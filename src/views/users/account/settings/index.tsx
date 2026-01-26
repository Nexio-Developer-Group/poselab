import ComingSoon from '@/components/shared/ComingSoon'
import { Settings } from 'lucide-react'

const ProfileSettings = () => {
    return (
        <ComingSoon
            title="Profile Settings"
            description="Customize your profile and preferences. This management panel is being built to give you full control over your account."
            icon={<Settings className="w-12 h-12 text-primary" />}
        />
    )
}

export default ProfileSettings
