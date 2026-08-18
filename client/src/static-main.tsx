import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import GameCanvas from "@/components/GameCanvas";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./index.css";

(window as Window & { __PROOFPATH_LEDGER_ASSETS__?: Record<string, string> }).__PROOFPATH_LEDGER_ASSETS__ = {
  "jet-black": `${import.meta.env.BASE_URL}ledger_illustrator_no_bitcoin.svg`,
  "cherry-red": `${import.meta.env.BASE_URL}ledger_cherry_red.svg`,
  "matcha-green": `${import.meta.env.BASE_URL}ledger_matcha_green.svg`,
  "glacier-white": `${import.meta.env.BASE_URL}ledger_glacier_white.svg`,
};

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
