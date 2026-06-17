import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type { FeedResponse, Story, Challenge } from '@/@types/feed'

const FALLBACK_POSTS = [
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
    { id: '1', user: { id: '1', name: 'AlexCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }, content: '/poseLabsPose/standing.png', createdAt: new Date().toISOString() },
    { id: '2', user: { id: '2', name: 'SteveTheGod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve' }, content: '/poseLabsPose/walking.png', createdAt: new Date().toISOString() },
    { id: '3', user: { id: '3', name: 'CreativeCat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cat' }, content: '/poseLabsPose/combat.png', createdAt: new Date().toISOString() },
    { id: '4', user: { id: '4', name: 'PixelMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel' }, content: '/poseLabsPose/walking.png', createdAt: new Date().toISOString() },
]

const FALLBACK_CHALLENGES: Challenge[] = [
    { id: '1', name: 'SunlightShadows', entries: '1.2k' },
    { id: '2', name: 'RigidDynamics', entries: '850' },
    { id: '3', name: 'EpicCombat', entries: '2.4k' },
]

const FeedService = {
    async getFeed(page = 1, limit = 10): Promise<FeedResponse> {
        try {
            return await ApiService.fetchDataWithAxios<FeedResponse>({
                url: endpointConfig.feed,
                method: 'GET',
                params: { page, limit },
            })
        } catch {
            if (page === 1) return { posts: FALLBACK_POSTS as any, nextPage: null, total: FALLBACK_POSTS.length }
            return { posts: [], nextPage: null, total: 0 }
        }
    },

    async likePost(postId: string): Promise<void> {
        try {
            await ApiService.fetchDataWithAxios({
                url: endpointConfig.feedLike.replace(':postId', postId),
                method: 'POST',
            })
        } catch { /* fire-and-forget */ }
    },

    async bookmarkPost(postId: string): Promise<void> {
        try {
            await ApiService.fetchDataWithAxios({
                url: endpointConfig.feedBookmark.replace(':postId', postId),
                method: 'POST',
            })
        } catch { /* fire-and-forget */ }
    },

    async getStories(): Promise<Story[]> {
        try {
            return await ApiService.fetchDataWithAxios<Story[]>({
                url: endpointConfig.stories,
                method: 'GET',
            })
        } catch {
            return FALLBACK_STORIES
        }
    },

    async getChallenges(): Promise<Challenge[]> {
        try {
            return await ApiService.fetchDataWithAxios<Challenge[]>({
                url: endpointConfig.challenges,
                method: 'GET',
            })
        } catch {
            return FALLBACK_CHALLENGES
        }
    },

    async reportPost(postId: string | number): Promise<void> {
        try {
            await ApiService.fetchDataWithAxios<void>({
                url: endpointConfig.reports,
                method: 'POST',
                data: { postId, reason: 'user_report' },
            })
        } catch { /* silently ignore — a failed report must not degrade UX */ }
    },
}

export default FeedService
