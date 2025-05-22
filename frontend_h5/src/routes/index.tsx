import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Game from '../pages/Game';
import Home from '../pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'game',
        element: <Game />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    // 启用 v7_relativeSplatPath 标志
    v7_relativeSplatPath: true,
  } as any,
}); 