import ComingSoon from '@/components/shared/ComingSoon'
import { Headset } from 'lucide-react'

const HelpDesk = () => {
    return (
        <ComingSoon
            title="Help & Support"
            description="Our comprehensive help center is on its way. Get answers to your questions, access tutorials, and connect with our support team."
            icon={<Headset className="w-12 h-12 text-primary" />}
        />
    )
}

export default HelpDesk
