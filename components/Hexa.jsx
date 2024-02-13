
const Hexa = ({altura}) => {

  const width = `${altura*2}px`;
  const height = `${altura}px`;
  
  return (
    <div className=" w-[500px] absolute top-0 right-0 hidden lg:block  overflow-hidden" style={{ height }}>
      <div className="p-4 bg-blue-950 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[0px] z-10"></div>
      <div className="p-1 w-[130px] bg-white opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[55px] translate-x-[120px] z-0"></div>
      <div className="p-1 w-[130px] bg-white opacity-25 rounded-lg absolute rotate-[30deg]  translate-y-[55px] -translate-x-[120px] right-0 z-0"></div>
      <div className="p-4 bg-amber-400 opacity-95 w-2 rounded-full absolute translate-x-[100px] translate-y-[85px] z-10"></div>
      <div className="p-4 bg-amber-400 opacity-95 w-2 rounded-full absolute -translate-x-[100px] translate-y-[85px] z-10 right-0"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute -rotate-[90deg] translate-y-[175px] translate-x-[55px] z-0"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute -rotate-[90deg] translate-y-[175px] -translate-x-[55px] right-0 z-0"></div>
      <div className="p-4 bg-amber-400 opacity-90 w-2 rounded-full absolute  translate-x-[100px] translate-y-[238px] z-10"></div>
      <div className="p-4 bg-amber-400 opacity-90 w-2 rounded-full absolute -translate-x-[100px] translate-y-[238px] right-0 z-10"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute rotate-[30deg] translate-y-[285px] translate-x-[120px] z-0"></div>
      <div className="p-1 w-[130px] bg-white rounded-lg absolute -rotate-[30deg] translate-y-[285px] -translate-x-[120px] right-0 z-0"></div>
      <div className="p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[305px] z-10"></div>
      <div className="p-1 w-[280px] bg-white rounded-lg absolute -rotate-[30deg] translate-y-[170px] translate-x-[110px] z-0"></div>
      <div className="p-1 w-[280px] bg-white rounded-lg absolute rotate-[30deg] translate-y-[170px] translate-x-[110px]  z-0"></div>

      <div className={"p-1 opacity-25 bg-white rounded-lg absolute -rotate-[90deg] left-1/2 -translate-x-1/2 z-0"} style={{ width }}></div>

        <div className="p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[160px]  z-10"></div>
    </div>
  )
}

export default Hexa