import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import { chat as chatApi } from "../services/api";

function ChatHistory() {
  const [history, setHistory] = useState({});
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState(null);
  const searchTimer = useRef(null);

  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")._id;

  useEffect(() => {
    fetchHistory();
  }, [page]);

  function handleSearch(value) {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchHistory(value);
    }, 400);
  }

  async function fetchHistory(searchTerm) {
    setLoading(true);
    try {
      const data = await chatApi.getHistory({ search: searchTerm || search, page, limit: 30 });
      setHistory(data.history);
      setTotal(data.total);
      // Auto-expand first group
      const dates = Object.keys(data.history);
      if (dates.length > 0 && !searchTerm) {
        setExpandedDate(dates[0]);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    } finally {
      setLoading(false);
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

  function isSentByMe(message) {
    const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
    return senderId === currentUserId;
  }

  function getMessagePreview(text) {
    return text.length > 80 ? text.substring(0, 80) + "..." : text;
  }

  function toggleDate(date) {
    setExpandedDate(expandedDate === date ? null : date);
  }

  const pages = Math.ceil(total / 30);

  return (
    <main className="dashboard-layout">
      <DashboardSidebar />

      <section className="chat-history-page">
        <div className="chat-history-header">
          <div>
            <span>CHAT HISTORY</span>
            <h1>Message History</h1>
            <p className="text-muted">
              {total > 0 ? `${total} message${total !== 1 ? 's' : ''} found` : "Browse all your past conversations"}
            </p>
          </div>

          <Link to="/chat" className="btn-back-to-chat">
            <i className="bi bi-chat-dots"></i>
            Go to Chat
          </Link>
        </div>

        <div className="chat-history-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search messages or people..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearch("");
                setPage(1);
                fetchHistory("");
              }}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>

        <div className="chat-history-content">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : Object.keys(history).length === 0 ? (
            <div className="empty-history">
              <i className="bi bi-chat-square-text"></i>
              <h3>No messages found</h3>
              <p>
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : "Start a conversation with someone to see your message history here."}
              </p>
              {!search && (
                <Link to="/matches" className="find-matches-btn">
                  <i className="bi bi-people"></i>
                  Find Matches
                </Link>
              )}
            </div>
          ) : (
            <div className="history-timeline">
              {Object.entries(history).map(([date, messages]) => (
                <div key={date} className="history-date-group">
                  <button
                    className="date-group-header"
                    onClick={() => toggleDate(date)}
                  >
                    <span className="date-label">{date}</span>
                    <span className="message-count">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
                    <i className={`bi bi-chevron-${expandedDate === date ? 'up' : 'down'}`}></i>
                  </button>

                  {(expandedDate === date || !expandedDate) && (
                    <div className="date-group-messages">
                      {messages.map((msg) => (
                        <div key={msg._id} className="history-message-item">
                          <div className="history-message-avatar">
                            {isSentByMe(msg) ? (
                              <div className="avatar-placeholder you-avatar">
                                <i className="bi bi-person"></i>
                              </div>
                            ) : (
                              <img
                                src={msg.otherUserImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"}
                                alt={msg.otherUserName}
                              />
                            )}
                          </div>

                          <div className="history-message-body">
                            <div className="history-message-header">
                              <strong className={isSentByMe(msg) ? "text-danger" : ""}>
                                {isSentByMe(msg) ? "You" : msg.otherUserName}
                              </strong>
                              <span className="message-time">{formatTime(msg.createdAt)}</span>
                              {!msg.read && !isSentByMe(msg) && (
                                <span className="unread-dot" title="Unread"></span>
                              )}
                            </div>
                            <p className="history-message-text">{getMessagePreview(msg.text)}</p>
                            <Link
                              to={`/chat`}
                              className="history-message-link"
                              title="Open conversation"
                            >
                              Open conversation <i className="bi bi-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              <i className="bi bi-chevron-left"></i> Previous
            </button>
            <span className="page-info">Page {page} of {pages}</span>
            <button
              className="page-btn"
              disabled={page >= pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ChatHistory;