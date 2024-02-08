import { useState, useEffect, FormEventHandler } from 'react';
import { toast } from 'react-toastify';
import { useUserContext } from '../contexts/UserContext';
import { useSocketContext } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [roomPassword, setRoomPassword] = useState<string>('');
  const { user, setUser } = useUserContext();
  const socket = useSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket!');
    });
    socket.on('joinedRoom', data => {
      navigate('/room');
      if (user) {
        setUser({ id: user.id, username: user.username, roomId: data.roomCode as string });
      }
      toast.success(`Successfully joined room ${data.roomCode}`);
    });
    socket.on('roomCodeExists', message => {
      toast.error(message);
    });
    socket.on('roomCreated', data => {
      socket.emit('joinRoom', { roomCode: data.roomCode, roomPassword: data.roomPassword, userId: user?.id });
    });

    socket.on('error', data => {
      toast.error(data.error);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  const handleJoinRoom = () => {
    const roomCodeRegEx: RegExp = /^[a-z]+$/;
    const passwordRegEx: RegExp = /^\S+$/;
    /* prettier-ignore */
    if (!roomCodeRegEx.test(roomCode)) {
      toast.error("room code can only include small case alphabet");
    } else if(!passwordRegEx.test(roomPassword)){
      toast.error('Password should not contain spaces')
    }else {
      try{
        socket.emit('joinRoom', {roomCode, roomPassword, userId: user?.id});
      }catch(error){
        console.log(error)
        toast.error('Error joining the room')
      }
    }
  };

  const handleCreateRoom = () => {
    const roomCodeRegEx: RegExp = /^[a-z]+$/;
    const passwordRegEx: RegExp = /^\S+$/;
    /* prettier-ignore */
    if (!roomCodeRegEx.test(roomCode)) {
      toast.error("room code can only include small case alphabet");
    } else if(!passwordRegEx.test(roomPassword)){
      toast.error('Password should not contain spaces')
    }else {
      try{
        socket.emit("createRoom", { roomCode, roomPassword, userId: user?.id });
      }catch (error){
        console.log(error)
        toast.error('Error creating the room')
      }
    }
  };

  const formHandler: FormEventHandler<HTMLFormElement> = (e: any) => {
    e.preventDefault();
    const buttonName = e.nativeEvent.submitter.name;
    if (buttonName === 'joinButton') {
      handleJoinRoom();
    } else if (buttonName === 'createButton') {
      handleCreateRoom();
    }
  };

  return (
    <div className="bg-secondary rounded-lg shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/12 max-md:w-10/12">
      <div className="text-4xl font-mono font-black mx-auto w-fit py-3 mt-4">Sync Chatty</div>
      <form onSubmit={formHandler}>
        <div className="my-3 max-w-xs mx-auto px-2">
          <input
            type="text"
            placeholder="Room Code"
            className="input input-bordered w-full"
            maxLength={6}
            minLength={6}
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
          />
        </div>
        <div className="my-3  max-w-xs mx-auto px-2">
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            maxLength={4}
            minLength={4}
            value={roomPassword}
            onChange={e => setRoomPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center my-8">
          <div className="join join-horizontal">
            <button type="submit" name="joinButton" className="btn join-item">
              Join Room
            </button>
            <button type="submit" name="createButton" className="btn btn-primary join-item">
              Create Room
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Home;
