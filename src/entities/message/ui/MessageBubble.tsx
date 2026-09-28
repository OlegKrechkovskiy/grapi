import st from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: {
    id: number;
    text: string;
    incoming: boolean;
  };
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const bubbleClass = message.incoming ? st.incoming : st.outgoing;

  return <div className={`${st.bubble} ${bubbleClass}`}>
    <p className={st.text}>{message.text}</p>
    <span className={st.time}>
      {!message.incoming && <span className={st.check}>✓</span>}
      12:00
    </span>
  </div>;
};