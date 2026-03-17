import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';

export default function ManagerLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signInManager } = useAppStore();
  const [password, setPassword] = useState('');

  return (
    <div className="login-shell">
      <div className="panel login-panel">
        <SectionHeading
          eyebrow={t('managerLogin.eyebrow')}
          title={t('managerLogin.title')}
          description={t('managerLogin.description')}
        />
        <form
          className="compact-form"
          onSubmit={async (event) => {
            event.preventDefault();
            const signedIn = await signInManager(password);
            if (signedIn) {
              navigate((location.state as { from?: string } | null)?.from ?? '/manager/dashboard');
            }
          }}
        >
          <label>
            {t('managerLogin.password')}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('managerLogin.passwordPlaceholder')}
            />
          </label>
          <Button type="submit">{t('actions.unlockManagerSuite')}</Button>
        </form>
      </div>
    </div>
  );
}
