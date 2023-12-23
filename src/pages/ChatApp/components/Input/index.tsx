import { Box, Button, IconButton, TextField } from "@mui/material";
import { FormEvent, KeyboardEvent, useState } from "react";
import EmojisDrawer from "../../../../components/EmojisDrawer";
import { InsertEmoticon, Keyboard } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/emojisSlice";
import { EmojiData } from "../../../../types";

type InputProps = {
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
};

function Input({
  handleFormSubmit,
  handleInputChange,
  inputText,
  setInputText,
}: InputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = useSelector((state: RootState) => state.emojis);

  const handleEmojiSelect = (emoji: EmojiData) => {
    setInputText((prevText) => prevText + emoji.character);
  };

  return (
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
          onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
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
  );
}

export default Input;
