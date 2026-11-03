/**
 * Mirrors /api/contact/admin/*. Every payload holds a website visitor's name,
 * e-mail address and own words: personal data. Render it as plain text only
 * (React text children, never dangerouslySetInnerHTML) and keep it in component
 * state — nothing here is persisted or cached client side.
 */

export interface ContactApiData<T> {
  status_code: number;
  data: T;
}

export type ContactStatusFilter = "all" | "unread" | "read";

export interface ContactMessageSummary {
  id: number;
  name: string;
  email: string;
  subject: string;
  /** Whitespace-collapsed and truncated server side. */
  preview: string;
  /** The website language the visitor wrote from. */
  lang: "az" | "en" | string;
  is_read: boolean;
  read_at: string | null;
  created_at: string | null;
}

export interface ContactMessageDetail extends ContactMessageSummary {
  /** Visitor-typed text, line breaks kept. Plain text only. */
  message: string;
  /** Username of the admin who marked it read. */
  read_by: string | null;
}

export interface ContactMessageList {
  items: ContactMessageSummary[];
  total: number;
  /** Unfiltered unread count — the same number the sidebar shows. */
  unread_total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface ContactMessageListQuery {
  page?: number;
  page_size?: number;
  status?: ContactStatusFilter;
  q?: string;
}

export interface ContactStats {
  total: number;
  unread: number;
}

/** What a read/unread change returns: ids and flags only (it is audited). */
export interface ContactReadState {
  id: number;
  is_read: boolean;
  read_at: string | null;
  read_by: string | null;
}
