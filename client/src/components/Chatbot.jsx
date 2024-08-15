import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const newMessages = [...messages, { text: userInput, user: true }];
    setMessages(newMessages);
    setUserInput('');

    try {
      const response = await axios.post('/chatbot', { message: userInput });
      const botMessage = response.data.message;
      setMessages([...newMessages, { text: botMessage, user: false }]);
    } catch (error) {
      console.error('Error communicating with the chatbot:', error);
      setMessages([...newMessages, { text: 'Sorry, I am unable to respond at the moment.', user: false }]);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header" onClick={toggleChat}>
        <h3>EcoUnity Assistant</h3>
      </div>
      {isOpen && (
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.user ? 'user' : 'bot'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
