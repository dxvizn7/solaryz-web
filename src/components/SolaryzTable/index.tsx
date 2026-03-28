import type { ReactNode } from 'react';

export interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface SolaryzTableProps<T extends { id: number | string }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  renderActions?: (row: T) => ReactNode;
  emptyMessage?: string;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-white/5 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 bg-white/10 rounded w-3/4" />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="h-3.5 bg-white/10 rounded w-12 ml-auto" />
      </td>
    </tr>
  );
}

export function SolaryzTable<T extends { id: number | string }>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  renderActions,
  emptyMessage = 'Nenhum registro encontrado.',
}: SolaryzTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-[#18181b]">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider text-right">
                Ações
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="px-4 py-10 text-center text-white/30"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-white/80">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-4 py-3 text-right">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
