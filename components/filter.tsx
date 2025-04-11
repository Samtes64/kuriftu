// components/filter.tsx
'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Slider } from "@/components/ui/slider"

interface FilterProps {
  title: string
  options?: string[] | { value: string; label: string }[]
  paramKey: string
  isMulti?: boolean
  isPriceRange?: boolean
}

export function Filter({ 
  title, 
  options = [], 
  paramKey, 
  isMulti = false,
  isPriceRange = false
}: FilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentValues = searchParams.get(paramKey)?.split(',') || []
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (isMulti) {
      const current = params.get(paramKey)?.split(',') || []
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      
      if (newValues.length > 0) {
        params.set(paramKey, newValues.join(','))
      } else {
        params.delete(paramKey)
      }
    } else {
      params.set(paramKey, value)
    }

    router.replace(`/?${params.toString()}`)
  }

  const handlePriceChange = (values: number[]) => {
    const params = new URLSearchParams(searchParams)
    params.set('minPrice', values[0].toString())
    params.set('maxPrice', values[1].toString())
    router.replace(`/?${params.toString()}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          <span>{title}</span>
          {(currentValues.length > 0 || minPrice || maxPrice) && (
            <Badge variant="secondary" className="px-1.5">
              {isPriceRange 
                ? (minPrice || maxPrice ? '1' : '0')
                : currentValues.length}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {isPriceRange ? (
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                ETB {minPrice || 0} - ETB {maxPrice || 10000}
              </span>
            </div>
            <Slider
              defaultValue={[parseInt(minPrice || '0'), parseInt(maxPrice || '10000')]}
              max={10000}
              step={500}
              onValueCommit={handlePriceChange}
            />
          </div>
        ) : (
          <>
            {options.map((option, i) => {
              const value = typeof option === 'string' ? option : option.value
              const label = typeof option === 'string' ? option : option.label
              const isSelected = currentValues.includes(value)

              return (
                <div key={value}>
                  <button
                    onClick={() => handleSelect(value)}
                    className={`w-full text-left p-2 text-sm hover:bg-muted/50 flex items-center justify-between ${isSelected ? 'font-medium' : ''}`}
                  >
                    {label}
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                  {i < options.length - 1 && <Separator />}
                </div>
              )
            })}
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}