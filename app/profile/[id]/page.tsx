"use client";

import Activity from "@app/profile/[id]/Activity";
import { RxCross1, RxColorWheel } from "react-icons/rx";
import QRCode from "easyqrcodejs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Button,
  Spinner,
  ButtonGroup,
  Avatar,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { LineDots } from "@components/LineDots";
import ActivityDayFilter from "@components/ActivityDayFilter";
import MinimalArrowDown from "@components/MinimalArrowDown";
import { UserGetResponse} from "@app/api/users/[id]/route";
import { EnrollmentGetByUserIdResponse } from "@app/api/enrollments/getById/[userId]/route";
import { Activity as ActivityI } from "@prisma/generated/zod";
import { UserPutRouletteResponse } from "@app/api/users/roulette/[id]/route";

export default function Profile() {
  const { id } = useParams() as { id: string };
  const [user, setUser] = useState<UserGetResponse["user"]>();
  const [activeScreen, setActiveScreen] = useState("enrolled");
  //const [badgesData, setBadgesData] = useState<UserGetResponse["user"] | null>(null);
  const router = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  // Fetch basic user profile
 const getUser = useCallback(async () => {
  try {
    const { data } = await axios.get<UserGetResponse>(`/api/users/${id}`);
    if (data.response === "success") {
      setUser(data.user);
      // We don't need setBadgesData anymore because 'user' already contains 'achievements'
    }
  } catch (err) {
    console.error("Error fetching user", err);
  }
}, [id]);

useEffect(() => {
  getUser();
}, [getUser]);

  return (
    <div className="bg-gradient-to-r from-custom-blue-1 to-custom-blue-3 h-screen bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
      <div className="p-5 md:p-7 flex flex-col md:flex-row h-full">
        <div className="flex flex-col flex-grow gap-2 justify-between">
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

        {status !== "loading" && user ? (
          <div className="bg-transparent w-full h-full">
            {activeScreen === "info" ? (
              <ProfileInfo id={id} />
            ) :activeScreen === "enrolled" ? (
              <ActivitiesSubscribed id={id} />
            ) : activeScreen === "badges" ? (
              <div className="p-4 md:p-8">
                <h2 className="text-white text-3xl font-extrabold mb-8 uppercase">Earned Badges</h2>
                {/* Pass the 'user' object directly */}
                {user ? <UserBadges user={user} /> : <Spinner color="white" />}
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <Spinner color="white" size="lg" />
        )}
      </div>
    </div>
  );
}

const ProfileNav = ({
  user,
  activeScreen,
  setActiveScreen,
}: {
  user: UserGetResponse["user"];
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([activeScreen]));

  const items = [
    { key: "enrolled", label: "Enrolled Activities" },
    { key: "badges", label: "Badges" },
    { key: "info", label: "Info" },
  ];

  const handleAction = (key: string) => {
    setActiveScreen(key);
    setSelectedKeys(new Set([key]));
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <Dropdown>
          <DropdownTrigger>
            <Button
              disableRipple
              radius="none"
              className="py-2 w-full h-fit justify-start overflow-visible flex flex-row bg-custombutton text-white relative border-l-2"
            >
              <div className="bg-yellow-300 h-4 w-4 rounded-full -translate-y-1/2 -translate-x-1/2 absolute top-0 left-0" />
              <div className="bg-yellow-300 h-4 w-4 rounded-full translate-y-1/2 -translate-x-1/2 absolute bottom-0 left-0" />
              <div className="flex gap-3 justify-start items-center w-full">
                <Avatar src="/user.svg" size="md" className="bg-custom-blue-3 p-1 border-1 border-white/50" />
                <div className="flex flex-1 flex-col items-start whitespace-break-spaces text-left">
                  <p className="text-xl uppercase font-extrabold">
                    {items.find((v) => v.key === activeScreen)?.label || "Unknown"}
                  </p>
                  <p className="">{user?.name}</p>
                </div>
                <MinimalArrowDown className="rotate-90" />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Navigation"
            items={items}
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onAction={(key) => handleAction(key as string)}
          >
            {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="hidden md:block">
        {items.map((item) => (
          <div key={item.key} className="flex flex-row items-center">
            <Button
              disableRipple
              radius="none"
              onClick={() => handleAction(item.key)}
              className={
                activeScreen !== item.key
                  ? "pl-3 flex flex-col text-white bg-transparent py-7"
                  : "pl-3 py-7 w-full justify-start overflow-visible flex flex-row bg-custombutton text-white font-extrabold border-l-2"
              }
            >
              {activeScreen === item.key && <LineDots />}
              <p className="text-2xl leading-5 uppercase">{item.label}</p>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

const UserBadges = ({ user }: { user: UserGetResponse["user"] }) => {
  const { achievements } = user;

  if (!achievements || achievements.length === 0) {
    return <p className="text-white/60 italic">No badges earned yet!</p>;
  }

  return (
    <div className="flex flex-row flex-wrap gap-6">
      {achievements.map((item) => {
        // 'type' is the name of the badge (e.g., "Workshop Master")
        const fileName = item.type ? item.type.toLowerCase().replace(/\s+/g, '-') : 'default';

        return (
          <div 
            key={item.id_achievement} 
            className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-36"
          >
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <img 
                src={`/assets/badges/${fileName}.png`} 
                alt={item.type}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.currentTarget.src = '/assets/badges/default.png'; }}
              />
            </div>
            <p className="text-white text-[10px] font-black text-center uppercase tracking-widest">
              {item.type}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const ActivitiesSubscribed = ({ id }: { id: string }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [activities, setActivities] = useState<[string, Array<ActivityI & { attended: boolean }>][]>([]);
  const [type, setType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const groupAndSortActivitiesByDay = useCallback((activities: Array<ActivityI & { attended: boolean }>) => {
    const groups = activities.reduce((acc: any, activity) => {
      const dateString = new Date(activity.date).getUTCDate().toString();
      if (!acc[dateString]) acc[dateString] = [];
      acc[dateString].push(activity);
      return acc;
    }, {});

    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b)) as [string, any[]][];
  }, []);

  const fetchData = useCallback(async () => {
    const { data } = await axios.get<EnrollmentGetByUserIdResponse>(`/api/enrollments/getById/${id}`);
    const grouped = groupAndSortActivitiesByDay(data.enrollment.map(e => ({ ...e.activity, attended: e.attended })));
    setActivities(grouped);
    if (grouped.length > 0) setSelectedDay(grouped[0][0]);
    setLoading(false);
  }, [id, groupAndSortActivitiesByDay]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDays = () => activities.map(([day]) => day);
  const getCurrentActivities = () => {
    const dayData = activities.find(([d]) => d === selectedDay);
    if (!dayData) return [];
    return type ? dayData[1].filter(a => a.type === type) : dayData[1];
  };

  return (
    <div className="dark:bg-black/40 flex flex-col">
      <ActivityDayFilter selectedDay={selectedDay} setSelectedDay={setSelectedDay} days={getDays()}>
        {!loading ? (
          <div className="md:ml-8 mt-8">
            <ButtonGroup className="mb-8">
              <Button className={!type ? "bg-white text-black" : "text-white"} onClick={() => setType(null)}>All</Button>
              <Button className={type === "WORKSHOP" ? "bg-white text-black" : "text-white"} onClick={() => setType("WORKSHOP")}>Workshops</Button>
              <Button className={type === "OTHER" ? "bg-white text-black" : "text-white"} onClick={() => setType("OTHER")}>Others</Button>
            </ButtonGroup>
            <div className="flex flex-wrap gap-4">
              {getCurrentActivities().length === 0 ? (
                <p className="text-white">No activities found.</p>
              ) : (
                getCurrentActivities().map((item, idx) => <Activity key={idx} item={item} userId={id} />)
              )}
            </div>
          </div>
        ) : <Spinner color="white" />}
      </ActivityDayFilter>
    </div>
  );
};

const ProfileInfo = ({ id }: { id: string }) => {
  const [user, setUser] = useState<UserGetResponse["user"]>();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [error, setError] = useState<string>();

  const loadUser = useCallback(async () => {
    const { data } = await axios.get<UserGetResponse>(`/api/users/${id}`);
    setUser(data.user);
    setName(data.user.name || "");
    setPictureUrl(data.user.picture || "");
  }, [id]);

  useEffect(() => { loadUser(); }, [loadUser]);

  const handleSave = async () => {
    try {
      await axios.put(`/api/users/${id}`, { name, picture: pictureUrl });
      setEditMode(false);
      loadUser();
    } catch (e: any) {
      setError(e.response?.data?.error || "Save failed");
    }
  };

  if (!user) return <Spinner color="white" />;

  return (
    <div className="flex flex-col gap-12 p-4 md:p-8">
      <div className="flex items-center gap-6">
        <Avatar src={user.picture || "/user.svg"} className="w-24 h-24 text-large" />
        <div className="flex flex-col">
          {editMode ? (
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <h1 className="text-white text-4xl font-black uppercase">{user.name}</h1>
          )}
          <p className="text-white/70">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 text-white">
        <div><p className="font-bold opacity-50">Points</p><p className="text-2xl">{user.points}</p></div>
        {user.graduation && <div><p className="font-bold opacity-50">Course</p><p className="text-2xl">{user.graduation}</p></div>}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setEditMode(!editMode)}>{editMode ? "Cancel" : "Edit Profile"}</Button>
        {editMode && <Button color="success" onClick={handleSave}>Save Changes</Button>}
      </div>
      <Code id={id} />
    </div>
  );
};

const Code = ({ id }: { id: string }) => {
  const qrcode = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!qrcode.current) return;
    qrcode.current.innerHTML = "";
    new QRCode(qrcode.current, {
      text: `spend;${id}`,
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });
  }, [id]);

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="p-4 bg-white rounded-xl" ref={qrcode} />
      <p className="text-white/40 text-xs mt-4 uppercase font-bold tracking-widest">Your Entry Pass</p>
    </div>
  );
};