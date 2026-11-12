import apiClient from "../../util/apiClient";

const HERO_CERTIFICATE_BASE = "/api/hero-certificate";

/** The four ranking families the hero can group certificates by. */
export type HeroCertificateFamily = "world" | "europe" | "subject" | "other";

export const FAMILY_OPTIONS: { value: HeroCertificateFamily; label: string }[] = [
    { value: "world", label: "Dünya" },
    { value: "europe", label: "Avropa" },
    { value: "subject", label: "Fənn üzrə" },
    { value: "other", label: "Digər" },
];

export type HeroCertificateIssuer = "qs" | "the" | "greenmetric" | "tkta" | "aqas" | "asiin" | "staregister";

export interface IssuerOption {
    value: HeroCertificateIssuer;
    label: string;
    fullName: string;
    kind: string;
    ranks: boolean;
    /** Same colour as on the website. */
    color: string;
    badge: string;
    placeholder: { az: string; en: string };
}

const PROGRAMME_PLACEHOLDER = { az: "Process Automation Engineering (MA)", en: "Process Automation Engineering (MA)" };

export const ISSUER_OPTIONS: IssuerOption[] = [
    {
        value: "qs",
        label: "QS",
        fullName: "QS World University Rankings",
        kind: "Reytinq",
        ranks: true,
        color: "#f5821f",
        badge: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
        placeholder: { az: "QS Avropa 2026: Qərbi Asiya", en: "QS Europe 2026: Western Asia" },
    },
    {
        value: "the",
        label: "THE",
        fullName: "Times Higher Education",
        kind: "Reytinq",
        ranks: true,
        color: "#c45ae9",
        badge: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
        placeholder: { az: "THE Dünya Universitet Reytinqi 2026", en: "THE World University Rankings 2026" },
    },
    {
        value: "greenmetric",
        label: "UI GreenMetric",
        fullName: "UI GreenMetric World University Rankings",
        kind: "Reytinq",
        ranks: true,
        color: "#45c46e",
        badge: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        placeholder: { az: "UI GreenMetric Dünya Universitet Reytinqi 2025", en: "UI GreenMetric World University Rankings 2025" },
    },
    {
        value: "tkta",
        label: "TKTA",
        fullName: "Təhsildə Keyfiyyət Təminatı Agentliyi",
        kind: "İnstitusional akkreditasiya",
        ranks: false,
        color: "#4f8dff",
        badge: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        placeholder: { az: "İnstitusional akkreditasiya", en: "Institutional accreditation" },
    },
    {
        value: "aqas",
        label: "AQAS",
        fullName: "AQAS",
        kind: "Proqram akkreditasiyası",
        ranks: false,
        color: "#3fb9c6",
        badge: "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
        placeholder: PROGRAMME_PLACEHOLDER,
    },
    {
        value: "asiin",
        label: "ASIIN",
        fullName: "ASIIN",
        kind: "Proqram akkreditasiyası",
        ranks: false,
        color: "#f2c230",
        badge: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
        placeholder: PROGRAMME_PLACEHOLDER,
    },
    {
        value: "staregister",
        label: "STAR Register",
        fullName: "STAR Register",
        kind: "Akkreditasiya və qeydiyyat",
        ranks: false,
        color: "#a9b4c8",
        badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        placeholder: PROGRAMME_PLACEHOLDER,
    },
];

/** A record saved before the issuer column existed comes back without it, and that has always meant QS. */
export const issuerOption = (issuer?: string | null): IssuerOption =>
    ISSUER_OPTIONS.find((option) => option.value === issuer) ?? ISSUER_OPTIONS[0];

export const RANKING_ISSUERS: HeroCertificateIssuer[] = ISSUER_OPTIONS.filter((option) => option.ranks).map(
    (option) => option.value
);

export const FAMILY_REQUIRED_ISSUERS: HeroCertificateIssuer[] = ["qs"];

export const issuerTakesRank = (issuer: string): boolean =>
    (RANKING_ISSUERS as string[]).includes(issuer);

