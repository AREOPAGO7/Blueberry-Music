import { CornerUpLeft, CornerUpRight, MoveLeft, User } from "lucide-react";

 function TopBar({ setIsProfileModalOpen }: { setIsProfileModalOpen: (isOpen: boolean) => void }) {
    return (
        <div className="h-16 bg-gradient-to-b from-[#1e1e1e]/80 to-transparent flex items-center justify-between px-8 backdrop-blur-xl border-b border-[#2a2a2a]/50">
            <div className="flex items-center gap-4">
                <button className="w-9 h-9 rounded-full bg-[#2a2a2a]/60 flex items-center justify-center text-[#8a8a8a] hover:text-white hover:bg-[#3a3a3a]/60 transition-all duration-200">
                <CornerUpLeft className="cursor-pointer w-4 h-4 " />
                </button>
                <button className="w-9 h-9 rounded-full bg-[#2a2a2a]/60 flex items-center justify-center text-[#8a8a8a] hover:text-white hover:bg-[#3a3a3a]/60 transition-all duration-200">
                <CornerUpRight className="cursor-pointer w-4 h-4 "/>
                </button>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="w-9 h-9 rounded-full bg- border-2 border-white/50 flex items-center justify-center cursor-pointer"
                >
                    <User size={18} className="text-white/60" />
                </button>
            </div>
        </div>
    )
}
export default TopBar;