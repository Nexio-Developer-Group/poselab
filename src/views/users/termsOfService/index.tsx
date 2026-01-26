import ComingSoon from '@/components/shared/ComingSoon'
import { NotepadText } from 'lucide-react'

const TermsOfService = () => {
    return (
        <ComingSoon
            title="Terms of Service"
            description="Our terms and conditions are being finalized. Soon you'll be able to review all the legal information about using our platform."
            icon={<NotepadText className="w-12 h-12 text-primary" />}
        />
    )
}

export default TermsOfService
