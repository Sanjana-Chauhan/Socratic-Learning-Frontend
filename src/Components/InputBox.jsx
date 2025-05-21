// src/components/InputBox.jsx
import React, { useState } from "react";

const InputBox = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 flex bg-gray-50 justify-center items-center">
      <div className="w-full  max-w-3xl relative">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Send a message..."
          className="
    w-full resize-none rounded-xl px-4 py-3
    text-sm bg-gray-100 placeholder:text-gray-500
    focus:outline-none shadow-[0_2px_10px_rgba(0,0,0,0.5)]
  "
        />
        <button
          onClick={handleSend}
          className="
            absolute bottom-6 right-4 bg-black text-white p-2 rounded-md
            hover:bg-blue-600 transition shadow-sm
          "
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default InputBox;
