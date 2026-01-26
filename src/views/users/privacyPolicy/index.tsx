import ComingSoon from '@/components/shared/ComingSoon'
import { NotepadText } from 'lucide-react'

const PrivacyPolicy = () => {
    return (
        <ComingSoon
            title="Privacy Policy"
            description="We're preparing our comprehensive privacy policy. Learn how we protect your data and respect your privacy."
            icon={<NotepadText className="w-12 h-12 text-primary" />}
        />
    )
}

export default PrivacyPolicy
