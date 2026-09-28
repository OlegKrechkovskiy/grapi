import st from './ChatWindow.module.css';

export const ChatWindow = () => {
  return (
    <section className={st.window}>
      <header className={st.header}>
        <div className={st.avatar}>8</div>
        <div className={st.info}>
          <div className={st.name}>89897776655</div>
        </div>
      </header>
    </section>
  );
};
