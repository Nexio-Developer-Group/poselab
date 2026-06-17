import { useState } from 'react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import SearchBar from './components/SearchBar'
import Stories from './components/Stories'
import PostCard from './components/PostCard'
import PromoCard from './components/PromoCard'
import Sidebar from './components/Sidebar'
import FeedService from '@/services/FeedService'

// --- Fallback Mock Data (used when backend is unavailable) ---
const FALLBACK_POSTS = [
    {
        id: '1',
        user: { id: 'u1', name: 'AlexCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        type: 'image' as const,
        content: '/poseLabsPose/standing.png',
        likes: 1240,
        comments: 45,
        caption: 'Just finished the cinematic standing pose! The lighting in PoseLab is insane! 🔥 #Minecraft #Render',
        tags: ['#3DRendering', '#MinecraftArt'],
        createdAt: '2024-01-20',
    },
    {
        id: '2',
        user: { id: 'u2', name: 'SteveTheGod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve' },
        type: 'video' as const,
        content: '/poseLabsPose/walking.png',
        likes: 890,
        comments: 12,
        caption: 'Experimenting with the bendable model. The joints feel so smooth now. 🧊',
        tags: ['#BendableModel', '#Animation'],
        createdAt: '2024-01-19',
    },
    {
        id: 'promo-1',
        user: { id: 'system', name: 'PoseLab', avatar: '' },
        type: 'promo' as const,
        content: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
        likes: 0,
        comments: 0,
        caption: '',
        tags: [],
        createdAt: '',
    },
    {
        id: '3',
        user: { id: 'u3', name: 'CreativeCat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cat' },
        type: 'image' as const,
        content: '/poseLabsPose/combat.png',
        likes: 2100,
        comments: 156,
        caption: 'Action sequence render! Ready for the battle. ⚔️',
        tags: ['#CombatPose', '#Epic'],
        createdAt: '2024-01-18',
    },
    {
        id: 'pose-rec-1',
        user: { id: 'system', name: 'PoseLab', avatar: '' },
        type: 'recommendation' as const,
        content: '/poseLabsPose/standing.png',
        likes: 0,
        comments: 0,
        caption: '',
        tags: [],
        createdAt: '',
    },
    {
        id: '4',
        user: { id: 'u4', name: 'PixelMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel' },
        type: 'image' as const,
        content: '/poseLabsPose/walking.png',
        likes: 560,
        comments: 8,
        caption: 'Starting small with basic walks. Practice makes perfect! 🚶‍♂️',
        tags: ['#Beginner', '#PosePractice'],
        createdAt: '2024-01-17',
    },
]

const TRENDING_CHALLENGES = [
    { id: '1', name: 'SunlightShadows', entries: '1.2k' },
    { id: '2', name: 'RigidDynamics', entries: '850' },
    { id: '3', name: 'EpicCombat', entries: '2.4k' },
]

// Map legacy mock post shapes (promo/recommendation) to the legacy components
// The API posts follow FeedPost shape; promos and recs are interleaved in the mock.
const LEGACY_COMMUNITY_POSTS = [
    ...FALLBACK_POSTS.filter(p => p.type !== 'promo' && p.type !== 'recommendation'),
    {
        id: 'promo-1',
        type: 'promo',
        title: 'New Bendable Rig v2.0',
        subtitle: 'Experience ultimate flexibility in your renders with our upgraded vertex-weight systems.',
        cta: 'Upgrade Rig',
        path: '/3d-viewer',
        image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'pose-rec-1',
        type: 'recommendation',
        title: 'Try this: "The Hero Entry"',
        poseId: 'standing',
        preview: '/poseLabsPose/standing.png',
    },
]

const FeedSkeleton = () => (
    <div className="space-y-8 sm:space-y-12 px-1 sm:px-4 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 border border-white/5 rounded-lg overflow-hidden">
                <div className="p-5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-700/50" />
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-gray-700/50 rounded" />
                        <div className="h-2 w-16 bg-gray-700/30 rounded" />
                    </div>
                </div>
                <div className="aspect-square md:aspect-video bg-gray-700/30" />
                <div className="p-5 space-y-3">
                    <div className="h-3 w-3/4 bg-gray-700/40 rounded" />
                    <div className="h-3 w-1/2 bg-gray-700/30 rounded" />
                </div>
            </div>
        ))}
    </div>
)

