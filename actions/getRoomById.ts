import prisma from "@/lib/prisma"

export const getRoomById = async (roomId: string) => {
  // More detailed validation
  if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
    console.error('Invalid roomId:', roomId)
    throw new Error("Valid room ID is required")
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { Hotel: true }
    })

    if (!room) {
      console.warn(`Room not found with ID: ${roomId}`)
      return null
    }

    return room
  } catch (error) {
    console.error(`Database error fetching room ${roomId}:`, error)
    throw new Error(`Failed to fetch room: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}