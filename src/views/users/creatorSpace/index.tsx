import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { BarChart2, Eye, Heart, Users, Edit2, EyeOff, Plus, CheckCircle2, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/Input'
import { useSessionUser } from '@/store/authStore'

// --- Hardcoded placeholder stats ---
const STATS = [
    { label: 'Published Poses', value: 12, trend: '+2', icon: Star },
    { label: 'Total Views', value: '8.4K', trend: '+1.2K', icon: Eye },
    { label: 'Total Likes', value: '1.2K', trend: '+184', icon: Heart },
    { label: 'Followers', value: 342, trend: '+28', icon: Users },
]

// --- Sample poses ---
const SAMPLE_POSES = [
    { id: '1', name: 'Hero Stance', views: 1240, likes: 89, preview: '/poseLabsPose/standing.png', tags: ['action', 'hero'] },
    { id: '2', name: 'Combat Ready', views: 856, likes: 62, preview: '/poseLabsPose/standing.png', tags: ['combat', 'pvp'] },
    { id: '3', name: 'Chill Walk', views: 2145, likes: 178, preview: '/poseLabsPose/standing.png', tags: ['casual'] },
]

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
    }),
}

const CreatorSpace = () => {
    const { user } = useSessionUser()
    const isVerifiedCreator = user?.authority?.includes('creator')

    // Publish form state
    const [poseName, setPoseName] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')

    // Creator application state
    const [applied, setApplied] = useState(false)

    const handleUnpublish = () => {
        toast.info('Coming soon')
    }

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault()
        toast.info('Pose publishing coming soon — connect to the PoseLab editor first!')
    }

    const handleApply = () => {
        setApplied(true)
        toast.success('Application submitted! We\'ll review within 48 hours.')
    }

    return (
        <div className="min-h-screen text-white space-y-10">

            {/* Page Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <BarChart2 className="w-6 h-6 text-primary" />
                    Creator Space
                </h1>
                <p className="text-sm text-gray-400">Your hub for managing and publishing poses.</p>
            </div>

            {/* ── Section 1: Stats Bar ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.label}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className="bg-gray-900 border border-white/10 rounded-2xl p-5 flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between text-gray-400">
                                <span className="text-xs font-semibold uppercase tracking-widest">{stat.label}</span>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <div className="text-xs font-semibold text-emerald-400">{stat.trend} this week</div>
                        </motion.div>
                    )
                })}
            </div>

            {/* ── Section 2: Published Poses ── */}
            <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Published Poses
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SAMPLE_POSES.map((pose, i) => (
                        <motion.div
                            key={pose.id}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden group"
                        >
                            {/* Preview image */}
                            <div className="relative w-full aspect-square bg-gray-950 overflow-hidden">
                                <img
                                    src={pose.preview}
                                    alt={pose.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Card body */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="font-bold text-white text-sm leading-tight">{pose.name}</span>
                                    <div className="flex gap-1 shrink-0">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-gray-400 hover:text-white"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-gray-400 hover:text-red-400"
                                            title="Unpublish"
                                            onClick={handleUnpublish}
                                        >
                                            <EyeOff className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {pose.views.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        {pose.likes.toLocaleString()}
                                    </span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {pose.tags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-[10px] uppercase tracking-wide bg-white/5 text-gray-300 border-white/10 px-2 py-0.5"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── Section 3: Publish New Pose ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-5"
            >
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    Publish New Pose
                </h2>

                <form onSubmit={handlePublish} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Pose Name
                        </label>
                        <Input
                            placeholder="e.g. Dragon Slayer Stance"
                            value={poseName}
                            onChange={e => setPoseName(e.target.value)}
                            className="bg-gray-950 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Description
                            <span className="ml-2 normal-case tracking-normal text-gray-600 font-normal">
                                ({description.length}/200)
                            </span>
                        </label>
                        <textarea
                            placeholder="Describe the pose, its style, or what it's best used for…"
                            value={description}
                            maxLength={200}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none transition-colors"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Tags
                            <span className="ml-2 normal-case tracking-normal text-gray-600 font-normal">
                                (comma-separated)
                            </span>
                        </label>
                        <Input
                            placeholder="e.g. combat, pvp, action"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            className="bg-gray-950 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
                        />
                    </div>

                    <Button type="submit" className="w-full sm:w-auto gap-2">
                        <Plus className="w-4 h-4" />
                        Publish Pose
                    </Button>
                </form>
            </motion.div>

            {/* ── Section 4: Creator Application Status ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
                className="bg-gray-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
            >
                <div className="space-y-0.5">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">
                        Creator Status
                    </h2>
                    {isVerifiedCreator ? (
                        <p className="text-xs text-gray-500">Your account is verified.</p>
                    ) : (
                        <p className="text-xs text-gray-500">
                            Become a verified creator to unlock analytics, featured placement, and more.
                        </p>
                    )}
                </div>

                {isVerifiedCreator ? (
                    <Badge className="gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Creator
                    </Badge>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={applied}
                        onClick={handleApply}
                        className="gap-2 shrink-0"
                    >
                        <Star className="w-3.5 h-3.5" />
                        {applied ? 'Application Submitted' : 'Apply to become a verified creator'}
                    </Button>
                )}
            </motion.div>
        </div>
    )
}

export default CreatorSpace
