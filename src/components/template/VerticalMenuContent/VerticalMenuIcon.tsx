import navigationIcon from '@/configs/navigation-icon.config'

type VerticalMenuIconProps = {
    icon: string
    gutter?: string
}

const VerticalMenuIcon = ({ icon }: VerticalMenuIconProps) => {
    if (typeof icon !== 'string' && !icon) {
        return <></>
    }

    const IconComponent = navigationIcon[icon]

    return (
        <>
            {IconComponent && (
                <span className={`text-2xl`}>
                    <IconComponent />
                </span>
            )}
        </>
    )
}

export default VerticalMenuIcon
