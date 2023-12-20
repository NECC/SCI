import { useEffect,useState} from 'react'

const Hexa = () => {

  const [change, setChange] = useState(true);
  useEffect(() => {
  
    setChange(false);
    
  
  }, []);
  return (

    <div className='absolute bottom-4 right-0 w-[500px] h-[350px] hidden lg:block'>
      <div className="relative">
        <div className={`p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[5px] z-10 transition delay-700 duration-300 ease-in-out ${change && "-translate-y-[700px]"} `} ></div>
        <div className={`p-1 w-[130px] bg-white opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[55px] translate-x-[120px] z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg]  -translate-x-[6000px] -translate-y-[700px]"}`}></div>
        <div className={`p-1 w-[130px] bg-white opacity-25 rounded-lg absolute rotate-[30deg]  translate-y-[55px] -translate-x-[120px] right-0 z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg] translate-x-[6000px] translate-y-[700px]"}`}></div>
        <div className={`p-4 bg-orange-600 opacity-95 w-2 rounded-full absolute translate-x-[100px] translate-y-[85px] z-10 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg] -translate-y-[700px]"}`}></div>
        <div className={`p-4 bg-orange-600 opacity-95 w-2 rounded-full absolute -translate-x-[100px] translate-y-[85px] z-10 right-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg]  -translate-y-[700px]"}`}></div>
        <div className={`p-1 w-[130px] bg-white opacity-25 rounded-lg absolute -rotate-[90deg] translate-y-[175px] translate-x-[55px] z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[0deg] -translate-x-[6000px]"}`}></div>
        <div className={`p-1 w-[130px] bg-white opacity-25 rounded-lg absolute -rotate-[90deg] translate-y-[175px] -translate-x-[55px] right-0 z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[0deg] translate-x-[200px]"}`}></div>
        <div className={`p-4 bg-amber-400 opacity-90 w-2 rounded-full absolute  translate-x-[100px] translate-y-[238px] z-10 transition delay-700 duration-300 ease-in-out ${change && "-translate-x-[6000px]"}`}></div>
        <div className={`p-4 bg-amber-400 opacity-90 w-2 rounded-full absolute -translate-x-[100px] translate-y-[238px] right-0 z-10 transition delay-700 duration-300 ease-in-out ${change && "translate-x-[6000px]"}`}></div>
        <div className={`p-1 w-[130px] bg-white opacity-25 rounded-lg absolute rotate-[30deg] translate-y-[285px] translate-x-[120px] z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg] -translate-y-[700px]"}`}></div>
        <div className={`p-1 w-[130px] bg-white opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[285px] -translate-x-[120px] right-0 z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg] -translate-y-[700px] "}`}></div>
        <div className={`p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[305px] z-10 transition delay-700 duration-300 ease-in-out ${change && "-translate-y-[700px]"}`}></div>
        <div className={`p-1 w-[280px] bg-white opacity-25 rounded-lg absolute -rotate-[30deg] translate-y-[170px] translate-x-[110px] z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg] -translate-y-[700px] "}`}></div>
        <div className={`p-1 w-[280px] bg-white opacity-25 rounded-lg absolute rotate-[30deg] translate-y-[170px] translate-x-[110px]  z-0 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg] -translate-y-[700px] "}`}></div>
        <div className={`p-1 w-[890px] bg-white rounded-lg absolute -rotate-[90deg] translate-y-[450px] left-1/2 -translate-x-1/2 z-0 transition delay-700 duration-300 ease-in-out ${change && ""}`}></div>
        <div className={`p-4 bg-amber-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[160px]  z-10 transition delay-700 duration-300 ease-in-out ${change && "rotate-[90deg] translate-x-[6000px]"}`}></div>
        <div className={`p-4 bg-black border-white border-2 w-2 rounded-full absolute left-1/2 -translate-x-1/2 translate-y-[550px] z-10 transition delay-700 duration-300 ease-in-out ${change && ""}`}></div>
      </div>
    </div>




  )
}

export default Hexa