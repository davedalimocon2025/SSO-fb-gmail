import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Box, TextField, Button, Typography, Paper, List, ListItem, 
  ListItemText, Divider, IconButton, Fab, Zoom, Badge
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

interface MessageData {
  author: string;
  message: string;
  time: string;
}

const socket: Socket = io("http://localhost:3001");

const PublicChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("chat_name") || "");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList, isOpen]);

  useEffect(() => {
    socket.on("load_history", (history: MessageData[]) => setMessageList(history));
    socket.on("receive_message", (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    });
    return () => {
      socket.off("load_history");
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData: MessageData = {
        author: userName.trim() || "Anonymous",
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  return (
    <>
      {/* 1. THE FLOATING BUTTON (MESSENGER ICON) */}
      <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
        <Zoom in={!isOpen}>
          <Fab color="primary" onClick={() => setIsOpen(true)} aria-label="chat">
            <Badge color="error" variant="dot" invisible={isOpen}>
              <ChatIcon />
            </Badge>
          </Fab>
        </Zoom>
      </Box>

      {/* 2. THE CHAT WINDOW */}
      <Zoom in={isOpen}>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: { xs: '90vw', sm: 350 },
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            borderRadius: '15px',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', ml: 1 }}>Public Chat</Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <RemoveIcon />
            </IconButton>
          </Box>

          {/* USERNAME SETTING (SMOOTH IN-CHAT) */}
          <Box sx={{ p: 1, bgcolor: '#f0f2f5' }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Enter Your Name..."
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                localStorage.setItem("chat_name", e.target.value);
              }}
              InputProps={{ disableUnderline: true, sx: { fontSize: '0.8rem', px: 1 } }}
            />
          </Box>
          <Divider />

          {/* MESSAGE LIST */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#fff' }}>
            {messageList.map((msg, index) => {
              const isMe = msg.author === (userName.trim() || "Anonymous");
              return (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                  {!isMe && <Typography variant="caption" sx={{ ml: 1, mb: 0.2, color: 'text.secondary' }}>{msg.author}</Typography>}
                  <Paper sx={{ 
                    p: 1.2, px: 1.8, maxWidth: '80%', 
                    bgcolor: isMe ? "primary.main" : "#e4e6eb", 
                    color: isMe ? "white" : "black",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  }}>
                    <Typography variant="body2">{msg.message}</Typography>
                  </Paper>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', mt: 0.2, opacity: 0.7 }}>{msg.time}</Typography>
                </Box>
              );
            })}
            <div ref={scrollRef} />
          </Box>

          {/* INPUT AREA */}
          <Box sx={{ p: 1.5, borderTop: '1px solid #ddd', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Aa"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#f0f2f5' } }}
            />
            <IconButton color="primary" onClick={sendMessage} disabled={!currentMessage.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Zoom>
    </>
  );
};

export default PublicChat;