import { useEffect, useState } from "react";
import { store } from "../../redux/store";
import { logout, setSession } from "../../redux/slices/authSlice";
import { fetchMe, refreshAccessToken } from "../../util/apiClient";

// Share the startup operation under React StrictMode and across mounts.
let restoration: Promise<void> | undefined;
function restore() {
    restoration ??= (async () => {
        try {
            await refreshAccessToken();
            const me = await fetchMe();
            if (!me) throw new Error("Session unavailable");
            store.dispatch(setSession(me));
        } catch { store.dispatch(logout()); }
    })();
    return restoration;
}
export default function SessionBootstrap({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        let mounted = true;
        restore().finally(() => { if (mounted) setReady(true); });
        return () => { mounted = false; };
    }, []);
    return ready ? children : <p role="status" className="p-8 text-gray-500">Sessiya yoxlanılır...</p>;
}
