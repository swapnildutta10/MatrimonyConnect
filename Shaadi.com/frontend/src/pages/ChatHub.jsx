import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { chat as chatApi } from "../services/api";

function ChatHub() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")._id;

  useEffect(() => {
    async function fetchConversations() {
      try {
        const data = await chatApi.getConversations();
        setConversations(data.conversations);
        if (data.conversations.length > 0) {
          setActiveChat(data.conversations[0]);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      async function fetchMessages() {
        try {
          const data = await chatApi.getMessages(activeChat._id);
          setMessages(data.messages);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      }
      fetchMessages();
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(event) {
    event.preventDefault();

    if (!message.trim() || !activeChat) return;

    const receiverId = activeChat.otherUser?._id;
    if (!receiverId) return;

    try {
      const data = await chatApi.sendMessage(receiverId, message);
      setMessages((prev) => [
        ...prev,
        {
          _id: data.message._id,
          conversationId: data.conversationId,
          senderId: data.message.senderId,
          text: data.message.text,
          createdAt: new Date(),
          read: false,
        },
      ]);
      setMessage("");

      // Update conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeChat._id
            ? { ...c, lastMessage: message, lastMessageTime: new Date() }
            : c
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  function formatTime(date) {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  }

  function formatRelativeTime(date) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString();
  }

  return (
    <main className="dashboard-layout">
      <DashboardSidebar />

      <section className="chat-page">
        <div className="chat-list-panel">
          <div className="chat-list-header">
            <span>CONVERSATIONS</span>
            <h1>Messages</h1>

            <div className="chat-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search conversations"
              />
            </div>
          </div>

          <div className="conversation-list">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p>No conversations yet.</p>
                <p>Send interest to start chatting!</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  className={`conversation-item ${
                    activeChat?._id === conversation._id
                      ? "active-conversation"
                      : ""
                  }`}
                  key={conversation._id}
                  onClick={() => setActiveChat(conversation)}
                >
                  <div className="conversation-avatar">
                    <img
                      src={conversation.otherUser?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"}
                      alt={conversation.otherUser?.name || "User"}
                    />

                    <span></span>
                  </div>

                  <div className="conversation-details">
                    <div>
                      <h4>{conversation.otherUser?.name || "Unknown"}</h4>
                      <span>{conversation.lastMessageTime ? formatRelativeTime(conversation.lastMessageTime) : ""}</span>
                    </div>

                    <div>
                      <p>{conversation.lastMessage || "No messages yet"}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="chat-window">
          {activeChat ? (
            <>
              <header className="chat-window-header">
                <div className="active-chat-profile">
                  <img
                    src={activeChat.otherUser?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"}
                    alt={activeChat.otherUser?.name || "User"}
                  />

                  <div>
                    <h3>{activeChat.otherUser?.name || "Unknown"}</h3>
                    <p>
                      <span></span>
                      Online
                    </p>
                  </div>
                </div>

                <div className="chat-actions">
                  <button aria-label="Video call">
                    <i className="bi bi-camera-video"></i>
                  </button>

                  <button aria-label="More options">
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                </div>
              </header>

              <div className="message-area">
                {messages.map((msg) => {
                  const isSentByMe = (typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId) === currentUserId;
                  return (
                    <div
                      key={msg._id}
                      className={`message ${isSentByMe ? "sent-message" : "received-message"}`}
                    >
                      <p>{msg.text}</p>
                      <span>{formatTime(msg.createdAt)}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="message-input-area"
                onSubmit={handleSendMessage}
              >
                <button type="button" aria-label="Attachment">
                  <i className="bi bi-paperclip"></i>
                </button>

                <input
                  type="text"
                  placeholder={`Message ${activeChat.otherUser?.name || "User"}`}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />

                <button type="button" aria-label="Emoji">
                  <i className="bi bi-emoji-smile"></i>
                </button>

                <button
                  type="submit"
                  className="send-message-btn"
                  aria-label="Send message"
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              <div className="text-center">
                <i className="bi bi-chat-dots" style={{ fontSize: "3rem" }}></i>
                <p className="mt-2">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ChatHub;