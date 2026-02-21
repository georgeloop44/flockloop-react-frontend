import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomAudioPlayer } from "./BottomAudioPlayer";
import { useAudioPlayer } from "@/hooks/use-audio-player";

export function AppShell() {
  // Manages Howler.js — persists across page navigation
  useAudioPlayer();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <BottomAudioPlayer />
      </div>
    </div>
  );
}
