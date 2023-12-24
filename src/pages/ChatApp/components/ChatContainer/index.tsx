import { Box, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { Message } from "../../../../types";

type ChatContainerProps = {
  message: Message;
};

function ChatContainer({ message }: ChatContainerProps) {
  const params = useParams();

  const userId = params.name;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={message.userId === userId ? "flex-end" : "flex-start"}
      key={message.id}
      width="100%"
    >
      <Typography fontWeight="bold">{message.userId as string}:</Typography>{" "}
      <Typography
        bgcolor={message.userId === userId ? "lightblue" : "lightgray"}
        borderRadius={1}
        padding={1}
        maxWidth="50%"
        height="100%"
        overflow="hidden"
        sx={{ wordWrap: "break-word" }}
      >
        {message.text}
      </Typography>
    </Box>
  );
}

export default ChatContainer;
