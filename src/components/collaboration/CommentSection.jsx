import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send, Trash2, AtSign, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function CommentSection({ projectId, taskId = null }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', projectId, taskId],
    queryFn: () => {
      const filter = taskId 
        ? { project_id: projectId, task_id: taskId }
        : { project_id: projectId, task_id: null };
      return base44.entities.Comment.filter(filter, '-created_date');
    },
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const comment = await base44.entities.Comment.create(data);
      
      // Send notifications for mentions
      if (data.mentions && data.mentions.length > 0) {
        await Promise.all(
          data.mentions.map(email =>
            base44.entities.Notification.create({
              user_email: email,
              type: 'task_assigned',
              title: 'Je bent vermeld in een reactie',
              message: `${currentUser.full_name} heeft je vermeld: "${data.content.substring(0, 100)}..."`,
              link: taskId ? `/Tasks?id=${taskId}` : `/ProjectDetail?id=${projectId}`,
              related_id: taskId || projectId
            })
          )
        );
      }
      
      return comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId, taskId] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setContent('');
      setShowMentions(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Comment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId, taskId] });
    },
  });

  const handleTextChange = (e) => {
    const text = e.target.value;
    const cursor = e.target.selectionStart;
    setContent(text);
    setCursorPosition(cursor);

    // Check for @ mentions
    const textBeforeCursor = text.substring(0, cursor);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user) => {
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    const newText = 
      content.substring(0, lastAtIndex) + 
      `@${user.full_name} ` + 
      textAfterCursor;
    
    setContent(newText);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Extract mentions
    const mentionRegex = /@([^\s]+(?:\s+[^\s]+)*)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedName = match[1];
      const user = users.find(u => u.full_name === mentionedName);
      if (user && user.email !== currentUser?.email) {
        mentions.push(user.email);
      }
    }

    createMutation.mutate({
      project_id: projectId,
      task_id: taskId,
      content,
      mentions: [...new Set(mentions)],
      author_email: currentUser?.email,
      author_name: currentUser?.full_name
    });
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(mentionSearch.toLowerCase()) &&
    u.email !== currentUser?.email
  );

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            placeholder="Voeg een reactie toe... (gebruik @ om iemand te taggen)"
            className="bg-[#1a1d21] border-gray-700 text-white min-h-[80px] resize-none"
          />
          
          {/* Mention Dropdown */}
          {showMentions && filteredUsers.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-[#22262b] border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
              {filteredUsers.slice(0, 5).map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => insertMention(user)}
                  className="w-full px-4 py-2 text-left hover:bg-[#1a1d21] flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">
                    {user.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-white">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <AtSign className="w-3 h-3" />
            Typ @ om iemand te taggen
          </p>
          <Button
            type="submit"
            disabled={!content.trim() || createMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600 gap-2"
            size="sm"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Versturen
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Nog geen reacties. Wees de eerste!
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-[#1a1d21] rounded-lg p-4 border border-gray-800">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                    {comment.author_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{comment.author_name}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(comment.created_date), 'dd MMM yyyy HH:mm', { locale: nl })}
                    </p>
                  </div>
                </div>
                
                {comment.author_email === currentUser?.email && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(comment.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {comment.content.split(/(@[^\s]+(?:\s+[^\s]+)*)/).map((part, idx) => {
                  if (part.startsWith('@')) {
                    return (
                      <span key={idx} className="text-emerald-400 font-medium">
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}