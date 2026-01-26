import ComingSoon from '@/components/shared/ComingSoon'
import { UserCog } from 'lucide-react'

const Profile = () => {
    return (
        <ComingSoon
            title="Profile"
            description="Your personal profile page is under construction. Soon you'll be able to view and edit your information."
            icon={<UserCog className="w-12 h-12 text-primary" />}
        />
    )
}

export default Profile
