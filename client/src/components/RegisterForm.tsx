import { useState, FormEventHandler } from 'react';
import Button from './Button';
import AuthenticationService from '../services/AuthenticationService';
import { toast } from 'react-toastify';

type RegisterFormProps = {
  setIsRegisterd: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterForm = ({ setIsRegisterd }: RegisterFormProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      if ((password === confirmPassword) && (username.length > 2) && (password.length > 7)) {
        const response = await AuthenticationService.register({ username, password });
        if(response?.status === 200){
          toast.success("user created successfully");
          setIsRegisterd(true);
        }else{
          toast.error(response?.data.message);
        }
      } else if (password !== confirmPassword) {
        toast.error('password and confirm password does not match');
      }
    }
  };
  return (
    <div>
      <div className="text-5xl text-center text-accent font-bold my-6">Sign Up</div>
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
        <div className="my-3">
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full max-w-xs"
            maxLength={15}
            minLength={8}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="my-4 flex justify-end">
          <Button text="Register" />
        </div>
      </form>
      <div>
        Already have an account?{' '}
        <span className="link link-accent" onClick={() => setIsRegisterd(true)}>
          Login Now
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;
