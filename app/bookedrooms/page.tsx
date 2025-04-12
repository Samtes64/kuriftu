'use client'
import ClientComponent from "@/components/client-component";
import { auth } from "@/lib/auth";
import {redirect} from "next/navigation";


export default async function DashboardPage() {

    // here will be the request for the booked rooms of the user
    const bookedRooms = ["booked one ", "booked one ", "booked one"]
    const displayBookings  = bookedRooms.map((room, index) => <button onClick={() => redirect('/bookedrooms/someid')} key={index} className='p-10 rounded-md text-center border-[1px] border-gray-400'>
        <p>{room}</p>
    </button>)

    return (
        <div className='mt-10 text-center container mx-auto'>

            <h1>BOOKED ROOMS</h1>
            <div className='flex flex-col gap-5'>
                {displayBookings}
            </div>


        </div>
    );
}