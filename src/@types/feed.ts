export interface FeedUser {
    id: string
    name: string
    avatar: string
}

export interface FeedPost {
    id: string
    user: FeedUser
    type: 'image' | 'video' | 'promo' | 'recommendation'
    content: string
    likes: number
    comments: number
    caption: string
    tags: string[]
    isLiked?: boolean
    isBookmarked?: boolean
    createdAt: string
}

export interface FeedResponse {
    posts: FeedPost[]
    nextPage: number | null
    total: number
}

export interface Story {
    id: string
    user: FeedUser
    content: string
    createdAt: string
}

export interface Challenge {
    id: string
    name: string
    entries: string
    previewUrl?: string
}
