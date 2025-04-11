import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
// import { Map } from '@/components/Map'

export function HotelLocation({
  city,
  subCity,
  locationDescription,
}: {
  city: string
  subCity: string
  locationDescription: string
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">Location</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">
              {subCity}, {city}
            </p>
            <p className="text-muted-foreground">{locationDescription}</p>
          </div>
        </div>
        {/* <div className="h-64 rounded-lg overflow-hidden">
          <Map location={`${subCity}, ${city}`} />
        </div> */}
      </CardContent>
    </Card>
  )
}