'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share, 
  ShareOff,
  Settings,
  Save,
  Play,
  Square,
  Download,
  Upload,
  MoreHorizontal,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  CollaborationUser, 
  CursorPosition, 
  CodeSelection, 
  CollaborationSession,
  ConnectionStatus,
  DocumentState,
  Operation
} from '@/types/collaboration';
import { cn } from '@/lib/utils';

interface CollaborativeEditorProps {
  session: CollaborationSession;
  participants: CollaborationUser[];
  currentUser: CollaborationUser;
  onCodeChange: (content: string, operations: Operation[]) => void;
  onCursorMove: (position: CursorPosition) => void;
  onSelectionChange: (selection: CodeSelection) => void;
  onSave: () => void;
  onExecute: () => void;
  onFileUpload: (file: File) => void;
  onFileDownload: () => void;
  className?: string;
}

export function CollaborativeEditor({
  session,
  participants,
  currentUser,
  onCodeChange,
  onCursorMove,
  onSelectionChange,
  onSave,
  onExecute,
  onFileUpload,
  onFileDownload,
  className,
}: CollaborativeEditorProps) {
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(session.language || 'javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isConnected, setIsConnected] = useState(true);
  const [cursorPositions, setCursorPositions] = useState<CursorPosition[]>([]);
  const [selections, setSelections] = useState<CodeSelection[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [documentState, setDocumentState] = useState<DocumentState>({
    content: '',
    version: 0,
    operations: [],
    lastModifiedBy: currentUser.id,
    lastModifiedAt: new Date(),
  });

  // Generate user colors for cursors and selections
  const getUserColor = useCallback((userId: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const index = participants.findIndex(p => p.id === userId);
    return colors[index % colors.length];
  }, [participants]);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor for collaboration
    editor.updateOptions({
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: true },
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      bracketPairColorization: { enabled: true },
    });

    // Add custom decorations for other users' cursors
    const decorations = participants
      .filter(p => p.id !== currentUser.id && p.cursorPosition)
      .map(p => ({
        range: new monaco.Range(
          p.cursorPosition!.line,
          p.cursorPosition!.column,
          p.cursorPosition!.line,
          p.cursorPosition!.column
        ),
        options: {
          className: 'collaborative-cursor',
          afterContentClassName: 'collaborative-cursor-after',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      }));

    editor.deltaDecorations([], decorations);

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      const position: CursorPosition = {
        line: e.position.lineNumber,
        column: e.position.column,
        userId: currentUser.id,
        userName: currentUser.name,
        color: getUserColor(currentUser.id),
        timestamp: new Date(),
      };
      
      onCursorMove(position);
    });

    // Handle selection changes
    editor.onDidChangeCursorSelection((e: any) => {
      if (e.selection && !e.selection.isEmpty()) {
        const selection: CodeSelection = {
          startLine: e.selection.startLineNumber,
          startColumn: e.selection.startColumn,
          endLine: e.selection.endLineNumber,
          endColumn: e.selection.endColumn,
          userId: currentUser.id,
          userName: currentUser.name,
          color: getUserColor(currentUser.id),
          timestamp: new Date(),
        };
        
        onSelectionChange(selection);
      }
    });

    // Handle content changes
    editor.onDidChangeModelContent((e: any) => {
      const content = editor.getValue();
      setCode(content);
      
      // Generate operations for operational transformation
      const operations: Operation[] = e.changes.map((change: any) => ({
        type: change.text ? 'INSERT' : 'DELETE',
        position: change.rangeOffset,
        content: change.text,
        length: change.rangeLength,
        userId: currentUser.id,
        timestamp: new Date(),
        version: documentState.version + 1,
      }));

      setDocumentState(prev => ({
        ...prev,
        content,
        version: prev.version + 1,
        operations: [...prev.operations, ...operations],
        lastModifiedBy: currentUser.id,
        lastModifiedAt: new Date(),
      }));

      onCodeChange(content, operations);
    });

    // Handle typing indicators
    let typingTimeout: NodeJS.Timeout;
    editor.onDidChangeModelContent(() => {
      setIsTyping(true);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    });
  }, [currentUser, participants, getUserColor, onCursorMove, onSelectionChange, onCodeChange, documentState.version]);

  // Update cursor positions from other users
  useEffect(() => {
    if (!editorRef.current) return;

    const decorations = participants
      .filter(p => p.id !== currentUser.id && p.cursorPosition)
      .map(p => ({
        range: new (window as any).monaco.Range(
          p.cursorPosition!.line,
          p.cursorPosition!.column,
          p.cursorPosition!.line,
          p.cursorPosition!.column
        ),
        options: {
          className: 'collaborative-cursor',
          afterContentClassName: 'collaborative-cursor-after',
          stickiness: (window as any).monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      }));

    editorRef.current.deltaDecorations([], decorations);
  }, [participants, currentUser.id]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  // Get connection status icon
  const getConnectionIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'CONNECTED':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'CONNECTING':
      case 'RECONNECTING':
        return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'DISCONNECTED':
      case 'ERROR':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Editor Header */}
      <Card className="rounded-b-none border-b-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">{session.title}</CardTitle>
              <Badge variant="outline" className="capitalize">
                {session.type.replace('_', ' ').toLowerCase()}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {session.language}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <div className="flex items-center gap-1">
                {getConnectionIcon(isConnected ? 'CONNECTED' : 'DISCONNECTED')}
                <span className="text-sm text-muted-foreground">
                  {participants.length} online
                </span>
              </div>
              
              {/* Action Buttons */}
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button variant="outline" size="sm" onClick={onExecute}>
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
              
              <Button variant="outline" size="sm" onClick={onFileDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <input
                type="file"
                accept=".js,.ts,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="file-upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </label>
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Participants Bar */}
      <div className="flex items-center gap-2 p-2 bg-muted/50 border-b">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Participants:</span>
        
        <div className="flex items-center gap-2">
          {participants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center gap-2 px-2 py-1 rounded-md bg-background border"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-xs">
                  {participant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <span className="text-sm font-medium">{participant.name}</span>
              
              <div className="flex items-center gap-1">
                {getConnectionIcon(participant.connectionStatus)}
                
                {participant.isTyping && (
                  <Badge variant="secondary" className="text-xs">
                    typing...
                  </Badge>
                )}
                
                {participant.isMuted && (
                  <MicOff className="h-3 w-3 text-muted-foreground" />
                )}
                
                {participant.isVideoEnabled && (
                  <Video className="h-3 w-3 text-green-500" />
                )}
                
                {participant.isSharingScreen && (
                  <Share className="h-3 w-3 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            lineHeight: 1.5,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            renderWhitespace: 'selection',
            renderControlCharacters: true,
            renderIndentGuides: true,
            highlightActiveIndentGuide: true,
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'matchingDocuments',
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
          }}
        />
        
        {/* Cursor Labels */}
        {participants
          .filter(p => p.id !== currentUser.id && p.cursorPosition)
          .map(participant => (
            <div
              key={participant.id}
              className="absolute pointer-events-none z-10"
              style={{
                left: `${participant.cursorPosition!.column * 8}px`,
                top: `${(participant.cursorPosition!.line - 1) * 21}px`,
                transform: 'translateY(-100%)',
              }}
            >
              <div
                className="px-2 py-1 rounded text-xs font-medium text-white shadow-lg"
                style={{ backgroundColor: getUserColor(participant.id) }}
              >
                {participant.name}
              </div>
            </div>
          ))}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 bg-muted/50 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
          <span>Version: {documentState.version}</span>
          {isTyping && (
            <span className="text-blue-500">You are typing...</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {typingUsers.length > 0 && (
            <span className="text-blue-500">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          )}
          
          <div className="flex items-center gap-1">
            {isConnected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for collaborative cursors */}
      <style jsx global>{`
        .collaborative-cursor {
          border-left: 2px solid;
          margin-left: -1px;
          position: relative;
        }
        
        .collaborative-cursor-after {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          width: 2px;
          height: 20px;
          background: inherit;
          animation: collaborative-cursor-blink 1s infinite;
        }
        
        @keyframes collaborative-cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
