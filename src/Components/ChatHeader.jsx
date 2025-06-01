// src/components/ChatHeader.jsx
import React from 'react';

const ChatHeader = () => {
  const handleLogOut = () => {
    localStorage.removeItem("jwt-token");
    window.location.replace("/signin");
  }
  return (
    <div className="w-full bg-gray-50  px-6 py-4  flex justify-between ">
      <p className='text-3xl font-semibold '>👋 Welcome to Socratica!</p>
      <button className='bg-gray-600 hover:bg-gray-800 cursor-pointer text-white px-4 py-2 rounded' onClick={handleLogOut}>LogOut</button>
    </div>
  );
};

export default ChatHeader;
