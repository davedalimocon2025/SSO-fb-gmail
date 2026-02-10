import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import HomePage from '../pages/home/HomePage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
 
//   {
//     // You can group routes under a layout object
//     element: <MainLayout />, 
//     children: [
//       {
//         path: "/home",
//         element: <Home />,
//       },
//     ],
//   },
  {
    path: "*",
    element: <div style={{ padding: '20px' }}>404 - Not Found</div>,
  }
]);

export default router;