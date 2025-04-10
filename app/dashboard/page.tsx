import ClientComponent from "@/components/client-component";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

 

  const user = session?.user;
  return (
    <div className='mt-10 text-center container mx-auto'>
      <h1 className='text-2xl font-bold underline'>Welcome to the dashboard</h1>
      <ul>
        <li>Name: {user?.name}</li>
        <li>Email: {user?.email}</li>
      </ul>
      <ClientComponent />
    </div>
  );
}