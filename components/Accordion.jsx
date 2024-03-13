import { useState } from "react";
import { IoArrowDownCircleOutline } from "react-icons/io5";

export default function Accordion() {
  const where = "SCI takes place from March 18th to March 21st, at Universidade do Minho in Braga.";
  const free = "Yes, it’s free to all attendees!";
  const participate = "Of course! SCI is open to everyone, regardless if you’re a student or not. Everyone is welcome to participate in our workshops and our talks.";
  const register = "You can participate by registering in this year’s edition through the link below.";
  const contact = " You can email us at sci.uminho@gmail.com or send us a message through our social media accounts.";
  const points = "In SCI every activity you are part of gives you 1 point! At the end of every activity, reach someone from the Staff so they can scan the QR Code on your profile and give you the point."

  const [active, setActive] = useState(false);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);
  const [active5, setActive5] = useState(false);
  const [active6, setActive6] = useState(false);


  // TODO: Refactor this component to use a map function to render the accordions
  return (
    <div className='flex-col flex items-center justify-center gap-4 '>
      
      <div className='bg-gradient-to-r from-custom-blue-3 to-custom-blue-1 w-full rounded-lg border-1 border-solid'>
        <div className='flex items-center justify-between p-3 cursor-pointer font-poppins text-white font-normal sm:text-lg text-base' onClick={() => setActive(!active)}>
          <p className="w-[80%]">When and where does SCI take place?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-300 ${active ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-b-md overflow-hidden ease-in-out duration-300 ${active ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{where}</p>
        </div>
      </div>

      <div className='bg-gradient-to-r from-custom-blue-3 to-custom-blue-1 w-full rounded-lg border-1 border-solid'>
        <div className='flex items-center justify-between p-3 cursor-pointer font-poppins text-white font-normal sm:text-lg text-base ' onClick={() => setActive2(!active2)}>
          <p className="w-[80%]">Is SCI free?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-300 ${active2 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-b-md overflow-hidden ease-in-out duration-300 ${active2 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{free}</p>
        </div>
      </div>

      <div className='bg-gradient-to-r from-custom-blue-3 to-custom-blue-1 w-full rounded-lg border-1 border-solid'>
        <div className='flex items-center justify-between p-3 cursor-pointer font-poppins text-white font-normal sm:text-lg text-base' onClick={() => setActive3(!active3)}>
          <p className="w-[80%]">Can I participate, even if I’m not a student?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-300 ${active3 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-b-md overflow-hidden ease-in-out duration-300 ${active3 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{participate}</p>
        </div>
      </div>

      <div className='bg-gradient-to-r from-custom-blue-3 to-custom-blue-1 w-full rounded-lg border-1 border-solid'>
        <div className='flex items-center justify-between p-3 cursor-pointer font-poppins text-white font-normal sm:text-lg text-base' onClick={() => setActive4(!active4)}>
          <p className="w-[80%]">Where can I register to participate?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-300 ${active4 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-b-md overflow-hidden ease-in-out duration-300 ${active4 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{register}</p>
        </div>
      </div>

      <div className='bg-gradient-to-r from-custom-blue-3 to-custom-blue-1 w-full rounded-lg border-1 border-solid'>
        <div className='flex items-center  justify-between p-3 cursor-pointer font-poppins text-white font-normal sm:text-lg text-base' onClick={() => setActive5(!active5)}>
          <p className="w-[80%]">How can I contact SCI&apos;s team?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-300 ${active5 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-b-md overflow-hidden ease-in-out duration-300 ${active5 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{contact}</p>
        </div>
      </div>

      <div className='bg-gradient-to-r from-custom-blue-3 to-custom-blue-1 w-full rounded-lg border-1 border-solid'>
        <div className='flex items-center  justify-between p-3 cursor-pointer font-poppins text-white font-normal sm:text-lg text-base' onClick={() => setActive6(!active6)}>
          <p className="w-[80%]">How does the system points work?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-300 ${active6 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-b-md overflow-hidden ease-in-out duration-300 ${active6 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{points}</p>
        </div>
      </div>
    </div>
  );
}