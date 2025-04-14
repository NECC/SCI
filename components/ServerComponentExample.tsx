import { authOptions } from "@/lib/auth";
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