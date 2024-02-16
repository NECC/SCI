import { motion, useScroll } from "framer-motion";

const Hexa = () => {
  const { scrollYProgress } = useScroll();



  return (
    <div className=" w-[500px] absolute top-0 right-0 hidden lg:block  overflow-hidden h-full">
      <div className="p-4 bg-blue-950 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[0px] z-50"></div>
      <div className="p-1 w-[130px] bg-white opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[55px] translate-x-[120px]"></div>
      <div className="p-1 w-[130px] bg-white opacity-25 rounded-lg absolute rotate-[30deg]  translate-y-[55px] -translate-x-[120px] right-0"></div>
      <div className="p-4 bg-yellow-300 w-2 rounded-full absolute translate-x-[100px] translate-y-[85px] z-50"></div>
      <div className="p-4 bg-yellow-300 w-2 rounded-full absolute -translate-x-[100px] translate-y-[85px] z-50 right-0"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute -rotate-[90deg] translate-y-[175px] translate-x-[55px]"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute -rotate-[90deg] translate-y-[175px] -translate-x-[55px] right-0"></div>
      <div className="p-4 bg-yellow-300 opacity-90 w-2 rounded-full absolute  translate-x-[100px] translate-y-[238px] z-50"></div>
      <div className="p-4 bg-yellow-300 opacity-90 w-2 rounded-full absolute -translate-x-[100px] translate-y-[238px] right-0 z-50"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute rotate-[30deg] translate-y-[285px] translate-x-[120px]"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute -rotate-[30deg] translate-y-[285px] -translate-x-[120px] right-0"></div>
      <div className="p-4 bg-yellow-300 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[305px] z-50"></div>
      <div className="p-1 w-[280px] bg-white rounded-lg absolute -rotate-[30deg] translate-y-[170px] translate-x-[110px]"></div>
      <div className="p-1 w-[280px] bg-white rounded-lg absolute rotate-[30deg] translate-y-[170px] translate-x-[110px] "></div>
      <motion.div
        className="p-1 h-full opacity-25 bg-white rounded-lg absolute  left-[49.4%]  origin-top"
        style={{ scaleY: scrollYProgress }}
      />
      <div className="p-4 bg-yellow-300 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[160px] z-50"></div>
    </div>
  )
}

export default Hexa