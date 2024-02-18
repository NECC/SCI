import React from "react";
import { ArrowRight } from "./ArrowRight";

function ActivityDayFilter({selectedDay, setSelectedDay, days}) {
  return (
    <div className="hidden md:flex flex-row items-center w-full justify-center text-white gap-10 bg-gradient-to-r from-transparent from-20% via-custom-blue-1/60 to-transparent to-80%">
      {days.map((day) => (
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
  );
}

export default ActivityDayFilter;
