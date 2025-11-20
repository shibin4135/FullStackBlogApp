"use client";
import { Keyboard } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";

interface CommandPaletteTriggerProps {
  onOpen: () => void;
}

const CommandPaletteTrigger = ({ onOpen }: CommandPaletteTriggerProps) => {
  return (
    <SignedIn>
      <button
        onClick={onOpen}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors text-xs text-muted-foreground hover:text-foreground"
        title="Open command palette (⌘K)"
      >
        <Keyboard className="h-3.5 w-3.5" />
        <kbd className="hidden md:inline-flex items-center gap-1">
          <span className="text-[10px]">⌘</span>
          <span>K</span>
        </kbd>
      </button>
    </SignedIn>
  );
};

export default CommandPaletteTrigger;

