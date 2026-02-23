"use client";

import { Heart, Smile } from "lucide-react";

import EmojiPicker from "@/components/shared/emoji-picker";
import { Button } from "@/components/ui/button";

export const title = "Emoji Picker with Custom Trigger";

const EmojiPickerExample = () => {
  const handleEmojiSelect = (emoji: string) => {
    console.log("Selected emoji:", emoji);
  };

  return (
    <div className="flex items-center gap-4">
      <EmojiPicker
        onEmojiSelect={handleEmojiSelect}
        trigger={
          <Button
            type="button"
            variant="default"
            size="default"
            className="gap-2"
          >
            <Smile className="h-4 w-4" />
            Add Emoji
          </Button>
        }
      />

      <EmojiPicker
        onEmojiSelect={handleEmojiSelect}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Heart className="h-5 w-5" />
          </Button>
        }
      />

      <EmojiPicker
        onEmojiSelect={handleEmojiSelect}
        trigger={
          <Button type="button" variant="outline" size="lg" className="gap-2">
            <Smile className="h-5 w-5" />
            Choose Emoji
          </Button>
        }
      />
    </div>
  );
};

export default EmojiPickerExample;
