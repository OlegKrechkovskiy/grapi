import { ChatMessage } from '../model/types';
import st from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: ChatMessage;
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