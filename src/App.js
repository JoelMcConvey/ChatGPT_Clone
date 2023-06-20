import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SyncLoader from "react-spinners/SyncLoader";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setpreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      getMessages();
    }
  }

  function scrollToBottom() {
    const feed = document.getElementsByClassName("feed")[0];
    feed.scrollTo(0, document.body.scrollHeight);
  }

  const getMessages = async () => {
    if (value !== "") {
      scrollToBottom();
      setLoading(true);
      scrollToBottom();
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      try {
        const response = await fetch('https://chatgpt-clone-cbnj.onrender.com', options);
        const data = await response.json();
        return setMessage(data.choices[0].message);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setpreviousChats(previousChats => (
        [...previousChats,
        {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
        ]
      ));
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)));

  useEffect(() => {
    setValue("");
    setLoading(false);
    scrollToBottom();
  }, [currentChat.length])

  return (
    <div className="app">

      <section className="sidebar">
        <button onClick={createNewChat}>
          + New Chat
        </button>
        {uniqueTitles.length ? (
          <h4>Chat Log</h4>
        ) : (
          null
        )}
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <motion.li key={index} onClick={() => handleClick(uniqueTitle)} >Chat {index + 1}: {uniqueTitle}</motion.li>)}
        </ul>
        <nav>
          <p className="made-by">Made By <a href="https://github.com/JoelMcConvey" target="_blank" rel="noopener noreferrer">Joel McConvey!</a></p>
        </nav>
      </section>

      <section className="main">
        <h1>ChatGPT Interface</h1>
        <ul className="feed">
          {currentChat?.map((chatMessage, index) =>
            <li key={index} className={chatMessage.role}>
              <p className="role">{chatMessage.role.charAt(0).toUpperCase() + chatMessage.role.slice(1)}</p>
              <p className="message">{chatMessage.content}</p>
            </li>)}
          {loading === true ? (
            <SyncLoader
              className="loader"
              color={'rgba(20, 126, 251, 0.9)'}
              loading={loading}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            null
          )}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input id="input-field" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleEnter} placeholder="Enter Here..." />
            <motion.div id="submit" onClick={getMessages} whileHover={{ scale: 0.8 }}>→</motion.div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us to improve.
          </p>
        </div>
      </section>

    </div>
  );
}

export default App;
