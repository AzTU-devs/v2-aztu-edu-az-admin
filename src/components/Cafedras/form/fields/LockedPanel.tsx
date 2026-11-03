import Button from "../../../ui/button/Button";
import { lockedPanel, sectionCard, sectionDesc, sectionHeader, sectionTitle } from "../formStyles";

interface LockedPanelProps {
  title: string;
  description?: string;
}

export default function LockedPanel({ title, description }: LockedPanelProps) {
  return (
    <div className={sectionCard}>
      <div className={sectionHeader}>
        <div>
          <p className={sectionTitle}>{title}</p>
          {description ? <p className={sectionDesc}>{description}</p> : null}
        </div>
      </div>
      <div className={lockedPanel}>
        <svg className="h-8 w-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kafedra yaradıldıqdan sonra bu bölmə aktivləşəcək.
        </p>
        <Button size="sm" disabled>
          + Əlavə et
        </Button>
      </div>
    </div>
  );
}
