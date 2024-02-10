import { useEffect, useState } from 'react'

const Hexa = () => {
  return (
    <div className=" w-[500px] h-[350px] absolute bottom-4 right-0 hidden lg:block ">
      <div className="p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[5px] z-10 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[130px] dark:bg-white bg-black opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[55px] translate-x-[120px] z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[130px] dark:bg-white bg-black opacity-25 rounded-lg absolute rotate-[30deg]  translate-y-[55px] -translate-x-[120px] right-0 z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-4 bg-orange-600 opacity-95 w-2 rounded-full absolute translate-x-[100px] translate-y-[85px] z-10 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-4 bg-orange-600 opacity-95 w-2 rounded-full absolute -translate-x-[100px] translate-y-[85px] z-10 right-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[130px] dark:bg-white bg-black opacity-25 rounded-lg absolute -rotate-[90deg] translate-y-[175px] translate-x-[55px] z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[130px] dark:bg-white bg-black opacity-25 rounded-lg absolute -rotate-[90deg] translate-y-[175px] -translate-x-[55px] right-0 z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-4 bg-amber-400 opacity-90 w-2 rounded-full absolute  translate-x-[100px] translate-y-[238px] z-10 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-4 bg-amber-400 opacity-90 w-2 rounded-full absolute -translate-x-[100px] translate-y-[238px] right-0 z-10 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[130px] dark:bg-white bg-black opacity-25 rounded-lg absolute rotate-[30deg] translate-y-[285px] translate-x-[120px] z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[130px] dark:bg-white bg-black opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[285px] -translate-x-[120px] right-0 z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[305px] z-10 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[280px] dark:bg-white bg-black opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[170px] translate-x-[110px] z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[280px] dark:bg-white bg-black opacity-25 rounded-lg absolute rotate-[30deg] translate-y-[170px] translate-x-[110px]  z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-1 w-[890px] dark:bg-white bg-black rounded-lg absolute -rotate-[90deg] translate-y-[450px] left-1/2 -translate-x-1/2 z-0 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[160px]  z-10 transition delay-700 duration-300 ease-in-out"></div>
      <div className="p-4 bg-black border-white border-2 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[550px] z-10 transition delay-700 duration-300 ease-in-out"></div>
    </div>
  )
}

export default Hexa