import { motion } from 'framer-motion'
import {
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    MoreHorizontal,
    Play
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface PostProps {
    post: any
    isLiked: boolean
    isBookmarked: boolean
    isFollowed: boolean
    onToggleLike: (id: number | string) => void
    onToggleBookmark: (id: number | string) => void
    onToggleFollow: (username: string) => void
}

const PostCard = ({
    post,
    isLiked,
    isBookmarked,
    isFollowed,
    onToggleLike,
    onToggleBookmark,
    onToggleFollow
}: PostProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/50 border border-white/5 rounded-lg overflow-hidden backdrop-blur-3xl shadow-2xl hover:border-white/10 transition-colors"
        >
            {/* Post Header */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar
                        className="w-11 h-11 border border-white/10 ring-2 ring-primary/20"
                        src={post.user?.avatar}
                    >
                        {post.user?.name[0]}
                    </Avatar>
                    <div className="min-w-0">
                        <h4 className="text-sm font-black tracking-widest uppercase text-white hover:text-primary cursor-pointer transition-colors truncate">
                            {post.user?.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-tighter whitespace-nowrap">Verified Creator</span>
                            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
                            <span
                                onClick={() => onToggleFollow(post.user.name)}
                                className={cn(
                                    "text-[9px] sm:text-[10px] font-black uppercase cursor-pointer hover:underline transition-colors whitespace-nowrap",
                                    isFollowed ? "text-gray-500" : "text-primary"
                                )}
                            >
                                {isFollowed ? 'Following' : 'Follow'}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Post Content */}
            <div className="relative aspect-square md:aspect-video bg-black/40 group overflow-hidden cursor-pointer">
                <img
                    src={post.content}
                    className="w-full h-full object-contain pixel-art transition-transform duration-700 group-hover:scale-105"
                    style={{ imageRendering: 'pixelated' }}
                    alt="Post content"
                />
                {post.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-hover:scale-110 transition-transform shadow-2xl">
                            <Play className="w-8 h-8 fill-current" />
                        </div>
                    </div>
                )}
                <div className="absolute top-4 right-4 py-1.5 px-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-primary/80">
                    {post.type}
                </div>
            </div>

            {/* Post Actions & Footer */}
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-4 sm:gap-7">
                        <button
                            onClick={() => onToggleLike(post.id)}
                            className={cn(
                                "flex items-center gap-2 transition-all active:scale-90",
                                isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                            )}
                        >
                            <Heart className={cn("w-6 h-6 transition-all", isLiked && "fill-current scale-110")} />
                            <span className="text-[11px] font-black">{post.likes! + (isLiked ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all active:scale-90">
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-[11px] font-black">{post.comments}</span>
                        </button>
                        <button className="text-gray-400 hover:text-green-400 transition-all active:scale-90">
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                    <button
                        onClick={() => onToggleBookmark(post.id)}
                        className={cn(
                            "transition-all active:scale-90",
                            isBookmarked ? "text-primary" : "text-gray-400 hover:text-primary"
                        )}
                    >
                        <Bookmark className={cn("w-6 h-6", isBookmarked && "fill-current")} />
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-sm font-medium leading-relaxed text-gray-300">
                        <span className="text-white font-black uppercase tracking-widest text-[10px] mr-2">{post.user?.name}</span>
                        {post.caption}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag: string) => (
                            <span
                                key={tag}
                                className="text-[9px] font-black text-primary px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default PostCard
