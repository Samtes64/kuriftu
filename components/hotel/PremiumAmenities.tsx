import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, ShowerHead, Wine, Utensils, ShoppingBag, Waves, Wifi, Tv2 } from 'lucide-react'

const amenities = [
  { name: 'Gym', icon: Dumbbell, active: true },
  { name: 'Spa', icon: ShowerHead, active: true },
  { name: 'Bar', icon: Wine, active: true },
  { name: 'Fine Dining', icon: Utensils, active: true },
  { name: 'Boutique', icon: ShoppingBag, active: true },
  { name: 'Infinity Pool', icon: Waves, active: true },
  { name: 'High-Speed WiFi', icon: Wifi, active: true },
  { name: '4K Entertainment', icon: Tv2, active: true },
]

export function PremiumAmenities({
  amenities: hotelAmenities
}: {
  amenities: Record<string, boolean>
}) {
  return (
    <Card className="border-none shadow-lg mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Amenities & Services</CardTitle>
        <p className="text-muted-foreground">Experience unparalleled luxury with our premium offerings</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {amenities.map((amenity) => (
            hotelAmenities[amenity.name.toLowerCase().replace(' ', '')] && (
              <div key={amenity.name} className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <amenity.icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{amenity.name}</span>
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  )
}