export const issuerNeedsFamily = (issuer: string): boolean =>
    (FAMILY_REQUIRED_ISSUERS as string[]).includes(issuer);

/** One language's worth of certificate copy. All plain text — no rich editor. */
export interface HeroCertificateTranslation {
    title: string;
    kicker: string | null;
    signer: string | null;
}

/** Row shape returned by `GET /public` and `GET /all` — single language, flattened. */
export interface HeroCertificate {
    id: number;
    certificate_id: number;
    /** Optional: a record written before the issuer column existed comes back without it — treat that as QS. */
    issuer?: HeroCertificateIssuer | string;
    rank_label: string | null;
    family: HeroCertificateFamily | string | null;
    image: string | null;
    document: string | null;
    external_url: string | null;
    issued_date: string | null;
    display_order: number;
    is_active: boolean;
    title: string | null;
    kicker: string | null;
    signer: string | null;
    created_at: string;
    updated_at?: string | null;
}

/** Shape returned by `GET /{certificate_id}/admin` — both languages, for the edit form. */
export interface HeroCertificateDetail {
    id: number;
    certificate_id: number;
    /** Optional for the same reason as on `HeroCertificate` — a missing value means QS. */
    issuer?: HeroCertificateIssuer | string;
    rank_label: string | null;
    family: HeroCertificateFamily | string | null;
    image: string | null;
    document: string | null;
    external_url: string | null;
    issued_date: string | null;
    display_order: number;
    is_active: boolean;
    az: HeroCertificateTranslation;
    en: HeroCertificateTranslation;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface CreateHeroCertificatePayload {
    issuer: HeroCertificateIssuer | string;
    /** Required by the API for ranking issuers; ignored for accreditation issuers. */
    rank_label?: string;
    /** Required by the API for QS, optional for THE and UI GreenMetric, ignored otherwise. */
    family?: HeroCertificateFamily | string;
    issued_date?: string;
    external_url?: string;
    image?: File | null;
    document?: File | null;
    az_title: string;
    en_title: string;
    az_kicker?: string;
    en_kicker?: string;
    az_signer?: string;
    en_signer?: string;
}

export interface UpdateHeroCertificatePayload extends CreateHeroCertificatePayload {
    certificate_id: number;
    /** Send `true` to drop the stored image; a new `image` upload replaces it instead. */
    remove_image?: boolean;
    /** Send `true` to drop the stored document; a new `document` upload replaces it instead. */
    remove_document?: boolean;
}

export interface ReorderHeroCertificatePayload {
    certificate_id: number;
    new_order: number;
}

export const blankTranslation = (): HeroCertificateTranslation => ({
    title: "",
    kicker: "",
    signer: "",
});

/**
 * Optional multipart fields are omitted when blank rather than sent as "" —
 * the API rejects empty strings on typed optional fields.
 */
const appendOptional = (formData: FormData, key: string, value?: string | null) => {
    const trimmed = value?.trim();
    if (trimmed) formData.append(key, trimmed);
};

const buildCertificateFormData = (payload: CreateHeroCertificatePayload) => {
    const formData = new FormData();

    formData.append("issuer", payload.issuer);
    // `rank_label` / `family` belong to ranking issuers only, but they are still
    // sent for an accreditation row — as "" — because the API reads a blank here
    // as "not set" and clears the stored value, which is what switching a
    // ranking to an accreditation has to do.
    formData.append("rank_label", payload.rank_label ?? "");
    formData.append("family", payload.family ?? "");
    appendOptional(formData, "issued_date", payload.issued_date);
    appendOptional(formData, "external_url", payload.external_url);

    if (payload.image) formData.append("image", payload.image);
    if (payload.document) formData.append("document", payload.document);

    formData.append("az_title", payload.az_title);
    formData.append("en_title", payload.en_title);
    appendOptional(formData, "az_kicker", payload.az_kicker);
    appendOptional(formData, "en_kicker", payload.en_kicker);
    appendOptional(formData, "az_signer", payload.az_signer);
    appendOptional(formData, "en_signer", payload.en_signer);

    return formData;
};

export const getHeroCertificates = async (start: number, end: number, lang: string = "az") => {
    try {
        const response = await apiClient.get(
            `${HERO_CERTIFICATE_BASE}/all?start=${start}&end=${end}&lang=${lang}`
        );

        // An empty list comes back as a real 204, which leaves axios with no body —
        // so the status is checked before reaching into `data`.
        if (response.status === 204 || response.data?.status_code === 204) {
            return "NO CONTENT" as const;
        }

        if (response.data?.status_code === 200) {
            return {
                certificates: (response.data.certificates ?? []) as HeroCertificate[],
                total: (response.data.total ?? 0) as number,
            };
        }

        return "ERROR" as const;
    } catch {
        return "ERROR" as const;
    }
};

export const getHeroCertificateDetail = async (certificateId: number) => {
    try {
        const response = await apiClient.get(`${HERO_CERTIFICATE_BASE}/${certificateId}/admin`);

        if (response.data?.status_code === 200) {
            return response.data.certificate as HeroCertificateDetail;
        }

        return "ERROR" as const;
    } catch (err: any) {
        if (err?.response?.status === 404) return "NOT FOUND" as const;
        return "ERROR" as const;
    }
};

export const createHeroCertificate = async (payload: CreateHeroCertificatePayload) => {
    try {
        const formData = buildCertificateFormData(payload);

        const response = await apiClient.post(`${HERO_CERTIFICATE_BASE}/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data?.status_code === 201) return "SUCCESS" as const;

        return "ERROR" as const;
    } catch {
        return "ERROR" as const;
    }
};

export const updateHeroCertificate = async (payload: UpdateHeroCertificatePayload) => {
    try {
        const formData = buildCertificateFormData(payload);

        // Uploads are optional on update; omitting one keeps the stored file, so the
        // explicit removal flags are the only way to clear it.
        if (payload.remove_image) formData.append("remove_image", "true");
        if (payload.remove_document) formData.append("remove_document", "true");

        const response = await apiClient.put(
            `${HERO_CERTIFICATE_BASE}/${payload.certificate_id}/update`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data?.status_code === 200) return "SUCCESS" as const;

        return "ERROR" as const;
    } catch (err: any) {
        if (err?.response?.status === 404) return "NOT FOUND" as const;
        return "ERROR" as const;
    }
};

export const reorderHeroCertificate = async (payload: ReorderHeroCertificatePayload) => {
    try {
        const response = await apiClient.post(`${HERO_CERTIFICATE_BASE}/reorder`, payload);

        if (response.data?.status_code === 200) return "SUCCESS" as const;

        return "ERROR" as const;
    } catch (err: any) {
        if (err?.response?.status === 404) return "NOT FOUND" as const;
        return "ERROR" as const;
    }
};

export const activateHeroCertificate = async (certificateId: number) => {
    try {
        const response = await apiClient.post(
            `${HERO_CERTIFICATE_BASE}/activate?certificate_id=${certificateId}`
        );

        if (response.data?.status_code === 200) return "SUCCESS" as const;

        return "ERROR" as const;
    } catch (err: any) {
        if (err?.response?.status === 404) return "NOT FOUND" as const;
        return "ERROR" as const;
    }
};

export const deactivateHeroCertificate = async (certificateId: number) => {
    try {
        const response = await apiClient.post(
            `${HERO_CERTIFICATE_BASE}/deactivate?certificate_id=${certificateId}`
        );

        if (response.data?.status_code === 200) return "SUCCESS" as const;

        return "ERROR" as const;
    } catch (err: any) {
        if (err?.response?.status === 404) return "NOT FOUND" as const;
        return "ERROR" as const;
    }
};

export const deleteHeroCertificate = async (certificateId: number) => {
    try {
        const response = await apiClient.delete(`${HERO_CERTIFICATE_BASE}/${certificateId}/delete`);

        if (response.data?.status_code === 200) return "SUCCESS" as const;

        return "ERROR" as const;
    } catch (err: any) {
        if (err?.response?.status === 404) return "NOT FOUND" as const;
        return "ERROR" as const;
    }
};
