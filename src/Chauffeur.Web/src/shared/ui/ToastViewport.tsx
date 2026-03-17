import { useTranslation } from 'react-i18next';

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M5.5 5.5l9 9m0-9l-9 9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

interface Toast {
  id: string;
  title: string;
  message: string;
}

export const ToastViewport = ({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions text">
      {toasts.map((toast) => (
        <article key={toast.id} className="toast">
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={() => onDismiss(toast.id)}
            aria-label={t('actions.dismiss')}
          >
            <CloseIcon />
          </button>
        </article>
      ))}
    </div>
  );
};
