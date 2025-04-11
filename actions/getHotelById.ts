import prisma from "@/lib/prisma"

export const getHotelById = async(hotelId:string)=>{
    try{
        const hotel= await prisma.hotel.findUnique({
            where:{
                id:hotelId
            },
            include:{rooms:true}
        })
        if(!hotel){
            return null
        }
        return hotel
    }catch (error){
        throw new Error(String(error))
    }
}