import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ChatBox() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load contacts
    api.getContacts()
      .then((res) => {
        if (res.success && res.data.length > 0) {
          setContacts(res.data);
          setActiveContact(res.data[0]);
        }
      })
      .catch((err) => console.warn('Contacts load error:', err));
  }, []);

  useEffect(() => {
    if (activeContact) {
      loadMessages(activeContact.id);
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadMessages = async (contactId) => {
    try {
      const res = await api.getMessages(contactId);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      console.warn('Messages load error:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const textToSend = inputText.trim();
    setInputText('');

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localMsg = {
      messageId: 'TEMP-' + Date.now(),
      senderId: user ? user.userId : 'USR002',
      senderName: user ? user.name : 'Current User',
      senderRole: user ? user.role : 'schooladmin',
      receiverId: activeContact.id,
      receiverName: activeContact.name,
      text: textToSend,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, localMsg]);

    try {
      await api.sendMessage({
        receiverId: activeContact.id,
        receiverName: activeContact.name,
        receiverRole: activeContact.role,
        text: textToSend,
      });

      // Simulate a realistic real-time response from staff/parent
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyText = getSimulatedReply(activeContact.name, textToSend);
        const replyMsg = {
          messageId: 'REP-' + Date.now(),
          senderId: activeContact.id,
          senderName: activeContact.name,
          senderRole: activeContact.role,
          receiverId: user ? user.userId : 'USR002',
          receiverName: user ? user.name : 'Current User',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1600);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const getSimulatedReply = (contactName, userMsg) => {
    const lower = userMsg.toLowerCase();
    if (lower.includes('exam') || lower.includes('mark') || lower.includes('result')) {
      return `Noted. The examination verification has been completed and submitted for review.`;
    }
    if (lower.includes('meeting') || lower.includes('time') || lower.includes('schedule')) {
      return `Yes, I will be available at the scheduled time. Thank you for coordinating!`;
    }
    if (lower.includes('attendance') || lower.includes('absent')) {
      return `The attendance registers have been updated on the portal.`;
    }
    return `Thank you for the update, ${user ? user.name.split(' ')[0] : 'Admin'}. I have noted this and will take necessary action immediately.`;
  };

  return (
    <div className="messaging-layout">
      {/* Contacts sidebar */}
      <div className="messaging-sidebar">
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '14px' }}>
          Active Conversations
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {contacts.map((c) => (
            <button
              key={c.id}
              className={`contact-item-btn ${activeContact?.id === c.id ? 'active' : ''}`}
              onClick={() => setActiveContact(c)}
            >
              <div style={{ position: 'relative' }}>
                <div
                  style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#e2e8f0' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: c.status === 'online' ? '#22c55e' : c.status === 'away' ? '#eab308' : '#94a3b8',
                    border: '2px solid #fff',
                  }}
                />
              </div>
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <strong style={{ display: 'block', fontSize: '0.84rem', color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {c.name}
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat pane */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '520px' }}>
        {/* Chat header */}
        {activeContact && (
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px 8px 0 0',
            }}
          >
            <div
              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0' }}
            />
            <div>
              <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary)' }}>{activeContact.name}</strong>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                {activeContact.role} • <span style={{ color: '#16a34a' }}>Online</span>
              </div>
            </div>
          </div>
        )}

        {/* Message feed */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map((m, idx) => {
            const isMe = m.senderId === (user ? user.userId : 'USR002');
            return (
              <div key={idx} className={`chat-bubble ${isMe ? 'outgoing' : 'incoming'}`}>
                <div style={{ fontWeight: 600, fontSize: '0.74rem', marginBottom: '3px', opacity: 0.85 }}>
                  {isMe ? 'You' : m.senderName}
                </div>
                <div>{m.text}</div>
                <div className="chat-meta">
                  <span>{m.timestamp}</span>
                  {isMe && <span>✓✓</span>}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '12px 14px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '10px',
            backgroundColor: '#f8fafc',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder={`Type message to ${activeContact ? activeContact.name : 'contact'}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ margin: 0, padding: '10px 14px', fontSize: '0.9rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', whiteSpace: 'nowrap' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
