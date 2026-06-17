import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import FeedService from '@/services/FeedService'
import { Avatar } from '@/components/ui/Avatar'

interface StoryItem {
    id: string | number
    type: string
    poseId?: string
    preview?: string
    user?: { name: string; avatar: string }
}

interface StoriesProps {
    posts: StoryItem[]
}

const Stories = ({ posts }: StoriesProps) => {
    const { data: apiStories } = useSWR('stories', () => FeedService.getStories())

    // Build story items: prefer API stories, fall back to first 4 posts with user data
    const storyItems = (() => {
        if (apiStories && apiStories.length > 0) {
            return apiStories.map(s => ({
                id: s.id,
                username: s.username,
                avatar: s.avatar,
                preview: s.preview,
            }))
        }
        // Fallback: derive stories from posts that have user data
        return posts
            .filter(p => p.user)
            .slice(0, 4)
            .map(p => ({
                id: p.id,
                username: p.user!.name,
                avatar: p.user!.avatar,
                preview: p.preview ?? p.type !== 'promo' ? undefined : undefined,
            }))
    })()

    return (
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
            {/* "New Rig" shortcut — always first */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
            >
                <Link to="/pose-lab" className="flex flex-col items-center group">
                    <div className="w-18 h-18 rounded-[1.5rem] bg-primary flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] group-hover:rotate-6 transition-transform">
                        <Zap className="w-9 h-9 text-black" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary text-center block">New Rig</span>
                </Link>
            </motion.div>

            {/* Story circles */}
            {storyItems.map((story, index) => (
                <motion.div
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                >
                    <button className="flex flex-col items-center group">
                        <div className="w-18 h-18 rounded-[1.5rem] border-2 border-white/10 p-1 group-hover:border-primary/50 transition-all bg-gray-900/50 backdrop-blur-sm">
                            <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-black flex items-center justify-center">
                                {story.preview ? (
                                    <img
                                        src={story.preview}
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                        alt={story.username}
                                    />
                                ) : (
                                    <Avatar
                                        className="w-full h-full rounded-none object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        src={story.avatar}
                                    >
                                        {story.username[0]}
                                    </Avatar>
                                )}
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500 group-hover:text-gray-300 text-center block mt-2 transition-colors max-w-[4.5rem] truncate">
                            {story.username}
                        </span>
                    </button>
                </motion.div>
            ))}
        </div>
    )
}

export default Stories
