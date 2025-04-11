'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BookingWidget({ hotelId }: { hotelId: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [nights, setNights] = useState(1)
  const [guests, setGuests] = useState(2)

  return (
    <Card className="shadow-xl border-border/20 sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl">Your Stay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Dates</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nights</label>
            <Select value={nights.toString()} onValueChange={(val) => setNights(parseInt(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select nights" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Night' : 'Nights'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Guests</label>
            <Select value={guests.toString()} onValueChange={(val) => setGuests(parseInt(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="w-full h-12">
          Check Availability
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          No payment required at this stage
        </div>
      </CardContent>
    </Card>
  )
}