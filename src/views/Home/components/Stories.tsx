import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface StoryItem {
    id: string | number
    type: string
    poseId?: string
    preview?: string
}

interface StoriesProps {
    posts: StoryItem[]
}

const Stories = ({ posts }: StoriesProps) => {
    const recommendations = posts.filter(p => p.type === 'recommendation')

    return (
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Link to="/pose-lab" className="flex flex-col items-center flex-shrink-0 group">
                    <div className="w-18 h-18 rounded-[1.5rem] bg-primary flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] group-hover:rotate-6 transition-transform">
                        <Zap className="w-9 h-9 text-black" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary text-center block">New Rig</span>
                </Link>
            </motion.div>

            {recommendations.map((rec, index) => (
                <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to={`/pose-lab?pose=${rec.poseId}`} className="flex flex-col items-center flex-shrink-0 group">
                        <div className="w-18 h-18 rounded-[1.5rem] border-2 border-white/5 p-1 group-hover:border-primary/50 transition-all bg-gray-900/50 backdrop-blur-sm">
                            <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-black">
                                <img
                                    src={rec.preview}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                    alt=""
                                />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500 group-hover:text-gray-300 text-center block mt-2 transition-colors">Try Pose</span>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}

export default Stories
