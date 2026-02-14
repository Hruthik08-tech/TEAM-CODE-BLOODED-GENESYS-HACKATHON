import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomList.css';

const RoomList = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const rooms = [
        {
            id: 'ROOM-001',
            partnerOrg: 'Global Aid Foundation',
            lastMessage: 'We agree on the revised pricing. Lets finalize the deal.',
            lastMessageTime: '10 min ago',
            unreadCount: 3,
            dealStatus: 'negotiating',
            itemName: 'Emergency Medical Kits',
            matchScore: 92,
        },
        {
            id: 'ROOM-002',
            partnerOrg: 'Eco Shelters',
            lastMessage: 'Can you provide updated delivery estimates?',
            lastMessageTime: '2 hours ago',
            unreadCount: 0,
            dealStatus: 'active',
            itemName: 'Portable Emergency Shelters',
            matchScore: 78,
        },
        {
            id: 'ROOM-003',
            partnerOrg: 'Alpha Logistics',
            lastMessage: 'Deal has been successfully closed. Thank you!',
            lastMessageTime: '1 day ago',
            unreadCount: 0,
            dealStatus: 'closed_successful',
            itemName: 'Heavy Duty Shipping Crates',
            matchScore: 85,
        },
        {
            id: 'ROOM-004',
            partnerOrg: 'AquaFilter Corp',
            lastMessage: 'Unfortunately we cannot meet the deadline.',
            lastMessageTime: '3 days ago',
            unreadCount: 0,
            dealStatus: 'closed_unsuccessful',
            itemName: 'Water Purification Systems',
            matchScore: 55,
        },
    ];

    const statusLabels = {
        negotiating: 'Negotiating',
        active: 'Active',
        closed_successful: 'Closed — Successful',
        closed_unsuccessful: 'Closed — Unsuccessful',
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'negotiating': return 'status-negotiating';
            case 'active': return 'status-active';
            case 'closed_successful': return 'status-closed-success';
            case 'closed_unsuccessful': return 'status-closed-fail';
            default: return '';
        }
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.partnerOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             room.itemName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || room.dealStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="room-list-page">
            <div className="room-list-header">
                <div>
                    <h1 className="room-list-title">Business Rooms</h1>
                    <p className="room-list-subtitle">Negotiate deals with matched organisations</p>
                </div>
            </div>

            <div className="room-list-controls">
                <div className="room-search-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="room-filter-pills">
                    {['all', 'active', 'negotiating', 'closed_successful', 'closed_unsuccessful'].map(status => (
                        <button
                            key={status}
                            className={`filter-pill ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === 'all' ? 'All' : statusLabels[status]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="room-list-grid">
                {filteredRooms.length === 0 ? (
                    <div className="room-list-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                        <p>No rooms found.</p>
                    </div>
                ) : (
                    filteredRooms.map(room => (
                        <div
                            key={room.id}
                            className="room-card"
                            onClick={() => navigate('/business-room')}
                        >
                            <div className="room-card-top">
                                <div className="room-avatar">
                                    {room.partnerOrg.charAt(0)}
                                </div>
                                <div className="room-card-info">
                                    <h3 className="room-partner-name">{room.partnerOrg}</h3>
                                    <span className="room-item-name">{room.itemName}</span>
                                </div>
                                {room.unreadCount > 0 && (
                                    <span className="room-unread-badge">{room.unreadCount}</span>
                                )}
                            </div>

                            <p className="room-last-message">{room.lastMessage}</p>

                            <div className="room-card-footer">
                                <span className={`room-status-badge ${getStatusClass(room.dealStatus)}`}>
                                    {statusLabels[room.dealStatus]}
                                </span>
                                <span className="room-time">{room.lastMessageTime}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RoomList;
