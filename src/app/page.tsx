import { ChatList } from '@/widgets/chat-list/ui/ChatList';
import { ChatWindow } from '@/widgets/chat-window/ui/ChatWindow';
import st from './page.module.css';

export default function Home() {
  return (
    <>
      <div className={st.app}>
        <ChatList />
        <ChatWindow />
      </div>
    </>
  );
}
