import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import LOGO from '../assets/logo.png';

const Auth = () => {
  const [isRegisterd, setIsRegisterd] = useState<boolean>(true);

  return (
    <div className="mb-4 flex justify-evenly items-center min-h-screen max-sm:flex-col">
      <div>
        <img className=" h-32 mx-auto mb-8 max-sm:mt-3 max-sm:mb-2" src={LOGO} alt="Logo" />
        <div className="text-7xl font-mono font-black max-[855px]:text-4xl">Sync Chatty</div>
      </div>
      <div>
        {isRegisterd ? <LoginForm setIsRegisterd={setIsRegisterd} /> : <RegisterForm setIsRegisterd={setIsRegisterd} />}
      </div>
    </div>
  );
};

export default Auth;
