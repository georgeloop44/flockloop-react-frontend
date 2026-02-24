import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import type { CampaignRead } from "@flockloop/shared-types";
import { Play, Pause } from "lucide-react";
import { useAudioStore } from "@flockloop/audio-state";
import { PlatformIcons, LinkBadge } from "./PlatformIcons";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<CampaignRead>();

function SubsLeftBadge({ count }: { count: number | undefined }) {
  if (count === undefined) return <span className="text-foreground-muted">\u2014</span>;

  const color =
    count <= 2
      ? "bg-status-accepted/20 text-status-accepted"
      : count <= 10
        ? "bg-status-pending/20 text-status-pending"
        : "text-foreground-secondary";

  return (
    <span
      className={cn(
        "inline-flex min-w-[2rem] justify-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        count <= 10 ? color : color,
      )}
    >
      {count}
    </span>
  );
}

function GenreCell({ genres }: { genres: string[] | undefined }) {
  if (!genres?.length) return <span className="text-foreground-muted">\u2014</span>;
  const display = genres.join(", ");
  return (
    <span className="truncate text-foreground-secondary" title={display}>
      {display.length > 20 ? `${display.slice(0, 20)}\u2026` : display}
    </span>
  );
}

function StyleCell({ styles }: { styles: string[] | undefined }) {
  if (!styles?.length) return <span className="text-foreground-muted">\u2014</span>;
  const display = styles.join(", ");
  return (
    <span className="truncate text-foreground-secondary" title={display}>
      {display.length > 22 ? `${display.slice(0, 22)}\u2026` : display}
    </span>
  );
}

interface CampaignTableProps {
  campaigns: CampaignRead[];
  selectedId: string | null;
  onSelect: (campaign: CampaignRead) => void;
  onPlayToggle: (campaign: CampaignRead) => void;
  columnFilters?: ColumnFiltersState;
}

export function CampaignTable({
  campaigns,
  selectedId,
  onSelect,
  onPlayToggle,
  columnFilters = [],
}: CampaignTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const currentTrackId = useAudioStore((s) => s.currentTrack?.trackId);
  const isPlaying = useAudioStore((s) => s.isPlaying);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "play",
        size: 40,
        cell: ({ row }) => {
          const isCurrentTrack = currentTrackId === row.original.track.id;
          const isThisPlaying = isCurrentTrack && isPlaying;

          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayToggle(row.original);
              }}
              className="rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={isThisPlaying ? "Pause" : "Play"}
            >
              {isThisPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          );
        },
      }),
      columnHelper.accessor((row) => row.track.title, {
        id: "track",
        header: "Campaign track",
        size: 220,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2.5">
            {row.original.track.thumbnail_url ? (
              <img
                src={row.original.track.thumbnail_url}
                alt=""
                className="h-8 w-8 shrink-0 rounded object-cover"
                width={32}
                height={32}
              />
            ) : (
              <div className="h-8 w-8 shrink-0 rounded bg-surface-elevated" />
            )}
            <span className="truncate text-sm font-medium text-foreground">
              {row.original.track.title}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.track.artist, {
        id: "artist",
        header: "Artist",
        size: 140,
        cell: ({ getValue }) => (
          <span className="text-sm text-foreground-secondary">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("submissions_count", {
        id: "subs_left",
        header: "Subs left",
        size: 90,
        cell: ({ row }) => {
          const max = row.original.max_submissions;
          const count = row.original.submissions_count ?? 0;
          const left = max !== undefined ? max - count : undefined;
          return <SubsLeftBadge count={left} />;
        },
        sortingFn: (a, b) => {
          const aLeft =
            a.original.max_submissions !== undefined
              ? (a.original.max_submissions - (a.original.submissions_count ?? 0))
              : Infinity;
          const bLeft =
            b.original.max_submissions !== undefined
              ? (b.original.max_submissions - (b.original.submissions_count ?? 0))
              : Infinity;
          return aLeft - bLeft;
        },
      }),
      columnHelper.accessor("genres", {
        header: "Genre",
        size: 160,
        cell: ({ getValue }) => <GenreCell genres={getValue()} />,
        filterFn: (row, _columnId, filterValue: string) => {
          if (!filterValue) return true;
          return row.original.genres?.includes(filterValue) ?? false;
        },
      }),
      columnHelper.accessor("styles", {
        header: "Style",
        size: 180,
        cell: ({ getValue }) => <StyleCell styles={getValue()} />,
      }),
      columnHelper.accessor("link_type", {
        header: "Link",
        size: 100,
        cell: ({ getValue }) => <LinkBadge type={getValue()} />,
      }),
      columnHelper.accessor("platforms", {
        header: "Platforms",
        size: 100,
        cell: ({ getValue }) => <PlatformIcons platforms={getValue() ?? []} />,
        filterFn: (row, _columnId, filterValue: string) => {
          if (!filterValue) return true;
          return row.original.platforms?.includes(filterValue) ?? false;
        },
      }),
    ],
    [currentTrackId, isPlaying, onPlayToggle],
  );

  const table = useReactTable({
    data: campaigns,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border-subtle">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "px-3 py-2.5 text-left text-xs font-medium text-foreground-muted",
                    header.column.getCanSort() ? "cursor-pointer select-none" : "",
                  )}
                  style={{ width: header.getSize() }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span className="flex items-center gap-1">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? " \u2191" : ""}
                    {header.column.getIsSorted() === "desc" ? " \u2193" : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isSelected = row.original.id === selectedId;
            return (
              <tr
                key={row.id}
                onClick={() => onSelect(row.original)}
                className={cn(
                  "cursor-pointer border-b border-border-subtle transition-colors",
                  isSelected
                    ? "bg-surface-elevated"
                    : "hover:bg-surface-hover",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
