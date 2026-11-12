import { ISSUER_OPTIONS } from "../../services/heroCertificate/heroCertificateService";

interface IssuerPickerProps {
    value: string;
    onChange: (next: string) => void;
}

export default function IssuerPicker({ value, onChange }: IssuerPickerProps) {
    return (
        <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
                Sertifikatı verən
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2">
                {ISSUER_OPTIONS.map((option) => {
                    const checked = option.value === value;
                    return (
                        <label
                            key={option.value}
                            title={option.fullName}
                            className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border bg-white dark:bg-gray-900 px-3 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500/40 ${
                                checked
                                    ? "border-transparent"
                                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                            }`}
                            style={checked ? { boxShadow: `0 0 0 2px ${option.color}` } : undefined}
                        >
                            <input
                                type="radio"
                                name="issuer"
                                value={option.value}
                                checked={checked}
                                onChange={() => onChange(option.value)}
                                className="sr-only"
                            />
                            <span className="flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: option.color }}
                                />
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{option.label}</span>
                            </span>
                            <span className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">{option.kind}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
