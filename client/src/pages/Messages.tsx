import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  // Mock data for prototype
  const chats = [
    { id: 1, name: "Alice Smith", lastMessage: "Is the textbook still available?", time: "2m" },
    { id: 2, name: "Bob Johnson", lastMessage: "I'll be there in 5 mins", time: "1h" },
  ];

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10 h-screen flex flex-col md:flex-row gap-6">
      {/* Chat List */}
      <div className={`w-full md:w-80 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
         <h1 className="font-display font-bold text-3xl text-primary mb-6">Messages</h1>
         
         <div className="bg-white rounded-3xl border border-border shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
               <Input placeholder="Search messages..." className="bg-muted/30 border-transparent" />
            </div>
            <div className="flex-1 overflow-y-auto">
               {chats.map((chat) => (
                  <div 
                     key={chat.id}
                     onClick={() => setSelectedChat(chat.id)}
                     className={`p-4 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors ${selectedChat === chat.id ? "bg-primary/5" : ""}`}
                  >
                     <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                           <span className="font-bold text-secondary-foreground">{chat.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold text-sm truncate">{chat.name}</h3>
                              <span className="text-xs text-muted-foreground">{chat.time}</span>
                           </div>
                           <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white rounded-3xl border border-border shadow-sm overflow-hidden ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
         {selectedChat ? (
            <>
               <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/10">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedChat(null)}>
                     ←
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                     <span className="font-bold text-secondary-foreground">A</span>
                  </div>
                  <div>
                     <h3 className="font-bold text-sm">Alice Smith</h3>
                     <span className="text-xs text-green-600 flex items-center gap-1">● Online</span>
                  </div>
               </div>
               
               <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-dots">
                  <div className="flex justify-start">
                     <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
                        <p className="text-sm">Hi! I saw your listing for the Calc textbook.</p>
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <div className="bg-primary text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-md shadow-primary/20">
                        <p className="text-sm">Hey! Yes it is still available.</p>
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-border bg-white">
                  <form className="flex gap-2">
                     <Input placeholder="Type a message..." className="flex-1 bg-muted/30 border-transparent rounded-xl" />
                     <Button type="submit" size="icon" className="rounded-xl shadow-lg shadow-primary/20">
                        <Send className="w-4 h-4" />
                     </Button>
                  </form>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
               <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 opacity-50" />
               </div>
               <h3 className="font-display font-bold text-xl mb-2">No chat selected</h3>
               <p>Select a conversation to start messaging</p>
            </div>
         )}
      </div>
    </div>
  );
}
