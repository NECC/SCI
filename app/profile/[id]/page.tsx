"use client";

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import QRCode from "easyqrcodejs";

// UI Components
import {
  Button,
  Spinner,
  ButtonGroup,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@nextui-org/react";

// Icons & Custom Components
import { LineDots } from "@components/LineDots";
import ActivityDayFilter from "@components/ActivityDayFilter";
import MinimalArrowDown from "@components/MinimalArrowDown";
import Activity from "@app/profile/[id]/Activity";

// Types
import { UserGetResponse } from "@app/api/users/[id]/route";
import { EnrollmentGetByUserIdResponse } from "@app/api/enrollments/getById/[userId]/route";
import { Activity as ActivityI } from "@prisma/generated/zod";

type UserData = UserGetResponse["user"];

// --- Main Profile Component ---

export default function Profile() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  const [user, setUser] = useState<UserData | null>(null);
  const [activeScreen, setActiveScreen] = useState("enrolled");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get<UserGetResponse>(`/api/users/${id}`);
      if (data.response === "success") {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error fetching user", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (status === "loading" || (isLoading && !user)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-custom-blue-1">
        <Spinner color="white" size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-custom-blue-1 to-custom-blue-3 h-screen bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
      <div className="p-5 md:p-7 flex flex-col md:flex-row h-full">
        {/* Navigation Sidebar */}
        <div className="flex flex-col flex-grow gap-2 justify-between md:max-w-[300px]">
          <div className="flex flex-col items-left">
            {user && (
              <ProfileNav
                user={user}
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
              />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-transparent w-full h-full">
          {activeScreen === "info" && user && (
            <ProfileInfo user={user} refreshUser={fetchUser} />
          )}
          {activeScreen === "enrolled" && (
            <ActivitiesSubscribed userId={id} />
          )}
          {activeScreen === "badges" && user && (
            <div className="p-4 md:p-8">
              <h2 className="text-white text-3xl font-extrabold mb-8 uppercase tracking-tighter">Earned Badges</h2>
              <UserBadges user={user} />
            </div>
          )}
          {activeScreen === "cv" && user && (
            <div className="p-4 md:p-8">
              <h2 className="text-white text-3xl font-extrabold mb-8 uppercase tracking-tighter">Curriculum Vitae</h2>
              <UserCV user={user} refreshUser={fetchUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Navigation Sub-Component ---

const ProfileNav = ({
  user,
  activeScreen,
  setActiveScreen,
}: {
  user: UserData;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}) => {
  const items = [
    { key: "info", label: "Info" },
    { key: "enrolled", label: "Enrolled Activities" },
    { key: "badges", label: "Badges" },
    { key: "cv", label: "C.V." },
  ];

  const handleAction = (key: string) => {
    setActiveScreen(key);
  };

  const currentLabel = items.find((v) => v.key === activeScreen)?.label || "Menu";

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="flex flex-row items-center md:hidden mb-6">
        <Dropdown>
          <DropdownTrigger>
            <Button
              disableRipple
              radius="none"
              className="py-2 w-full h-fit justify-start overflow-visible flex flex-row bg-custombutton text-white relative border-l-2 border-yellow-300"
            >
              <div className="bg-yellow-300 h-4 w-4 rounded-full absolute -top-2 -left-2" />
              <div className="bg-yellow-300 h-4 w-4 rounded-full absolute -bottom-2 -left-2" />
              <div className="flex gap-3 justify-start items-center w-full">
                <Avatar src={user?.picture || "/user.svg"} size="md" className="bg-custom-blue-3 border-1 border-white/50" />
                <div className="flex flex-1 flex-col items-start text-left">
                  <p className="text-xl uppercase font-black">{currentLabel}</p>
                  <p className="text-sm opacity-70">{user?.name}</p>
                </div>
                <MinimalArrowDown className="rotate-90" />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Navigation" 
            selectionMode="single"
            selectedKeys={[activeScreen]}
            onAction={(key) => handleAction(key as string)}
          >
            {items.map((item) => (
              <DropdownItem key={item.key}>{item.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Desktop Sidebar Nav */}
      <div className="hidden md:block">
        {items.map((item) => (
          <div key={item.key} className="flex flex-row items-center">
            <Button
              disableRipple
              radius="none"
              onClick={() => handleAction(item.key)}
              className={
                activeScreen !== item.key
                  ? "pl-3 flex flex-col text-white/60 hover:text-white bg-transparent py-7 transition-all"
                  : "pl-3 py-7 w-full justify-start overflow-visible flex flex-row bg-custombutton text-white font-extrabold border-l-2 border-yellow-300"
              }
            >
              {activeScreen === item.key && <LineDots />}
              <p className="text-2xl leading-5 uppercase tracking-tighter">{item.label}</p>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

// --- Badges Sub-Component ---

const UserBadges = ({ user }: { user: UserData }) => {
  if (!user.achievements || user.achievements.length === 0) {
    return <p className="text-white/60 italic">No badges earned yet!</p>;
  }

  return (
    <div className="flex flex-row flex-wrap gap-6">
      {user.achievements.map((item) => {
        const fileName = item.type ? item.type.toLowerCase().replace(/\s+/g, '-') : 'default';
        return (
          <div key={item.achievement_id} className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-36 hover:scale-105 transition-transform">
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <img
                src={`/assets/badges/${fileName}.png`}
                alt={item.type}
                className="max-w-full max-h-full object-contain"
                onError={(e) => (e.currentTarget.src = '/assets/badges/default.png')}
              />
            </div>
            <p className="text-white text-[10px] font-black text-center uppercase tracking-widest">{item.type}</p>
          </div>
        );
      })}
    </div>
  );
};

// --- Activities Sub-Component ---

const ActivitiesSubscribed = ({ userId }: { userId: string }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [activities, setActivities] = useState<[string, Array<ActivityI & { attended: boolean }>][]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get<EnrollmentGetByUserIdResponse>(`/api/enrollments/getById/${userId}`);
      const groups = data.enrollment.reduce((acc: any, e) => {
        const dateKey = new Date(e.activity.date).getUTCDate().toString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push({ ...e.activity, attended: e.attended });
        return acc;
      }, {});

      const sorted = Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b)) as [string, any[]][];
      setActivities(sorted);
      if (sorted.length > 0) setSelectedDay(sorted[0][0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentActivities = useMemo(() => {
    const dayData = activities.find(([d]) => d === selectedDay);
    if (!dayData) return [];
    return filterType ? dayData[1].filter((a) => a.type === filterType) : dayData[1];
  }, [activities, selectedDay, filterType]);

  return (
    <div className="flex flex-col">
      <ActivityDayFilter selectedDay={selectedDay} setSelectedDay={setSelectedDay} days={activities.map(([d]) => d)}>
        {loading ? <Spinner color="white" className="mt-10" /> : (
          <div className="md:ml-8 mt-8">
            <ButtonGroup className="mb-8 bg-white/10 p-1 rounded-lg">
              {["All", "WORKSHOP", "TERTULIA","TALK","OTHER"].map((t) => (
                <Button
                  key={t}
                  size="sm"
                  className={(filterType === t || (t === "All" && !filterType)) ? "bg-white text-black" : "bg-transparent text-white"}
                  onClick={() => setFilterType(t === "All" ? null : t)}
                >
                  {t === "All" ? "All" : t.charAt(0) + t.slice(1).toLowerCase() + "s"}
                </Button>
              ))}
            </ButtonGroup>
            <div className="flex flex-wrap gap-4">
              {currentActivities.length === 0 ? <p className="text-white/50">No activities found.</p> : 
                currentActivities.map((item, idx) => <Activity key={idx} item={item} userId={userId} />)
              }
            </div>
          </div>
        )}
      </ActivityDayFilter>
    </div>
  );
};

// --- Profile Info Sub-Component ---

const ProfileInfo = ({ user, refreshUser }: { user: UserData; refreshUser: () => void }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      await axios.put(`/api/users/${user.id}`, { name, picture: user.picture });
      setEditMode(false);
      refreshUser();
    } catch (e: any) {
      setError(e.response?.data?.error || "Save failed");
    }
  };

  return (
    <div className="flex flex-col gap-10 p-4 md:p-8 max-w-2xl">
      <div className="flex items-center gap-6">
        <Avatar src={user.picture || "/user.svg"} className="w-24 h-24 text-large ring-2 ring-white/20" />
        <div className="flex flex-col gap-2">
          {editMode ? (
            <Input variant="underlined" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="text-white" />
          ) : (
            <h1 className="text-white text-4xl font-black uppercase tracking-tighter">{user.name}</h1>
          )}
          <p className="text-white/60 font-mono text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Points</p>
          <p className="text-3xl text-white font-black">{user.points}</p>
        </div>
        {user.graduation && (
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Course</p>
            <p className="text-xl text-white font-bold truncate">{user.graduation}</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button size="sm" variant="flat" className="text-white border-white/20" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </Button>
        {editMode && <Button size="sm" color="success" onClick={handleSave}>Save Changes</Button>}
      </div>

      <Code id={user.id} />
    </div>
  );
};

// --- QR Code Sub-Component ---

const Code = ({ id }: { id: string }) => {
  const qrcodeContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!qrcodeContainer.current) return;
    qrcodeContainer.current.innerHTML = "";
    new QRCode(qrcodeContainer.current, {
      text: `spend;${id}`,
      width: 160,
      height: 160,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }, [id]);

  return (
    <div className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/10 mt-10">
      <div className="p-3 bg-white rounded-2xl shadow-2xl" ref={qrcodeContainer} />
      <p className="text-white/40 text-[10px] mt-4 uppercase font-black tracking-[0.2em]">Your Entry Pass</p>
    </div>
  );
};


const UserCV = ({ user, refreshUser }: { user: UserData; refreshUser: () => void }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File is too large. Max 5MB.");

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      await axios.post(`/api/users/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      refreshUser();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-white w-full max-w-xl">
      <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
        <h3 className="text-sm font-black uppercase tracking-widest mb-2">Upload New CV</h3>
        <p className="text-xs opacity-50 mb-4">Accepted: .pdf, .doc, .docx (Max 5MB)</p>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileUpload} 
            disabled={uploading}
            className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer disabled:opacity-50" 
          />
          {uploading && <Spinner size="sm" color="white" />}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-black uppercase tracking-widest opacity-40">Your Documents</h3>
        {user.cvs && user.cvs.length > 0 ? user.cvs.map((cv, i) => (
          <div key={`${cv.candidateId}-${i}`} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
            <div>
              <p className="font-bold text-sm">{cv.fileName}</p>
              <p className="text-[10px] opacity-40 uppercase">Uploaded: {new Date(cv.uploadedAt).toLocaleDateString()}</p>
            </div>
            <Button size="sm" as="a" href={cv.fileUrl} target="_blank" variant="flat" color="primary">View</Button>
          </div>
        )) : <p className="text-white/30 italic text-sm">No files uploaded yet.</p>}
      </div>
    </div>
  );
};