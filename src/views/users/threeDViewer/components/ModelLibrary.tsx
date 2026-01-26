import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Box, User, Ghost, MousePointer2, Command, Zap, ChevronLeft } from 'lucide-react'
import classNames from '@/utils/classNames'
import { availableModels, type ModelItem } from '../config'

interface ModelLibraryProps {
    onSelect: (model: ModelItem) => void
}

const ModelLibrary = ({ onSelect }: ModelLibraryProps) => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<'all' | 'character' | 'mob' | 'prop'>('all')

    const filteredModels = availableModels.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.description.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = category === 'all' || m.category === category
        return matchesSearch && matchesCategory
    })

    const categories = [
        { id: 'all', label: 'All Assets', icon: Box },
        { id: 'character', label: 'Characters', icon: User },
        { id: 'mob', label: 'Creatures', icon: Ghost },
        { id: 'prop', label: 'Props', icon: Box },
    ]

    return (
        <div className='min-h-screen'>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="flex items-start gap-4">
                    <div>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-3"
                        >
                            <Zap className="w-3 h-3 fill-primary" />
                            Asset Repository
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Model <span className="text-primary italic">Library</span>
                        </h1>
                        <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-lg font-medium max-w-xl">
                            Select a high-fidelity model from our repository to view, pose, and render in real-time.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex bg-gray-900/50 p-1 rounded-xl md:rounded-2xl border border-white/5 backdrop-blur-xl whitespace-nowrap min-w-max md:min-w-0">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id as any)}
                                className={classNames(
                                    'flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg md:rounded-xl transition-all',
                                    category === cat.id
                                        ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                        : 'text-gray-500 hover:text-white group'
                                )}
                            >
                                <cat.icon className={classNames('w-3 md:w-3.5 h-3 md:h-3.5', category === cat.id ? 'text-black' : 'text-gray-600 group-hover:text-primary')} />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group mb-8 md:mb-12">
                <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search models..."
                    className="w-full bg-gray-900/40 border border-white/5 focus:border-primary/50 text-white rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-16 pr-12 md:pr-16 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-600 text-sm md:text-lg"
                />
                <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-bold text-gray-500">
                    <Command className="w-3 h-3" /> K
                </div>
            </div>

            {/* Model Grid */}
            <AnimatePresence mode="wait">
                {filteredModels.length > 0 ? (
                    <motion.div
                        key={category + search}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                    >
                        {filteredModels.map((model) => (
                            <motion.div
                                key={model.id}
                                whileHover={{ y: -4 }}
                                onClick={() => onSelect(model)}
                                className="group relative bg-[#111115] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-300"
                            >
                                {/* Thumbnail Container */}
                                <div className="aspect-square relative overflow-hidden bg-black/40">
                                    <img
                                        src={model.thumbnail}
                                        alt={model.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                                    />

                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                        <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <MousePointer2 className="w-5 h-5 fill-black" />
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                                        {model.category}
                                    </div>
                                </div>

                                {/* Minimal Info Section */}
                                <div className="p-3.5 bg-gradient-to-b from-transparent to-black/20">
                                    <h3 className="text-xs font-bold text-gray-200 truncate group-hover:text-primary transition-colors">
                                        {model.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">Ready to Render</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                    >
                        <Search className="w-12 h-12 text-gray-800 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-500">No Asset Matches Your Search</h2>
                        <p className="text-gray-600 mt-2">Try different keywords or browse categories.</p>
                        <button
                            onClick={() => { setSearch(''); setCategory('all') }}
                            className="mt-8 text-primary font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Reset Repository View
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ModelLibrary
