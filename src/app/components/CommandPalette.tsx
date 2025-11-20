"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  PenSquare, 
  Bookmark, 
  BarChart3, 
  Home,
  User,
  Settings,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  onOpenChange?: (open: boolean) => void;
}

const CommandPalette = ({ onOpenChange }: CommandPaletteProps = {}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const commands: Command[] = [
    {
      id: "home",
      label: "Go to Home",
      icon: <Home className="h-4 w-4" />,
      shortcut: "H",
      action: () => {
        router.push("/");
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "articles",
      label: "View Articles",
      icon: <FileText className="h-4 w-4" />,
      shortcut: "A",
      action: () => {
        router.push("/articles");
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "create",
      label: "Create Article",
      icon: <PenSquare className="h-4 w-4" />,
      shortcut: "C",
      action: () => {
        router.push("/create-article");
        setOpen(false);
      },
      category: "Actions",
    },
    {
      id: "bookmarks",
      label: "My Bookmarks",
      icon: <Bookmark className="h-4 w-4" />,
      shortcut: "B",
      action: () => {
        router.push("/bookmarks");
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "analytics",
      label: "Analytics Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
      shortcut: "G",
      action: () => {
        router.push("/analytics");
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "toggle-theme",
      label: `Toggle ${theme === "dark" ? "Light" : "Dark"} Mode`,
      icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      shortcut: "T",
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setOpen(false);
      },
      category: "Settings",
    },
  ];

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(search.toLowerCase()) ||
    command.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleCommand = (command: Command) => {
        command.action();
  };

  // Expose open function globally for keyboard shortcut
  useEffect(() => {
    (window as any).openCommandPalette = () => setOpen(true);
    return () => {
      delete (window as any).openCommandPalette;
    };
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Command Palette
            </DialogTitle>
            <DialogDescription>
              Search and navigate quickly. Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-4">
            <Input
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto px-2 pb-4">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                <p>No commands found</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="mb-4">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    {category}
                  </div>
                  {cmds.map((command) => (
                    <button
                      key={command.id}
                      onClick={() => handleCommand(command)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                    >
                      <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {command.icon}
                      </div>
                      <span className="flex-1 font-medium">{command.label}</span>
                      {command.shortcut && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {command.shortcut}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
          <div className="px-6 pb-4 border-t border-border pt-4">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">⌘</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">K</kbd>
              <span>to open</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandPalette;

