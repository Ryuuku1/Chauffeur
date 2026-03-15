import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CustomerPage } from './pages/CustomerPage';
import { ManagerPage } from './pages/ManagerPage';
import { ApiLabPage } from './pages/ApiLabPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'customer', element: <CustomerPage /> },
      { path: 'manager', element: <ManagerPage /> },
      { path: 'api-lab', element: <ApiLabPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
