"use client";

import Nav from "@components/Nav";
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
import { createMedia } from "@artsy/fresnel";
import { FaLongArrowAltRight } from "react-icons/fa";
import { getActivities } from "@app/actions";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 768,
    lg: 1024,
    xl: 1192,
  },
});

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([]);

  const getDays = (activities) => {
    return activities.map(([day, _]) => day);
  };

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

  const getActivitiesOfDay = (selectedDay) => {
    const activitiesOfDay = activities.find(([date]) => date === selectedDay);
    return groupActivitiesByStartTime(
      activitiesOfDay ? activitiesOfDay[1] : []
    );
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities();
      const groupedByDay = groupActivitiesByDay(data);
      setActivities(groupedByDay);
      setSelectedDay(getDays(groupedByDay)[0]);
    };

    fetchActivities();
  }, []);

  return (
    <MediaContextProvider>
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
              <Media greaterThan="sm" className="mx-auto">
                <div className="mx-auto flex items-center gap-3">
                  <h2>Day</h2>
                  <ButtonGroup>
                    {getDays(activities).map((day) => (
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
              </Media>
            </CardHeader>
            <CardBody className="flex flex-col md:flex-row">
              <div className="flex flex-col md:flex-row gap-3">
                {getActivitiesOfDay(selectedDay).map(
                  ([startTime, activities]) => (
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
                                className="min-w-[18rem] max-w-[300px]"
                                shadow="sm"
                              >
                                <CardBody className="gap-2 p-5 rounded-2xl">
                                  {item.speakers && (
                                    <p className="text-tiny text-black/60 dark:text-white/60 uppercase font-bold mb-1">
                                      {item.type}
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
                                  {item.enrollable && (
                                    <div>
                                      <Button
                                        className="mt-4"
                                        size="sm"
                                        radius="full"
                                        color="primary"
                                        variant="solid"
                                        endContent={<FaLongArrowAltRight />}
                                      >
                                        Enroll
                                      </Button>
                                    </div>
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
                  )
                )}
              </div>
            </CardBody>
          </Card>
        </div>
        <Media at="sm">
          <div className="absolute bottom-3 w-full flex">
            <Card className="mx-auto p-2">
              <ButtonGroup>
                {getDays(activities).map((day) => (
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
        </Media>
      </div>
    </MediaContextProvider>
  );
}
