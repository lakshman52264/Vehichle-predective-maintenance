import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import { FaComments, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hey! How can I assist you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [queryType, setQueryType] = useState('general'); // Default to manual
  const userMessageRef = useRef(null);
  const botMessageRef = useRef(null);  
  
  const endOfMessagesRef = useRef(null); // Ref for auto-scrolling

  // Scroll to the latest message
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Trigger scroll on messages update



  const scrollToUserMessage = () => {
    userMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToBotMessage = () => {
    botMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleQuerySubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      let botResponse = '';

      if (queryType === 'manual') {
        // Manual-related query
        const res = await axios.post('backened-url/search-manual', { query });
        botResponse = res.data.response || 'Sorry, I could not find any relevant information in the manual.';
      } else {
        // General query using GPT-4
        const res = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an assistant that provides information strictly related to vehicle maintenance. Please answer questions only if they are relevant to vehicle maintenance in 50 characters.',
              },
              { role: 'user', content: query },
            ],
            max_tokens: 100,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
          }
        );
        botResponse = res.data.choices[0].message.content;
      }

      setMessages([...newMessages, { role: 'bot', content: botResponse }]);
      scrollToBotMessage();
    } catch (error) {
      setMessages([...newMessages, { role: 'bot', content: 'An error occurred. Please try again.' }]);
      console.error('Error fetching chatbot response:', error);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
        >
          <FaComments size={35} />
        </button>
      )}

      {isOpen && (
        <div className="p-4 bg-white rounded-lg shadow-lg w-80 max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chatbot</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="overflow-y-auto h-48 mb-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                ref={msg.role === 'user' ? userMessageRef : botMessageRef}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  } p-2 rounded-lg max-w-xs text-justify`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-xs">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleQuerySubmit} className="flex flex-col space-y-3">
            <select
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="manual">Manual</option>
              <option value="general">General</option>
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
