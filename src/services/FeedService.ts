import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type { FeedResponse, Story, Challenge } from '@/@types/feed'

const FeedService = {
    async getFeed(page = 1, limit = 10): Promise<FeedResponse> {
        return ApiService.fetchDataWithAxios<FeedResponse>({
            url: endpointConfig.feed,
            method: 'GET',
            params: { page, limit },
        })
    },

    async likePost(postId: string): Promise<void> {
        return ApiService.fetchDataWithAxios({
            url: endpointConfig.feedLike.replace(':postId', postId),
            method: 'POST',
        })
    },

    async bookmarkPost(postId: string): Promise<void> {
        return ApiService.fetchDataWithAxios({
            url: endpointConfig.feedBookmark.replace(':postId', postId),
            method: 'POST',
        })
    },

    async getStories(): Promise<Story[]> {
        return ApiService.fetchDataWithAxios<Story[]>({
            url: endpointConfig.stories,
            method: 'GET',
        })
    },

    async getChallenges(): Promise<Challenge[]> {
        return ApiService.fetchDataWithAxios<Challenge[]>({
            url: endpointConfig.challenges,
            method: 'GET',
        })
    },
}

export default FeedService
