import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import Swal from "sweetalert2";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Badge from "../../components/ui/badge/Badge";
import { errorMessage, formatDateTime } from "../../components/chat/chatFormat";
import contactMessageService from "../../services/contact/contactMessageService";
import usePermissions from "../../hooks/usePermissions";
import type { ContactMessageDetail } from "../../types/contact";

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <div className="mt-0.5 truncate text-sm font-medium text-gray-800 dark:text-white/90">{children}</div>
    </div>
  );
}

const replyHref = (message: ContactMessageDetail): string => {
  const at = message.email.lastIndexOf("@");
  const local = encodeURIComponent(message.email.slice(0, at));
  const domain = message.email.slice(at + 1);
  const subject = encodeURIComponent(`Re: ${message.subject}`);
  return `mailto:${local}@${domain}?subject=${subject}`;
};

export default function ContactMessageDetailPage() {
  const { message_id } = useParams<{ message_id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canUpdate = can("contact_messages.update");
  const canDelete = can("contact_messages.delete");

  const id = Number(message_id);
  const [message, setMessage] = useState<ContactMessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const autoMarked = useRef<number | null>(null);

  const load = useCallback(() => {
    if (!Number.isInteger(id) || id < 1) {
      setError("Mesaj tapılmadı.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    contactMessageService
      .get(id)
      .then(setMessage)
      .catch((err) => setError(errorMessage(err, "Mesaj yüklənərkən xəta baş verdi.")))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  useEffect(() => {
    if (!message || message.is_read || !canUpdate || autoMarked.current === message.id) return;
    autoMarked.current = message.id;
    contactMessageService
      .setRead(message.id, true)
      .then((state) => setMessage((prev) => (prev && prev.id === state.id ? { ...prev, ...state } : prev)))
      .catch(() => undefined); // still readable; the button below can retry
  }, [message, canUpdate]);

  const toggleRead = async () => {
    if (!message) return;
    setBusy(true);
    try {
      const state = await contactMessageService.setRead(message.id, !message.is_read);
      setMessage({ ...message, ...state });
    } catch (err) {
      Swal.fire({
        icon: "error",
        titleText: "Xəta",
        text: errorMessage(err, "Mesajın vəziyyəti dəyişdirilərkən xəta baş verdi."),
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!message) return;
    const confirm = await Swal.fire({
      titleText: "Mesaj silinsin?",
      text: "Mesaj həmişəlik silinəcək. Bu əməliyyat geri alına bilməz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "İmtina",
      reverseButtons: true,
    });
    if (!confirm.isConfirmed) return;
    setBusy(true);
    try {
      await contactMessageService.remove(message.id);
      Swal.fire({ icon: "success", titleText: "Uğurla silindi", showConfirmButton: false, timer: 1400 });
      navigate("/contact-messages");
    } catch (err) {
      Swal.fire({
        icon: "error",
        titleText: "Xəta",
        text: errorMessage(err, "Mesaj silinərkən xəta baş verdi."),
      });
      setBusy(false);
    }
  };

  const secondaryButton =
    "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5";

  return (
    <>
      <PageMeta title="Əlaqə mesajı | AzTU Admin" description="Saytın əlaqə formasından gələn mesaj" />
      <PageBreadcrumb pageTitle="Əlaqə mesajı" />

      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/contact-messages")}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          Mesajlara qayıt
        </button>

        {error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-12 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-error-500">{error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-3 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
            >
              Yenidən cəhd et
            </button>
          </div>
        ) : loading || !message ? (
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        ) : (
          <>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetaItem label="Göndərən">{message.name}</MetaItem>
                <MetaItem label="E-poçt">
                  <a href={replyHref(message)} className="text-brand-500 hover:underline">
                    {message.email}
                  </a>
                </MetaItem>
                <MetaItem label="Göndərilib">{formatDateTime(message.created_at)}</MetaItem>
                <MetaItem label="Saytın dili">
                  <Badge size="sm" color="light">
                    {(message.lang || "az").toUpperCase()}
                  </Badge>
                </MetaItem>
              </div>
              <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {message.is_read
                  ? `Oxunub: ${formatDateTime(message.read_at)}${message.read_by ? ` — ${message.read_by}` : ""}`
                  : "Oxunmayıb"}
              </p>
            </div>

            <ComponentCard
              title={message.subject}
              desc="Ziyarətçinin yazdığı kimi, düz mətn"
              actions={
                <div className="flex flex-wrap justify-end gap-2">
                  <a
                    href={replyHref(message)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                  >
                    <ReplyIcon sx={{ fontSize: 18 }} />
                    E-poçtla cavab ver
                  </a>
                  {canUpdate && (
                    <button type="button" disabled={busy} onClick={toggleRead} className={secondaryButton}>
                      {message.is_read ? (
                        <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <DraftsOutlinedIcon sx={{ fontSize: 18 }} />
                      )}
                      {message.is_read ? "Oxunmamış et" : "Oxunmuş et"}
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleDelete}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                      Sil
                    </button>
                  )}
                </div>
              }
            >
              {/* Text child only — markup in a message shows as typed; line breaks kept. */}
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800 dark:text-white/90">
                {message.message}
              </p>
            </ComponentCard>
          </>
        )}
      </div>
    </>
  );
}
