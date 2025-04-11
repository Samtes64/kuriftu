'use client' // Add this at the top since we're using useRouter

import { Hotel } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  MapPin, 
  Dumbbell, 
  Wine, 
  ShoppingBag, 
  Utensils, 
  Waves,
  ShowerHead,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface HotelCardProps {
  hotel: Hotel & { rooms: { roomPrice: number }[] }
  showEditButton?: boolean // Optional prop to show edit button
}

export function HotelCard({ hotel, showEditButton = false }: HotelCardProps) {
  const router = useRouter()

  // Calculate price range
  const prices = hotel.rooms.map(room => room.roomPrice)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  // Amenities data
  const amenities = [
    { name: "Gym", icon: Dumbbell, active: hotel.gym },
    { name: "Spa", icon: ShowerHead, active: hotel.spa },
    { name: "Bar", icon: Wine, active: hotel.bar },
    { name: "Restaurant", icon: Utensils, active: hotel.restaurant },
    { name: "Shopping", icon: ShoppingBag, active: hotel.shopping },
    { name: "Pool", icon: Waves, active: hotel.swimmingPool }
  ].filter(a => a.active)

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/hotel/${hotel.id}`)
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 border-border/30">
      {/* Image with overlay */}
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <Image
            src={hotel.image || "/hotel-placeholder.jpg"}
            alt={hotel.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/90">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>4.8</span>
          </Badge>
          {hotel.swimmingPool && (
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/60">
              Pool
            </Badge>
          )}
        </div>
      </div>

      {/* Card content */}
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl line-clamp-1">{hotel.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">
                {hotel.subCity}, {hotel.city}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">From</p>
            <p className="font-bold text-lg">
              ETB {minPrice.toLocaleString()}
              {minPrice !== maxPrice && (
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  - {maxPrice.toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {hotel.locationDescription || hotel.description}
        </p>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <Badge 
                  key={amenity.name}
                  variant="outline"
                  className="gap-1.5 px-3 py-1.5 rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10"
                >
                  <amenity.icon className="h-4 w-4 text-primary" />
                  <span className="text-xs">{amenity.name}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer with action buttons */}
      <CardFooter className="p-4 pt-0 grid gap-3">
        <Button asChild className="w-full" size="lg">
          <Link href={`/hotels/${hotel.id}`}>
            View Availability
          </Link>
        </Button>
        
        {showEditButton && (
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleEdit}
          >
            Edit Hotel
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}