import { getHotelById } from '@/actions/getHotelById'
import { notFound } from 'next/navigation'
import { LuxuryGallery } from '@/components/hotel/LuxuryGallery'
import { PremiumAmenities } from '@/components/hotel/PremiumAmenities'
import { RoomSuites } from '@/components/hotel/RoomSuites'
import { HotelHeader } from '@/components/hotel/HotelHeader'
// import { ExperienceSection } from '@/components/hotel/ExperienceSection'
import { BookingWidget } from '@/components/hotel/BookingWidget'

export default async function HotelDetailsPage({
  params,
}: {
  params: { hotelId: string }
}) {
  const hotel = await getHotelById(params.hotelId)

  if (!hotel) {
    return notFound()
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HotelHeader 
        title={hotel.title} 
        location={`${hotel.subCity}, ${hotel.city}`} 
        rating={4.8}
      />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 -mt-16 relative z-10">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Gallery */}
            <LuxuryGallery mainImage={hotel.image} />
            
            {/* Experience */}
            {/* <ExperienceSection 
              description={hotel.description}
              highlights={hotel.locationDescription}
            /> */}
            
            {/* Amenities */}
            <PremiumAmenities 
              amenities={{
                gym: hotel.gym,
                spa: hotel.spa,
                bar: hotel.bar,
                restaurant: hotel.restaurant,
                shopping: hotel.shopping,
                swimmingPool: hotel.swimmingPool,
              }}
            />
            
            {/* Rooms & Suites */}
            <RoomSuites rooms={hotel.rooms} />
          </div>
          
          {/* Booking Widget - Sticky */}
          <div className="lg:w-1/3 lg:sticky lg:top-4 lg:self-start">
            <BookingWidget hotelId={hotel.id} />
          </div>
        </div>
      </div>
    </div>
  )
}