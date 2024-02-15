"use client";

import Nav from "@components/Nav";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  ButtonGroup,
  Chip,
} from "@nextui-org/react";
import { createMedia } from "@artsy/fresnel";
import { getActivities } from "@app/actions";
import Activity from "./Activity";

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
      <div className="bg-gradient-to-b from-sky-400 to-sky-300 dark:bg-black bg-[url('/rectangle_light.png')] dark:bg-[url('/rectangle.png')] h-screen bg-no-repeat bg-top bg-cover">
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
                            <div key={index}>
                              <Activity item={item} attended={false}/>
                            </div>
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
