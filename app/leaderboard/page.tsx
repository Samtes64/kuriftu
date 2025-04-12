import ClientComponent from "@/components/client-component";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {MembershipService} from "@/lib/services/membership.service";


export default async function DashboardPage() {
    //here i will request from api the leaders board
    // const data = await fetch('/api/leaderboards')
    // console.log(data)
    const userList = [
        { user: "user1", points: 80 },
        { user: "user2", points: 150 },
        { user: "user3", points: 120 },
        { user: "user4", points: 90 },
        { user: "user5", points: 175 },
        { user: "user6", points: 60 },
        { user: "user7", points: 140 },
        { user: "user8", points: 110 },
        { user: "user9", points: 160 },
        { user: "user10", points: 130 }
    ]
    const sortedUserList = userList.sort((a, b) => b.points - a.points)
    const displayUser = sortedUserList.map(user => <div key={user.user} className='flex justify-between border-[1px] border-gray-300  rounded-md p-5'>
        <h2>{user.user}</h2>
        <div>
            <p>{user.points}</p>
        </div>
    </div>)
    return (
        <div className='mt-10 text-center container mx-auto p-10'>
            <h2>Leadersboard</h2>
            <div className='flex flex-col gap-5 mt-10'>
                {displayUser}
            </div>
        </div>
    );
}