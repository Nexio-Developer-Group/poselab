import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

const SearchBar = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gray-800/50 border border-white/5 p-3 sm:p-4 rounded-xl backdrop-blur-xl sticky top-20 lg:top-36 z-40 shadow-2xl"
        >
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search community poses, rigs, or artists..."
                    className="w-full bg-black/40 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary/50 transition-all font-medium text-white placeholder:text-gray-600"
                />
            </div>
            <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-11 px-8 transition-transform active:scale-95 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                Upload
            </Button>
        </motion.div>
    )
}

export default SearchBar
