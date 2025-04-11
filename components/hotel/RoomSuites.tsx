import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Room } from '@prisma/client'
import Image from 'next/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export function RoomSuites({ rooms }: { rooms: Room[] }) {
  return (
    <Card className="border-none shadow-lg mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Rooms & Suites</CardTitle>
        <p className="text-muted-foreground">Select your perfect accommodation</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {rooms.map((room) => (
          <div key={room.id} className="flex flex-col md:flex-row gap-6 p-6 border rounded-xl hover:border-primary/30 transition-colors">
            <div className="md:w-1/3">
              <AspectRatio ratio={4/3} className="rounded-lg overflow-hidden">
                <Image
                  src={room.image || '/room-placeholder.jpg'}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
              </AspectRatio>
            </div>
            <div className="md:w-2/3 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{room.title}</h3>
                <p className="text-muted-foreground mt-2 line-clamp-3">{room.description}</p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary" className="gap-1">
                    {room.bedCount} {room.bedCount === 1 ? 'Bed' : 'Beds'}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    {room.bathroomCount} {room.bathroomCount === 1 ? 'Bath' : 'Baths'}
                  </Badge>
                  {room.tv && <Badge variant="secondary">Smart TV</Badge>}
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div>
                  <p className="text-2xl font-bold">ETB {room.roomPrice.toLocaleString()}</p>
                  {room.breakfastPrice > 0 && (
                    <p className="text-sm text-muted-foreground">
                      + ETB {room.breakfastPrice.toLocaleString()} breakfast
                    </p>
                  )}
                </div>
                <Button className="">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}