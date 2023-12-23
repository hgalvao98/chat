import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { EmojiData, Message } from "../../types";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import {
  ArrowBack,
  Delete,
  InsertEmoticon,
  Keyboard,
} from "@mui/icons-material";
import EmojisDrawer from "../../components/EmojisDrawer";
import { useSelector } from "react-redux";
import { RootState } from "../../store/emojisSlice";

const ChatApp = () => {
  const params = useParams();
  const navigate = useNavigate();

  const userId = params.name;

  const [messagesFromServer, setMessagesFromServer] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = useSelector((state: RootState) => state.emojis);

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

    //save messages before closing tab
    const handleBeforeUnload = () => {
      const serializedMessages = JSON.stringify(messagesFromServer);
      localStorage.setItem("chatMessages", serializedMessages);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messagesFromServer]);

  //listen to changes in local storage
  useEffect(() => {
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

  const handleEmojiSelect = (emoji: EmojiData) => {
    setInputText((prevText) => prevText + emoji.character);
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
        <Box
          width="100%"
          overflow="hidden"
          display="flex"
          flexDirection={showEmojiPicker ? "column-reverse" : "column"}
        >
          {showEmojiPicker && (
            <EmojisDrawer data={emojis} onSelect={handleEmojiSelect} />
          )}
          <TextField
            fullWidth
            multiline
            minRows={showEmojiPicker ? 1 : 2}
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
            sx={{ bgcolor: "white" }}
          />
        </Box>
        <Button
          disabled={inputText === ""}
          variant="contained"
          type="submit"
          sx={{ height: "100%" }}
        >
          Enviar
        </Button>
        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {showEmojiPicker ? <Keyboard /> : <InsertEmoticon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatApp;
