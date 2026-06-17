import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type { CreationsResponse, Creation, RenderPayload } from '@/@types/creation'

const CreationService = {
    async getMyCreations(userId: string, page = 1, limit = 20): Promise<CreationsResponse> {
        return ApiService.fetchDataWithAxios<CreationsResponse>({
            url: endpointConfig.renders,
            method: 'GET',
            params: { userId, page, limit },
        })
    },

    async saveRender(payload: RenderPayload): Promise<Creation> {
        return ApiService.fetchDataWithAxios<Creation>({
            url: endpointConfig.renders,
            method: 'POST',
            data: payload,
        })
    },

    async deleteCreation(renderId: string): Promise<void> {
        return ApiService.fetchDataWithAxios({
            url: endpointConfig.renderById.replace(':renderId', renderId),
            method: 'DELETE',
        })
    },
}

export default CreationService
