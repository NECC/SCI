import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function ServerComponentExample() {
    const session = await getServerSession(authOptions);
    // console.log("Session: ",session)
  
    return (
        <div>
            <h1>Server Component Example {session?.user.name}</h1>
        </div>
    );
}