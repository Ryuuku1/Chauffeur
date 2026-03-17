import { useEffect, type PropsWithChildren, type ReactNode } from 'react';
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

interface ModalProps extends PropsWithChildren {
  title: string;
  description?: string;
  isOpen: boolean;
  footer?: ReactNode;
  closeLabel?: string;
  onClose: () => void;
}

export const Modal = ({
  title,
  description,
  isOpen,
  footer,
  closeLabel,
  onClose,
  children,
}: ModalProps) => {
  const { t } = useTranslation();
  const ariaLabel = closeLabel ?? t('actions.close');

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3 id="modal-title">{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={ariaLabel}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
};
