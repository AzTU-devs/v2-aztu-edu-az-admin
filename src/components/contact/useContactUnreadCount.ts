import { useEffect, useState } from "react";
import usePermissions from "../../hooks/usePermissions";
import contactMessageService, {
  CONTACT_INBOX_CHANGED_EVENT,
} from "../../services/contact/contactMessageService";

/**
 * Unread contact-form messages, for the sidebar badge.
 *
 * Asked for only when the account may read the inbox, and refreshed when this
 * tab changes the inbox (CONTACT_INBOX_CHANGED_EVENT) or becomes visible again
 * — new mail arrives rarely, so there is no polling. A failed request simply
 * hides the badge; the inbox page itself reports errors.
 */
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
