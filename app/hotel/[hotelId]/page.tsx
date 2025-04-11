import AddHotelForm from '@/components/hotel/AddHotelForm'
import React from 'react'

interface HotelPageProps{
    params:{
        hotelId:string
    }
}

const Hotel = ({params}:HotelPageProps) => {
    console.log('hotelId',params.hotelId)
  return (
    <div>
      <AddHotelForm/>
    </div>
  )
}

export default Hotel
