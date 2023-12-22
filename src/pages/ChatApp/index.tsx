import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../../types";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { ArrowBack, Delete } from "@mui/icons-material";
import EmojisDrawer from "../../components/EmojisDrawer";

const ChatApp = () => {
  const params = useParams();
  const navigate = useNavigate();

  const userId = params.name;
  const [messagesFromServer, setMessagesFromServer] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === "chatMessages") {
      setMessagesFromServer(JSON.parse(e.newValue as string));
    }
  };

  const prevLengthRef = useRef(messagesFromServer.length);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessagesFromServer(JSON.parse(storedMessages));
    }

    const handleBeforeUnload = () => {
      const serializedMessages = JSON.stringify(messagesFromServer);
      localStorage.setItem("chatMessages", serializedMessages);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messagesFromServer]);

  useEffect(() => {
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessagesFromServer(JSON.parse(storedMessages));
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "chatMessages") {
        const newMessages = JSON.parse(e.newValue as string);
        newMessages.sort(
          (a: { creationDate: string }, b: { creationDate: any }) =>
            a.creationDate.localeCompare(b.creationDate)
        );
        setMessagesFromServer(newMessages);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage = {
      creationDate: new Date().toISOString(),
      userId: userId,
      text: inputText,
      id: uuidv4(),
    };

    const updatedMessages = [...messagesFromServer, newMessage];
    updatedMessages.sort((a, b) =>
      a.creationDate.localeCompare(b.creationDate)
    );

    setMessagesFromServer(updatedMessages);

    const serializedMessages = JSON.stringify(updatedMessages);
    localStorage.setItem("chatMessages", serializedMessages);

    setInputText("");
  };

  useEffect(() => {
    if (messagesFromServer.length > prevLengthRef.current) {
      scrollToBottom();
    }

    prevLengthRef.current = messagesFromServer.length;
  }, [messagesFromServer]);

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      gap={2}
      p={4}
      overflow="auto"
      position="relative"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="#f5f7f8"
      padding={2}
    >
      <Box
        display="flex"
        padding={2}
        justifyContent="space-between"
        width="100%"
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBack color="primary" />
        </IconButton>
        <Typography variant="h4">Chat</Typography>
        <Button
          variant="outlined"
          onClick={() => {
            localStorage.removeItem("chatMessages");
            setMessagesFromServer([]);
          }}
        >
          Limpar
          <Delete />
        </Button>
      </Box>
      <Box
        height="80%"
        border="1px solid"
        borderColor="gray"
        borderRadius={2}
        width="100%"
        overflow="auto"
        bgcolor="white"
        id="chat-container"
        p={2}
      >
        {messagesFromServer.map((message) => (
          <Box
            display="flex"
            flexDirection="column"
            alignItems={message.userId === userId ? "flex-end" : "flex-start"}
            key={message.id}
          >
            <Typography fontWeight="bold">
              {message.userId as string}:
            </Typography>{" "}
            <Typography
              bgcolor={message.userId === userId ? "lightblue" : "lightgray"}
              borderRadius={1}
              padding={1}
            >
              {message.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        width="100%"
        component={"form"}
        onSubmit={handleFormSubmit}
        display="flex"
        gap={2}
      >
        {showEmojiPicker ? (
          <EmojisDrawer />
        ) : (
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={2}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }
            }}
          />
        )}
        <Button
          disabled={inputText === ""}
          variant="contained"
          type="submit"
          sx={{ height: "79px" }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default ChatApp;
