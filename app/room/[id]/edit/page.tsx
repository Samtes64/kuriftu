import { getRoomById } from "@/actions/getRoomById"
import { EditRoomForm } from "@/components/room/EditRoomForm"
import { notFound } from "next/navigation"

export default async function EditRoomPage({
  params,
}: {
  params: { id: string }
}) {
  // Add debug logging
  console.log('Route params:', params)

  if (!params?.id) {
    console.error('No ID parameter received')
    return notFound()
  }

  try {
    const room = await getRoomById(params.id)
    
    if (!room) {
      return notFound()
    }

    return (
      <div className="container mx-auto py-8">
        <EditRoomForm 
          room={room}
        />
      </div>
    )
  } catch (error) {
    console.error("Error loading room:", error)
    return notFound()
  }
}