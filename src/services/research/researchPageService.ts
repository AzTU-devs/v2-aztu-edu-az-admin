import apiClient from "../../util/apiClient";

export interface ResearchTranslation {
  title: string | null;
  description: string | null;
  body_html: string | null;
  links_title: string | null;
  /** Journal page. */
  journal_name: string | null;
  journal_language: string | null;
  founder: string | null;
  button_label: string | null;
}

export interface ResearchPriority {
  id: number;
  display_order: number;
  az: { title: string | null; description: string | null };
  en: { title: string | null; description: string | null };
}

export interface ResearchPatent {
  id: number;
  patent_number: string | null;
  document_url: string | null;
  display_order: number;
  az: { name: string | null; authors: string | null };
  en: { name: string | null; authors: string | null };
}

export interface ResearchPatentYear {
  id: number;
  year: string | null;
  patents: ResearchPatent[];
}

/** One seminar/training entry — a rich-text name linking to a news item. */
export interface ResearchSeminar {
  id: number;
  url: string | null;
  display_order: number;
  az: { name: string | null };
  en: { name: string | null };
}

export interface ResearchLink {
  id: number;
  url: string | null;
  display_order: number;
  az: { label: string | null };
  en: { label: string | null };
}

export interface ResearchPageDetail {
  id: number;
  page_key: string;
  template: string;
  slug_az: string | null;
  slug_en: string | null;
  is_active: boolean;
  /** Journal page, language-neutral. */
  image_url: string | null;
  issn: string | null;
  eissn: string | null;
  doi: string | null;
  publication_year: string | null;
  yearly_count: string | null;
  button_url: string | null;
  az: ResearchTranslation;
  en: ResearchTranslation;
  priorities: ResearchPriority[];
  patent_years: ResearchPatentYear[];
  /** Seminars & Trainings page. */
  seminars: ResearchSeminar[];
  links: ResearchLink[];
  updated_at: string | null;
}

export interface ResearchPagePayload {
  slug_az?: string;
  slug_en?: string;
  /** Journal page, language-neutral. */
  image_url?: string;
  issn?: string;
  eissn?: string;
  doi?: string;
  publication_year?: string;
  yearly_count?: string;
  button_url?: string;
  az?: Partial<ResearchTranslation>;
  en?: Partial<ResearchTranslation>;
  priorities?: Array<{
    az: { title: string; description: string };
    en: { title: string; description: string };
  }>;
  patent_years?: Array<{
    year: string;
    patents: Array<{
      patent_number: string;
      document_url: string;
      az: { name: string; authors: string };
      en: { name: string; authors: string };
    }>;
  }>;
  seminars?: Array<{
    url: string;
    az: { name: string };
    en: { name: string };
  }>;
  links?: Array<{
    url: string;
    az: { label: string };
    en: { label: string };
  }>;
}

const BASE = "/api/research";

export const getResearchPage = async (pageKey: string) => {
  try {
    const response = await apiClient.get(`${BASE}/admin/pages/${pageKey}`);
    if (response.data?.status_code === 200) {
      return response.data.page as ResearchPageDetail;
    }
    return response.data?.status_code === 404 ? ("NOT FOUND" as const) : ("ERROR" as const);
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    return status === 404 ? ("NOT FOUND" as const) : ("ERROR" as const);
  }
};

export const updateResearchPage = async (
  pageKey: string,
  payload: ResearchPagePayload
) => {
  try {
    const response = await apiClient.put(`${BASE}/admin/pages/${pageKey}`, payload);
    return response.data?.status_code === 200 ? ("SUCCESS" as const) : ("ERROR" as const);
  } catch {
    return "ERROR" as const;
  }
};

export const publishResearchPage = async (pageKey: string, isActive: boolean) => {
  try {
    const response = await apiClient.put(`${BASE}/admin/pages/${pageKey}/publish`, {
      is_active: isActive,
    });
    return response.data?.status_code === 200 ? ("SUCCESS" as const) : ("ERROR" as const);
  } catch {
    return "ERROR" as const;
  }
};

export const uploadResearchDocument = async (pageKey: string, file: File) => {
  try {
    const body = new FormData();
    body.append("file", file);
    const response = await apiClient.put(
      `${BASE}/admin/pages/${pageKey}/document`,
      body
    );
    if (response.data?.status_code === 200 && response.data?.path) {
      return response.data.path as string;
    }
    return null;
  } catch {
    return null;
  }
};

/** Stores a journal cover image and returns its path for the next whole-page save. */
export const uploadResearchImage = async (pageKey: string, file: File) => {
  try {
    const body = new FormData();
    body.append("file", file);
    const response = await apiClient.put(`${BASE}/admin/pages/${pageKey}/image`, body);
    if (response.data?.status_code === 200 && response.data?.path) {
      return response.data.path as string;
    }
    return null;
  } catch {
    return null;
  }
};
