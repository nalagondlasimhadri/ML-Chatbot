import { useState } from "react";

import {
  Bot,
  MessageCircle,
  Info,
  Star,
  Mail,
  Paperclip,
  Send,
  User,
  Sparkles,
  Trash2,
} from "lucide-react";

import "./App.css";


function App() {

  const initialMessages = [
    {
      sender: "bot",
      text: "Hello! 👋 I'm your ML Chatbot. How can I help you today?",
      time: getTime(),
    },
    {
      sender: "user",
      text: "What can you do?",
      time: getTime(),
    },
    {
      sender: "bot",
      text: "I can understand your questions and provide helpful responses using Natural Language Processing. 🤖",
      time: getTime(),
    },
  ];


  const [messages, setMessages] = useState(initialMessages);

  const [message, setMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);


  /* =========================
     GET CURRENT TIME
  ========================= */

  function getTime() {

    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  }


  /* =========================
     SEND MESSAGE
  ========================= */

 const handleSend = async () => {

  if (message.trim() === "") return;

  const userMessage = {
    sender: "user",
    text: message,
    time: getTime(),
  };

  setMessages((previousMessages) => [
    ...previousMessages,
    userMessage,
  ]);

  const currentMessage = message;

  setMessage("");
  setIsTyping(true);

  try {

    const response = await fetch(
      "http://localhost:5000/api/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: currentMessage,
        }),
      }
    );


    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }


    setMessages((previousMessages) => [
      ...previousMessages,

      {
        sender: "bot",
        text: data.response,
        time: getTime(),
      },
    ]);

  }

  catch (error) {

    console.error("Chat API Error:", error);

    setMessages((previousMessages) => [
      ...previousMessages,

      {
        sender: "bot",
        text: "Sorry, I couldn't connect to the backend. 🥲",
        time: getTime(),
      },
    ]);

  }

  finally {

    setIsTyping(false);

  }

};


  /* =========================
     ENTER KEY
  ========================= */

  const handleKeyDown = (event) => {

    if (event.key === "Enter") {
      handleSend();
    }

  };


  /* =========================
     CLEAR CHAT
  ========================= */

  const clearChat = () => {

    setMessages([]);

  };


  return (

    <div className="app">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="sidebar">


        {/* BRAND */}

        <div className="brand">

          <div className="brand-icon">
            <Bot size={38} />
          </div>


          <div>

            <h1>
              ML <span>Chatbot</span>
            </h1>

            <p>
              Smart Conversations with AI
            </p>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="navigation">


          <button className="nav-item active">

            <MessageCircle size={21} />

            <span>
              Chat
            </span>

          </button>


          <button className="nav-item">

            <Info size={21} />

            <span>
              About
            </span>

          </button>


          <button className="nav-item">

            <Star size={21} />

            <span>
              Features
            </span>

          </button>


          <button className="nav-item">

            <Mail size={21} />

            <span>
              Contact
            </span>

          </button>


        </nav>


        {/* POWERED BY */}

        <div className="powered-card">

          <div className="powered-title">

            <Sparkles size={18} />

            <span>
              Powered by
            </span>

          </div>


          <p>
            NLTK / Transformer
          </p>

          <p>
            Built with Python & Flask
          </p>

        </div>


        {/* PROFILE */}

        <div className="profile">

          <div className="profile-icon">

            <User size={25} />

          </div>


          <div>

            <h3>
              ML Chatbot Project
            </h3>

            <p>
              Student Project
            </p>

            <small>
              Made with ❤️
            </small>

          </div>

        </div>


      </aside>


      {/* =====================================
          MAIN CHAT
      ===================================== */}

      <main className="chat-container">


        {/* HEADER */}

        <header className="chat-header">


          <div>

            <h2>
              Chat with AI
            </h2>

            <p>
              Ask anything! I'm here to help.
            </p>

          </div>


          <div className="header-actions">


            {/* CLEAR CHAT */}

            <button
              className="clear-button"
              onClick={clearChat}
              title="Clear chat"
            >

              <Trash2 size={18} />

              <span>
                Clear
              </span>

            </button>


            {/* ONLINE */}

            <div className="online-status">

              <span></span>

              Online

            </div>


          </div>


        </header>


        {/* =====================================
            MESSAGES
        ===================================== */}

        <section className="messages">


          {messages.length === 0 && (

            <div className="empty-chat">

              <div className="empty-icon">

                <Bot size={42} />

              </div>


              <h2>
                Start a conversation 🤖
              </h2>


              <p>
                Ask me anything and let's chat!
              </p>


            </div>

          )}


          {messages.map((msg, index) => (

            <div
              key={index}
              className={`message-row ${msg.sender}`}
            >


              {/* BOT AVATAR */}

              {msg.sender === "bot" && (

                <div className="avatar bot-avatar">

                  <Bot size={22} />

                </div>

              )}


              <div className="message-content">


                <div className="message-bubble">

                  {msg.text}

                </div>


                <div className="message-time">

                  {msg.time}

                </div>


              </div>


              {/* USER AVATAR */}

              {msg.sender === "user" && (

                <div className="avatar user-avatar">

                  <User size={20} />

                </div>

              )}


            </div>

          ))}


          {/* =====================================
              TYPING INDICATOR
          ===================================== */}

          {isTyping && (

            <div className="message-row bot">


              <div className="avatar bot-avatar">

                <Bot size={22} />

              </div>


              <div className="typing-bubble">

                <span></span>
                <span></span>
                <span></span>

              </div>


            </div>

          )}


        </section>


        {/* =====================================
            INPUT
        ===================================== */}

        <div className="input-area">


          <button
            className="attachment-button"
            title="Attach file"
          >

            <Paperclip size={22} />

          </button>


          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
          />


          <button
            className="send-button"
            onClick={handleSend}
            title="Send message"
          >

            <Send size={21} />

          </button>


        </div>


      </main>

    </div>

  );

}


export default App;