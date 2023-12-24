import { ArrowBack, Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../../types";

type ChatHeaderProps = {
  setMessagesFromServer: (array: Message[]) => void;
};

function ChatHeader({ setMessagesFromServer }: ChatHeaderProps) {
  const navigate = useNavigate();
  return (
    <Box display="flex" padding={2} justifyContent="space-between" width="100%">
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
  );
}

export default ChatHeader;
