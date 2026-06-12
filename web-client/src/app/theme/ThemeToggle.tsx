import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from './useTheme'
import { Button } from '@/components/ui/button'

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
      <Sun className={`h-4 w-4 transition-all duration-200 ${theme === 'light' ? 'scale-100 rotate-0 opacity-100' : 'absolute scale-0 -rotate-90 opacity-0'}`} />
      <Moon className={`h-4 w-4 transition-all duration-200 ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'absolute scale-0 rotate-90 opacity-0'}`} />
      <Monitor className={`h-4 w-4 transition-all duration-200 ${theme === 'system' ? 'scale-100 rotate-0 opacity-100' : 'absolute scale-0 -rotate-90 opacity-0'}`} />
    </Button>
  )
}
