import { createContext } from 'react'

export interface ThemeContextType {
  theme: 'lumio' | 'lumio-dark'
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
