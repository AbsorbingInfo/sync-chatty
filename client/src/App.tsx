import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Auth from './pages/Auth';
import ThemeController from './components/ThemeController';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import { useUserContext } from './contexts/UserContext';
import Room from './pages/Room';

type CheckAuthProps = {
  children: JSX.Element;
};

const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const { user } = useUserContext();
  return user ? children : <Auth />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,
  },
  {
    path: '/home',
    element: (
      <CheckAuth>
        <Home />
      </CheckAuth>
    ),
  },
  {
    path: '/room',
    element: (
      <CheckAuth>
        <Room />
      </CheckAuth>
    ),
  },
]);

const App = () => {
  return (
    <div>
      <div className="fixed py-4 px-5 right-0">
        <ThemeController />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
