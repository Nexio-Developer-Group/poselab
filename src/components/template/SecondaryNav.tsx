import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from '@/utils/classNames'
import navigationConfig from '@/configs/navigation.config'
import { useSessionUser } from '@/store/authStore'
import { ChevronDown, ChevronUp } from 'lucide-react'
import navigationIcon from '@/configs/navigation-icon.config'
import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const SecondaryNav = () => {
    const location = useLocation()
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const userAuthority = useSessionUser((state) => state.user.authority) || []
    const dropdownRef = useRef<HTMLDivElement>(null)

    const hasAuthority = (item: NavigationTree) => {
        if (!item.authority || item.authority.length === 0) {
            return true
        }
        return item.authority.some((auth) => userAuthority.includes(auth))
    }

    const isActive = (path: string) => {
        if (!path) return false
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    const toggleDropdown = (key: string) => {
        setOpenDropdown(openDropdown === key ? null : key)
    }

    const renderIcon = (icon: string) => {
        const Icon = navigationIcon[icon as keyof typeof navigationIcon]
        if (!Icon) return null
        return <Icon className="w-4 h-4" />
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null)
            }
        }

        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [openDropdown])

    // Close dropdown on route change
    useEffect(() => {
        setOpenDropdown(null)
    }, [location.pathname])

    return (
        <div className="hidden lg:flex border-b items-center sticky top-16 z-20 justify-center border-gray-200 dark:border-gray-800 bg-primary dark:bg-gray-900 shadow-sm">
            <div className="px-4">
                <nav className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                    {navigationConfig
                        .filter((item) => item.key !== 'account') // Filter out account menu
                        .map((item) => {
                            if (!hasAuthority(item)) return null

                            const isItemActive = isActive(item.path)
                            const hasSubMenu = item.type === NAV_ITEM_TYPE_COLLAPSE && item.subMenu.length > 0

                            if (hasSubMenu) {
                                const isOpen = openDropdown === item.key
                                const hasActiveChild = item.subMenu.some((sub) => isActive(sub.path))

                                return (
                                    <div key={item.key} className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => toggleDropdown(item.key)}
                                            className={classNames(
                                                'flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-200 relative',
                                                'hover:text-primary dark:hover:text-primary hover:bg-gray-100  dark:hover:bg-gray-800',
                                                (hasActiveChild || isOpen)
                                                    ? 'text-primary bg-gray-100 dark:bg-gray-800'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            )}
                                        >
                                            {renderIcon(item.icon)}
                                            <span className="whitespace-nowrap">{item.title}</span>
                                            {isOpen ? (
                                                <ChevronUp className="w-3 h-3 transition-transform" />
                                            ) : (
                                                <ChevronDown className="w-3 h-3 transition-transform" />
                                            )}
                                            {hasActiveChild && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setOpenDropdown(null)}
                                                />
                                                <div className="absolute top-full left-0 mt-0 min-w-[220px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {item.subMenu.map((subItem) => {
                                                        if (!hasAuthority(subItem)) return null
                                                        const isSubActive = isActive(subItem.path)

                                                        return (
                                                            <Link
                                                                key={subItem.key}
                                                                to={subItem.path}
                                                                onClick={() => setOpenDropdown(null)}
                                                                className={classNames(
                                                                    'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150',
                                                                    'hover:bg-gray-100 dark:hover:bg-gray-800 hover:pl-5',
                                                                    isSubActive
                                                                        ? 'text-primary bg-primary-subtle font-medium border-l-2 border-primary'
                                                                        : 'text-gray-700 dark:text-gray-300'
                                                                )}
                                                            >
                                                                {renderIcon(subItem.icon)}
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            }

                            if (item.type === NAV_ITEM_TYPE_ITEM && item.path) {
                                return (
                                    <Link
                                        key={item.key}
                                        to={item.path}
                                        className={classNames(
                                            'flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-200 relative',
                                            'hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isItemActive
                                                ? 'text-primary bg-gray-100 dark:bg-gray-800'
                                                : 'text-gray-700 dark:text-gray-300'
                                        )}
                                    >
                                        {renderIcon(item.icon)}
                                        <span className="whitespace-nowrap">{item.title}</span>
                                        {isItemActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                        )}
                                    </Link>
                                )
                            }

                            return null
                        })}
                </nav>
            </div>
        </div>
    )
}

export default SecondaryNav

