"use client";
import { 
    Scanner,
    useDevices,
  outline,
  boundingBox,
  centerText,
 } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserPutRouletteResponse } from "@app/api/users/roulette/[id]/spend/route";
import { RankingPostResponse } from "@app/api/ranking/route";
import { EnrollmentAttendQRCodePostResponse } from "@app/api/enrollments/attend/qrcode/route";
import { UserUpdateResponse } from "@app/api/users/[id]/route";
import { ActivityPointsResponse } from "@app/api/activities/[id]/points/route";
import { RxDragHandleDots1 } from "@node_modules/react-icons/rx";

const styles = {
    container: {
      width: 400,
      margin: "auto",
    },
    controls: {
      marginBottom: 8,
    },
  };

export default function QRCodeReader() {
const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
}>({ user: null, loaded: false });

const [success, setSuccess] = useState(false);
const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [r, setR] = useState({response: "", points: 0, error: ""});

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

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
    const [action, userId, activityId] = data.split(";");
    if (action == "attend") {
        setPause(true);
        const res = await axios.post<EnrollmentAttendQRCodePostResponse>(
        `/api/enrollments/attend/qrcode`,
        {
            userId: userId,
            activityId: parseInt(activityId),
        }
        );  

        const res3 = await axios.put<ActivityPointsResponse>(
        `api/activities/${activityId}/points`
        );

        setR({response: res3.data.response,points: res3.data.points,error: res3.data.error});

        if (res3.data.response !== "error") {
        const res4 = await axios.put<UserUpdateResponse>(
            `/api/users/${userId}`,
            { points: res3.data.points }
        );
        //setError(res4.data.response);
        }


        router.push("/");
    }
    else if (action == "spend"){
        setPause(true);
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
        <div style={styles.controls}>
        <select onChange={(e) => setDeviceId(e.target.value)}>
          <option value={undefined}>Select a device</option>
          {devices.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <select
          style={{ marginLeft: 5 }}
          onChange={(e) => setTracker(e.target.value)}
        >
          <option value="centerText">Center Text</option>
          <option value="outline">Outline</option>
          <option value="boundingBox">Bounding Box</option>
          <option value={undefined}>No Tracker</option>
        </select>
      </div>
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
        constraints={{
            deviceId: deviceId,
          }}
        onScan={(detectedCodes) => {
            setPause(true);
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
            tracker: getTracker(),
        }}
        allowMultiple={true}
        scanDelay={2000}
        paused={pause}
        />
    {(success || pause) && (
        <div className="bg-green-500 p-4 rounded-md mt-4">
        <h1 className="text-white">Success; {r.error}; {r.response}; {r.points}</h1>
        </div>)}
    </div>
);
}