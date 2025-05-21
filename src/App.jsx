import React, { useState, useEffect, useCallback } from "react";
import MessageList from "./Components/MessageList";
import InputBox from "./Components/InputBox";
import Sidebar from "./Components/Sidebar";
import ChatHeader from "./Components/ChatHeader";
import ChatContainer from "./Components/ChatContainer";

const USER_ID = "Testuser-1";
const API_BASE = "http://localhost:5125/api";

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [chatId, setChatId] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations?userId=${USER_ID}`);
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  }, []);

  const fetchMessages = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/messages`);
      const data = await res.json();
      const formattedMessages = data.map((msg) => ({
        sender: msg.role,
        text: msg.content,
      }));
      setCurrentChat(formattedMessages);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSend = async (userMessage) => {
    setCurrentChat((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          prompt: userMessage,
          conversationId: chatId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!chatId) setChatId(data.conversationId);
        setCurrentChat((prev) => [...prev, { sender: "bot", text: data.aiResponse }]);
      } else {
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setCurrentChat((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong! Check your Internet Connection." },
      ]);
    }
  };

  const handleNewChat = async () => {
    setCurrentChat([{ sender: "bot", text: "Hii User Welcome to Promptium!" }]);
    setChatId(null);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, prompt: "", conversationId: null }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatId(data.conversationId);
        setCurrentChat([{ sender: "bot", text: data.aiResponse }]);
      }
    } catch (err) {
      console.error("Failed to start new chat:", err);
    }
  };

  const handleSelectConversation = (id) => {
    setChatId(id);
    fetchMessages(id);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
      />
      <div className="flex-grow flex flex-col overflow-hidden">
        <ChatHeader />
        <ChatContainer>
          <MessageList messages={currentChat} />
        </ChatContainer>
        <InputBox onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
