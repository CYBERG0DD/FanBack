import { useEffect } from 'react'; // Added useEffect
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export default function App() {

  useEffect(() => {
    // 1. Check if the user has ever saved a preference
    const savedTheme = localStorage.getItem("fanback-theme");

    if (!savedTheme || savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem("fanback-theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      

    </>
  );
}