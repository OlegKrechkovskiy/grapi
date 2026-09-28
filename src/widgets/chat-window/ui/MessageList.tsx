"use client";

import { MessageBubble } from '@/entities/message/ui/MessageBubble';
import st from './MessageList.module.css';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: { id: number; text: string; incoming: boolean }[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={st.list}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
