import React, { useState } from "react";
import { Message } from "../../types";
import { Box, Button, TextField, Typography } from "@mui/material";

function Welcome() {
  const [name, setName] = useState("");

  const handleJoinChat = () => {
    const storedMessages = localStorage.getItem("chatMessages");
    const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
    const nameInUse = parsedMessages.find(
      (message: Message) => message.userId === name
    );
    if (name && !nameInUse) {
      window.location.href = `/chat/${name}`;
    } else {
      alert("Nome de usuário já em uso");
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      gap={2}
    >
      <Typography variant="h3" textAlign="center">
        Bem vindo ao GoBots Chat
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        bgcolor="#f5f7f8"
        padding={2}
        borderRadius={2}
      >
        <Typography variant="body2">
          Digite seu nome de usuário para entrar no chat
        </Typography>
        <TextField
          label="Nome de usuário"
          size="small"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" type="button" onClick={handleJoinChat}>
          Entrar
        </Button>
      </Box>
    </Box>
  );
}

export default Welcome;
