import { getHotels } from "@/actions/getHotels"
import { HotelCard } from "@/components/hotel/HotelCard"
import { HotelFilters } from "@/components/hotel/HotelFilters"


export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const filters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    amenities: typeof searchParams.amenities === 'string' 
      ? searchParams.amenities.split(',') 
      : [],
    minPrice: typeof searchParams.minPrice === 'string' 
      ? parseInt(searchParams.minPrice) 
      : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' 
      ? parseInt(searchParams.maxPrice) 
      : undefined,
  }

  const hotels = await getHotels(filters)

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
     

      {/* Filter Section */}
      <div className="mb-8">
        <HotelFilters />
      </div>

      {/* Results Section */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {hotels.length} {hotels.length === 1 ? 'Hotel' : 'Hotels'} Available
        </h2>
      </div>

      {/* Hotels Grid */}
      {hotels.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed">
          <h3 className="text-xl font-medium mb-2">No hotels found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  )
}