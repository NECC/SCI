import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default function ServerComponentExample(props) {
    const { session } = props
    return (
        <div>
            <h1>Server Component Example {session?.user.name}</h1>
        </div>
    );
}