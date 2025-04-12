'use client'

import {redirect} from "next/navigation";

const BookedRoomServices = () => {
    const hotel = {
        name: "lakdfaldf",
        id: "kakldfaweif"
    }
    return <div className='mt-10 text-center container mx-auto gap-y-5 flex flex-col'>
        <div className='flex gap-5 justify-between'>
            <div className='p-5 py-10 rounded-sm text-center border-[1px] border-gray-400 flex-1' onClick={() => redirect('/leaderboard')}> Leadersboard</div>
            <div className='p-5 py-10 rounded-sm text-center border-[1px] border-gray-400 flex-1' onClick={() => redirect(`/hotel-details/${hotel.id}/services`)}> Hotel Services</div>
        </div>
        <div className='text-center border-[1px] border-gray-400  p-5 py-10 rounded-sm'>
            <h3>My room</h3>
        </div>
    </div>
}

export default BookedRoomServices