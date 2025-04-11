// components/ViewHotelModal.tsx
"use client"


import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, Dumbbell, Waves, Utensils, Martini, ShoppingBag } from "lucide-react"
import { HotelWithRooms } from "./AddHotelForm"

interface ViewHotelModalProps {
  hotel: HotelWithRooms
  children?: React.ReactNode
}

export const ViewHotelModal = ({ hotel, children }: ViewHotelModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="outline">View Details</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{hotel.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Hotel Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={hotel.image}
              alt={hotel.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{hotel.description}</p>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">{hotel.city}, {hotel.subCity}</p>
                  <p className="text-sm text-muted-foreground">{hotel.locationDescription}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.gym && (
                <Badge variant="secondary" className="gap-1">
                  <Dumbbell className="h-4 w-4" /> Gym
                </Badge>
              )}
              {hotel.swimmingPool && (
                <Badge variant="secondary" className="gap-1">
                  <Waves className="h-4 w-4" /> Pool
                </Badge>
              )}
              {hotel.restaurant && (
                <Badge variant="secondary" className="gap-1">
                  <Utensils className="h-4 w-4" /> Restaurant
                </Badge>
              )}
              {hotel.bar && (
                <Badge variant="secondary" className="gap-1">
                  <Martini className="h-4 w-4" /> Bar
                </Badge>
              )}
              {hotel.shopping && (
                <Badge variant="secondary" className="gap-1">
                  <ShoppingBag className="h-4 w-4" /> Shopping
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}