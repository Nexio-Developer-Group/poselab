export interface ModelItem {
    id: string
    title: string
    description: string
    thumbnail: string
    url: string
    type: 'model' | 'skin'
    category: 'character' | 'mob' | 'prop'
}

export const availableModels: ModelItem[] = [
    {
        id: 'steve',
        title: 'Classic Steve',
        description: 'The iconic protagonist of Minecraft with full animation support.',
        thumbnail: 'https://media.sketchfab.com/models/bc3a691e63054c3ea316962ffbb35105/thumbnails/fa6ec0c4d3164e6e90c9682e9bcc3b3d/2851bbb787e74458a4f7bb6485af9024.jpeg',
        url: '/models/steve_walk.glb',
        type: 'model',
        category: 'character'
    },
    {
        id: 'blaze',
        title: 'Nether Blaze',
        description: 'A fiery mob from the Nether dimension.',
        thumbnail: 'https://media.sketchfab.com/models/e0c479ccd5274c03b3b3603a753ca930/thumbnails/34233fb4c93f4c2290091828674387a4/920d5c5e792c43d1831250df32f7dad8.jpeg',
        url: '/models/blaze.glb',
        type: 'model',
        category: 'mob'
    },
    {
        id: 'default',
        title: 'Dev Model',
        description: 'Default testing model for layout and lighting.',
        thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXqp9_7z5rnHERb4T0eS8T3nLNrmDBBW8rBQ&s',
        url: '/models/default-model.glb',
        type: 'model',
        category: 'prop'
    }
]
