import  { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import MessageList from "./Components/MessageList";
import InputBox from "./Components/InputBox";
import Sidebar from "./Components/Sidebar";
import ChatHeader from "./Components/ChatHeader";
import ChatContainer from "./Components/ChatContainer";
import AuthForm from "./Components/AuthForm";
import ProtectedRoute from "./Components/ProtectedRoute";
import {jwtDecode} from "jwt-decode"; 

const API_BASE = "http://localhost:5125/api";

function App() {
  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt-token"));

  // Extract userId from token on mount
 useEffect(() => {
  if (!userId && token) {
    try {
      const decoded = jwtDecode(token);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      setUserId(id);
    } catch (e) {
      console.error("Invalid token", e);
    }
  }
}, [token]);

  // Fetch conversations from server
  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  }, [token]);

  // Fetch messages for a selected conversation
  const fetchMessages = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const formattedMessages = data.map((msg) => ({
        sender: msg.role,
        text: msg.content,
      }));
      setCurrentChat(formattedMessages);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchConversations();
  }, [fetchConversations, token]);

  // Handle user sending a message
  const handleSend = async (userMessage) => {
    setCurrentChat((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: userMessage,
          conversationId: chatId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!chatId) setChatId(data.conversationId);
        setCurrentChat((prev) => [
          ...prev,
          { sender: "bot", text: data.aiResponse },
        ]);
      } else {
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setCurrentChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong! Check your Internet Connection.",
        },
      ]);
    }
  };

  // Handle starting a new chat
  const handleNewChat = async () => {
    setCurrentChat([{ sender: "bot", text: "Hii User Welcome to Promptium!" }]);
    setChatId(null);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: "",
          conversationId: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatId(data.conversationId);
        setCurrentChat((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.aiResponse,
          },
        ]);
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
    <Routes>
      <Route
        path="/signUp"
        element={<AuthForm formType={"signUp"} onAuthSuccess={setUserId} onNewToken={setToken} />}
      />
      <Route
        path="/signIn"
        element={<AuthForm formType={"signIn"} onAuthSuccess={setUserId} onNewToken={setToken} />}
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute setUser={setUserId}>
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
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
