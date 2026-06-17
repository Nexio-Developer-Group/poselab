import ApiService from './ApiService'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeedPost {
    id: number | string
    user?: { name: string; avatar: string }
    type: string
    content?: string
    likes?: number
    comments?: number
    caption?: string
    tags?: string[]
    title?: string
    subtitle?: string
    cta?: string
    path?: string
    image?: string
    poseId?: string
    preview?: string
}

export interface FeedPage {
    posts: FeedPost[]
    nextPage: number | null
}

export interface Story {
    id: string | number
    username: string
    avatar: string
    preview?: string
}

export interface Challenge {
    id: number | string
    name: string
    entries: string
}

// ---------------------------------------------------------------------------
// Fallback data (used when the API is unavailable)
// ---------------------------------------------------------------------------

const FALLBACK_POSTS: FeedPost[] = [
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

const FALLBACK_STORIES: Story[] = [
    { id: 1, username: 'AlexCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', preview: '/poseLabsPose/standing.png' },
    { id: 2, username: 'SteveTheGod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve', preview: '/poseLabsPose/walking.png' },
    { id: 3, username: 'CreativeCat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cat', preview: '/poseLabsPose/combat.png' },
    { id: 4, username: 'PixelMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel', preview: '/poseLabsPose/walking.png' },
]

const FALLBACK_CHALLENGES: Challenge[] = [
    { id: 1, name: 'SunlightShadows', entries: '1.2k' },
    { id: 2, name: 'RigidDynamics', entries: '850' },
    { id: 3, name: 'EpicCombat', entries: '2.4k' },
]

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const FeedService = {
    /**
     * Fetch a paginated feed page.  Falls back to mock data when API is down.
     */
    async getFeed(page = 1): Promise<FeedPage> {
        try {
            return await ApiService.fetchDataWithAxios<FeedPage>({
                url: `/feed?page=${page}`,
                method: 'GET',
            })
        } catch {
            // Simulate pagination: page 1 returns fallback posts; page 2+ signals end
            if (page === 1) {
                return { posts: FALLBACK_POSTS, nextPage: null }
            }
            return { posts: [], nextPage: null }
        }
    },

    /**
     * Fetch stories.  Falls back to derived story items when API is down.
     */
    async getStories(): Promise<Story[]> {
        try {
            return await ApiService.fetchDataWithAxios<Story[]>({
                url: '/stories',
                method: 'GET',
            })
        } catch {
            return FALLBACK_STORIES
        }
    },

    /**
     * Fetch trending challenges.  Falls back to hardcoded list when API is down.
     */
    async getChallenges(): Promise<Challenge[]> {
        try {
            return await ApiService.fetchDataWithAxios<Challenge[]>({
                url: '/challenges',
                method: 'GET',
            })
        } catch {
            return FALLBACK_CHALLENGES
        }
    },

    /**
     * Report a post.  Fire-and-forget — errors are silently swallowed.
     */
    async reportPost(postId: string | number): Promise<void> {
        try {
            await ApiService.fetchDataWithAxios<void>({
                url: '/reports',
                method: 'POST',
                data: { postId, reason: 'user_report' },
            })
        } catch {
            // Silently ignore — a failed report must not degrade UX
        }
    },
}

export default FeedService
