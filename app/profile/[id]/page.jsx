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

export default function Profile({ params: { id } }) {
  const [user, setUser] = useState({});
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

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-300 dark:bg-black h-screen bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
      <div className="gap-2 p-2 md:p-7 flex flex-col md:flex-row h-full">
        <div className="flex flex-col flex-grow gap-2 p-2 justify-between">
          <div className="px-2 flex flex-col items-left">
            <ProfileNav
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
            />
          </div>
        </div>

        {status != "loading" ? (
          <div className="bg-transparent w-full h-full">
            {activeScreen == 0 ? (
              <ActivitiesSubscribed id={id} />
            ) : activeScreen == 2 ? (
              <Code user={user} id={id} />
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
        <Button
          disableRipple={true}
          radius={"none"}
          onClick={() => setActiveScreen(0)}
          className={
            activeScreen != 0
              ? "flex flex-col text-white bg-transparent py-7"
              : "pl-8 py-7 w-full justify-start overflow-visible flex flex-row bg-custombutton text-white font-extrabold"
          }
        >
          {activeScreen == 0 && <Line className="-ml-10" />}
          <p className="text-2xl leading-5">ENROLLED ACTIVITIES</p>
        </Button>
      </div>
      <div className="flex flex-row items-center">
        <Button
          disableRipple={true}
          radius={"none"}
          onClick={() => setActiveScreen(2)}
          className={
            activeScreen != 2
              ? "flex flex-col text-white bg-transparent py-7"
              : "pl-8 py-7 w-full justify-start overflow-visible flex flex-row bg-custombutton text-white font-extrabold"
          }
        >
          {activeScreen == 2 && <Line className="-ml-10" />}
          <p className="text-2xl leading-5">QRCODE</p>
        </Button>
      </div>
    </>
  );
};

const ActivitiesSubscribed = ({ id }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([]);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(id);

  // TODO: Move this to a helper function
  const groupAndSortActivitiesByDay = (activities) => {
    // Group activities by date
    const groups = activities.reduce((groups, activity) => {
      const date = new Date(activity.date);
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1; // Months are 0-based
      const year = date.getUTCFullYear();
      const dateString = `${day}`;

      const group = groups[dateString] || [];
      group.push(activity);
      groups[dateString] = group;
      return groups;
    }, {});

    // Convert groups to an array and sort by date
    return Object.entries(groups).sort(
      ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
    );
  };

  const getUserEnrolledActivitiesGroupedByDay = async () => {
    const enrollments = await axios.get(`/api/enrollments/getById/${id}`);
    const activities = enrollments.data.enrollment;

    return groupAndSortActivitiesByDay(
      activities.map((enrollment) => {
        return {
          ...enrollment.activity,
          attended: enrollment.attended,
        };
      })
    );
  };

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
      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="dark:bg-black/40 flex flex-col">
      <div className="flex flex-col gap-y-1 px-5 ">
        <ActivityDayFilter
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          days={getDays(activities)}
        >
          {!loading ? (
            <>
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
                    {"You aren't enrolled in an activity of this type"}
                  </p>
                ) : (
                  getActivitiesOfDayAndType(selectedDay, type).map(
                    (item, index) => {
                      console.log(item)
                      return (
                        <div key={index}>
                          <Activity item={item} userId={id} />
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </>
          ) : (
            <Spinner className="w-full" color="white" size="lg" />
          )}
        </ActivityDayFilter>
      </div>
    </div>
  );
};

const Code = ({ user, id }) => {
  const qrcode = useRef(null);
  const currentUrl =
    process.env.NEXT_PUBLIC_MODE == "development"
      ? process.env.NEXT_PUBLIC_BACKOFFICE_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_BACKOFFICE_URL_PRODUCTION;

  // console.log(currentUrl);

  useEffect(() => {
    var options = {
      text: "Bem-vindo ao evento",
      width: 300,
      height: 300,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    };

    const code = new QRCode(qrcode.current, options);
    code.makeCode(`${currentUrl}/admin/ranking/${id}`);
    return () => code.clear();
  }, [qrcode, currentUrl, id]);

  return (
    <div className="dark:bg-black/40 h-full">
      <div className="px-5 md:px-1 gap-3 flex flex-col h-full">
        <h2 className="text-white font-normal text-2xl md:text-lg leading-5">
          {" "}
          Points: {user.points}{" "}
        </h2>
        <div className="flex flex-wrap content-center justify-center h-full">
          <div className="-mt-56 md:-mt-28" ref={qrcode}></div>
        </div>
      </div>
    </div>
  );
};
