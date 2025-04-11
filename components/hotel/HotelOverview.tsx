import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function HotelOverview({
  description,
  locationDescription,
}: {
  description: string
  locationDescription: string
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">Overview</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">About the Hotel</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Location Highlights</h3>
          <p className="text-muted-foreground">{locationDescription}</p>
        </div>
      </CardContent>
    </Card>
  )
}