import { useEffect, useState } from "react";
import usePermissions from "../../hooks/usePermissions";
import contactMessageService, {
  CONTACT_INBOX_CHANGED_EVENT,
} from "../../services/contact/contactMessageService";

export default function useContactUnreadCount(): number {
  const { can } = usePermissions();
  const allowed = can("contact_messages.read");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;

    const refresh = () => {
      contactMessageService
        .getStats()
        .then((stats) => {
          if (!cancelled) setCount(stats.unread);
        })
        .catch(() => {
          if (!cancelled) setCount(0);
        });
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    refresh();
    window.addEventListener(CONTACT_INBOX_CHANGED_EVENT, refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      cancelled = true;
      window.removeEventListener(CONTACT_INBOX_CHANGED_EVENT, refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [allowed]);

  return allowed ? count : 0;
}
