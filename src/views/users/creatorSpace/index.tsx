import ComingSoon from '@/components/shared/ComingSoon'
import { Telescope } from 'lucide-react'

const CreatorSpace = () => {
    return (
        <ComingSoon
            title="Creator Space"
            description="Your creative hub is being crafted with care. Soon you'll be able to create, share, and manage your content all in one place."
            icon={<Telescope className="w-12 h-12 text-primary" />}
        />
    )
}

export default CreatorSpace
