import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { QuoteStatus } from '@/domain/models';
import { getQuoteStatusOptions, quoteStatusKeyMap } from '@/i18n/helpers';
import { DataTable } from '@/shared/ui/DataTable';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency, formatDate } from '@/utils/format';

export default function QuotesManagementPage() {
  const { t } = useTranslation();
  const { snapshot, updateQuoteStatus } = useAppStore();
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all');
  const statusOptions = getQuoteStatusOptions(t);
  const rows = filter === 'all' ? snapshot.quotes : snapshot.quotes.filter((quote) => quote.status === filter);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('quotesManagement.eyebrow')}
          title={t('quotesManagement.title')}
          description={t('quotesManagement.description')}
        />
      </section>
      <section className="panel">
        <div className="toolbar">
          <label>
            {t('quotesManagement.filterStatus')}
            <select value={filter} onChange={(event) => setFilter(event.target.value as QuoteStatus | 'all')}>
              <option value="all">{t('quotesManagement.allStatuses')}</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <DataTable
          rows={rows}
          columns={[
            { key: 'reference', header: t('quotesManagement.columns.reference'), render: (row) => row.reference },
            {
              key: 'customer',
              header: t('quotesManagement.columns.customer'),
              render: (row) => snapshot.customers.find((customer) => customer.id === row.customerId)?.name ?? t('quotesManagement.unknown'),
            },
            {
              key: 'car',
              header: t('quotesManagement.columns.car'),
              render: (row) => snapshot.cars.find((car) => car.id === row.carId)?.name ?? t('quotesManagement.unknownCar'),
            },
            { key: 'date', header: t('quotesManagement.columns.eventDate'), render: (row) => formatDate(row.eventDate) },
            { key: 'estimate', header: t('quotesManagement.columns.estimate'), render: (row) => formatCurrency(row.estimatedPrice) },
            { key: 'status', header: t('quotesManagement.columns.status'), render: (row) => <StatusBadge status={row.status} /> },
            {
              key: 'actions',
              header: t('quotesManagement.columns.actions'),
              render: (row) => (
                <div className="table-actions">
                  {(['reviewing', 'quote-sent', 'accepted', 'declined'] as QuoteStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="text-link"
                      onClick={() => updateQuoteStatus({ quoteId: row.id, status })}
                    >
                      {t(quoteStatusKeyMap[status])}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
