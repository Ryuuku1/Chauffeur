import { lazy, Suspense } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

const HomePage = lazy(() => import('@/features/public/HomePage'));
const FleetPage = lazy(() => import('@/features/fleet/FleetPage'));
const CarDetailsPage = lazy(() => import('@/features/fleet/CarDetailsPage'));
const QuoteRequestPage = lazy(() => import('@/features/booking/QuoteRequestPage'));
const ReservationRequestPage = lazy(() => import('@/features/booking/ReservationRequestPage'));
const FavoritesPage = lazy(() => import('@/features/customer/FavoritesPage'));
const ComparisonPage = lazy(() => import('@/features/compare/ComparisonPage'));
const ContactPage = lazy(() => import('@/features/public/ContactPage'));
const FaqPage = lazy(() => import('@/features/public/FaqPage'));
const CustomerDashboardPage = lazy(() => import('@/features/customer/CustomerDashboardPage'));
const ConfirmationPage = lazy(() => import('@/features/booking/ConfirmationPage'));
const ManagerLoginPage = lazy(() => import('@/features/admin/ManagerLoginPage'));
const ManagerDashboardPage = lazy(() => import('@/features/admin/ManagerDashboardPage'));
const CarsManagementPage = lazy(() => import('@/features/admin/CarsManagementPage'));
const ReservationsManagementPage = lazy(() => import('@/features/admin/ReservationsManagementPage'));
const QuotesManagementPage = lazy(() => import('@/features/admin/QuotesManagementPage'));
const PricingManagementPage = lazy(() => import('@/features/admin/PricingManagementPage'));
const AvailabilityManagementPage = lazy(() => import('@/features/admin/AvailabilityManagementPage'));
const SettingsPage = lazy(() => import('@/features/admin/SettingsPage'));
const BrandSettingsPage = lazy(() => import('@/features/admin/BrandSettingsPage'));
const ThemeSettingsPage = lazy(() => import('@/features/admin/ThemeSettingsPage'));
const ContentManagementPage = lazy(() => import('@/features/admin/ContentManagementPage'));
const SeoSettingsPage = lazy(() => import('@/features/admin/SeoSettingsPage'));

const PageFallback = () => (
  <div className="page-loading">
    <div className="skeleton skeleton-heading" />
    <div className="skeleton skeleton-body" />
    <div className="skeleton skeleton-grid" />
  </div>
);

const withSuspense = (element: JSX.Element) => <Suspense fallback={<PageFallback />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'fleet', element: withSuspense(<FleetPage />) },
      { path: 'fleet/:slug', element: withSuspense(<CarDetailsPage />) },
      { path: 'quote-request', element: withSuspense(<QuoteRequestPage />) },
      { path: 'reservation-request', element: withSuspense(<ReservationRequestPage />) },
      { path: 'favorites', element: withSuspense(<FavoritesPage />) },
      { path: 'compare', element: withSuspense(<ComparisonPage />) },
      { path: 'contact', element: withSuspense(<ContactPage />) },
      { path: 'faq', element: withSuspense(<FaqPage />) },
      { path: 'customer/dashboard', element: withSuspense(<CustomerDashboardPage />) },
      { path: 'confirmation/:kind/:reference', element: withSuspense(<ConfirmationPage />) },
    ],
  },
  {
    path: '/manager/login',
    element: withSuspense(<ManagerLoginPage />),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/manager',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/manager/dashboard" replace /> },
          { path: 'dashboard', element: withSuspense(<ManagerDashboardPage />) },
          { path: 'cars', element: withSuspense(<CarsManagementPage />) },
          { path: 'reservations', element: withSuspense(<ReservationsManagementPage />) },
          { path: 'quotes', element: withSuspense(<QuotesManagementPage />) },
          { path: 'pricing', element: withSuspense(<PricingManagementPage />) },
          { path: 'availability', element: withSuspense(<AvailabilityManagementPage />) },
          { path: 'settings', element: withSuspense(<SettingsPage />) },
          { path: 'settings/brand', element: withSuspense(<BrandSettingsPage />) },
          { path: 'settings/theme', element: withSuspense(<ThemeSettingsPage />) },
          { path: 'settings/content', element: withSuspense(<ContentManagementPage />) },
          { path: 'settings/seo', element: withSuspense(<SeoSettingsPage />) },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
