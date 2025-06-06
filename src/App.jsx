import  { useState, useEffect, useCallback ,useMemo} from "react";
import { Routes, Route } from "react-router-dom";
import MessageList from "./Components/MessageList";
import InputBox from "./Components/InputBox";
import Sidebar from "./Components/Sidebar";
import ChatHeader from "./Components/ChatHeader";
import ChatContainer from "./Components/ChatContainer";
import AuthForm from "./Components/AuthForm";
import ProtectedRoute from "./Components/ProtectedRoute";
import {jwtDecode} from "jwt-decode"; 
import useChat from "./hooks/useChat";
import { useUser } from "./context/userContext";
import Landing from "./Components/Landing";

const API_BASE = "http://localhost:5125/api";

function App() {
  const [conversations, setConversations] = useState([]);
  const { token, userId, setUserId } = useUser();
  const {
  currentChat,
  chatId,
  setChatId,
  sendMessage,
  startNewChat,
  fetchMessages,
} = useChat(token);


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

  

  useEffect(() => {
    if (token) fetchConversations();
  }, [fetchConversations, token]);

  
 const handleSelectConversation = (id) => {
  if (!id || id === chatId) return;
  setChatId(id);
  fetchMessages(id);
};


  return (
    <Routes>
      <Route
        path="/"
        element={<Landing />}
      />
      <Route
        path="/signUp"
        element={<AuthForm formType={"signUp"} onAuthSuccess={setUserId}  />}
      />
      <Route
        path="/signIn"
        element={<AuthForm formType={"signIn"} onAuthSuccess={setUserId} />}
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute setUser={setUserId}>
            <div className="flex h-screen">
              <Sidebar
                conversations={conversations}
                onSelect={handleSelectConversation}
                onNew={startNewChat}
              />
              <div className="flex-grow flex flex-col overflow-hidden">
                <ChatHeader />
                <ChatContainer>
                  <MessageList messages={currentChat} />
                </ChatContainer>
                <InputBox onSend={sendMessage} />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
