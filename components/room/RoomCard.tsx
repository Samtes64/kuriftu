import { Room } from "@prisma/client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tv, Wifi, Mountain, Trees, AirVent, DoorOpen, Trash2, Edit,  Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface RoomCardProps {
  room: Room
  onDeleteSuccess?: () => void
}

export const RoomCard = ({ room, onDeleteSuccess }: RoomCardProps) => {
  const router = useRouter()
 
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const amenities = [
    { name: "TV", icon: Tv, active: room.tv },
    { name: "WiFi", icon: Wifi, active: room.wifi },
    { name: "Air Conditioning", icon: AirVent, active: room.airCondition },
    { name: "Balcony", icon: DoorOpen, active: room.balcony },
    { name: "Forest View", icon: Trees, active: room.forestView },
    { name: "Mountain View", icon: Mountain, active: room.mountainView },
  ].filter(a => a.active)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/room/${room.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete room')
      }

      toast.success(
         "Room has been deleted")

      onDeleteSuccess?.()
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error(
        
        "Could not delete room"
     
      )
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Card className="h-full overflow-hidden transition-all duration-200  border-border/50">
        <div className="relative aspect-video group">
          <Image
            src={room.image}
            alt={room.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <CardHeader className="pb-3 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{room.title}</h3>
            <div className="text-right min-w-[100px]">
              <p className="font-bold text-lg">ETB {room.roomPrice.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
              {room.breakfastPrice > 0 && (
                <p className="text-xs text-muted-foreground">+ ETB {room.breakfastPrice.toLocaleString()} breakfast</p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {room.description}
          </p>
        </CardHeader>
        
        <CardContent className="pb-3 space-y-3">
          <div className="flex flex-wrap gap-2">
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
          
          {amenities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <Badge 
                    key={amenity.name} 
                    variant="outline" 
                    className="gap-1.5 px-2.5 py-1 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <amenity.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs">
                      {amenity.name}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-0">
          <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
            <Link href={`/room/${room.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the room {room.title} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Room"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}