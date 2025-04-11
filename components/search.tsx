// components/search.tsx
'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "./ui/input"
import { SearchIcon } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    replace(`/?${params.toString()}`)
  }, 300)

  return (
    <div className="relative flex-1">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('search')?.toString()}
      />
    </div>
  )
}