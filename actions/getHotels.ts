// app/actions/getHotels.ts
import prisma from "@/lib/prisma"

interface GetHotelsParams {
  search?: string
  city?: string
  subCity?: string
  amenities?: string[]
  minPrice?: number
  maxPrice?: number
}

export const getHotels = async (params: GetHotelsParams = {}) => {
    try {
      const { search, city, subCity, amenities, minPrice, maxPrice } = params;
  
      const hotels = await prisma.hotel.findMany({
        where: {
          AND: [
            search ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
                { locationDescription: { contains: search } }
              ]
            } : {},
            city ? { city: { equals: city } } : {},
            subCity ? { subCity: { equals: subCity } } : {},
            amenities?.length ? {
              OR: amenities.map(amenity => ({
                [amenity]: true
              }))
            } : {},
            (minPrice || maxPrice) ? {
              rooms: {
                some: {
                  roomPrice: {
                    gte: minPrice,
                    lte: maxPrice
                  }
                }
              }
            } : {}
          ].filter(condition => Object.keys(condition).length > 0)
        },
        include: {
          rooms: {
            select: {
              roomPrice: true
            }
          }
        },
        orderBy: {
          addedAt: "desc"
        }
      });
  
      return hotels;
    } catch (error) {
      console.error("Error fetching hotels:", error);
      throw new Error(typeof error === 'string' ? error : 'Failed to fetch hotels');
    }
  }