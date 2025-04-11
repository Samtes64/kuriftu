"use client"
import { Mountain } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"
import { signOutAction } from "@/actions/signout"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const { data } = useSession()
  const [isPending, startTransition] = useTransition()
  const session = data

  const handleSignOut = async () => {
    startTransition(async () => {
      await signOutAction()
      // Clear the session client-side
      
      // Refresh the router to update the UI
      router.refresh()
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href='/' className="flex items-center gap-2">
          <Mountain className="h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">Kuriftu</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full"
                  disabled={isPending}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={session.user?.image || undefined} alt="Profile" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isPending && (
                    <span className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/user" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotel/new" className="w-full">
                    Add Hotel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="focus:bg-destructive/10 focus:text-destructive"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing out...
                    </span>
                  ) : (
                    "Sign Out"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href='/sign-in' className={buttonVariants({ size: "sm" })}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}