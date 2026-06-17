export interface Creation {
    id: string
    title: string
    thumbnail: string
    type: 'pose' | 'render' | 'animation'
    views: number
    likes: number
    createdAt: string
    tags: string[]
    userId?: string
}

export interface CreationsResponse {
    creations: Creation[]
    total: number
    nextPage: number | null
}

export interface RenderPayload {
    imageDataUrl: string
    poseSnapshot: Record<string, unknown>
    skinUrl?: string
    renderSettings: Record<string, unknown>
    title?: string
}
