// import React, { useState } from 'react';
// import io from "socket.io-client";
// const socket = io("http://localhost:8080");

// function ClientChat() {
//     const [username, setUserName] = useState("");
//     const [chatActive, setChatActive] = useState(false);
//     const [newMessage, setNewMessage] = useState("");
//     const [messages, setMessages] = useState([]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // if (!newMessage || !username) return;
//         const msgData = {
            
//             message: newMessage,
//             user: username,
//             time: new Date(Date.now()).getHours() + ":" + new Date().getMinutes(),
//         };

//         socket.emit('send-message', msgData);
//     }
//   return (
//       <>
//           <div className='container display-6 mb-5'>Client Chat</div>
//           <div>
//               {
//                   chatActive ? (
//                       <div className='container'>
//                           <h1>Chat Started...</h1>
//                           <div className=''></div>
//                           <form  onSubmit={handleSubmit} >
//                             <div className='row'>
//                                 <div className='col-sm-4'>
//                                     <input type='text' name='' id='' className='form-control' placeholder='Type your message'
//                                         onChange={(e) => setNewMessage(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className='col-sm-4'>
//                                     <button type='submit' className='btn btn-success'>Send</button>
//                                 </div>
//                             </div>
//                           </form>
//                       </div>
                      
//                   ) : (
//                         <div className='container mb-5'>
//                             <div className='row'>
//                                 <div className='col-sm-4'>
//                                       <input type='text' name='' id='' className='form-control'
//                                           value={username} placeholder='type your user name to start!'
//                                           onChange={(e) => setUserName(e.target.value)} />
//                                 </div>
//                                 <div className='col-sm-4'>
//                                     <button type='submit' className='btn btn-success' onClick={() => username !== "" && setChatActive(true)}>Start Chatting</button>
//                                 </div>
//                             </div>
//                         </div>
//                   )
                  
//               }
//           </div>
//       </>
//   )
// }

// export default ClientChat

import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:8080");

function ClientChat() {
    const [username, setUsername] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for admin replies
        socket.on('admin-reply', (data) => {
            setMessages(prevMessages => [...prevMessages, { user: 'Admin', message: data.message }]);
        });

        return () => {
            // Clean up socket listeners when component unmounts
            socket.off('admin-reply');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== "") {
            const msgData = {
                message: newMessage,
                user: username,
                time: new Date(Date.now()).getHours() + ":" + new Date().getMinutes(),
            };
            socket.emit('user-message', msgData);
            setNewMessage("");
            setMessages(prevMessages => [...prevMessages, msgData]);
        }
    };

    return (
        <div className='container'>
            <h1>User Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input type='text' className='form-control' placeholder='Type your message' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type='submit' className='btn btn-success mt-2'>Send</button>
            </form>
        </div>
    );
}

export default ClientChat;
