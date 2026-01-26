import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

interface PromoProps {
    post: any
}

const PromoCard = ({ post }: PromoProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden group border border-white/5 bg-gray-950 shadow-2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img
                src={post.image}
                className="w-full h-[250px] sm:h-[320px] object-cover opacity-50 group-hover:scale-105 transition-transform duration-[2s]"
                alt=""
            />
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 sm:mb-3 shadow-sm drop-shadow-md">
                    Platform Spotlight
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2 sm:mb-4 max-w-md leading-[0.85] text-white">
                    {post.title}
                </h2>
                <p className="text-gray-300 font-medium mb-4 sm:mb-8 max-w-sm text-xs sm:text-sm">
                    {post.subtitle}
                </p>
                <Button
                    asChild
                    className="w-fit bg-white text-black font-black uppercase tracking-widest text-[10px] h-11 sm:h-12 px-6 sm:px-10 rounded-2xl hover:bg-primary hover:text-black transition-colors shadow-2xl"
                >
                    <Link to={post.path!}>{post.cta}</Link>
                </Button>
            </div>
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
        </motion.div>
    )
}

export default PromoCard
