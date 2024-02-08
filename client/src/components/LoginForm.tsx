import { useState, FormEventHandler } from 'react';
import Button from './Button';
import AuthenticationService from '../services/AuthenticationService';
import { toast } from 'react-toastify';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  setIsRegisterd: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ setIsRegisterd }: LoginFormProps) => {
  const { setUser } = useUserContext();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    const userNameRegEx: RegExp = /^[a-zA-Z0-9-_]+$/;
    const passwordRegEx: RegExp = /^\S+$/;
    /* prettier-ignore */
    if (!userNameRegEx.test(username)) {
      toast.error("Username can only include alphanumeric characters, '_', and '-'.");
    } else if(!passwordRegEx.test(password)){
      toast.error('Password should not contain spaces')
    }else {
      const response = await AuthenticationService.login({ username, password });
      if(response?.status === 200){
        toast.success("user logged in successfully");
        setUser(response.data.user);
        navigate('/home')
      }else{
        toast.error(response?.data.error);
      }
    }
  };

  return (
    <div>
      <div className="text-5xl text-center text-accent font-bold my-6">Login</div>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
            maxLength={15}
            minLength={3}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="my-3">
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
            maxLength={15}
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="my-4 flex justify-end">
          <Button text="Login" />
        </div>
      </form>
      <div>
        Don't have an account?{' '}
        <span className="link link-accent" onClick={() => setIsRegisterd(false)}>
          Register Now
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
