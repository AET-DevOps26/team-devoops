import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from './useTheme'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const themeIconClassName = (isActive: boolean, inactiveRotationClass: string) =>
  cn(
    'size-4 transition-all duration-200',
    isActive ? 'scale-100 rotate-0 opacity-100' : `absolute scale-0 ${inactiveRotationClass} opacity-0`,
  )

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Toggle theme (current: ${theme})`}
      title={`Toggle theme (current: ${theme})`}
      className="relative border border-border bg-background/70"
    >
      <Sun className={themeIconClassName(theme === 'light', '-rotate-90')} />
      <Moon className={themeIconClassName(theme === 'dark', 'rotate-90')} />
      <Monitor className={themeIconClassName(theme === 'system', '-rotate-90')} />
    </Button>
  )
}
