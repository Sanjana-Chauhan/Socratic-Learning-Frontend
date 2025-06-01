// src/Components/MessageList.jsx

import ReactMarkdown from 'react-markdown';

const MessageList = ({ messages }) => {
  console.log(messages[0]);
  return (
   
    <div className="flex flex-col space-y-3">
      
      {messages.map((msg,index) => (
        <div
          key={index}
          className={`max-w-md px-4 py-2 rounded-xl ${
            msg.sender === 'user'
              ? 'bg-gray-700 text-white self-end'
              : 'bg-gray-200 text-gray-800 self-start'
          }`}
        >
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
