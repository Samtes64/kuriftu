import { getHotelById } from '@/actions/getHotelById'
import AddHotelForm from '@/components/hotel/AddHotelForm'
import React from 'react'

interface HotelPageProps{
    params:{
        hotelId:string
    }
}

const Hotel = async ({params}:HotelPageProps) => {
  const hotel = await getHotelById(params.hotelId)


  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  )
}

export default Hotel
