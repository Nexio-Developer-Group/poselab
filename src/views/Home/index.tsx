import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'
import SearchBar from './components/SearchBar'
import Stories from './components/Stories'
import PostCard from './components/PostCard'
import PromoCard from './components/PromoCard'
import Sidebar from './components/Sidebar'
import FeedService from '@/services/FeedService'
import type { Challenge } from '@/@types/feed'

// ---------------------------------------------------------------------------
// Static fallback data kept for Stories / first-render safety
// ---------------------------------------------------------------------------
const COMMUNITY_POSTS = [
    {
        id: 1,
        user: { name: 'AlexCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        type: 'image',
        content: '/poseLabsPose/standing.png',
        likes: 1240,
        comments: 45,
        caption: 'Just finished the cinematic standing pose! The lighting in PoseLab is insane! 🔥 #Minecraft #Render',
        tags: ['#3DRendering', '#MinecraftArt'],
    },
    {
        id: 2,
        user: { name: 'SteveTheGod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve' },
        type: 'video',
        content: '/poseLabsPose/walking.png',
        likes: 890,
        comments: 12,
        caption: 'Experimenting with the bendable model. The joints feel so smooth now. 🧊',
        tags: ['#BendableModel', '#Animation'],
    },
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
        id: 3,
        user: { name: 'CreativeCat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cat' },
        type: 'image',
        content: '/poseLabsPose/combat.png',
        likes: 2100,
        comments: 156,
        caption: 'Action sequence render! Ready for the battle. ⚔️',
        tags: ['#CombatPose', '#Epic'],
    },
    {
        id: 'pose-rec-1',
        type: 'recommendation',
        title: 'Try this: "The Hero Entry"',
        poseId: 'standing',
        preview: '/poseLabsPose/standing.png',
    },
    {
        id: 4,
        user: { name: 'PixelMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel' },
        type: 'image',
        content: '/poseLabsPose/walking.png',
        likes: 560,
        comments: 8,
        caption: 'Starting small with basic walks. Practice makes perfect! 🚶‍♂️',
        tags: ['#Beginner', '#PosePractice'],
    },
]

const TRENDING_CHALLENGES: Challenge[] = [
    { id: 1, name: 'SunlightShadows', entries: '1.2k' },
    { id: 2, name: 'RigidDynamics', entries: '850' },
    { id: 3, name: 'EpicCombat', entries: '2.4k' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Home = () => {
    // Interaction state
    const [likedPosts, setLikedPosts] = useState<Set<number | string>>(new Set())
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number | string>>(new Set())
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

    // Notifications badge
    const [notifCount] = useState(3)

    // Infinite scroll state
    const [page, setPage] = useState(1)
    const [allPosts, setAllPosts] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(true)

    const sentinelRef = useRef<HTMLDivElement>(null)

    // SWR fetch for the current page
    const { data: feedPage, isLoading } = useSWR(
        ['feed', page],
        () => FeedService.getFeed(page),
        { revalidateOnFocus: false }
    )

    // Accumulate posts when a new page arrives
    useEffect(() => {
        if (!feedPage) return
        if (feedPage.posts.length > 0) {
            setAllPosts(prev => {
                // Deduplicate by id
                const existingIds = new Set(prev.map(p => p.id))
                const newPosts = feedPage.posts.filter(p => !existingIds.has(p.id))
                return [...prev, ...newPosts]
            })
        }
        if (feedPage.nextPage === null) {
            setHasMore(false)
        }
    }, [feedPage])

    // IntersectionObserver — increment page when sentinel enters viewport
    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                setPage(prev => prev + 1)
            }
        },
        [hasMore, isLoading]
    )

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return
        const observer = new IntersectionObserver(handleIntersect, { rootMargin: '200px' })
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [handleIntersect])

    // Use accumulated posts or fall back to static data while first page loads
    const displayPosts = allPosts.length > 0 ? allPosts : COMMUNITY_POSTS

    // Action handlers
    const toggleLike = (id: number | string) => {
        setLikedPosts(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleBookmark = (id: number | string) => {
        setBookmarkedPosts(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleFollow = (username: string) => {
        setFollowedUsers(prev => {
            const next = new Set(prev)
            if (next.has(username)) next.delete(username)
            else next.add(username)
            return next
        })
    }

    const handleBellClick = () => {
        toast.info('Real-time notifications coming soon!')
    }

    return (
        <div className="min-h-screen text-white selection:bg-primary/30">
            <div className="px-3 sm:px-0 py-4 sm:py-0 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-16">

                {/* --- Main Feed Column --- */}
                <div className="space-y-8 sm:space-y-12 min-w-0">
                    {/* Fixed header background */}
                    <div className="fixed top-16 left-0 right-0 z-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-16 pointer-events-none">
                        <div className="h-16 lg:h-28 bg-gray-950" />
                        <div className="h-16 lg:h-20 bg-transparent" />
                    </div>

                    {/* Search bar + notification bell */}
                    <div className="relative">
                        <SearchBar />
                        {/* Notification bell — floats to the right of the search bar */}
                        <button
                            onClick={handleBellClick}
                            className="absolute -right-14 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gray-800/50 border border-white/5 backdrop-blur-xl text-gray-400 hover:text-white transition-colors hidden xl:flex items-center justify-center shadow-2xl"
                            aria-label="Notifications"
                        >
                            <div className="relative">
                                <Bell className="w-5 h-5" />
                                {notifCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Discovery Hub / Stories */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1 sm:px-2">
                            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-gray-600">Discovery Hub</h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</button>
                        </div>
                        <Stories posts={COMMUNITY_POSTS} />
                    </div>

                    {/* Feed posts */}
                    <div className="space-y-8 sm:space-y-12 px-1 sm:px-4">
                        {displayPosts.map((post) => {
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

                    {/* Sentinel for IntersectionObserver */}
                    <div ref={sentinelRef} className="h-1" />

                    {/* Loading / end of feed indicator */}
                    <div className="py-20 flex flex-col items-center gap-8">
                        {hasMore ? (
                            <>
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
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center">
                                    <span className="text-xl">✓</span>
                                </div>
                                <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em]">You've reached the end</span>
                                <p className="text-[10px] text-gray-600 font-medium">All community posts loaded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Sidebar Column --- */}
                <Sidebar challenges={TRENDING_CHALLENGES} />
            </div>
        </div>
    )
}

export default Home
