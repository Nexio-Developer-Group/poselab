import ComingSoon from '@/components/shared/ComingSoon'
import { Sparkles } from 'lucide-react'

const CreatorApplication = () => {
    return (
        <ComingSoon
            title="Become a Creator"
            description="Ready to share your talents? Our creator application process is being refined. Soon you'll be able to apply and join our creative community."
            icon={<Sparkles className="w-12 h-12 text-primary" />}
        />
    )
}

export default CreatorApplication
