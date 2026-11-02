// F8: the dashboard's HTML sinks go through src/util/safeHtml.ts. This bundles
// that exact module and runs it in a real browser DOM against XSS payloads.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';

const bundle = await build({
  entryPoints: ['src/util/safeHtml.ts'], bundle: true, write: false, format: 'iife', globalName: 'SafeHtml', platform: 'browser',
});
const executablePath = process.env.CHROME_EXECUTABLE;
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body></body></html>');
await page.addScriptTag({ content: bundle.outputFiles[0].text });

const payloads = [
  '<p>ok</p><script>alert(1)</script>',
  '<img src=x onerror="alert(1)">',
  '<svg onload=alert(1)><circle/></svg>',
  '<a href="javascript:alert(1)">x</a>',
  '<a href="  JaVaScRiPt:alert(1)">x</a>',
  '<a href="data:text/html,<script>alert(1)</script>">x</a>',
  '<iframe src="https://evil.example"></iframe>',
  '<form action="https://evil.example"><input name=q></form>',
  '<math><mi xlink:href="javascript:alert(1)">x</mi></math>',
  '<p style="background:url(javascript:alert(1))">x</p>',
];
for (const payload of payloads) {
  const out = await page.evaluate((html) => window.SafeHtml.safeHtml(html), payload);
  assert.doesNotMatch(out, /<script|onerror|onload|javascript:|data:text|<iframe|<form|<svg|<math|style=/i, `${payload} -> ${out}`);
}
const kept = await page.evaluate(() => window.SafeHtml.safeHtml(
  '<h2>Title</h2><p><strong>b</strong> <a href="https://aztu.edu.az/az">link</a> <a href="/az/elaqe">rel</a> <a href="mailto:x@aztu.edu.az">m</a></p><ul><li>i</li></ul><table><tr><td>c</td></tr></table>'));
for (const fragment of ['<h2>Title</h2>', '<strong>b</strong>', 'href="https://aztu.edu.az/az"', 'href="/az/elaqe"', 'href="mailto:x@aztu.edu.az"', '<li>i</li>', '<td>c</td>']) {
  assert.ok(kept.includes(fragment), `lost legitimate formatting: ${fragment} in ${kept}`);
}
assert.equal(await page.evaluate(() => window.SafeHtml.escapeHtml('<img src=x onerror=alert(1)>"\'&')), '&lt;img src=x onerror=alert(1)&gt;&quot;&#39;&amp;');
await browser.close();
console.log(`PASS: ${payloads.length} XSS payloads neutralised; legitimate formatting kept; escapeHtml`);
