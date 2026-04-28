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

interface ProcessAttendanceResponse {
  success: boolean;
  error?: string;
}

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
  const router = useRouter();
  const devices = useDevices();

  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  useEffect(() => {
    if (session) {
      setUser({ user: session.user, loaded: true });
      
      if (session.user.role === "USER") {
        router.push("/");
      }
    }
  }, [session, router]);

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

  const triggerSuccess = () => {
    setSuccess(true);
    setError(null); 
    setTimeout(() => {
      setSuccess(false);
    }, 3000); 
  };

  const triggerError = (message: string) => {
    setError(message);
    setSuccess(false); 
    setTimeout(() => {
      setError(null);
    }, 4000);
  };

  const handleScan = async (data: string) => {
    if (!data) {
      setPause(false);
      return;
    }

    try {
      const [action, userId, activityId] = data.split(";");

      // --- ATTEND LOGIC ---
      if (action === "attend" && userId && activityId) {
        const parsedActivityId = parseInt(activityId);
        
        if (isNaN(parsedActivityId)) {
            triggerError("Invalid Activity ID in QR Code.");
            return;
        }
        
        // One single call to your new unified endpoint
        const response = await axios.post<ProcessAttendanceResponse>(
        '/api/scan/process-attendance', 
        {
            userId,
            activityId: parsedActivityId
        }
        );

        if (response.data.success) {
            triggerSuccess();
        } else {
            triggerError("Transaction failed. No changes were made.");
        }

      // --- SPEND LOGIC (Restored) ---
      } else if (action === "spend" && userId) {
        const res = await axios.put<UserPutRouletteResponse>(
          `/api/users/roulette/${userId}/spend`
        );
        if (res.data.response === "success") {
          triggerSuccess();
        } else {
          triggerError("Failed to process spend action.");
        }

      // --- INVALID QR FORMAT ---
      } else {
        triggerError("Unrecognized QR code format.");
      }

    } catch (error) {
      console.error("Scan processing error:", error);
      triggerError("Network or server error. Please try again.");
    } finally {
      setTimeout(() => setPause(false), 1500);
    }
  };

  if (status === "loading" || (user.loaded && user.user?.role === "USER")) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col items-center w-full h-screen bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 relative">
      <div style={styles.controls} className="z-10">
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

      {success && (
        <div className="bg-green-500 p-4 rounded-md mt-4 transition-all absolute top-20 z-50 shadow-lg">
          <h1 className="text-white font-bold">Action Successful!</h1>
        </div>
      )}

      {error && (
        <div className="bg-red-500 p-4 rounded-md mt-4 transition-all absolute top-20 z-50 shadow-lg border-2 border-red-700">
          <h1 className="text-white font-bold text-center">Scan Failed</h1>
          <p className="text-white text-sm mt-1">{error}</p>
        </div>
      )}

      <Scanner
        formats={[
          "qr_code",
          "micro_qr_code",
          "rm_qr_code",
        ]}
        constraints={{
          deviceId: deviceId,
        }}
        onScan={(detectedCodes) => {
          if (detectedCodes.length > 0 && !pause) {
            setPause(true);
            handleScan(detectedCodes[0].rawValue);
          }
        }}
        onError={(err) => {
          console.error(`Scanner Error: ${err}`);
          triggerError("Camera error or unable to read QR code.");
        }}
        styles={{ container: { height: "400px", width: "350px" } }}
        components={{
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
    </div>
  );
}