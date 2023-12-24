import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../../types";
import { Box } from "@mui/material";

import Input from "./components/Input";
import ChatHeader from "./components/ChatHeader";
import ChatContainer from "./components/ChatContainer";

const ChatApp = () => {
  const params = useParams();

  const userId = params.name;

  const [messagesFromServer, setMessagesFromServer] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const handleStorage = (e: StorageEvent) => {
    if (e.key === "chatMessages") {
      setMessagesFromServer(JSON.parse(e.newValue as string));
    }
  };

  const prevLengthRef = useRef(messagesFromServer?.length);

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
    if (messagesFromServer?.length > prevLengthRef.current) {
      scrollToBottom();
    }

    prevLengthRef.current = messagesFromServer?.length;
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
      <ChatHeader setMessagesFromServer={setMessagesFromServer} />
      <Box
        height="80%"
        border="1px solid"
        borderColor="gray"
        borderRadius={2}
        width="100%"
        overflow="auto"
        bgcolor="white"
        id="chat-container"
        display="flex"
        flexDirection="column"
        gap={1}
        p={2}
      >
        {messagesFromServer &&
          messagesFromServer.map((message) => (
            <ChatContainer key={message.id} message={message} />
          ))}
      </Box>
      <Input
        handleFormSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        inputText={inputText}
        setInputText={setInputText}
      />
    </Box>
  );
};

export default ChatApp;
