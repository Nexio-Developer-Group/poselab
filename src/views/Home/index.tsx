import { useState } from 'react'
import { motion } from 'framer-motion'
import SearchBar from './components/SearchBar'
import Stories from './components/Stories'
import PostCard from './components/PostCard'
import PromoCard from './components/PromoCard'
import Sidebar from './components/Sidebar'

// --- Mock Data ---
const COMMUNITY_POSTS = [
    {
        id: 1,
        user: { name: 'AlexCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        type: 'image',
        content: '/poseLabsPose/standing.png',
        likes: 1240,
        comments: 45,
        caption: 'Just finished the cinematic standing pose! The lighting in PoseLab is insane! 🔥 #Minecraft #Render',
        tags: ['#3DRendering', '#MinecraftArt']
    },
    {
        id: 2,
        user: { name: 'SteveTheGod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve' },
        type: 'video',
        content: '/poseLabsPose/walking.png',
        likes: 890,
        comments: 12,
        caption: 'Experimenting with the bendable model. The joints feel so smooth now. 🧊',
        tags: ['#BendableModel', '#Animation']
    },
    {
        id: 'promo-1',
        type: 'promo',
        title: 'New Bendable Rig v2.0',
        subtitle: 'Experience ultimate flexibility in your renders with our upgraded vertex-weight systems.',
        cta: 'Upgrade Rig',
        path: '/3d-viewer',
        image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 3,
        user: { name: 'CreativeCat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cat' },
        type: 'image',
        content: '/poseLabsPose/combat.png',
        likes: 2100,
        comments: 156,
        caption: 'Action sequence render! Ready for the battle. ⚔️',
        tags: ['#CombatPose', '#Epic']
    },
    {
        id: 'pose-rec-1',
        type: 'recommendation',
        title: 'Try this: "The Hero Entry"',
        poseId: 'standing',
        preview: '/poseLabsPose/standing.png'
    },
    {
        id: 4,
        user: { name: 'PixelMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel' },
        type: 'image',
        content: '/poseLabsPose/walking.png',
        likes: 560,
        comments: 8,
        caption: 'Starting small with basic walks. Practice makes perfect! 🚶‍♂️',
        tags: ['#Beginner', '#PosePractice']
    }
]

const TRENDING_CHALLENGES = [
    { id: 1, name: 'SunlightShadows', entries: '1.2k' },
    { id: 2, name: 'RigidDynamics', entries: '850' },
    { id: 3, name: 'EpicCombat', entries: '2.4k' },
]

const Home = () => {
    const [likedPosts, setLikedPosts] = useState<Set<number | string>>(new Set())
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number | string>>(new Set())
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

    const toggleLike = (id: number | string) => {
        const newLiked = new Set(likedPosts)
        if (newLiked.has(id)) newLiked.delete(id)
        else newLiked.add(id)
        setLikedPosts(newLiked)
    }

    const toggleBookmark = (id: number | string) => {
        const newBookmarks = new Set(bookmarkedPosts)
        if (newBookmarks.has(id)) newBookmarks.delete(id)
        else newBookmarks.add(id)
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
                        <Stories posts={COMMUNITY_POSTS} />
                    </div>

                    <div className="space-y-8 sm:space-y-12 px-1 sm:px-4">
                        {COMMUNITY_POSTS.map((post) => {
                            if (post.type === 'recommendation') return null

                            if (post.type === 'promo') {
                                return <PromoCard key={post.id} post={post} />
                            }

                            return (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    isLiked={likedPosts.has(post.id)}
                                    isBookmarked={bookmarkedPosts.has(post.id)}
                                    isFollowed={!!post.user && followedUsers.has(post.user.name)}
                                    onToggleLike={toggleLike}
                                    onToggleBookmark={toggleBookmark}
                                    onToggleFollow={toggleFollow}
                                />
                            )
                        })}
                    </div>

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
