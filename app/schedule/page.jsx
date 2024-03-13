"use client";

import React, { useEffect, useState } from "react";
import { Chip, Spinner } from "@nextui-org/react";
import Activity from "./Activity";
import ActivityDayFilter from "@components/ActivityDayFilter";
import axios from "axios";
import { useSession } from "next-auth/react";
import { set } from "zod";

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const { data: session, status } = useSession({
    required: false,
  });

  const getActivitiesGroupedByDay = async () => {
    const { data } = await axios.get(`/api/activities`);

    const activities = data.activities;

    return groupAndSortActivitiesByDay(
      activities.map((activity) => {
        return {
          ...activity,
          enrollable: activity.capacity > activity.enrollments.length && activity.type === "WORKSHOP",
          alreadyEnrolled: activity.enrollments.some(
            (enrollment) => enrollment.userId === session?.user.id
          ),
          attended: activity.enrollments.some(
            (enrollment) => enrollment.userId === session?.user.id && enrollment.attended === true
          ),
        };
      })
    );
  };

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
    // console.log( groupActivitiesByStartTime(
    //   activitiesOfDay && activitiesOfDay[1] ? activitiesOfDay[1] : []
    // ))
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
      if (session?.user.id) {
        setUserId(session.user.id);
      }
      // console.log("Data: ", data)
    };
    fetchActivities();
  }, [status]);

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

  return (
    <div className="bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 dark:bg-black dark:bg-[url('/rectangle.png')] min-h-screen bg-no-repeat bg-top bg-cover">
      <div className="pb-10 h-full">
        <div className="p-5 md:p-7 w-full h-full">
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
                          <div className="flex flex-row md:flex-col p-2 overflow-scroll hide-scroll gap-3 -translate-y-4 md:translate-y-0 md:-translate-x-10 md:-mr-5">
                            {activities.map((item, index) => (
                              <div key={index}>
                                <Activity item={item} userId={userId} />
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