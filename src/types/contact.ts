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
  preview: string;
  lang: "az" | "en" | string;
  is_read: boolean;
  read_at: string | null;
  created_at: string | null;
}

export interface ContactMessageDetail extends ContactMessageSummary {
  message: string;
  read_by: string | null;
}

export interface ContactMessageList {
  items: ContactMessageSummary[];
  total: number;
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

export interface ContactReadState {
  id: number;
  is_read: boolean;
  read_at: string | null;
  read_by: string | null;
}
