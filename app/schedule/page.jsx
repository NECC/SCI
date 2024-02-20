"use client";

import Nav from "@components/Nav";
import React, { useEffect, useState } from "react";
import { Chip, Spinner } from "@nextui-org/react";
import { getActivitiesGroupedByDay } from "@app/actions";
import Activity from "./Activity";
import ActivityDayFilter from "@components/ActivityDayFilter";

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDays = (activities) => {
    return activities.map(([day, _]) => day);
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
      activitiesOfDay && activitiesOfDay[1] ? activitiesOfDay[1] : []
    );
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivitiesGroupedByDay();
      setActivities(data);
      setSelectedDay(getDays(data)[0]);
      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-300 dark:bg-black bg-[url('/rectangle_light.png')] dark:bg-[url('/rectangle.png')] h-screen bg-no-repeat bg-top bg-cover">
      <div className="p-2 pb-10 md:p-7 md:px-8 h-full">
        <div className="w-full h-full">
          <ActivityDayFilter
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            days={getDays(activities)}
          >
            {!loading ? (
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
                                <Activity item={item} attended={false} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </React.Fragment>
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
    </div>
  );
}
