import React, { useState, useEffect } from 'react';
import { useStore } from '../services/store';
import { Send, User as UserIcon, Bot } from 'lucide-react';
import { getChatAssistance } from '../services/gemini';

export const Chat = () => {
  const { user, chatRooms, messages, sendMessage, users } = useStore();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Filter rooms for current user
  const myRooms = chatRooms.filter(r => r.participants.includes(user?.id || ''));

  // Auto-select first room
  useEffect(() => {
    if (!activeRoomId && myRooms.length > 0) setActiveRoomId(myRooms[0].id);
  }, [myRooms, activeRoomId]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeRoomId) return;
    sendMessage(activeRoomId, inputText);
    setInputText('');

    // AI Assistant simulation in a specific "AI Support" room if we had one,
    // or just a helper feature. For now, normal chat.
    // If the room includes 'ai-bot', we trigger AI response.
    if (activeRoomId === 'ai-assistant') {
      setIsTyping(true);
      const reply = await getChatAssistance([], inputText);
      sendMessage(activeRoomId, reply); // In reality this should be a system msg
      setIsTyping(false);
    }
  };

  const getOtherParticipant = (room: any) => {
    const otherId = room.participants.find((id: string) => id !== user?.id);
    return users.find(u => u.id === otherId) || { name: 'Unknown User' };
  };

  if (myRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Bot size={48} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
        <p>Start matching with farmers or buyers to chat!</p>
      </div>
    );
  }

  const currentMessages = activeRoomId ? (messages[activeRoomId] || []) : [];

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-100 bg-slate-50">
        <div className="p-4 border-b border-slate-200 font-semibold text-slate-700">Messages</div>
        <div className="overflow-y-auto h-full pb-20">
          {myRooms.map(room => {
            const otherUser = getOtherParticipant(room);
            return (
              <div
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`p-4 cursor-pointer hover:bg-emerald-50 transition-colors ${activeRoomId === room.id ? 'bg-emerald-100 border-l-4 border-emerald-500' : ''}`}
              >
                <div className="font-medium text-slate-900">{otherUser.name}</div>
                <div className="text-sm text-slate-500 truncate">{room.lastMessage || 'No messages yet'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeRoomId && (
          <>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <span className="font-semibold text-lg">{getOtherParticipant(myRooms.find(r => r.id === activeRoomId)).name}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {currentMessages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {isTyping && <div className="text-xs text-slate-400 italic">AI is thinking...</div>}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
