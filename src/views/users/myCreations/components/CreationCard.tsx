import React, { cloneElement } from 'react'
import { motion } from 'framer-motion'
import { Eye, Heart, Download, Share2, MoreVertical, Trash2, Edit3, PlayCircle, Image as ImageIcon } from 'lucide-react'
import classNames from '@/utils/classNames'

export interface Creation {
    id: string
    title: string
    thumbnail: string
    type: 'pose' | 'render' | 'animation'
    views: number
    likes: number
    createdAt: string
    tags: string[]
}

interface CreationCardProps {
    creation: Creation
    viewMode: 'grid' | 'list'
}

const CreationCard = ({ creation, viewMode }: CreationCardProps) => {
    const isGrid = viewMode === 'grid'

    const typeIcons = {
        pose: <PlayCircle className="w-4 h-4 text-emerald-400" />,
        render: <ImageIcon className="w-4 h-4 text-blue-400" />,
        animation: <PlayCircle className="w-4 h-4 text-purple-400" />,
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={classNames(
                'group relative bg-gray-900/40 border border-white/5 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm overflow-hidden',
                isGrid ? 'rounded-2xl flex flex-col' : 'rounded-xl flex flex-row p-3 gap-4'
            )}
        >
            {/* Image Section */}
            <div className={classNames(
                'relative overflow-hidden bg-black/40',
                isGrid ? 'aspect-[4/3] w-full' : 'w-40 h-32 rounded-lg shrink-0'
            )}>
                <img
                    src={creation.thumbnail}
                    alt={creation.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />

                {/* HUD Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />

                {/* Type Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold tracking-wider text-white">
                    {typeIcons[creation.type]}
                    {creation.type}
                </div>

                {/* Quick Action Flyout (Grid Only) */}
                {isGrid && (
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <ActionButton icon={<Eye />} />
                        <ActionButton icon={<Download />} />
                        <ActionButton icon={<Share2 />} />
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className={classNames('flex-1 flex flex-col', isGrid ? 'p-5' : 'py-1 pr-3')}>
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-100 truncate group-hover:text-primary transition-colors">
                        {creation.title}
                    </h3>
                    <button className="text-gray-500 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {creation.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 uppercase tracking-tight">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-4 pt-4  flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1.5 text-xs">
                            <Eye className="w-3.5 h-3.5" /> {creation.views}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                            <Heart className="w-3.5 h-3.5" /> {creation.likes}
                        </span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono">
                        {creation.createdAt}
                    </span>
                </div>
            </div>

            {/* List Action Buttons */}
            {!isGrid && (
                <div className="flex flex-col justify-center gap-2 border-l border-white/5 pl-4">
                    <ListActionBtn icon={<Edit3 />} color="hover:text-blue-400" />
                    <ListActionBtn icon={<Trash2 />} color="hover:text-red-400" />
                </div>
            )}
        </motion.div>
    )
}

const ActionButton = ({ icon }: { icon: React.ReactNode }) => (
    <button className="p-3 rounded-full bg-primary text-white shadow-2xl hover:scale-110 active:scale-95 transition-all">
        {React.isValidElement(icon) ? cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' }) : icon}
    </button>
)

const ListActionBtn = ({ icon, color }: { icon: React.ReactNode, color: string }) => (
    <button className={classNames('p-2 text-gray-500 transition-colors', color)}>
        {React.isValidElement(icon) ? cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' }) : icon}
    </button>
)


export default CreationCard
