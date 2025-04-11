
import { Mountain } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ThemeToggle } from "./theme-toggle";

import { signOutAction } from "@/actions/signout";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16 px-4 md:px-1">
        <Link href='/' className="flex items-center gap-2">
          <Mountain className="h-6 w-6" />
          <span className="font-bold">Kuriftu.</span>
        </Link>

        <div>
          <div className="flex">
            <div className="z-50 flex items-center">
              <ThemeToggle />
            </div>
            <div>

            {
              session ? (
                <form action={signOutAction}>
                  <Button type='submit'>Sign Out</Button>
                </form>
              ) :
                <Link href='/sign-in' className={buttonVariants()}>
                  Sign In
                </Link>
            }
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}