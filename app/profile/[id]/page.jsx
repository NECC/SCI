"use client";

import Activity from "@app/schedule/Activity";
import QRCode from "easyqrcodejs";
import React, { useEffect, useRef, useState } from "react";
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
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LineDots } from "@components/LineDots";
import ActivityDayFilter from "@components/ActivityDayFilter";
import { ArrowRight } from "@components/ArrowRight";
import MinimalArrowDown from "@components/MinimalArrowDown";

export default function Profile({ params: { id } }) {
  const [user, setUser] = useState({});
  const [activeScreen, setActiveScreen] = useState("enrolled");
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
      // console.log(data);
      setUser(data.user);
    };
    getUser();
  }, [id]);

  return (
    <div className="bg-gradient-to-r from-custom-blue-1 to-custom-blue-3 h-screen bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
      <div className="p-5 md:p-7 flex flex-col md:flex-row h-full">
        <div className="flex flex-col flex-grow gap-2 justify-between">
          <div className="flex flex-col items-left">
            <ProfileNav
              user={user}
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
            />
          </div>
        </div>

        {status != "loading" ? (
          <div className="bg-transparent w-full h-full">
            {activeScreen == "enrolled" ? (
              <ActivitiesSubscribed id={id} />
            ) : activeScreen == "qrcode" ? (
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

const ProfileNav = ({ user, activeScreen, setActiveScreen }) => {
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set([activeScreen])
  );

  useEffect(() => {
    setActiveScreen(Array.from(selectedKeys).join(""));
  }, [selectedKeys, setActiveScreen]);

  const items = [
    {
      key: "enrolled",
      label: "Enrolled Activities",
    },
    {
      key: "qrcode",
      label: "QR Code",
    },
  ];

  return (
    <>
      <div className="flex flex-row items-center">
        <Dropdown>
          <DropdownTrigger>
            <Button
              disableRipple={true}
              radius={"none"}
              className="py-2 w-full h-fit justify-start overflow-visible flex flex-row bg-custombutton text-white relative border-l-2"
            >
              <div className="bg-yellow-300 h-4 w-4 rounded-full -translate-y-1/2 -translate-x-1/2 absolute top-0 left-0 "></div>
              <div className="bg-yellow-300 h-4 w-4 rounded-full translate-y-1/2 -translate-x-1/2 absolute bottom-0 left-0 "></div>
              <div className="flex gap-3 justify-start items-center w-full">
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  size="md"
                />
                <div className="flex flex-1 flex-col items-start whitespace-break-spaces text-left">
                  <p className="text-xl uppercase font-extrabold">
                    {items.find((v) => v.key == activeScreen).label}
                  </p>
                  <p className="">{user.name}</p>
                </div>
                <MinimalArrowDown className="rotate-90" />
                {/* <Image width={50} alt="" src={"/arrow-down.svg"} /> */}
              </div>
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Dynamic Actions"
            items={items}
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="hidden md:block">
        <div className="flex flex-row items-center">
          <Button
            disableRipple={true}
            radius={"none"}
            onClick={() => setSelectedKeys(new Set(["enrolled"]))}
            className={
              activeScreen != "enrolled"
                ? "pl-3 flex flex-col text-white bg-transparent py-7"
                : "pl-3 py-7 w-full justify-start overflow-visible flex flex-row bg-custombutton text-white font-extrabold border-l-2"
            }
          >
            {activeScreen == "enrolled" && <LineDots />}
            <p className="text-2xl leading-5">ENROLLED ACTIVITIES</p>
          </Button>
        </div>
        <div className="flex flex-row items-center">
          <Button
            disableRipple={true}
            radius={"none"}
            onClick={() => setSelectedKeys(new Set(["qrcode"]))}
            className={
              activeScreen != "qrcode"
                ? "pl-3 flex flex-col text-white bg-transparent py-7"
                : "pl-3 py-7 w-full justify-start overflow-visible flex flex-row bg-custombutton text-white font-extrabold border-l-2"
            }
          >
            {activeScreen == "qrcode" && <LineDots />}
            <p className="text-2xl leading-5">QRCODE</p>
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <div className="flex flex-col text-white bg-transparent py-7 pl-3">
          <p className="text-2xl leading-5"> PONTOS: {user.points} </p>
        </div>
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
      <div className="flex flex-col gap-y-1">
        <ActivityDayFilter
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          days={getDays(activities)}
        >
          {!loading ? (
            <div className="md:ml-8 mt-8">
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
                    Workshops: {getWorkshopCount()}
                  </Button>
                  <Button
                    className={type == "OTHER" && "bg-white text-black"}
                    onClick={() => setType("OTHER")}
                  >
                    Others: {getOtherCount()}
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
                      // console.log(item)
                      return (
                        <div key={index}>
                          <Activity item={item} userId={id} />
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>
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
    <div className="dark:bg-black/40 h-full md:ml-8 mt-8">
      <div className="px-5 md:px-1 gap-3 flex flex-col h-full">
        <h2 className="text-white font-normal text-2xl md:text-lg leading-5">
          {" "}
          Points: {user.points}{" "}
        </h2>
        <div className="flex flex-wrap content-center justify-center h-full">
          <div className="-mt-56 md:-mt-28 border-[12px] rounded-md border-white" ref={qrcode}></div>
        </div>
      </div>
    </div>
  );
};
