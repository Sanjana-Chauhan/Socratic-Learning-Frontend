import { useRef } from "react";
function ChatContainer({ children }) {
  const scrollContainerRef = useRef(null);
  return (
    <div
      className="flex-grow overflow-y-auto px-4 py-4 bg-gray-50"
      ref={(el) => {
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
        scrollContainerRef.current = el;
      }}
    >
      {children}
    </div>
  );
}
export default ChatContainer;
