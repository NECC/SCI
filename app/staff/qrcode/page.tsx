"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserPutRouletteResponse } from "@app/api/users/roulette/[id]/spend/route";
import { RankingPostResponse } from "@app/api/ranking/route";
import { EnrollmentAttendQRCodePostResponse } from "@app/api/enrollments/attend/qrcode/route";
import { UserUpdateResponse } from "@app/api/users/[id]/route";
import { ActivityPointsResponse } from "@app/api/activities/[id]/points/route";

export default function QRCodeReader() {
const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
}>({ user: null, loaded: false });
const [pause, setPause] = useState(false);
const [success, setSuccess] = useState(false);

const router = useRouter();

//   console.log(ids);
const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
    router.push("/api/auth/signin");
    },
});

useEffect(() => {
    if (session) {
    setUser({ user: session.user, loaded: true });
    }
}, [session]);

const handleScan = async (data: string) => {
    setPause(true);
    const [action, userId, acticityId] = data.split(";");
    if (action == "attend") {
        setPause(true);
        const res = await axios.post<EnrollmentAttendQRCodePostResponse>(
        `/api/enrollments/attend/qrcode`,
        {
            userId: userId,
            activityId: parseInt(acticityId),
        }
        );

        const res2 = await axios.post<RankingPostResponse>("/api/ranking", {
        id: userId,
        });

        const res3 = await axios.put<ActivityPointsResponse>(
        `api/activities/${acticityId}`
        );

        if (res3.data.response !== "error") {
        const res4 = await axios.put<UserUpdateResponse>(
            `/api/users/${userId}`,
            { points: res3.data.points }
        );
        }

        router.push("/");
    }
    else if (action == "spend"){

        const res = await axios.post<UserPutRouletteResponse>(`/api/users/roulette/${userId}/spend`);

        if (res.data.response == "success") {
        setSuccess(true);
        }
    }
    setPause(false);
};

if (status == "loading") return <p>Loading...</p>;
if (user.user?.role == "USER" && user.loaded) router.push("/");

return (
    <div className="flex justify-center flex-col items-center w-full h-screen bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
    <Scanner
    formats={[
        "qr_code",
        "micro_qr_code",
        "rm_qr_code",
        "maxi_code",
        "pdf417",
        "aztec",
        "data_matrix",
        "matrix_codes",
        "dx_film_edge",
        "databar",
        "databar_expanded",
        "codabar",
        "code_39",
        "code_93",
        "code_128",
        "ean_8",
        "ean_13",
        "itf",
        "linear_codes",
        "upc_a",
        "upc_e",
    ]}
    onScan={(detectedCodes) => {
        handleScan(detectedCodes[0].rawValue);
    }}
    onError={(error) => {
        console.log(`onError: ${error}'`);
    }}
    styles={{ container: { height: "400px", width: "350px" } }}
    components={{
        audio: true,
        onOff: true,
        torch: true,
        zoom: true,
        finder: true,
    }}
    allowMultiple={true}
    scanDelay={2000}
    paused={pause}
    />
    </div>
);
}