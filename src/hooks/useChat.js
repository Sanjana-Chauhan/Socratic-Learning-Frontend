// src/hooks/useChat.js
import { useState, useCallback } from "react";

const API_BASE = "http://localhost:5125/api";

export default function useChat(token) {
  const [currentChat, setCurrentChat] = useState([]);
  const [chatId, setChatId] = useState(null);

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
      setChatId(id);
    } catch (err) {
      console.error("Failed to fetch messages", err);
      alert("Failed to fetch messages. Check console for details.");
    }
  }, [token]);

  const sendMessage = async (userMessage) => {
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
          text: "Something went wrong! Cant connect to server.",
        },
      ]);
    }
  };

  const startNewChat = async () => {
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
          { sender: "bot", text: data.aiResponse },
        ]);
      }
    } catch (err) {
      console.error("Failed to start new chat:", err);
    }
  };

  return {
    currentChat,
    chatId,
    setChatId,
    sendMessage,
    startNewChat,
    fetchMessages,
  };
}
