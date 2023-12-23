import React, { useEffect, useState } from "react";
import { Message } from "../../types";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { setEmojisData } from "../../store/emojisSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const getEmojis = async () => {
    try {
      const response = await axios.get(
        `https://emoji-api.com/emojis?access_key=${process.env.REACT_APP_EMOJI_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["Emoji"],
    queryFn: getEmojis,
    refetchOnWindowFocus: false,
  });

  const handleJoinChat = () => {
    const storedMessages = localStorage.getItem("chatMessages");
    const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
    const nameInUse = parsedMessages.find(
      (message: Message) => message.userId === name
    );
    if (name && !nameInUse) {
      navigate(`/chat/${name}`);
    } else {
      alert("Nome de usuário já em uso");
    }
  };

  useEffect(() => {
    if (data) {
      dispatch(setEmojisData(data.slice(0, 100)));
    }
  }, [data]);

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
        <Button
          disabled={isLoading || !name}
          variant="contained"
          type="button"
          onClick={handleJoinChat}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
}

export default Welcome;
