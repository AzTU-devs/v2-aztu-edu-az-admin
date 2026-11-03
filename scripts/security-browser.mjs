import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const origin = 'https://admin.aztu.edu.az';
const api = 'https://api.aztu.edu.az';
const directory = path.resolve('dist');
const policyText = fs.readFileSync('deploy/nginx-security-headers.conf', 'utf8');
const policyHeaders = Object.fromEntries([...policyText.matchAll(/add_header\s+(\S+)\s+"([^"]*)"\s+always;/g)].map(m => [m[1], m[2]]));
assert(policyHeaders['Content-Security-Policy'].includes("script-src 'self'"));
const executablePath = process.env.CHROME_EXECUTABLE;
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const results = [];
async function fixture(mode) {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const state = { signedIn: false, refreshes: 0, logins: [], confirms: 0 };
    const errors = [];
    context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
    await context.addInitScript(() => { if (location.origin === 'https://admin.aztu.edu.az') localStorage.setItem('persist:root', 'old-unsafe-access-token'); });
    await context.route('**/*', async route => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.origin === api) {
            const cors = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': 'authorization,content-type,accept-language', 'access-control-allow-methods': 'GET,POST,OPTIONS' };
            if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
            let status = 200, json = {};
            if (url.pathname === '/api/auth/refresh') {
                state.refreshes++;
                status = state.signedIn ? 200 : 401;
                json = state.signedIn ? { access_token: 'fixture-refreshed-access', token_type: 'bearer' } : { detail: 'No session' };
            } else if (url.pathname === '/api/auth/login') {
                const body = request.postDataJSON(); state.logins.push(body);
                if (mode === 'setup') {
                    json = { mfa_setup_required: true, setup_token: 'fixture-setup-challenge', secret: 'JBSWY3DPEHPK3PXP', provisioning_uri: 'otpauth://totp/AzTU' };
                } else if (body.otp_code === '123456') {
                    state.signedIn = true; json = { access_token: 'fixture-login-access', token_type: 'bearer' };
                } else { status = 401; json = { detail: 'Invalid verification code' }; }
            } else if (url.pathname === '/api/auth/mfa/confirm') {
                state.confirms++;
                assert.equal(request.postDataJSON().otp_code, '123456');
                state.signedIn = true;
                json = { access_token: 'fixture-login-access', token_type: 'bearer', recovery_codes: ['recovery-one', 'recovery-two'] };
            } else if (url.pathname === '/api/auth/me') {
                status = state.signedIn ? 200 : 401;
                json = { status_code: status, data: { id: 1, username: 'test-admin', first_name: 'Test', last_name: 'Admin', is_active: true, is_super_admin: true, role: null, permissions: [], enforcement_mode: 'enforce', last_login_at: null } };
            } else { status = 403; json = { detail: 'Fixture deliberately does not expose dashboard data' }; }
            return route.fulfill({ status, json, headers: cors });
        }
        if (url.origin !== origin) return route.abort();
        const filename = url.pathname.startsWith('/assets/') || url.pathname.startsWith('/images/') || /\.(png|svg|ico)$/.test(url.pathname) ? path.join(directory, decodeURIComponent(url.pathname)) : path.join(directory, 'index.html');
        if (!filename.startsWith(directory + path.sep) || !fs.existsSync(filename)) return route.fulfill({ status: 404 });
        const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }[path.extname(filename)] ?? 'application/octet-stream';
        return route.fulfill({ body: fs.readFileSync(filename), headers: { ...policyHeaders, 'content-type': mime } });
    });
    const page = await context.newPage();
    await page.goto(origin + '/signin');
    await page.locator('#signin-username').waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('persist:root')), null);
    await page.locator('#signin-username').fill('test-admin');
    await page.locator('#signin-password').fill('Fixture-password-2026!');
    return { context, page, state, errors };
}
try {
    {
        const { context, page, state, errors } = await fixture('setup');
        await page.getByRole('button', { name: 'Daxil ol', exact: true }).click();
        await page.getByText('İki mərhələli təsdiqi qurun', { exact: true }).waitFor();
        assert.equal(state.signedIn, false);
        await page.locator('#signin-code').fill('123456');
        await page.getByRole('button', { name: 'Daxil ol', exact: true }).click();
        await page.getByText('Bərpa kodlarını saxlayın', { exact: true }).waitFor();
        assert.equal(state.confirms, 1);
        assert.equal(await page.evaluate(() => Object.values(localStorage).some(v => /fixture-.*access|fixture-setup/.test(v))), false);
        await page.getByRole('button', { name: 'Kodları saxladım, davam et' }).click();
        await page.waitForURL(origin + '/');
        await page.waitForTimeout(300);
        assert.deepEqual(errors, []);
        results.push('MFA enrollment, confirmation, recovery-code acknowledgement, enforced CSP and memory-only session');
        await context.close();
    }
    {
        const { context, page, state, errors } = await fixture('existing');
        await page.locator('#signin-code').fill('111111');
        await page.getByRole('button', { name: 'Daxil ol', exact: true }).click();
        await page.locator('#signin-error').waitFor();
        assert.equal(state.refreshes, 1, 'Invalid MFA must not cause refresh/retry');
        await page.locator('#signin-code').fill('123456');
        await page.getByRole('button', { name: 'Daxil ol', exact: true }).click();
        await page.waitForURL(origin + '/');
        assert.equal(state.logins[1].otp_code, '123456');
        await context.clearPermissions();
        await page.reload();
        await page.waitForTimeout(500);
        assert.equal(new URL(page.url()).pathname, '/');
        assert.equal(state.refreshes, 2, 'A reload restores with one refresh');
        assert.equal(await page.evaluate(() => localStorage.getItem('persist:root')), null);
        assert.deepEqual(errors, []);
        results.push('Invalid OTP handling, successful OTP login, single-flight startup refresh and session restoration');
        await context.close();
    }
    console.log('PASS:', results.join('; '));
} finally { await browser.close(); }
