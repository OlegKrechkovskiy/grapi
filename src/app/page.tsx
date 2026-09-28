import { ChatList } from '@/widgets/chat-list/ui/ChatList';
import { ChatWindow } from '@/widgets/chat-window/ui/ChatWindow';
import st from './page.module.css';
import { OfflineBanner } from '@/widgets/offline-banner/ui/OfflineBanner';

export default function Home() {
  return (
    <>
      <OfflineBanner />
      <div className={st.app}>
        <ChatList />
        <ChatWindow />
      </div>
    </>
  );
}
