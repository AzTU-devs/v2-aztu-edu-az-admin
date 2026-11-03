import apiClient from "../../util/apiClient";
import type {
  ContactApiData,
  ContactMessageDetail,
  ContactMessageList,
  ContactMessageListQuery,
  ContactReadState,
  ContactStats,
} from "../../types/contact";

/**
 * Fired after anything that changes the unread count (read/unread, delete), so
 * the sidebar badge refreshes without polling. Same window-event pattern as
 * PERMISSION_DENIED_EVENT in util/apiClient.
 */
export const CONTACT_INBOX_CHANGED_EVENT = "aztu:contact-inbox-changed";

const announceChange = () => window.dispatchEvent(new Event(CONTACT_INBOX_CHANGED_EVENT));

/** Blank fields are dropped — the API reads absent as "no filter". */
const clean = (query: ContactMessageListQuery): ContactMessageListQuery => {
  const params: ContactMessageListQuery = {};
  if (query.page) params.page = query.page;
  if (query.page_size) params.page_size = query.page_size;
  if (query.status && query.status !== "all") params.status = query.status;
  if (query.q && query.q.trim()) params.q = query.q.trim();
  return params;
};

/**
 * The website contact form's inbox. Reads need `contact_messages.read`; marking
 * read/unread is `contact_messages.update`, deleting `contact_messages.delete`.
 */
const contactMessageService = {
  list: async (query: ContactMessageListQuery = {}): Promise<ContactMessageList> => {
    const response = await apiClient.get<ContactApiData<ContactMessageList>>(
      "/api/contact/admin/messages",
      { params: clean(query) }
    );
    return response.data.data;
  },

  get: async (id: number): Promise<ContactMessageDetail> => {
    const response = await apiClient.get<ContactApiData<ContactMessageDetail>>(
      `/api/contact/admin/messages/${id}`
    );
    return response.data.data;
  },

  getStats: async (): Promise<ContactStats> => {
    const response = await apiClient.get<ContactApiData<ContactStats>>("/api/contact/admin/stats");
    return response.data.data;
  },

  setRead: async (id: number, isRead: boolean): Promise<ContactReadState> => {
    const response = await apiClient.patch<ContactApiData<ContactReadState>>(
      `/api/contact/admin/messages/${id}`,
      { is_read: isRead }
    );
    announceChange();
    return response.data.data;
  },

  /** Permanent: the message is gone from the database. */
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/contact/admin/messages/${id}`);
    announceChange();
  },
};

export default contactMessageService;
