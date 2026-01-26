import { Search, Grid3x3, List, Command } from 'lucide-react'
import classNames from '@/utils/classNames'

interface FiltersProps {
    search: string
    setSearch: (val: string) => void
    viewMode: 'grid' | 'list'
    setViewMode: (val: 'grid' | 'list') => void
    category: string
    setCategory: (val: any) => void
}

const Filters = ({ search, setSearch, viewMode, setViewMode, category, setCategory }: FiltersProps) => {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Quick search (Title, Tags, Type...)"
                    className="w-full bg-gray-900/50 border border-white/5 focus:border-primary/50 text-white rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-600"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500">
                    <Command className="w-2.5 h-2.5" /> F
                </div>
            </div>

            {/* Category Toggle */}
            <div className="flex bg-gray-900/50 p-1.5 rounded-xl border border-white/5 w-full lg:w-auto">
                {['all', 'pose', 'render', 'animation'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={classNames(
                            'px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all',
                            category === cat
                                ? 'bg-primary text-black'
                                : 'text-gray-500 hover:text-white'
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Layout Toggle */}
            <div className="flex bg-gray-900/50 p-1.5 rounded-xl border border-white/5 w-full lg:w-auto justify-center">
                <button
                    onClick={() => setViewMode('grid')}
                    className={classNames(
                        'p-2 rounded-lg transition-all',
                        viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
                    )}
                >
                    <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={classNames(
                        'p-2 rounded-lg transition-all',
                        viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
                    )}
                >
                    <List className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default Filters
