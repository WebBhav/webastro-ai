import ChatInterface from "@/components/chat/ChatInterface";
import { Header } from "@/components/layout/Header";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <ChatInterface />
    </div>
  );
}
