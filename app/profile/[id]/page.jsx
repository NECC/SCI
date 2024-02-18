"use client";

import Activity from "@app/schedule/Activity";
import QRCode from "easyqrcodejs";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Spinner, ButtonGroup } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Line } from "@components/Line";
import ActivityDayFilter from "@components/ActivityDayFilter";
import { getUserEnrolledActivitiesGroupedByDay } from "@app/actions";

export default function Profile({ params: { id } }) {
  const [user, setUser] = useState({});
  const [place, setPlace] = useState(0);
  const [firstPlace, setFirstPlace] = useState(0);
  const [activeScreen, setActiveScreen] = useState(0);
  let count = 1;
  let maxCount = 0;
  const router = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  // get profile user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get(`/api/users/${id}`);
      console.log(data);
      setUser(data.user);
    };
    getUser();
  }, [id]);

  useEffect(() => {
    const getUserPlace = async () => {
      // compares current user points with the rest of the users to determine current user's place and how many points first place has
      const { data } = await axios.get("/api/users");
      for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].points > user.points && data.users[i].id != user.id) {
          count++;
        }
        if (data.users[i].points > maxCount) {
          maxCount = data.users[i].points;
        }
      }
      setPlace(count);
      setFirstPlace(maxCount);
    };

    getUserPlace();
  }, [user]);

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-300 dark:bg-black h-screen bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
      <div className="gap-2 px-8 flex flex-col md:flex-row">
        <div className="flex flex-col flex-grow gap-2 p-2 justify-between">
          <div className="px-2 flex flex-col items-left">
            <ProfileNav
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
            />
            <div className="flex flex-row items-center">
              {activeScreen == 2 && <Line />}
              <Button
                radius={"none"}
                onClick={() => setActiveScreen(2)}
                className={
                  activeScreen != 2
                    ? "flex flex-col text-white bg-transparent"
                    : "-ml-1.5 overflow-visible flex flex-row bg-custombutton text-white"
                }
              >
                <p className="text-2xl font-extrabold leading-5 mt-1.5 mb-1 ml-[17px] mr-1.5">
                  {" "}
                  QRCODE{" "}
                </p>
              </Button>
            </div>
          </div>
        </div>

        {status != "loading" ? (
          <div className="bg-transparent w-full h-[625px]">
            {activeScreen == 0 ? (
              <ActivitiesSubscribed />
            ) : activeScreen == 1 ? (
              <Ranking user={user} place={place} firstPlace={firstPlace} />
            ) : activeScreen == 2 ? (
              <Code userId={id} />
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

const ProfileNav = ({ activeScreen, setActiveScreen }) => {
  return (
    <>
      <div className="flex flex-row items-center">
        {activeScreen == 0 && <Line />}
        <Button
          radius={"none"}
          onClick={() => setActiveScreen(0)}
          className={
            activeScreen != 0
              ? "flex flex-col text-white bg-transparent"
              : "-ml-1.5 overflow-visible flex flex-row bg-custombutton text-white"
          }
        >
          <p className="text-2xl font-extrabold leading-5 mt-1.5 mb-1 ml-[17px] mr-1.5">
            {" "}
            ENROLLED ACTIVITIES{" "}
          </p>
        </Button>
      </div>
      <div className="flex flex-row items-center">
        {activeScreen == 1 && <Line />}
        <Button
          radius={"none"}
          onClick={() => setActiveScreen(1)}
          className={
            activeScreen != 1
              ? "flex flex-col text-white bg-transparent"
              : "-ml-1.5 overflow-visible flex flex-row bg-custombutton text-white"
          }
        >
          <p className="text-2xl font-extrabold leading-5 mt-1.5 mb-1 ml-[17px] mr-1.5">
            {" "}
            RANKING{" "}
          </p>
        </Button>
      </div>
    </>
  );
};

const ActivitiesSubscribed = ({}) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([]);
  const [type, setType] = useState(null);

  const getDays = (activities) => {
    return activities.map(([day, _]) => day);
  };

  const getActivitiesOfDayAndType = (selectedDay, type) => {
    const activitiesOfDay = activities.find(([date]) => date === selectedDay);
    if (activitiesOfDay) {
      if (type) {
        return activitiesOfDay[1].filter((e) => e.type == type);
      }
      return activitiesOfDay[1];
    }
    return [];
  };

  const getWorkshopCount = () => {
    return getActivitiesOfDayAndType(selectedDay, "WORKSHOP").length;
  };

  const getOtherCount = () => {
    return getActivitiesOfDayAndType(selectedDay, "OTHER").length;
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getUserEnrolledActivitiesGroupedByDay();
      setActivities(data);
      setSelectedDay(getDays(data)[0]);
    };

    fetchActivities();
  }, []);

  return (
    <div className="dark:bg-black/40 flex flex-col">
      <div className="flex flex-col gap-y-1">
        <ActivityDayFilter
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          days={getDays(activities)}
        />
        <div className="mt-1 -mb-3 flex flex-row h-8">
          <ButtonGroup>
            <Button
              className={type == null && "bg-white text-black"}
              onClick={() => setType(null)}
            >
              All
            </Button>
            <Button
              className={type == "WORKSHOP" && "bg-white text-black"}
              onClick={() => setType("WORKSHOP")}
            >
              Workshops : {getWorkshopCount()}
            </Button>
            <Button
              className={type == "OTHER" && "bg-white text-black"}
              onClick={() => setType("OTHER")}
            >
              Others : {getOtherCount()}
            </Button>
          </ButtonGroup>
        </div>
        <div className="no-scrollbar flex flex-wrap gap-4 flex-col md:flex-row w-[300px] md:w-auto mt-8">
          {getActivitiesOfDayAndType(selectedDay, type).length == 0 ? (
            <p className="text-white h-[117px]">
              You aren't enrolled in an activity of this type
            </p>
          ) : (
            getActivitiesOfDayAndType(selectedDay, type).map((item, index) => (
              <div key={index}>
                <Activity item={item} attended={item.attended} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Ranking = ({ user, place, firstPlace }) => {
  return (
    <div className="dark:bg-black/40 flex flex-col ">
      <div className="px-1">
        <h2 className="dark:text-white font-semibold text-l"> Ranking </h2>
        <div>
          <p> Tens {user.points} pontos </p>
          <p> Estás em {place}º lugar </p>
          {place > 1 ? <p> O primeiro lugar têm {firstPlace} pontos</p> : <></>}
        </div>
      </div>
    </div>
  );
};

const Code = ({ userId }) => {
  const qrcode = useRef(null);
  const currentUrl =
    process.env.NEXT_PUBLIC_MODE == "development"
      ? process.env.NEXT_PUBLIC_BACKOFFICE_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_BACKOFFICE_URL_PRODUCTION;
  console.log(currentUrl);
  useEffect(() => {
    var options = {
      text: "Bem-vindo ao evento",
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    };

    const code = new QRCode(qrcode.current, options);
    code.makeCode(`${currentUrl}/ranking/${userId}`);
    return () => code.clear();
  }, [qrcode, currentUrl, userId]);

  return (
    <div className="dark:bg-black/40 flex flex-col ">
      <div className="px-1">
        <h2 className="dark:text-white font-semibold text-l"> QRCode </h2>
        <div ref={qrcode}></div>
      </div>
    </div>
  );
};
