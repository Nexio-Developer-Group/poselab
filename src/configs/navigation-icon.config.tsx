import {
    // PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone
} from 'react-icons/pi'
import { LayoutGrid, UserCog, Rotate3d, Headset, NotepadText, Origami, Telescope, Clapperboard } from 'lucide-react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <LayoutGrid />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
    poseLab: <Clapperboard />,
    account: <UserCog />,
    ThreeDViewer: <Rotate3d />,
    helpDesk: <Headset />,
    termsAndConditions: <NotepadText />,
    myCreations: <Origami />,
    creatorSpace: <Telescope />,
}

export default navigationIcon
