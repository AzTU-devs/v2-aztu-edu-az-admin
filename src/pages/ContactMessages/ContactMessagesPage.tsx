import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Pagination, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ContactMessagesTable from "../../components/contact/ContactMessagesTable";
import { errorMessage } from "../../components/chat/chatFormat";
import contactMessageService from "../../services/contact/contactMessageService";
import usePermissions from "../../hooks/usePermissions";
import type { ContactMessageSummary, ContactStatusFilter } from "../../types/contact";

const PAGE_SIZE = 25;

const FILTERS: { value: ContactStatusFilter; label: string }[] = [
  { value: "all", label: "Hamısı" },
  { value: "unread", label: "Oxunmamış" },
  { value: "read", label: "Oxunmuş" },
];

/**
 * Inbox for the website's contact form (/az/elaqe). Messages are visitors'
 * personal data: shown as plain text, never cached, and the dialogs below use
 * text-only SweetAlert2 options and carry no visitor detail at all.
 */
export default function ContactMessagesPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();

  const [status, setStatus] = useState<ContactStatusFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ContactMessageSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    contactMessageService
      .list({ page, page_size: PAGE_SIZE, status, q: query })
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
        setUnreadTotal(data.unread_total);
      })
      .catch((err) => setError(errorMessage(err, "Mesajlar yüklənərkən xəta baş verdi.")))
      .finally(() => setLoading(false));
  }, [page, status, query]);

  /** Free text is debounced; the status tabs apply immediately. */
  useEffect(() => {
    const timer = setTimeout(load, query ? 350 : 0);
    return () => clearTimeout(timer);
  }, [load, query]);

  const changeStatus = (next: ContactStatusFilter) => {
    setPage(1);
    setStatus(next);
  };

  const handleToggleRead = async (item: ContactMessageSummary) => {
    setBusyId(item.id);
    try {
      await contactMessageService.setRead(item.id, !item.is_read);
      load();
    } catch (err) {
      Swal.fire({
        icon: "error",
        titleText: "Xəta",
        text: errorMessage(err, "Mesajın vəziyyəti dəyişdirilərkən xəta baş verdi."),
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: ContactMessageSummary) => {
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

    setBusyId(item.id);
    try {
      await contactMessageService.remove(item.id);
      Swal.fire({ icon: "success", titleText: "Uğurla silindi", showConfirmButton: false, timer: 1400 });
      // Stepping back a page keeps the view from stranding on an empty last page.
      if (items.length === 1 && page > 1) setPage((prev) => prev - 1);
      else load();
    } catch (err) {
      Swal.fire({
        icon: "error",
        titleText: "Xəta",
        text: errorMessage(err, "Mesaj silinərkən xəta baş verdi."),
      });
    } finally {
      setBusyId(null);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const summary =
    total > 0
      ? `${total.toLocaleString("az-AZ")} mesajdan ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
          page * PAGE_SIZE,
          total
        )} göstərilir · ${unreadTotal.toLocaleString("az-AZ")} oxunmamış`
      : `Mesaj yoxdur · ${unreadTotal.toLocaleString("az-AZ")} oxunmamış`;

  return (
    <>
      <PageMeta
        title="Əlaqə mesajları | AzTU Admin"
        description="Saytın əlaqə formasından gələn mesajlar"
      />
      <PageBreadcrumb pageTitle="Əlaqə mesajları" />

      <ComponentCard title="Əlaqə mesajları" desc={summary}>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Mesajları süz"
            className="inline-flex w-fit rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-800 dark:bg-gray-900"
          >
            {FILTERS.map((filter) => {
              const active = status === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeStatus(filter.value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {filter.label}
                  {filter.value === "unread" && unreadTotal > 0 && (
                    <span className="ml-1.5 rounded-full bg-brand-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                      {unreadTotal}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon fontSize="small" />
            </span>
            <input
              type="search"
              value={query}
              aria-label="Mesajlarda axtar"
              placeholder="Ad, e-poçt, mövzu və ya mətn"
              onChange={(event) => {
                setPage(1);
                setQuery(event.target.value);
              }}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm font-medium text-error-500">{error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-3 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
            >
              Yenidən cəhd et
            </button>
          </div>
        ) : (
          <>
            <ContactMessagesTable
              items={items}
              loading={loading}
              pageSize={PAGE_SIZE}
              onOpen={(id) => navigate(`/contact-messages/${id}`)}
              onToggleRead={can("contact_messages.update") ? handleToggleRead : undefined}
              onDelete={can("contact_messages.delete") ? handleDelete : undefined}
              busyId={busyId}
            />

            {pageCount > 1 && (
              <div className="mt-5 flex justify-center">
                <Stack spacing={2}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    shape="rounded"
                    color="primary"
                  />
                </Stack>
              </div>
            )}
          </>
        )}
      </ComponentCard>
    </>
  );
}
