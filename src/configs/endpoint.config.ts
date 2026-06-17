export const apiPrefix = '/api'

const endpointConfig = {
    // Auth (existing)
    signIn: '/auth',
    signOut: '/sign-out',
    signUp: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    googleSignIn: '/auth',
    githubSignIn: '/auth',
    // Feed
    feed: '/feed',
    feedPost: '/feed',
    feedLike: '/feed/:postId/like',
    feedBookmark: '/feed/:postId/bookmark',
    // Renders
    renders: '/renders',
    renderById: '/renders/:renderId',
    // Poses
    poses: '/poses',
    poseById: '/poses/:poseId',
    // Profile
    profileById: '/profile/:userId',
    profileUpdate: '/profile',
    // Stories
    stories: '/stories',
    // Challenges
    challenges: '/challenges',
    // Reports
    reports: '/reports',
}

export default endpointConfig
