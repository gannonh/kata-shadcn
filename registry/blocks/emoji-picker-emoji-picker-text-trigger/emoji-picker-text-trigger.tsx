"use client";

import { Smile } from "lucide-react";

import EmojiPicker from "@/components/shared/emoji-picker";
import { Button } from "@/components/ui/button";

export const title = "Emoji Picker with Text Trigger";

const EmojiPickerExample = () => {
  const handleEmojiSelect = (emoji: string) => {
    console.log("Selected emoji:", emoji);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Text Button Trigger</p>
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          trigger={
            <Button type="button" variant="ghost" size="sm">
              <Smile className="mr-2 h-4 w-4" />
              Add Emoji
            </Button>
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Large Text Button</p>
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          trigger={
            <Button type="button" variant="outline" size="lg">
              <Smile className="mr-2 h-5 w-5" />
              Insert Emoji
            </Button>
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Default Button with Text
        </p>
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          trigger={
            <Button type="button" variant="default">
              <Smile className="mr-2 h-4 w-4" />
              Choose Emoji
            </Button>
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Secondary Button</p>
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          trigger={
            <Button type="button" variant="secondary" size="default">
              <Smile className="mr-2 h-4 w-4" />
              Pick Emoji
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default EmojiPickerExample;
