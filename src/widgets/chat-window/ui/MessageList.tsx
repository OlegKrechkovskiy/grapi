"use client";

import { MessageBubble } from '@/entities/message/ui/MessageBubble';
import st from './MessageList.module.css';
import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/entities/message/model/types';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={st.block}>
      <div className={st.list}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
