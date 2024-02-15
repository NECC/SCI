"use client";

import Nav from "@components/Nav";
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  ButtonGroup,
  Chip,
} from "@nextui-org/react";
import { createMedia } from "@artsy/fresnel";
import { getActivities } from "@app/actions";
import Activity from "./Activity";
import { ArrowRight } from "@components/ArrowRight";

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
        <div className="p-2 pb-10 md:p-7 md:px-8 h-full">
          <div className="w-full h-full">
            <Media greaterThan="sm" className="mx-auto">
              <div className="flex flex-row items-center w-full justify-center text-white gap-10 bg-gradient-to-r from-transparent from-20% via-custom-blue-1/60 to-transparent to-80%">
                {getDays(activities).map((day) => (
                  <div
                    key={day}
                    className="flex flex-row items-center"
                    onClick={() => setSelectedDay(day)}
                  >
                    {selectedDay === day && (
                      <>
                        <ArrowRight className="rotate-180" />
                        <div className="flex flex-col items-center mx-5">
                          <h1 className="text-2xl font-bold">{day}</h1>
                          <h2 className="uppercase text-lg">March</h2>
                        </div>
                        <ArrowRight />
                      </>
                    )}

                    {selectedDay !== day && (
                      <h1 className="text-2xl font-bold opacity-50">{day}</h1>
                    )}
                  </div>
                ))}
              </div>
            </Media>
            <div className="flex flex-col md:flex-row mt-5">
              <div className="flex flex-col md:flex-row">
                {getActivitiesOfDay(selectedDay).map(
                  ([startTime, activities]) => (
                    <React.Fragment key={startTime}>
                      <Chip className="bg-custom-yellow-1 text-black md:mb-0 z-10">
                        {startTime}
                      </Chip>
                      <div className="flex flex-row md:flex-col">
                        <div className="bg-white p-[1px] mx-3 md:h-[2px] md:my-3 md:mx-0 md:w-auto"></div>
                        <div className="flex flex-row md:flex-col p-5 overflow-scroll hide-scroll gap-3 -translate-y-4 md:translate-y-0 md:-translate-x-10 md:-mr-5">
                          {activities.map((item, index) => (
                            <div key={index}>
                              <Activity item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          </div>
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
