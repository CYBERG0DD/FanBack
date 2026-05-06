import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './components/FanBackLandingPage';
import { Dashboard } from './components/YT-DashBoard';
import UserGuide from './components/UserGuide'; // <-- 1. Import it here

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage
  },
  {
    path: '/dashboard',
    Component: Dashboard
  },
  {
    path: '/guide',           // <-- 2. Give it a dedicated URL
    Component: UserGuide      // <-- 3. Render the component here
  },
  {
    path: '*',
    Component: Dashboard
  },
]);