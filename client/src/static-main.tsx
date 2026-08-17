import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import GameCanvas from "@/components/GameCanvas";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./index.css";

(window as Window & { __PROOFPATH_LEDGER_ASSET__?: string }).__PROOFPATH_LEDGER_ASSET__ = `${import.meta.env.BASE_URL}ledger_illustrator_no_bitcoin.svg`;

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster theme="dark" />
        <GameCanvas />
      </TooltipProvider>
    </ThemeProvider>
  </ErrorBoundary>,
);
