import { Bell, LogOut, Menu, Moon, Search, Sun, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useSidebarStore } from '@/stores/sidebarStore'
import { getInitials } from '@/lib/utils'

interface DashboardHeaderProps {
  title?: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const { setOpen } = useSidebarStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/75 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative hidden max-w-sm flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari..." className="pl-9" />
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{getInitials(user?.name ?? 'Admin')}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name ?? 'Administrator'}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email ?? 'admin@sekolahapp.sch.id'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void logout()} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
