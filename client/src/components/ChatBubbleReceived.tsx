type ChatBubbleProps = {
  name: string;
  time: string;
  content: string;
};

const ChatBubbleReceived = ({ name, time, content }: ChatBubbleProps) => {
  return (
    <div>
      <div className="chat chat-start">
        <div className="chat-header">
          {name + ' '} <time className="text-xs opacity-50">{time}</time>
        </div>
        <div className="chat-bubble">{content}</div>
      </div>
    </div>
  );
};

export default ChatBubbleReceived;
