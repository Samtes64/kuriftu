import { Room } from "@prisma/client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tv, Wifi, Mountain, Trees, AirVent, DoorOpen } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface RoomCardProps {
  room: Room
  onEdit?: () => void
  onDelete?: () => void
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const amenities = [
    { name: "tv", icon: Tv, active: room.tv },
    { name: "wifi", icon: Wifi, active: room.wifi },
    { name: "airCondition", icon: AirVent, active: room.airCondition },
    { name: "balcony", icon: DoorOpen, active: room.balcony },
    { name: "forestView", icon: Trees, active: room.forestView },
    { name: "mountainView", icon: Mountain, active: room.mountainView },
  ]

  const activeAmenities = amenities.filter(a => a.active)

  return (
    <Card className="h-full overflow-hidden transition-all duration-200 ">
      <div className="relative aspect-video">
        <Image
          src={room.image}
          alt={room.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{room.title}</h3>
          <div className="text-right min-w-[100px]">
            <p className="font-bold text-lg">ETB {room.roomPrice}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
            {room.breakfastPrice > 0 && (
              <p className="text-xs text-muted-foreground">+ ${room.breakfastPrice} breakfast</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {room.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="gap-1">
            {room.bedCount} {room.bedCount === 1 ? "Bed" : "Beds"}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            {room.bathroomCount} {room.bathroomCount === 1 ? "Bath" : "Baths"}
          </Badge>
          {room.kingBed > 0 && (
            <Badge variant="secondary" className="gap-1">
              {room.kingBed} King {room.kingBed === 1 ? "Bed" : "Beds"}
            </Badge>
          )}
          {room.normalBed > 0 && (
            <Badge variant="secondary" className="gap-1">
              {room.normalBed} Standard {room.normalBed === 1 ? "Bed" : "Beds"}
            </Badge>
          )}
        </div>
        
        {activeAmenities.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {activeAmenities.map((amenity) => (
                <Badge 
                  key={amenity.name} 
                  variant="outline" 
                  className="gap-1.5 px-2.5 py-1 rounded-lg"
                >
                  <amenity.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs">
                    {amenity.name.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-0">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/dashboard/rooms/${room.id}/edit`}>
            Edit
          </Link>
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link href={`/dashboard/rooms/${room.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}