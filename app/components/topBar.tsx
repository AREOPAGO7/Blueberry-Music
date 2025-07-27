import { useAuth } from "@/context/AuthContext";
import { CornerUpLeft, CornerUpRight, MoveLeft, User } from "lucide-react";
import Link from "next/link";

 function TopBar({ setIsProfileModalOpen }: { setIsProfileModalOpen: (isOpen: boolean) => void }) {
    const { user } = useAuth();
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
                {user ? (
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="w-9 h-9 rounded-full bg-[#2a2a2a]/60 border-2 border-white/50 flex items-center justify-center cursor-pointer hover:bg-[#3a3a3a]/60 transition-all duration-200"
                    >
                        <User size={18} className="text-white/60" />
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
export default TopBar;