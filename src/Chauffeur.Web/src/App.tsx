import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { AppErrorBoundary } from '@/shared/ui/AppErrorBoundary';
import { TenantPresentationBridge } from '@/shared/ui/TenantPresentationBridge';

export const App = () => (
  <AppErrorBoundary>
    <TenantPresentationBridge />
    <RouterProvider router={router} />
  </AppErrorBoundary>
);
