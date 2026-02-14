import React, { useState, useRef, useEffect } from 'react';
import './BusinessRoom.css';

const BusinessRoom = () => {
    /* ---- Mock room data ---- */
    const [room, setRoom] = useState({
        id: 'ROOM-8421-Z3',
        supply_name_snapshot: 'Medical Masks (N95)',
        demand_name_snapshot: 'Emergency Response Kit Request',
        room_status: 'active',
        created_at: '2024-01-12T10:30:00Z',
    });

    /* ---- Status history ---- */
    const [statusHistory, setStatusHistory] = useState([
        {
            id: 1,
            from_status: null,
            to_status: 'active',
            changed_at: '2024-01-12T10:30:00Z',
            note: 'Room created automatically on match',
        },
        {
            id: 2,
            from_status: 'active',
            to_status: 'in_progress',
            changed_at: '2024-01-18T14:15:00Z',
            note: 'Supplier confirmed availability',
        },
        {
            id: 3,
            from_status: 'in_progress',
            to_status: 'active',
            changed_at: '2024-01-22T09:00:00Z',
            note: 'Pending additional documents',
        },
    ]);

    /* ---- Chat messages ---- */
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender_name: 'Haruto Tanaka',
            message_text: 'Hello! I have 500 units of N95 masks ready for dispatch.',
            sent_at: '2024-01-12T10:32:00Z',
            is_edited: false,
            message_type: 'text',
        },
        {
            id: 2,
            sender_name: null,
            message_text: 'Request Accepted',
            sent_at: '2024-01-12T10:33:00Z',
            is_edited: false,
            message_type: 'system_event',
        },
        {
            id: 3,
            sender_name: 'Priya Sharma',
            message_text: 'Great, we need them urgently. Can you share the quality certification?',
            sent_at: '2024-01-12T11:05:00Z',
            is_edited: false,
            message_type: 'text',
        },
        {
            id: 4,
            sender_name: 'Haruto Tanaka',
            message_text: 'Sure, attaching the ISO certification document now.',
            sent_at: '2024-01-12T11:20:00Z',
            is_edited: true,
            message_type: 'text',
        },
        {
            id: 5,
            sender_name: 'Haruto Tanaka',
            message_text: null,
            sent_at: '2024-01-12T11:21:00Z',
            is_edited: false,
            message_type: 'attachment',
            attachment: {
                file_name: 'ISO_Certification_N95.pdf',
                file_size: '2.4 MB',
                download_url: '#',
            },
        },
        {
            id: 6,
            sender_name: 'Priya Sharma',
            message_text: 'Received. Let me review and get back to you by EOD.',
            sent_at: '2024-01-13T09:15:00Z',
            is_edited: false,
            message_type: 'text',
        },
        {
            id: 7,
            sender_name: null,
            message_text: 'Status changed to In Progress',
            sent_at: '2024-01-18T14:15:00Z',
            is_edited: false,
            message_type: 'system_event',
        },
        {
            id: 8,
            sender_name: 'Priya Sharma',
            message_text: 'Everything looks good. We\'ll proceed with the logistics coordination. Please share the shipping details whenever ready.',
            sent_at: '2024-01-19T10:00:00Z',
            is_edited: false,
            message_type: 'text',
        },
    ]);

    /* ---- State for change-status controls ---- */
    const [newStatus, setNewStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');

    /* ---- Chat input state ---- */
    const [messageInput, setMessageInput] = useState('');
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Current user for "own message" styling
    const currentUser = 'Priya Sharma';

    /* ---- Auto-scroll to bottom on new message ---- */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /* ---- Helpers ---- */
    const formatDate = (iso) => {
        const d = new Date(iso);
        const day = d.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || (day > 10 && day < 14)) ? 0 : day % 10] || 'th';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const formatTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatStatusLabel = (s) => {
        if (!s) return 'Created';
        return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    /* ---- Handlers ---- */
    const handleStatusChange = () => {
        if (!newStatus || newStatus === room.room_status) return;

        const entry = {
            id: statusHistory.length + 1,
            from_status: room.room_status,
            to_status: newStatus,
            changed_at: new Date().toISOString(),
            note: statusNote || null,
        };
        setStatusHistory([...statusHistory, entry]);

        // Also add system event message
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            sender_name: null,
            message_text: `Status changed to ${formatStatusLabel(newStatus)}`,
            sent_at: new Date().toISOString(),
            is_edited: false,
            message_type: 'system_event',
        }]);

        setRoom(prev => ({ ...prev, room_status: newStatus }));
        setNewStatus('');
        setStatusNote('');
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        const msg = {
            id: messages.length + 1,
            sender_name: currentUser,
            message_text: messageInput.trim(),
            sent_at: new Date().toISOString(),
            is_edited: false,
            message_type: 'text',
        };
        setMessages(prev => [...prev, msg]);
        setMessageInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const sizeStr = file.size > 1048576
            ? `${(file.size / 1048576).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`;

        const msg = {
            id: messages.length + 1,
            sender_name: currentUser,
            message_text: null,
            sent_at: new Date().toISOString(),
            is_edited: false,
            message_type: 'attachment',
            attachment: {
                file_name: file.name,
                file_size: sizeStr,
                download_url: '#',
            },
        };
        setMessages(prev => [...prev, msg]);
        e.target.value = '';
    };

    /* ===================================================
       RENDER
       =================================================== */
    return (
        <div className="room-page-wrapper">
            <div className="room-container">

                {/* =====================
                    LEFT PANEL
                    ===================== */}
                <div className="room-info-column">
                    <div className="room-info-card">

                        {/* Room header */}
                        <div className="room-header-block">
                            <div className="room-title-row">
                                <div className="room-names">
                                    <h2 className="room-supply-name">{room.supply_name_snapshot}</h2>
                                    <span className="room-demand-name">{room.demand_name_snapshot}</span>
                                </div>
                                <span className={`room-status-badge ${room.room_status}`}>
                                    {formatStatusLabel(room.room_status)}
                                </span>
                            </div>
                            <span className="room-created-at">created on: {formatDate(room.created_at)}</span>
                        </div>

                        {/* Scrollable middle */}
                        <div className="room-info-scroll">
                            {/* Status History */}
                            <h3 className="room-section-title">Status History</h3>
                            <div className="status-timeline">
                                {statusHistory.map((entry) => (
                                    <div key={entry.id} className="timeline-item">
                                        <span className="timeline-dot" />
                                        <div className="timeline-content">
                                            <span className="timeline-transition">
                                                {formatStatusLabel(entry.from_status)}
                                                <span className="timeline-transition-arrow">→</span>
                                                {formatStatusLabel(entry.to_status)}
                                            </span>
                                            <span className="timeline-date">{formatDate(entry.changed_at)} · {formatTime(entry.changed_at)}</span>
                                            {entry.note && <span className="timeline-note">"{entry.note}"</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Change Status — pinned at bottom */}
                        <div className="change-status-section">
                            <h3 className="room-section-title">Change Room Status</h3>
                            <select
                                className="status-select"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="">Select new status…</option>
                                <option value="active">Active</option>
                                <option value="in_progress">In Progress</option>
                                <option value="deal_closed">Deal Closed</option>
                                <option value="deal_failed">Deal Failed</option>
                            </select>
                            <textarea
                                className="status-note-input"
                                placeholder="Optional note about this change…"
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                rows={2}
                            />
                            <button
                                className="confirm-status-btn"
                                onClick={handleStatusChange}
                                disabled={!newStatus || newStatus === room.room_status}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Confirm Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* =====================
                    RIGHT PANEL — Chat
                    ===================== */}
                <div className="room-chat-column">
                    <div className="chat-header-bar">
                        <h2 className="room-section-title" style={{ marginBottom: 0 }}>Negotiation Chat</h2>
                    </div>

                    <div className="chat-body-card">
                        {/* Messages area */}
                        <div className="chat-messages-area">
                            {messages.length === 0 ? (
                                <div className="chat-empty-state">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    /* System event */
                                    if (msg.message_type === 'system_event') {
                                        return (
                                            <div key={msg.id} className="system-event-banner">
                                                <span className="system-event-text">{msg.message_text}</span>
                                            </div>
                                        );
                                    }

                                    const isOwn = msg.sender_name === currentUser;

                                    /* Normal text / attachment bubble */
                                    return (
                                        <div key={msg.id} className={`chat-bubble ${isOwn ? 'own-message' : ''}`}>
                                            <div className="bubble-header">
                                                <span className="bubble-sender">{msg.sender_name}</span>
                                                <span className="bubble-timestamp">{formatTime(msg.sent_at)}</span>
                                            </div>

                                            {msg.message_text && (
                                                <p className="bubble-text">{msg.message_text}</p>
                                            )}

                                            {msg.is_edited && (
                                                <span className="bubble-edited">(edited)</span>
                                            )}

                                            {msg.message_type === 'attachment' && msg.attachment && (
                                                <div className="attachment-card">
                                                    {/* File icon */}
                                                    <svg className="attachment-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                                    <div className="attachment-info">
                                                        <span className="attachment-name">{msg.attachment.file_name}</span>
                                                        <span className="attachment-size">{msg.attachment.file_size}</span>
                                                    </div>
                                                    <a href={msg.attachment.download_url} className="attachment-download" title="Download">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input bar */}
                        <div className="chat-input-bar">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden-file-input"
                                onChange={handleFileSelect}
                            />
                            <button
                                type="button"
                                className="attach-btn"
                                onClick={() => fileInputRef.current?.click()}
                                title="Attach file"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </button>
                            <input
                                type="text"
                                className="chat-text-input"
                                placeholder="Type a message…"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                className="send-btn"
                                onClick={handleSendMessage}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                Send
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BusinessRoom;
