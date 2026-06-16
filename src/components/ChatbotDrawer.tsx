// app/components/ChatbotDrawer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Box, Typography, IconButton, TextField, Stack, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface ChatbotDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotDrawer({ open, onClose }: ChatbotDrawerProps) {
  const [localInput, setLocalInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Live Logger Hook for debugging typing state
  useEffect(() => {
    console.log('Current typing state:', localInput);
  }, [localInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  // Robust Native Form Submission Handler
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!localInput.trim() || isLoading) return;

    const userMessageContent = localInput.trim();
    setLocalInput(''); // Instantly clear input field

    // 1. Create and add user message locally
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      console.log('Sending message to Groq route:', userMessageContent);

      // 2. Direct native fetch to your route handler
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error('Failed to fetch reply');

      // 3. Handle Streaming Response Legibly
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) return;

      // Add placeholder assistant reply block
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '' },
      ]);

      let accumulatedReply = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Vercel AI SDK text stream format prefixes text chunks (usually prepended with text markings)
        // Clean up formatting tokens if present
        const cleanedChunk = chunk.replace(/^[0-9]:"/g, '').replace(/"$/g, '').replace(/\\n/g, '\n');
        accumulatedReply += cleanedChunk;

        // Update assistant text letter-by-letter live
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedReply }
              : msg
          )
        );
      }

    } catch (error) {
      console.error('Error streaming chatbot response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      <Box sx={{ width: { xs: '100vw', sm: 380 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header Layout */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <SmartToyIcon />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Kayal Vista Support AI</Typography>
          </Stack>
          <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </Box>

        {/* Message Window Stream Panel */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: 'action.hover' }}>
          {messages.length === 0 && (
            <Paper elevation={0} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Hello! Ask me anything about our luxury houseboats, scenic cruise routes, or dining arrangements.
              </Typography>
            </Paper>
          )}
          
          {messages.map((m) => (
            <Box
              key={m.id}
              sx={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                bgcolor: m.role === 'user' ? 'primary.main' : 'background.paper',
                color: m.role === 'user' ? 'white' : 'text.primary',
                p: 1.5,
                borderRadius: m.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                whiteSpace: 'pre-line',
                fontSize: '0.875rem'
              }}
            >
              {m.content}
            </Box>
          ))}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Footer Layout */}
        <Box 
          component="form" 
          onSubmit={onFormSubmit} 
          sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder={isLoading ? "AI is replying..." : "Ask a question..."}
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              variant="outlined"
              autoComplete="off"
              disabled={isLoading}
              sx={{
                bgcolor: 'background.paper',
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            />
            <IconButton type="submit" color="primary" disabled={!localInput.trim() || isLoading}>
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>

      </Box>
    </Drawer>
  );
}