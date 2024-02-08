import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
import { SocketProvider } from './contexts/SocketContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <UserProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </UserProvider>,
  // </React.StrictMode>
);
