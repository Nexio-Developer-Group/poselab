import {
    // NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Explore',
        translateKey: 'nav.home',
        icon: 'creatorSpace',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'creatorSpace',
        path: '/creator-space',
        title: 'Creator Space',
        translateKey: 'nav.creatorSpace',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'poseLab',
        path: '/pose-lab',
        title: 'Pose Lab',
        translateKey: 'nav.poseLab',
        icon: 'poseLab',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'ThreeDViewer',
        path: '/3d-viewer',
        title: 'Model Library',
        translateKey: 'nav.ThreeDViewer',
        icon: 'ThreeDViewer',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'myCreations',
        path: '/my-creations',
        title: 'My Creations',
        translateKey: 'nav.myCreations',
        icon: 'myCreations',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'account',
        path: '',
        title: 'Account',
        translateKey: 'nav.account.account',
        icon: 'account',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'account.profile',
                path: '/profile',
                title: 'Basic Info',
                translateKey: 'nav.account.profile',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'account.settings',
                path: '/profile/settings',
                title: 'Profile Settings',
                translateKey: 'nav.account.settings',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'account.creatorApplication',
                path: '/profile/creator-application',
                title: 'Become a Creator',
                translateKey: 'nav.account.creatorApplication',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'helpDesk',
        path: '/help-desk',
        title: 'Help & Support',
        translateKey: 'nav.helpDesk',
        icon: 'helpDesk',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
