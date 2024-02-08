type ChatBubbleProps = {
  name: string;
  time: string;
  content: string;
};
const ChatBubbleSent = ({ name, time, content }: ChatBubbleProps) => {
  return (
    <div>
      <div className="chat chat-end">
        <div className="chat-header">
          {name + ' '}
          <time className="text-xs opacity-50">{time}</time>
        </div>
        <div className="chat-bubble">{content}</div>
      </div>
    </div>
  );
};

export default ChatBubbleSent;
