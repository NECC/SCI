import React from "react";
import { ArrowRight } from "./ArrowRight";
import { LineDots } from "./LineDots";

function ActivityDayFilter({ selectedDay, setSelectedDay, days, children }) {
  const setSelectedDayPrev = () => {
    // Find the index of the selected day and subtract 1 and if it's less than 0, set it to the first day
    const index = days.indexOf(selectedDay);
    setSelectedDay(days[index - 1] || days[0]);
  };

  const setSelectedDayNext = () => {
    // Find the index of the selected day and add 1 and if it's more than length(days), set it to the last day
    const index = days.indexOf(selectedDay);
    setSelectedDay(days[index + 1] || days[days.length - 1]);
  };

  return (
    <>
      <div className="hidden md:flex flex-row items-center w-full justify-center text-white gap-10 bg-gradient-to-r from-transparent from-20% via-custom-blue-2/80 to-transparent to-80%">
        {days.map((day) => (
          <div key={day} className="flex flex-row items-center cursor-pointer">
            {selectedDay === day && (
              <>
                <ArrowRight
                  className="rotate-180"
                  onClick={() => setSelectedDayPrev()}
                />
                <div
                  className="flex flex-col items-center mx-5"
                  onClick={() => setSelectedDay(day)}
                >
                  <h1 className="text-2xl font-bold">{day}</h1>
                  <h2 className="uppercase text-lg">March</h2>
                </div>
                <ArrowRight onClick={() => setSelectedDayNext()} />
              </>
            )}

            {selectedDay !== day && (
              <h1
                className="text-2xl font-bold opacity-50"
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </h1>
            )}
          </div>
        ))}
      </div>
      {selectedDay && (
        <div className="md:hidden">
          <div className="p-2 px-5 w-full h-fit justify-start overflow-visible flex flex-row bg-custombutton text-white relative border-l-2">
            <LineDots />
            <div className="flex flex-1 flex-col items-start whitespace-break-spaces text-left">
              <p className="text-xl uppercase">
                <span className="font-extrabold">{selectedDay}</span> March
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mb-28 md:mb-0 overflow-scroll no-scrollbar">
        {children}
      </div>
      {days.length > 0 && (
        // Mobile Schedule Bar - Days (Opacity and Blur)
        <div className="fixed left-0 bottom-0 z-20 w-full h-24 flex gap-6 md:hidden bg-blue-400 bg-opacity-70 backdrop-filter backdrop-blur-md items-center justify-center">
          {days.map((day) => (
            <div
              onClick={() => setSelectedDay(day)}
              className={
                "w-[45px] h-[45px] flex items-center justify-center relative cursor-pointer " +
                (selectedDay == day ? "border-2 border-white" : "")
              }
              key={day}
            >
              {selectedDay == day && (
                <div>
                  <div className="bg-yellow-300 h-3 w-3 rounded-full -translate-y-2/4 translate-x-2/4 absolute top-0 right-0 "></div>
                  <div className="bg-yellow-300 h-3 w-3 rounded-full translate-y-2/4 translate-x-2/4 absolute bottom-0 right-0 "></div>
                  <div className="bg-blue-950   h-3 w-3 rounded-full -translate-y-2/4 -translate-x-2/4 absolute top-0 left-0 "></div>
                  <div className="bg-yellow-300 h-3 w-3 rounded-full translate-y-2/4 -translate-x-2/4 absolute bottom-0 left-0 "></div>
                </div>
              )}
              <p className="text-white mx-auto font-extrabold text-xl">{day}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ActivityDayFilter;
