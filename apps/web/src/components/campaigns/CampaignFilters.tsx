import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none rounded-lg border border-border bg-surface py-1.5 pl-3 pr-8 text-sm transition-colors",
          "text-foreground-secondary hover:bg-surface-hover",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
        )}
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted"
        aria-hidden="true"
      />
    </div>
  );
}

interface CampaignFiltersProps {
  genreFilter: string;
  platformFilter: string;
  onGenreChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  genres: string[];
  platforms: string[];
}

export function CampaignFilters({
  genreFilter,
  platformFilter,
  onGenreChange,
  onPlatformChange,
  genres,
  platforms,
}: CampaignFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <FilterDropdown
        label="Subs left"
        value=""
        options={[
          { value: "low", label: "1\u20135" },
          { value: "medium", label: "6\u201320" },
          { value: "high", label: "20+" },
        ]}
        onChange={() => {}}
      />
      <FilterDropdown
        label="Genre"
        value={genreFilter}
        options={genres.map((g) => ({ value: g, label: g }))}
        onChange={onGenreChange}
      />
      <FilterDropdown
        label="Platforms"
        value={platformFilter}
        options={platforms.map((p) => ({ value: p, label: p }))}
        onChange={onPlatformChange}
      />
    </div>
  );
}
