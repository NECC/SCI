import { useState } from "react";
import { IoArrowDownCircleOutline } from "react-icons/io5";

export default function Accordion() {
  const where = "SCI takes place from June 5th to June 7th, at Universidade do Minho in Braga.";
  const free = "Yes, it’s free to all attendees!";
  const participate = "Of course! SCI is open to everyone, regardless if you’re a student or not. Everyone is welcome to participate in our workshops and our talks.";
  const register = "You can participate by registering in this year’s edition through the link below.";
  const contact = " You can email us at join.di.uminho@gmail.com or send us a message through our social media accounts.";

  const [active, setActive] = useState(false);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);
  const [active5, setActive5] = useState(false);

  return (
    <div className='flex-col flex items-center justify-center gap-4'>
      
      <div className='bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 w-full rounded-lg'>
        <div className='flex items-center justify-between p-3 cursor-pointer font-poppins text-white font-normal text-lg' onClick={() => setActive(!active)}>
          <p>When and where does SCI take place?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-500 ${active ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-lg overflow-hidden ease-in-out duration-500 ${active ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{where}</p>
        </div>
      </div>

      <div className='bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 w-full rounded-lg'>
        <div className='flex items-center justify-between p-3 cursor-pointer ont-poppins text-white font-normal text-lg' onClick={() => setActive2(!active2)}>
          <p>Is SCI free?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-500 ${active2 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-lg overflow-hidden ease-in-out duration-500 ${active2 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{free}</p>
        </div>
      </div>

      <div className='bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 w-full rounded-lg'>
        <div className='flex items-center justify-between p-3 cursor-pointer ont-poppins text-white font-normal text-lg' onClick={() => setActive3(!active3)}>
          <p>Can I participate, even if I’m not a student?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-500 ${active3 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-lg overflow-hidden ease-in-out duration-500 ${active3 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{participate}</p>
        </div>
      </div>

      <div className='bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 w-full rounded-lg'>
        <div className='flex items-center justify-between p-3 cursor-pointer ont-poppins text-white font-normal text-lg' onClick={() => setActive4(!active4)}>
          <p>Where can I register to participate?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-500 ${active4 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-lg overflow-hidden ease-in-out duration-500 ${active4 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{register}</p>
        </div>
      </div>

      <div className='bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 w-full rounded-lg'>
        <div className='flex items-center justify-between p-3 cursor-pointer ont-poppins text-white font-normal text-lg' onClick={() => setActive5(!active5)}>
          <p>How can I contact SCI’s team?</p>
          <IoArrowDownCircleOutline size={30} color="white" className={`ease-in-out duration-500 ${active5 ? 'rotate-180' : 'rotate-0'}`} />
        </div>
        <div className={`bg-white rounded-lg overflow-hidden ease-in-out duration-500 ${active5 ? 'max-h-[500px]' : 'max-h-0'}`}>
          <p className="p-3">{contact}</p>
        </div>
      </div>
    </div>
  );
}