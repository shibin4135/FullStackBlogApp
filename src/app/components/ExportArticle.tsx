"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileCode } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

interface ExportArticleProps {
  title: string;
  content: string;
  author: string;
  date: string;
}

const ExportArticle = ({ title, content, author, date }: ExportArticleProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const exportAsMarkdown = () => {
    setIsExporting(true);
    try {
      const plainTitle = stripHtml(title);
      const plainContent = stripHtml(content);
      
      const markdown = `# ${plainTitle}\n\n**Author:** ${author}\n**Date:** ${date}\n\n---\n\n${plainContent}`;
      
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${plainTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Article exported as Markdown!");
    } catch (error) {
      toast.error("Failed to export article");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = () => {
    setIsExporting(true);
    try {
      const plainTitle = stripHtml(title);
      const plainContent = stripHtml(content);
      
      const text = `${plainTitle}\n\nAuthor: ${author}\nDate: ${date}\n\n${plainContent}`;
      
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${plainTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Article exported as Text!");
    } catch (error) {
      toast.error("Failed to export article");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsMarkdown}>
          <FileCode className="h-4 w-4 mr-2" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportArticle;

