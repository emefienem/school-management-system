import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/api/useAuth";
import { useParams } from "react-router-dom";

interface Message {
  text: string;
  senderEmail: string;
  receiverEmail: string;
  timestamp: string;
}

function Chat() {
  const { contactEmail } = useParams<{ contactEmail: string }>();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const socket = useRef<WebSocket | null>(null);
  const { currentUser, sendMessage, getMessage, messages } = useAuth();
  const currentUserEmail = currentUser?.user?.email;

  useEffect(() => {
    const fetchMessages = async () => {
      await getMessage(currentUserEmail, contactEmail!);
      setLocalMessages(messages);
    };

    fetchMessages();

    const initWebSocket = () => {
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      socket.current = new WebSocket(`${wsProtocol}://localhost:5001`);

      socket.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.current.onmessage = (event) => {
        const newMessage: Message = JSON.parse(event.data);
        setLocalMessages((prev) => [...prev, newMessage]);
      };

      let reconnectAttempts = 0;
      socket.current.onclose = (event) => {
        console.log("WebSocket connection closed. Attempting to reconnect...");
        setTimeout(
          initWebSocket,
          Math.min(10000, 1000 * Math.pow(2, reconnectAttempts))
        );
        reconnectAttempts++;
      };

      socket.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    initWebSocket();

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [contactEmail, currentUserEmail, getMessage, messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const message: Message = {
      text: messageInput,
      senderEmail: currentUserEmail,
      receiverEmail: contactEmail!,
      timestamp: new Date().toISOString(),
    };

    await sendMessage(currentUserEmail, contactEmail!, message.text);

    if (socket.current) {
      socket.current.send(JSON.stringify(message));
    }

    setLocalMessages((prev) => [...prev, message]);
    setMessageInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-auto p-4">
        {localMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.senderEmail === currentUserEmail
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg text-white ${
                msg.senderEmail === currentUserEmail
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            >
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-300">
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-lg focus:outline-none"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;

// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/api/useAuth";
// import { useParams } from "react-router-dom";

// interface Message {
//   text: string;
//   senderEmail: string;
//   receiverEmail: string;
//   timestamp: string;
// }

// interface Contact {
//   name: string;
//   email: string;
// }

// interface ChatProps {
//   currentUserEmail: string;
// }

// function Chat() {
//   const { contactEmail } = useParams<{ contactEmail: string }>();
//   const [localMessages, setLocalMessages] = useState<Message[]>([]);
//   const [messageInput, setMessageInput] = useState("");
//   const socket = useRef<WebSocket | null>(null);
//   const { currentUser, sendMessage, getMessage, messages } = useAuth();
//   const currentUserEmail = currentUser?.user?.email;

//   useEffect(() => {
//     const fetchMessages = async () => {
//       await getMessage(currentUserEmail, contactEmail!);
//       setLocalMessages(messages);
//     };

//     fetchMessages();

//     const initWebSocket = () => {
//       socket.current = new WebSocket("ws://localhost:5001");

//       socket.current.onopen = () => {
//         console.log("WebSocket connection established");
//       };

//       socket.current.onmessage = (event) => {
//         const newMessage: Message = JSON.parse(event.data);
//         setLocalMessages((prev) => [...prev, newMessage]);
//       };

//       let reconnectAttempts = 0;
//       socket.current.onclose = (event) => {
//         console.log("WebSocket connection closed. Attempting to reconnect...");
//         setTimeout(
//           initWebSocket,
//           Math.min(10000, 1000 * Math.pow(2, reconnectAttempts))
//         ); // Limit to 10 seconds
//         reconnectAttempts++;
//       };

//       socket.current.onerror = (error) => {
//         console.error("WebSocket error:", error);
//       };
//     };

//     initWebSocket();

//     return () => {
//       if (socket.current) {
//         socket.current.close();
//       }
//     };
//   }, [contactEmail, currentUserEmail, getMessage, messages]);

//   const handleSendMessage = async () => {
//     if (!messageInput.trim()) return;

//     const message: Message = {
//       text: messageInput,
//       senderEmail: currentUserEmail,
//       receiverEmail: contactEmail!,
//       timestamp: new Date().toISOString(),
//     };

//     await sendMessage(currentUserEmail, contactEmail!, message.text);

//     if (socket.current) {
//       socket.current.send(JSON.stringify(message));
//     }

//     setLocalMessages((prev) => [...prev, message]);
//     setMessageInput("");
//   };

//   return (
//     <div className="chat-window">
//       <div className="messages">
//         {localMessages.map((msg, index) => (
//           <div
//             key={index}
//             className={
//               msg.senderEmail === currentUserEmail
//                 ? "message sent"
//                 : "message received"
//             }
//           >
//             <span>{msg.text}</span>
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default Chat;
