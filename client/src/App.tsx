// GraphOps style reminder: Neon Glass Circuit, semantic neon colors, English-only technical game voice.

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import GameCanvas from "./components/GameCanvas";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./pages/NotFound";

function Router() {
  return <Switch><Route path="/" component={GameCanvas} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster theme="dark" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
