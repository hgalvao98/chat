import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Message } from "./types";
import { Box, Button, TextField, Typography } from "@mui/material";

const ChatApp = () => {
  const params = useParams();

  const userId = params.name;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesFromServer, setMessagesFromServer] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessagesFromServer(JSON.parse(storedMessages));
    }

    const handleBeforeUnload = () => {
      const serializedMessages = JSON.stringify(messages);
      localStorage.setItem("chatMessages", serializedMessages);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "chatMessages") {
        setMessagesFromServer(JSON.parse(e.newValue as string));
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "chatMessages") {
        const newMessages = JSON.parse(e.newValue as string);
        newMessages.sort(
          (a: { creationDate: string }, b: { creationDate: any }) =>
            a.creationDate.localeCompare(b.creationDate)
        ); // Sort messages by date
        setMessagesFromServer(newMessages);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    setMessages(messagesFromServer);
  }, [messagesFromServer]);

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

    const updatedMessages = [...messages, newMessage];
    updatedMessages.sort((a, b) =>
      a.creationDate.localeCompare(b.creationDate)
    );

    setMessages(updatedMessages);
    setMessagesFromServer(updatedMessages);

    const serializedMessages = JSON.stringify(updatedMessages);
    localStorage.setItem("chatMessages", serializedMessages);

    setInputText("");
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      gap={3}
      p={4}
      overflow="auto"
      position="relative"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="#f5f7f8"
      padding={2}
    >
      <Box width="100%">
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
        <Button variant="contained" type="submit" sx={{ height: "79px" }}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default ChatApp;
