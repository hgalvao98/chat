export type Message = {
  creationDate: string;
  id: string;
  userId: string | unknown;
  text: string;
};

export type EmojiData = {
  slug: string;
  character: string;
  unicodeName: string;
  codePoint: string;
  group: string;
  subGroup: string;
};

export type EmojisDrawerProps = {
  data: EmojiData[];
  onSelect: (emoji: EmojiData) => void;
};
