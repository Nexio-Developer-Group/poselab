import { useState } from 'react'
import Header from './components/Header'
import Filters from './components/Filters'
import CreationCard, { type Creation } from './components/CreationCard'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Sample data (In a real app, this would come from a hook/API)
const sampleCreations: Creation[] = [
    {
        id: '1',
        title: 'Nether Warlord',
        thumbnail: 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'pose',
        views: 1234,
        likes: 89,
        createdAt: '2024-01-20',
        tags: ['PVP', 'WAR', 'NETHER']
    },
    {
        id: '2',
        title: 'Studio Lighting Setup',
        thumbnail: 'https://images.unsplash.com/photo-1594845222818-9097c52dabb5?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'render',
        views: 856,
        likes: 62,
        createdAt: '2024-01-18',
        tags: ['CINEMATIC', 'MODERN']
    },
    {
        id: '3',
        title: 'Walking Loop v2',
        thumbnail: 'https://images.unsplash.com/photo-1697479665524-3e06cf37b2b7?q=80&w=1014&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'animation',
        views: 2145,
        likes: 178,
        createdAt: '2024-01-15',
        tags: ['LOOP', 'MOTION']
    },
    {
        id: '4',
        title: 'Cyberpunk Stance',
        thumbnail: 'https://images.unsplash.com/photo-1644003197803-6782a1ed1cdd?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'pose',
        views: 3102,
        likes: 245,
        createdAt: '2024-01-12',
        tags: ['CYBER', 'NEON']
    }
]

const MyCreations = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<'all' | 'pose' | 'render' | 'animation'>('all')

    const filteredCreations = sampleCreations.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
        const matchesCategory = category === 'all' || c.type === category
        return matchesSearch && matchesCategory
    })

    return (
            <div className='min-h-screen'>
                <Header count={filteredCreations.length} />

                <Filters
                    search={search}
                    setSearch={setSearch}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    category={category}
                    setCategory={setCategory}
                />

                <AnimatePresence mode="wait">
                    {filteredCreations.length > 0 ? (
                        <motion.div
                            key={viewMode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'flex flex-col gap-4'
                            }
                        >
                            {filteredCreations.map((creation) => (
                                <CreationCard
                                    key={creation.id}
                                    creation={creation}
                                    viewMode={viewMode}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-32 border border-white/5 bg-gray-900/20 backdrop-blur-sm rounded-3xl"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                                <Search className="w-8 h-8 text-gray-700" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-400 tracking-tight">Zero Results Detected</h2>
                            <p className="text-gray-600 mt-2 font-medium italic">Adjust your filters to see more creations.</p>
                            <button
                                onClick={() => { setSearch(''); setCategory('all') }}
                                className="mt-6 text-primary text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Reset Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
    )
}

export default MyCreations
