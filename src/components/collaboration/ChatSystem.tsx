'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Smile, 
  Paperclip, 
  Code, 
  Mic, 
  MicOff,
  MoreHorizontal,
  Reply,
  Edit,
  Trash2,
  ThumbsUp,
  Heart,
  Laugh,
  Angry,
  Sad,
  Wow,
  AtSign,
  Hash,
  FileText,
  Image,
  Video,
  Music,
  Archive
} from 'lucide-react';
import { 
  ChatMessage, 
  CollaborationUser, 
  MessageType, 
  CodeSnippet,
  MessageReaction,
  FileAttachment
} from '@/types/collaboration';
import { cn } from '@/lib/utils';

interface ChatSystemProps {
  messages: ChatMessage[];
  currentUser: CollaborationUser;
  participants: CollaborationUser[];
  onSendMessage: (content: string, type: MessageType, metadata?: any) => void;
  onSendCodeSnippet: (snippet: CodeSnippet) => void;
  onSendFile: (file: File) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReplyToMessage: (messageId: string, content: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onMentionUser: (userId: string) => void;
  className?: string;
}

const EMOJI_REACTIONS = [
  { emoji: '👍', label: 'Thumbs Up', icon: ThumbsUp },
  { emoji: '❤️', label: 'Heart', icon: Heart },
  { emoji: '😂', label: 'Laugh', icon: Laugh },
  { emoji: '😮', label: 'Wow', icon: Wow },
  { emoji: '😢', label: 'Sad', icon: Sad },
  { emoji: '😡', label: 'Angry', icon: Angry },
];

export function ChatSystem({
  messages,
  currentUser,
  participants,
  onSendMessage,
  onSendCodeSnippet,
  onSendFile,
  onReactToMessage,
  onReplyToMessage,
  onEditMessage,
  onDeleteMessage,
  onMentionUser,
  className,
}: ChatSystemProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicators
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (newMessage.trim()) {
      setIsTyping(true);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }

    return () => clearTimeout(typingTimeout);
  }, [newMessage]);

  // Handle message sending
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    
    // Check for mentions
    const mentions = messageContent.match(/@(\w+)/g) || [];
    const mentionedUsers = mentions.map(mention => 
      participants.find(p => p.name.toLowerCase() === mention.slice(1).toLowerCase())?.id
    ).filter(Boolean);

    onSendMessage(messageContent, 'TEXT', { mentions: mentionedUsers });
    setNewMessage('');
    setIsTyping(false);
  }, [newMessage, onSendMessage, participants]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === '@') {
      setShowMentionList(true);
      setMentionQuery('');
    }
  }, [handleSendMessage]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSendFile(file);
    }
  }, [onSendFile]);

  // Handle code snippet
  const handleCodeSnippet = useCallback(() => {
    const code = `// Write your code here
function example() {
  console.log("Hello, World!");
}`;
    
    const snippet: CodeSnippet = {
      language: 'javascript',
      code,
      lineNumbers: true,
      isExecutable: true,
    };
    
    onSendCodeSnippet(snippet);
    setShowCodeEditor(false);
  }, [onSendCodeSnippet]);

  // Handle emoji reaction
  const handleEmojiReaction = useCallback((messageId: string, emoji: string) => {
    onReactToMessage(messageId, emoji);
  }, [onReactToMessage]);

  // Handle reply
  const handleReply = useCallback((messageId: string) => {
    setReplyingTo(messageId);
    inputRef.current?.focus();
  }, []);

  // Handle edit
  const handleEdit = useCallback((messageId: string, content: string) => {
    setEditingMessage(messageId);
    setEditingContent(content);
    inputRef.current?.focus();
  }, []);

  // Handle edit save
  const handleEditSave = useCallback(() => {
    if (editingMessage && editingContent.trim()) {
      onEditMessage(editingMessage, editingContent.trim());
      setEditingMessage(null);
      setEditingContent('');
    }
  }, [editingMessage, editingContent, onEditMessage]);

  // Handle edit cancel
  const handleEditCancel = useCallback(() => {
    setEditingMessage(null);
    setEditingContent('');
  }, []);

  // Handle mention selection
  const handleMentionSelect = useCallback((userId: string) => {
    const user = participants.find(p => p.id === userId);
    if (user) {
      const mention = `@${user.name} `;
      setNewMessage(prev => prev + mention);
      onMentionUser(userId);
    }
    setShowMentionList(false);
    setMentionQuery('');
  }, [participants, onMentionUser]);

  // Filter participants for mentions
  const filteredParticipants = participants.filter(p => 
    p.id !== currentUser.id && 
    p.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  // Format message time
  const formatMessageTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  // Get file icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('text/') || mimeType.includes('code/')) return Code;
    return FileText;
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {messages.length} messages
            </Badge>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 group',
                  message.userId === currentUser.id ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {message.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className={cn(
                  'flex-1 max-w-[70%]',
                  message.userId === currentUser.id ? 'items-end' : 'items-start'
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(message.timestamp)}
                    </span>
                    {message.editedAt && (
                      <span className="text-xs text-muted-foreground">(edited)</span>
                    )}
                  </div>

                  <div className={cn(
                    'rounded-lg p-3 relative',
                    message.userId === currentUser.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  )}>
                    {/* Message Content */}
                    {message.type === 'TEXT' && (
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    )}

                    {message.type === 'CODE_SNIPPET' && message.codeSnippet && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {message.codeSnippet.fileName || 'Code Snippet'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {message.codeSnippet.language}
                          </Badge>
                        </div>
                        <pre className="bg-background/50 rounded p-2 text-sm overflow-x-auto">
                          <code>{message.codeSnippet.code}</code>
                        </pre>
                        {message.codeSnippet.executionResult && (
                          <div className="bg-background/50 rounded p-2 text-sm">
                            <div className="font-medium mb-1">Output:</div>
                            <pre className="text-green-600">
                              {message.codeSnippet.executionResult.output}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {message.type === 'FILE_SHARE' && message.fileAttachment && (
                      <div className="flex items-center gap-3 p-2 bg-background/50 rounded">
                        {React.createElement(getFileIcon(message.fileAttachment.mimeType), {
                          className: 'h-8 w-8 text-muted-foreground'
                        })}
                        <div className="flex-1">
                          <div className="font-medium">{message.fileAttachment.fileName}</div>
                          <div className="text-sm text-muted-foreground">
                            {(message.fileAttachment.fileSize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Message Actions */}
                    <div className={cn(
                      'absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity',
                      message.userId === currentUser.id ? 'left-2' : 'right-2'
                    )}>
                      <div className="flex items-center gap-1">
                        {EMOJI_REACTIONS.map((reaction) => (
                          <Button
                            key={reaction.emoji}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleEmojiReaction(message.id, reaction.emoji)}
                          >
                            {reaction.emoji}
                          </Button>
                        ))}
                        
                        {message.userId === currentUser.id && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEdit(message.id, message.content)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => onDeleteMessage(message.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleReply(message.id)}
                        >
                          <Reply className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            {reaction.emoji} {reaction.userName}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-2 border-t bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span>
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t">
          {/* Reply Preview */}
          {replyingTo && (
            <div className="mb-2 p-2 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Replying to:</span>
                  <span className="text-muted-foreground ml-1">
                    {messages.find(m => m.id === replyingTo)?.content.substring(0, 50)}...
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Edit Preview */}
          {editingMessage && (
            <div className="mb-2 p-2 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Editing message</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditCancel}
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={editingMessage ? editingContent : newMessage}
                onChange={(e) => {
                  if (editingMessage) {
                    setEditingContent(e.target.value);
                  } else {
                    setNewMessage(e.target.value);
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
              
              {/* Mention List */}
              {showMentionList && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-sm font-medium mb-2">Mention someone:</div>
                    <div className="space-y-1">
                      {filteredParticipants.map(participant => (
                        <Button
                          key={participant.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleMentionSelect(participant.id)}
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback className="text-xs">
                              {participant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {participant.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.js,.ts,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCodeEditor(!showCodeEditor)}
              >
                <Code className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={editingMessage ? handleEditSave : handleSendMessage}
                disabled={editingMessage ? !editingContent.trim() : !newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          {showCodeEditor && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Code Snippet</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCodeEditor(false)}
                >
                  ×
                </Button>
              </div>
              <textarea
                className="w-full h-32 p-2 border rounded bg-background font-mono text-sm"
                placeholder="// Write your code here..."
                defaultValue={`// Write your code here
function example() {
  console.log("Hello, World!");
}`}
              />
              <div className="flex items-center gap-2 mt-2">
                <select className="px-2 py-1 border rounded text-sm">
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                <Button size="sm" onClick={handleCodeSnippet}>
                  Send Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
