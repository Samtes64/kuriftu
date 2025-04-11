import UserCard from "@/components/user-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export default async function DashboardPage() {
	const [session, activeSessions] =
		await Promise.all([
			auth.api.getSession({
				headers: await headers(),
			}),
			auth.api.listSessions({
				headers: await headers(),
			}),
			
		]).catch((e) => {
			console.log(e);
			throw redirect("/sign-in");
		});
	return (
		<div className="w-full">
			<div className="flex gap-4 flex-col">
				
				<UserCard
					session={JSON.parse(JSON.stringify(session))}
					activeSessions={JSON.parse(JSON.stringify(activeSessions))}
					
				/>
				
			</div>
		</div>
	);
}