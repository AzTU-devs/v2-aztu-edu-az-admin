import { Link } from "react-router";
import DeleteIcon from "@mui/icons-material/Delete";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import { CircularProgress } from "@mui/material";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { formatDateTime } from "../chat/chatFormat";
import type { ContactMessageSummary } from "../../types/contact";

interface ContactMessagesTableProps {
  items: ContactMessageSummary[];
  loading?: boolean;
  pageSize?: number;
  onOpen: (id: number) => void;
  /** Omitted without contact_messages.update — the button disappears with it. */
  onToggleRead?: (item: ContactMessageSummary) => void;
  /** Omitted without contact_messages.delete. */
  onDelete?: (item: ContactMessageSummary) => void;
  busyId?: number | null;
}

const headerCell =
  "px-5 py-3 text-left text-theme-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400";

const actionButton =
  "rounded-lg p-1.5 transition-colors disabled:opacity-40";

/**
 * Visitor-authored fields (name, e-mail, subject, preview) are React text
 * children only, so markup in a message shows as the characters typed.
 */
export default function ContactMessagesTable({
  items,
  loading = false,
  pageSize = 25,
  onOpen,
  onToggleRead,
  onDelete,
  busyId = null,
}: ContactMessagesTableProps) {
  const hasActions = Boolean(onToggleRead || onDelete);
  const columnCount = hasActions ? 5 : 4;

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <Table>
        <TableHeader className="border-b border-gray-100 dark:border-gray-800">
          <TableRow>
            <TableCell isHeader className={headerCell}>
              Göndərən
            </TableCell>
            <TableCell isHeader className={headerCell}>
              Mövzu və mesaj
            </TableCell>
            <TableCell isHeader className={headerCell}>
              Dil
            </TableCell>
            <TableCell isHeader className={headerCell}>
              Tarix
            </TableCell>
            {hasActions && (
              <TableCell isHeader className={`${headerCell} text-right`}>
                Əməliyyat
              </TableCell>
            )}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {loading &&
            Array.from({ length: Math.min(pageSize, 8) }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell className="px-5 py-4" colSpan={columnCount}>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                </TableCell>
              </TableRow>
            ))}

          {!loading && items.length === 0 && (
            <TableRow>
              <TableCell
                className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                colSpan={columnCount}
              >
                Uyğun mesaj tapılmadı
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            items.map((item) => {
              const unread = !item.is_read;
              return (
                <TableRow
                  key={item.id}
                  onClick={() => onOpen(item.id)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03] ${
                    unread ? "bg-brand-50/40 dark:bg-brand-500/[0.04]" : ""
                  }`}
                >
                  <TableCell className="max-w-[16rem] px-5 py-4">
                    <div className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          unread ? "bg-brand-500" : "bg-transparent"
                        }`}
                      />
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm ${
                            unread
                              ? "font-semibold text-gray-900 dark:text-white"
                              : "font-medium text-gray-700 dark:text-white/80"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{item.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xl px-5 py-4">
                    {/* A real link, so the row opens from the keyboard too. */}
                    <Link
                      to={`/contact-messages/${item.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className={`block truncate text-sm hover:text-brand-500 focus-visible:text-brand-500 ${
                        unread
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "font-medium text-gray-700 dark:text-white/80"
                      }`}
                    >
                      {unread && <span className="sr-only">Oxunmamış: </span>}
                      {item.subject}
                    </Link>
                    <span className="mt-0.5 line-clamp-2 break-words text-xs text-gray-500 dark:text-gray-400">
                      {item.preview}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge size="sm" color="light">
                      {(item.lang || "az").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(item.created_at)}
                  </TableCell>
                  {hasActions && (
                    <TableCell className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {onToggleRead && (
                          <button
                            type="button"
                            title={unread ? "Oxunmuş et" : "Oxunmamış et"}
                            aria-label={unread ? "Oxunmuş et" : "Oxunmamış et"}
                            disabled={busyId === item.id}
                            onClick={(event) => {
                              // The row itself opens the message.
                              event.stopPropagation();
                              onToggleRead(item);
                            }}
                            className={`${actionButton} text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200`}
                          >
                            {unread ? (
                              <DraftsOutlinedIcon sx={{ fontSize: 18 }} />
                            ) : (
                              <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 18 }} />
                            )}
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            title="Mesajı sil"
                            aria-label="Mesajı sil"
                            disabled={busyId === item.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              onDelete(item);
                            }}
                            className={`${actionButton} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
                          >
                            {busyId === item.id ? (
                              <CircularProgress size={16} sx={{ color: "currentColor" }} />
                            ) : (
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            )}
                          </button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
