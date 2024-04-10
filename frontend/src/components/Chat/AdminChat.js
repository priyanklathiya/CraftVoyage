import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:8080");

function AdminChat() {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userMessages, setUserMessages] = useState({});
    const [replyMessage, setReplyMessage] = useState("");

    useEffect(() => {
        socket.on('user-message', (data) => {
            setUserMessages(prevMessages => ({
                ...prevMessages,
                [data.userId]: [...(prevMessages[data.userId] || []), { user: data.user, message: data.message }]
            }));
        });

        socket.on('admin-reply', (data) => {
            setUserMessages(prevMessages => ({
                ...prevMessages,
                [data.userId]: [...(prevMessages[data.userId] || []), { user: 'Admin', message: data.message }]
            }));
        });

        return () => {
            socket.off('user-message');
            socket.off('admin-reply');
        };
    }, []);

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
    };

    const handleReplyChange = (e) => {
        setReplyMessage(e.target.value);
    };

    const handleSendReply = () => {
        if (replyMessage.trim() !== "") {
            socket.emit('admin-reply', { userId: selectedUserId, message: replyMessage, user: 'Admin' });
            setUserMessages(prevMessages => ({
                ...prevMessages,
                [selectedUserId]: [...(prevMessages[selectedUserId] || []), { user: 'Admin', message: replyMessage }]
            }));
            setReplyMessage("");
        }
    };

    const handleRemoveChat = () => {
        socket.emit('remove-chat', { userId: selectedUserId });
        setUserMessages(prevMessages => {
            const updatedMessages = { ...prevMessages };
            delete updatedMessages[selectedUserId];
            return updatedMessages;
        });
        setSelectedUserId(null);
    };

    return (
        <div className='container'>
            <h1>Admin Chat</h1>
            <div className="row">
                <div className="col-md-4">
                    <h2>Users</h2>
                    <div className="list-group">
                        {Object.entries(userMessages).map(([userId, messages]) => (
                            <button key={userId} onClick={() => handleUserSelect(userId)} className={`list-group-item list-group-item-action ${selectedUserId === userId ? 'active' : ''}`}>
                                User {userId}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-md-8">
                    {selectedUserId && (
                        <div>
                            <h2>User {selectedUserId}</h2>
                            <div className="card">
                                <div className="card-body">
                                    {userMessages[selectedUserId] && userMessages[selectedUserId].map((msg, index) => (
                                        <div key={index} className={msg.user === 'Admin' ? 'text-right text-primary' : ''}>
                                            <strong>{msg.user}:</strong> {msg.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3">
                                <textarea className="form-control" rows="3" placeholder="Type your reply" value={replyMessage} onChange={handleReplyChange}></textarea>
                                <button className="btn btn-primary mt-2" onClick={handleSendReply}>Send Reply</button>
                                <button className="btn btn-danger mt-2 ml-2" onClick={handleRemoveChat}>Remove Chat</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminChat;
