import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMyClassGroups, useJoinClassGroup, useGroupMessages, useSendGroupMessage } from "@/hooks/use-class-groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Send, Users, Plus, ArrowLeft, Loader2, GraduationCap, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ClassGroup, GroupMessage } from "@shared/schema";

const joinClassSchema = z.object({
  classId: z.string().min(1, "Class ID is required").regex(/^[A-Za-z]+-\d+-\d+$/, "Format: SUBJ-###-### (e.g., ICS-311-001)"),
});

type JoinClassForm = z.infer<typeof joinClassSchema>;

export default function Messages() {
  const [activeTab, setActiveTab] = useState<"direct" | "classes">("classes");
  const [selectedGroup, setSelectedGroup] = useState<ClassGroup | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  
  const { data: myGroups = [], isLoading: groupsLoading } = useMyClassGroups();
  const { data: groupMessages = [], isLoading: messagesLoading } = useGroupMessages(selectedGroup?.id || 0);
  const joinGroup = useJoinClassGroup();
  const sendMessage = useSendGroupMessage();
  const { toast } = useToast();

  const form = useForm<JoinClassForm>({
    resolver: zodResolver(joinClassSchema),
    defaultValues: { classId: "" },
  });

  const onJoinClass = (data: JoinClassForm) => {
    joinGroup.mutate(data.classId.toUpperCase(), {
      onSuccess: (result) => {
        setShowJoinDialog(false);
        form.reset();
        toast({ 
          title: "Joined Class!", 
          description: `You're now in ${result.group.className}`
        });
        setSelectedGroup(result.group);
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !messageInput.trim()) return;

    sendMessage.mutate({ groupId: selectedGroup.id, content: messageInput }, {
      onSuccess: () => {
        setMessageInput("");
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  };

  const directChats = [
    { id: 1, name: "Alice Smith", lastMessage: "Is the textbook still available?", time: "2m" },
    { id: 2, name: "Bob Johnson", lastMessage: "I'll be there in 5 mins", time: "1h" },
  ];

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10 h-screen flex flex-col md:flex-row gap-6">
      <div className={`w-full md:w-80 flex flex-col ${selectedGroup ? 'hidden md:flex' : 'flex'}`}>
         <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
            <h1 className="font-display font-bold text-3xl text-primary">Messages</h1>
         </div>

         <div className="bg-muted p-1 rounded-xl flex gap-1 mb-4">
            <button 
               onClick={() => setActiveTab("classes")}
               className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === "classes" ? "bg-white dark:bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
               }`}
               data-testid="button-classes-tab"
            >
               <Users className="w-4 h-4" /> Classes
            </button>
            <button 
               onClick={() => setActiveTab("direct")}
               className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === "direct" ? "bg-white dark:bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
               }`}
               data-testid="button-direct-tab"
            >
               <MessageCircle className="w-4 h-4" /> Direct
            </button>
         </div>
         
         <div className="bg-white dark:bg-card rounded-3xl border border-border shadow-sm flex-1 overflow-hidden flex flex-col">
            {activeTab === "classes" ? (
               <>
                  <div className="p-4 border-b border-border flex items-center justify-between gap-2">
                     <span className="text-sm font-medium text-muted-foreground">Class Groups</span>
                     <Button size="sm" onClick={() => setShowJoinDialog(true)} data-testid="button-join-class">
                        <Plus className="w-4 h-4 mr-1" /> Join
                     </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {groupsLoading ? (
                        <div className="flex justify-center py-8">
                           <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                     ) : myGroups.length === 0 ? (
                        <div className="p-6 text-center">
                           <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                           <p className="text-sm text-muted-foreground mb-4">No class groups yet</p>
                           <Button size="sm" variant="outline" onClick={() => setShowJoinDialog(true)} data-testid="button-join-first-class">
                              Join Your First Class
                           </Button>
                        </div>
                     ) : (
                        myGroups.map((group) => (
                           <div 
                              key={group.id}
                              onClick={() => setSelectedGroup(group)}
                              className={`p-4 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors ${
                                 selectedGroup?.id === group.id ? "bg-primary/5" : ""
                              }`}
                              data-testid={`chat-class-group-${group.id}`}
                           >
                              <div className="flex gap-3">
                                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 text-primary" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1 gap-2">
                                       <h3 className="font-bold text-sm truncate">{group.className}</h3>
                                       <Badge variant="secondary" className="text-xs">{group.semester}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{group.classId}</p>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </>
            ) : (
               <>
                  <div className="p-4 border-b border-border">
                     <Input placeholder="Search messages..." className="bg-muted/30 border-transparent" data-testid="input-search-messages" />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {directChats.map((chat) => (
                        <div 
                           key={chat.id}
                           className="p-4 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                        >
                           <div className="flex gap-3">
                              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                 <span className="font-bold text-secondary-foreground">{chat.name[0]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-baseline mb-1 gap-2">
                                    <h3 className="font-bold text-sm truncate">{chat.name}</h3>
                                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                                 </div>
                                 <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </>
            )}
         </div>
      </div>

      <div className={`flex-1 flex flex-col bg-white dark:bg-card rounded-3xl border border-border shadow-sm overflow-hidden ${!selectedGroup ? 'hidden md:flex' : 'flex'}`}>
         {selectedGroup ? (
            <>
               <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/10">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedGroup(null)} data-testid="button-back-to-groups">
                     <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                     <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-sm">{selectedGroup.className}</h3>
                     <span className="text-xs text-muted-foreground">{selectedGroup.classId} - {selectedGroup.semester}</span>
                  </div>
               </div>
               
               <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-dots">
                  {messagesLoading ? (
                     <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                     </div>
                  ) : groupMessages.length === 0 ? (
                     <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-10 h-10 mx-auto opacity-50 mb-3" />
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                     </div>
                  ) : (
                     [...groupMessages].reverse().map((msg: GroupMessage) => (
                        <div key={msg.id} className="flex justify-start">
                           <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
                              <p className="text-xs font-medium text-primary mb-1">Student {msg.senderId.slice(-4)}</p>
                              <p className="text-sm">{msg.content}</p>
                           </div>
                        </div>
                     ))
                  )}
               </div>

               <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white dark:bg-card">
                  <div className="flex gap-2">
                     <Input 
                        placeholder="Type a message..." 
                        className="flex-1 bg-muted/30 border-transparent rounded-xl"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        data-testid="input-message"
                     />
                     <Button 
                        type="submit" 
                        size="icon" 
                        className="rounded-xl shadow-lg shadow-primary/20"
                        disabled={sendMessage.isPending || !messageInput.trim()}
                        data-testid="button-send-message"
                     >
                        {sendMessage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                     </Button>
                  </div>
               </form>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
               <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 opacity-50" />
               </div>
               <h3 className="font-display font-bold text-xl mb-2 text-foreground">Join a Class Group</h3>
               <p className="mb-4">Connect with classmates by joining your class's group chat</p>
               <Button onClick={() => setShowJoinDialog(true)} data-testid="button-join-class-empty">
                  <Plus className="w-4 h-4 mr-2" /> Join a Class
               </Button>
            </div>
         )}
      </div>

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
         <DialogContent data-testid="dialog-join-class">
            <DialogHeader>
               <DialogTitle className="font-display">Join Class Group</DialogTitle>
               <DialogDescription>
                  Enter your class ID to join the group chat with other students.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onJoinClass)} className="space-y-4 py-4">
                  <FormField
                     control={form.control}
                     name="classId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Class ID</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="e.g., ICS-311-001"
                                 {...field}
                                 className="uppercase"
                                 data-testid="input-class-id"
                              />
                           </FormControl>
                           <FormMessage />
                           <p className="text-xs text-muted-foreground">
                              Format: SUBJ-###-### (e.g., ICS-311-001, ECON-130-002)
                           </p>
                        </FormItem>
                     )}
                  />

                  <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                     <p>If the class group doesn't exist yet, it will be created automatically when you join.</p>
                  </div>

                  <DialogFooter>
                     <Button type="button" variant="outline" onClick={() => setShowJoinDialog(false)} data-testid="button-cancel-join">
                        Cancel
                     </Button>
                     <Button type="submit" disabled={joinGroup.isPending} data-testid="button-submit-join">
                        {joinGroup.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Join Class
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
    </div>
  );
}
