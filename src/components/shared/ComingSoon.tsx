import { Rocket, Sparkles, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface ComingSoonProps {
    title?: string
    description?: string
    icon?: React.ReactNode
}

const ComingSoon = ({
    title = "Coming Soon",
    description = "We're working hard to bring you something amazing. Stay tuned!",
    icon
}: ComingSoonProps) => {
    return (
        <div className="min-h-[calc(100vh-180px)] w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    {/* Icon Container */}
                    <motion.div
                        className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {icon || <Rocket className="w-12 h-12 text-primary" />}
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent tracking-tight">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                        {description}
                    </p>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap gap-3 justify-center mb-8"
                >
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Exciting Features
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            In Development
                        </span>
                    </div>
                </motion.div>

                {/* Animated Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="max-w-xs mx-auto"
                >
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
                        Development in Progress
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default ComingSoon
