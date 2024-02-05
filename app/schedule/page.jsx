"use client";

import Nav from "@components/Nav";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  ButtonGroup,
  Chip,
} from "@nextui-org/react";
import { CiMapPin } from "react-icons/ci";
import { useMediaQuery } from "react-responsive";

export default function Schedule() {
  const courses = [
    "BIOQUIMICA",
    "CIENCIAS",
    "MATEMATICA",
    "FISICA",
    "QUIMICA",
    "BIOLOGIA",
    "HISTORIA",
    "GEOGRAFIA",
    "PORTUGUES",
    "INGLES",
    "ESPANHOL",
    "ARTES",
    "EDUCACAO FISICA",
    "FILOSOFIA",
    "SOCIOLOGIA",
    "LITERATURA",
    "REDAÇÃO",
    "ATUALIDADES",
    "PROJETO DE VIDA",
    "TECNOLOGIA",
    "EMPREENDEDORISMO",
    "METODOLOGIA CIENTIFICA",
  ];
  const getRandomCourse = () => {
    return courses[Math.floor(Math.random() * courses.length)];
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const [days, setDays] = useState([]);
  const [rowsOfDay, setRowsOfDay] = useState([]);
  const [groupedByDay, setGroupedByDay] = useState([]);

  const groupActivitiesByDay = (activities) => {
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

  const groupActivitiesByStartTime = (activities) => {
    // Group activities by startTime
    const groups = activities.reduce((groups, activity) => {
      const group = groups[activity.startTime] || [];
      group.push(activity);
      groups[activity.startTime] = group;
      return groups;
    }, {});

    // Convert groups to an array and sort by startTime
    return Object.entries(groups).sort(([startTimeA], [startTimeB]) => {
      // split startTime into hours and minutes
      const [hoursA, minutesA] = startTimeA.split(":");
      const [hoursB, minutesB] = startTimeB.split(":");

      return hoursA - hoursB || (hoursA == hoursB && minutesA - minutesB);
    });
  };

  useEffect(() => {
    const getActivitiesOfDay = (day) => {
      const activitiesOfDay = groupedByDay.find(([date]) => date === day);
      return activitiesOfDay ? activitiesOfDay[1] : [];
    };

    setRowsOfDay(groupActivitiesByStartTime(getActivitiesOfDay(selectedDay)));
  }, [selectedDay, groupedByDay]);

  useEffect(() => {
    const getActivities = async () => {
      const { data } = await axios.get("/api/activities");
      const groupedByDay = groupActivitiesByDay(data.activities);
      setGroupedByDay(groupedByDay);
      const days = groupedByDay.map(([day, activities]) => day);
      setDays(days);
      setSelectedDay(days[0]);
    };
    getActivities();
  }, []);

  const isBelowMd = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="bg-white dark:bg-black bg-[url('/rectangle_light.png')] dark:bg-[url('/rectangle.png')] h-screen bg-no-repeat bg-top bg-cover">
      <Nav />
      <div className="p-2 pb-10 md:p-7 md:px-8 pt-[70px] md:pt-[100px] h-full">
        <Card isBlurred className="w-full h-full">
          <CardHeader className="dark:bg-black/40 border-b-1 dark:border-default-600 dark:border-default-100">
            <div className="flex gap-2 items-center p-2">
              <div className="flex flex-col dark:text-white/90">
                <h2 className="uppercase font-black text-2xl">Schedule</h2>
                <p className="text-sm">Forest Day</p>
              </div>
            </div>
            <div
              className={`mx-auto flex items-center gap-3 ${
                isBelowMd ? "hidden" : ""
              }`}
            >
              <h2>Day</h2>
              <ButtonGroup>
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "solid" : "bordered"}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col md:flex-row">
            <div className="flex flex-col md:flex-row gap-3">
              {rowsOfDay.map(([startTime, activities]) => (
                <React.Fragment key={startTime}>
                  <Chip className="bg-[#B8E2FF] text-black md:mb-0 z-10">
                    {startTime}
                  </Chip>
                  <div className="flex flex-row md:flex-col">
                    <div className="bg-black dark:bg-white p-[0.5px] mx-3 md:h-[1px] md:my-3 md:mx-0 md:w-auto"></div>
                    <div className="flex flex-row md:flex-col p-5 overflow-scroll hide-scroll gap-3 -translate-y-4 md:translate-y-0 md:-translate-x-10 md:-mr-5">
                      {activities.map((item, index) => (
                        <a href={`/schedule/${item.id}`} key={index}>
                          <Card
                            className="min-w-[200px] max-w-[300px]"
                            shadow="sm"
                          >
                            <CardBody className="gap-2 p-5 rounded-2xl">
                              {item.speakers && (
                                <p className="text-tiny text-black/60 dark:text-white/60 uppercase font-bold mb-1">
                                  {getRandomCourse()}
                                </p>
                              )}
                              <h4 className="dark:text-white/90 font-bold text-xl">
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-small dark:text-white/60 font-medium">
                                  {item.description}
                                </p>
                              )}
                            </CardBody>
                            {(item.location || item.speakers) && (
                              <CardFooter className="flex flex-row gap-2 p-3 px-5 bg-gray-200 dark:bg-gray-700/50 mt-1">
                                <Image
                                  src="https://avatars.githubusercontent.com/u/44109954?v=4"
                                  alt="logo"
                                  width={30}
                                  height={30}
                                />
                                <p className="text-tiny dark:text-white/60 font-medium">
                                  {item.speakers}
                                </p>
                                {item.location && (
                                  <div className="flex flex-row ml-auto pl-5 items-center">
                                    <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                                      {item.location}
                                    </p>
                                    <CiMapPin className="inline ml-2" />
                                  </div>
                                )}
                              </CardFooter>
                            )}
                          </Card>
                        </a>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
      {isBelowMd && (
        <div className="absolute bottom-3 w-full flex">
          <Card className="mx-auto p-2">
            <ButtonGroup>
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "solid" : "bordered"}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </Button>
              ))}
            </ButtonGroup>
          </Card>
        </div>
      )}
    </div>
  );
}
