import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

export interface DataColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Array<DataColumn<T>>;
  rows: T[];
  rowKey?: (row: T, index: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  caption?: string;
}

export const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  emptyTitle,
  emptyDescription,
  caption,
}: DataTableProps<T>) => {
  if (!rows.length && emptyTitle && emptyDescription) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="table-shell overflow-shell scroll-shell">
      <table className="data-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey ? rowKey(row, index) : index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
