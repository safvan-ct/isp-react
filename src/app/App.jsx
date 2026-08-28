import { RouterProvider } from 'react-router-dom';
import { router } from './AppRouter';
import '../styles/global.css';

export default function App() {
  return <RouterProvider router={router} />;
}
