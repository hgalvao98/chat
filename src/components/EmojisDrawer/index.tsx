import { Box } from "@mui/material";
import React from "react";
import { EmojisDrawerProps } from "../../types";

function EmojisDrawer({ data, onSelect }: EmojisDrawerProps) {
  return (
    <Box
      width="100%"
      overflow="auto"
      height="50px"
      display="flex"
      alignItems="center"
    >
      {data.map((emoji) => (
        <Box key={emoji.unicodeName} onClick={() => onSelect(emoji)}>
          {emoji.character}
        </Box>
      ))}
    </Box>
  );
}

export default EmojisDrawer;
