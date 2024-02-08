import { useState, useEffect, useRef } from 'react';
import ChatBubbleReceived from '../components/ChatBubbleReceived';
import ChatBubbleSent from '../components/ChatBubbleSent';
import { useUserContext } from '../contexts/UserContext';
import { useSocketContext } from '../contexts/SocketContext';
import { toast } from 'react-toastify';
import List from 'react-virtualized/dist/commonjs/List';

type MessageType = {
  id: string;
  username: string;
  time: string;
  content: string;
};

type NotificationType = {
  message: string;
};

const isMessageType = (message: any): message is MessageType => {
  return (
    typeof message.id === 'string' &&
    typeof message.username === 'string' &&
    typeof message.time === 'string' &&
    typeof message.content === 'string'
  );
};

const Room = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<(MessageType | NotificationType)[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const container = useRef<HTMLDivElement>(null);
  const socket = useSocketContext();
  const { user } = useUserContext();

  const hanldeSendMessage = () => {
    if (message.length > 0) {
      socket.emit('sendMessage', {
        username: user?.username,
        content: message,
        roomCode: user?.roomId,
        userId: user?.id,
      });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('broadcastMessage', data => {
      setMessages(prev => [
        ...prev,
        {
          id: data.message.id,
          username: data.username as string,
          content: data.message.content as string,
          time: new Date(data.message.createdAt).toLocaleTimeString(),
        },
      ]);
    });
    socket.on('newUser', data => {
      setMessages(prev => [
        ...prev,
        {
          message: `${data.username} joined the room`,
        },
      ]);
    });

    socket.on('roomCheckResult', isInRoom => {
      if (!isInRoom) {
        socket.emit('reconnectRoom', { roomCode: user?.roomId });
      }
    });

    socket.on('reconnectedRoom', data => {
      console.log('recievd id: ', data);
      toast.success(`Reconnected to room ${data.roomCode}`);
    });
  }, []);

  useEffect(() => {
    socket.emit('checkRoom', user?.roomId);
  }, [user]);

  useEffect(() => {
    function handleResize() {
      if (container.current) {
        const { width, height } = container.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col justify-end bg-secondary rounded-lg shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5/6 w-8/12 max-md:w-10/12">
      <div ref={container} className="h-full">
        <List
          scrollToIndex={messages.length - 1}
          width={containerDimensions.width}
          height={containerDimensions.height}
          rowCount={messages.length}
          rowHeight={72}
          rowRenderer={({ index, key, style }) => {
            const message = messages[index];
            if (isMessageType(message)) {
              return message.username === user?.username ? (
                <div key={key} style={style}>
                  <ChatBubbleSent
                    key={message.id}
                    name={message.username}
                    time={message.time}
                    content={message.content}
                  />
                </div>
              ) : (
                <div key={key} style={style}>
                  <ChatBubbleReceived
                    key={message.id}
                    name={message.username}
                    time={message.time}
                    content={message.content}
                  />
                </div>
              );
            } else {
              return (
                <div key={key} style={style}>
                  <div className="mx-auto mt-5 w-fit">
                    <div className="badge badge-neutral">{message.message}</div>
                  </div>
                </div>
              );
            }
          }}
        />
      </div>
      <div className="px-3 py-3 flex justify-center">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          type="text"
          placeholder="Type here"
          className="input w-full max-w-md"
        />
        <button onClick={hanldeSendMessage} className="btn mx-4">
          Send
        </button>
      </div>
    </div>
  );
};

export default Room;
