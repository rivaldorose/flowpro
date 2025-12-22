import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bot, Send, X, Minimize2, Maximize2, Loader2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';

export default function TaskAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      setIsSending(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const startConversation = async () => {
    try {
      const conversation = await base44.agents.createConversation({
        agent_name: 'task_assistant',
        metadata: {
          name: 'Taak Assistent Chat',
          description: 'AI assistent voor taakbeheer'
        }
      });
      setConversationId(conversation.id);
      
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: 'Hoi! Ik wil hulp bij taakbeheer.'
      });
      setIsSending(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = input.trim();
    setInput('');
    setIsSending(true);

    try {
      if (!conversationId) {
        const conversation = await base44.agents.createConversation({
          agent_name: 'task_assistant',
          metadata: {
            name: 'Taak Assistent Chat',
            description: 'AI assistent voor taakbeheer'
          }
        });
        setConversationId(conversation.id);
        
        await base44.agents.addMessage(conversation, {
          role: 'user',
          content: userMessage
        });
      } else {
        const conversation = await base44.agents.getConversation(conversationId);
        await base44.agents.addMessage(conversation, {
          role: 'user',
          content: userMessage
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsSending(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!conversationId) {
      startConversation();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg z-50"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 px-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg gap-2"
        >
          <Bot className="w-5 h-5 text-white" />
          <span className="text-white font-medium">AI Assistent</span>
          {isSending && <Loader2 className="w-4 h-4 text-white animate-spin" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-[#22262b] border border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Taak Assistent</h3>
              <p className="text-xs text-gray-400">Powered by FlowPro</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">
                Hoi {currentUser?.full_name?.split(' ')[0]}! 👋
              </p>
              <p className="text-gray-500 text-xs mb-4">
                Ik help je met slimme taakbeheer. Probeer:
              </p>
              <div className="space-y-2 text-left">
                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400 block">
                  "Splits project X op in taken"
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400 block">
                  "Wat zijn mijn taken deze week"
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400 block">
                  "Maak een taak voor editing"
                </Badge>
              </div>
            </div>
          )}

          {messages.map((message, idx) => {
            const isUser = message.role === 'user';
            
            return (
              <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] ${isUser ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isUser
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                        : 'bg-[#1a1d21] text-gray-300 border border-gray-800'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          code: ({ inline, children }) => 
                            inline ? (
                              <code className="px-1 py-0.5 rounded bg-gray-800 text-purple-400 text-xs">
                                {children}
                              </code>
                            ) : (
                              <code className="block p-2 rounded bg-gray-800 text-sm my-2">
                                {children}
                              </code>
                            ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                  
                  {message.tool_calls && message.tool_calls.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.tool_calls.map((tool, tidx) => (
                        <div
                          key={tidx}
                          className="text-xs text-gray-500 flex items-center gap-2 bg-[#1a1d21] rounded-lg px-3 py-2 border border-gray-800"
                        >
                          <Loader2 className={`w-3 h-3 ${tool.status === 'completed' ? 'text-emerald-400' : 'animate-spin text-blue-400'}`} />
                          <span>
                            {tool.status === 'completed' ? '✓' : '⏳'} {tool.name?.split('.').pop() || 'Actie'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#1a1d21] rounded-2xl px-4 py-3 border border-gray-800">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Vraag iets aan de AI..."
            className="flex-1 bg-[#1a1d21] border-gray-700 text-white placeholder:text-gray-500"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={isSending || !input.trim()}
            className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-600 mt-2 text-center">
          AI kan fouten maken. Controleer belangrijke info.
        </p>
      </div>
    </div>
  );
}