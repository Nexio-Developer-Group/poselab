import { Moon, Sun } from 'lucide-react'
import { THEME_ENUM } from '@/constants/theme.constant'
import { useThemeStore } from '@/store/themeStore'
import { motion } from 'framer-motion'

const ThemeSwitcher = () => {
    const mode = useThemeStore((state) => state.mode)
    const setMode = useThemeStore((state) => state.setMode)

    const { MODE_DARK, MODE_LIGHT } = THEME_ENUM

    const isDark = mode === MODE_DARK

    const toggleTheme = () => {
        setMode(isDark ? MODE_LIGHT : MODE_DARK)
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 0 : 1,
                        rotate: isDark ? 90 : 0,
                        opacity: isDark ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Sun className="w-5 h-5 text-amber-500" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 1 : 0,
                        rotate: isDark ? 0 : -90,
                        opacity: isDark ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Moon className="w-5 h-5 text-blue-400" />
                </motion.div>
            </div>
        </button>
    )
}

export default ThemeSwitcher
