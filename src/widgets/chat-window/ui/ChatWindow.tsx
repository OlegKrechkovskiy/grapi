import st from './ChatWindow.module.css';
import { MessageList } from './MessageList';

// fixme: временный мок .
const mockMessages = [
  { id: 1, text: 'Привет', incoming: true },
  { id: 2, text: 'Хелло', incoming: false },
  { id: 3, text: 'Как дела?', incoming: true },
  { id: 4, text: 'Отлично', incoming: false },
  { id: 5, text: 'Сплю', incoming: false },
  { id: 6, text: 'Днем??', incoming: true },
  { id: 7, text: 'Да', incoming: false },
  { id: 8, text: 'А ты чего?', incoming: false },
  { id: 9, text: 'Что-то хотел?', incoming: false },
  { id: 10, text: 'Да просто решил узнать как дела', incoming: true },
];

export const ChatWindow = () => {
  return (
    <section className={st.window}>
      <header className={st.header}>
        <div className={st.avatar}>8</div>
        <div className={st.info}>
          <div className={st.name}>89897776655</div>
        </div>
      </header>
      <MessageList messages={mockMessages} />
    </section>
  );
};