const Home = () => {
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set())
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

    const { data: feedData, isLoading: feedLoading } = useSWR(
        'feed-page-1',
        () => FeedService.getFeed(1, 10),
        { shouldRetryOnError: false },
    )

    // Use API data if available, fall back to FALLBACK_POSTS on error or before load
    const apiPosts = feedData?.posts ?? null

    // Build the display list: API posts when available, else legacy mock with promos/recs interleaved
    const displayPosts = apiPosts
        ? apiPosts
        : LEGACY_COMMUNITY_POSTS

    const toggleLike = (id: string) => {
        const newLiked = new Set(likedPosts)
        if (newLiked.has(id)) {
            newLiked.delete(id)
        } else {
            newLiked.add(id)
            // Fire-and-forget API call
            FeedService.likePost(id).catch(() => undefined)
        }
        setLikedPosts(newLiked)
    }

    const toggleBookmark = (id: string) => {
        const newBookmarks = new Set(bookmarkedPosts)
        if (newBookmarks.has(id)) {
            newBookmarks.delete(id)
        } else {
            newBookmarks.add(id)
            // Fire-and-forget API call
            FeedService.bookmarkPost(id).catch(() => undefined)
        }
        setBookmarkedPosts(newBookmarks)
    }

    const toggleFollow = (username: string) => {
        const newFollowed = new Set(followedUsers)
        if (newFollowed.has(username)) newFollowed.delete(username)
        else newFollowed.add(username)
        setFollowedUsers(newFollowed)
    }

    return (
        <div className="min-h-screen text-white selection:bg-primary/30">
            <div className="px-3 sm:px-0 py-4 sm:py-0 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-16">

                {/* --- Main Feed Column --- */}
                <div className="space-y-8 sm:space-y-12 min-w-0">
                    {/* for fixed header - Adjusted for responsiveness */}
                    <div className=' fixed top-16 left-0 right-0  z-10  grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-16 pointer-events-none'>
                        <div className='h-16 lg:h-28 bg-gray-950'></div>
                        <div className='h-16 lg:h-20 bg-transparent'></div>
                    </div>

                    <SearchBar />

                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1 sm:px-2">
                            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-gray-600">Discovery Hub</h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</button>
                        </div>
                        <Stories posts={displayPosts} />
                    </div>

                    {feedLoading ? (
                        <FeedSkeleton />
                    ) : (
                        <div className="space-y-8 sm:space-y-12 px-1 sm:px-4">
                            {displayPosts.map((post: any) => {
                                if (post.type === 'recommendation') return null

                                if (post.type === 'promo') {
                                    return <PromoCard key={post.id} post={post} />
                                }

                                return (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        isLiked={likedPosts.has(String(post.id))}
                                        isBookmarked={bookmarkedPosts.has(String(post.id))}
                                        isFollowed={!!post.user && followedUsers.has(post.user.name)}
                                        onToggleLike={(id) => toggleLike(String(id))}
                                        onToggleBookmark={(id) => toggleBookmark(String(id))}
                                        onToggleFollow={toggleFollow}
                                    />
                                )
                            })}
                        </div>
                    )}

                    {/* Infinite Scroll/Loading Indicator */}
                    <div className="py-20 flex flex-col items-center gap-8">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative w-14 h-14"
                        >
                            <div className="absolute inset-0 border-4 border-primary/10 rounded-2xl" />
                            <div className="absolute inset-0 border-4 border-t-primary rounded-2xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                        </motion.div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Decrypting community content</span>
                            <div className="h-[1px] w-24 bg-white/5 relative overflow-hidden">
                                <motion.div
                                    animate={{ left: ['-100%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-primary/40 w-1/2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Sidebar Column --- */}
                <Sidebar challenges={TRENDING_CHALLENGES} />
            </div>
        </div>
    )
}

export default Home
