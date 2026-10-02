'use client';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { SettingsPanel } from '@/features/connect-instance/ui/SettingsPanel';
import { useReceiveMessages } from '@/features/receive-messages/model/useReceiveMessages';
import { ChatList } from '@/widgets/chat-list/ui/ChatList';
import { ChatWindow } from '@/widgets/chat-window/ui/ChatWindow';
import { OfflineBanner } from '@/widgets/offline-banner/ui/OfflineBanner';
import st from './page.module.css';

export default function Home() {
  // учетка из локального хранилища (пока так, пока не реализована авторизация)
  const instance = useChatStore((state) => state.instance);

  useReceiveMessages();

  return (
    <>
      <OfflineBanner />

      {!instance ? (
        <SettingsPanel />
      ) : (
        <div className={st.app}>
          <ChatList />
          <ChatWindow />
        </div>
      )}
    </>
  );
}
