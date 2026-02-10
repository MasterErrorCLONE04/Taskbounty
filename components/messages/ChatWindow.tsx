
import { Info, Paperclip, Banknote, Smile, Send } from 'lucide-react'

export function ChatWindow() {
    return (
        <div className="flex-1 flex flex-col bg-white h-full">
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-slate-50 flex items-center justify-between flex-none">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src="https://ui-avatars.com/api/?name=Marcus+Chen&background=random" alt="Marcus Chen" className="w-10 h-10 rounded-full" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 leading-none">Marcus Chen</h2>
                        <p className="text-[12px] text-slate-400 font-medium mt-1">● Online</p>
                    </div>
                </div>
                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                    <Info size={20} />
                </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex justify-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                </div>

                {/* Received */}
                <div className="flex flex-col gap-1 items-start max-w-lg">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-[14px] text-slate-800 leading-relaxed shadow-sm">
                        Hey Alex! I saw your profile and noticed you've done a lot of work with React and Redux.
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">10:42 AM</span>
                </div>

                {/* Sent */}
                <div className="flex flex-col gap-1 items-end ml-auto max-w-lg">
                    <div className="bg-blue-500 p-4 rounded-2xl rounded-tr-none text-[14px] text-white leading-relaxed shadow-sm">
                        Hi Marcus, thanks for reaching out! Yes, I specialize in state management issues. What's the problem you're facing?
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mr-1 uppercase">10:45 AM</span>
                </div>

                {/* Received */}
                <div className="flex flex-col gap-1 items-start max-w-lg">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-[14px] text-slate-800 leading-relaxed shadow-sm">
                        I have a complex issue with Redux Toolkit and Persist where the hydration is failing on some routes. It's causing some major UI bugs.
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">10:48 AM</span>
                </div>

                {/* Sent */}
                <div className="flex flex-col gap-1 items-end ml-auto max-w-lg">
                    <div className="bg-blue-500 p-4 rounded-2xl rounded-tr-none text-[14px] text-white leading-relaxed shadow-sm">
                        Got it. Hydration issues can be tricky with Persist. I can take a look at it right away if you'd like.
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mr-1 uppercase">10:50 AM</span>
                </div>

                {/* Received */}
                <div className="flex flex-col gap-1 items-start max-w-lg">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-[14px] text-slate-800 leading-relaxed shadow-sm">
                        Perfect. I've just approved the escrow for the React task. Let's get started.
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">11:15 AM</span>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 pt-0 flex-none">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <textarea
                        placeholder="Start a new message"
                        className="w-full bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 resize-none min-h-[60px] outline-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-4">
                            <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <Paperclip size={18} />
                            </button>
                            <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <Banknote size={18} />
                            </button>
                            <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <Smile size={18} />
                            </button>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600 p-2 transform hover:scale-110 transition-all">
                            <Send size={24} className="fill-blue-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
