"use client";

import Nav from "@components/Nav";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Spinner,
    ButtonGroup,
  } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
    SlArrowLeft,
    SlArrowRight 
} from "react-icons/sl";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TbFileDownload } from "react-icons/tb";
import Link from 'next/link'

export default function Profile () {
    const [user, setUser] = useState({});
    const [userEnrollment, setUserEnrollment] = useState([]);
    const [activities, setActivities] = useState ([]);
    const [place,setPlace] = useState(0);
    const [firstPlace,setFirstPlace] = useState(0);
    const [type,setType] = useState(null);
    const [workshops,setWorkshops] = useState(0);
    const [talks,setTalks] = useState(0);
    const [others,setOthers] = useState(0);
    const [activeScreen,setActiveScreen] = useState(0);
    const [activeDay,setActiveDay] = useState(18);
    let count = 1;
    let maxCount = 0;
    const router = useRouter();

    const { data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/api/auth/signin");
        },
    });

    useEffect(() => {
        if (session) setUser(session.user);
    }, [session]);

    function filterByUser(e) {
        if (e.userId == user.id) { 
            return true;
        }
        return false;
    }

    const getUserEnrollments = async () => {
        // gets enrollments and filters them by the current user
        const { data } = await axios.get("/api/enrollments");
        const fdata = data.enrollments.filter(filterByUser);
        setUserEnrollment(fdata);
        setType("WORKSHOP");
    }

    function filterByType(e) {
        if(e.activity.type == type) {
            return true;
        }
        return false;
    }

    useEffect (() => {
        // sets which activities to show to the user
        setActivities(userEnrollment.filter(filterByType));   
    },[type])

    function getNumberOfActivity(a,t) {
        let count = 0;
        a.forEach((v) => (v.activity.type == t && count++));
        return count;
    }

    useEffect (() => {
        // get amount of each activity that the user is enrolled in 
        setWorkshops(getNumberOfActivity(userEnrollment,"WORKSHOP"));
        setTalks(getNumberOfActivity(userEnrollment,"TALK"));
        setOthers(getNumberOfActivity(userEnrollment,"OTHER")); 
    },[userEnrollment])

    useEffect (() => {
        getUserEnrollments();
    },[])

    const getUserPlace = async () => {
        // compares current user points with the rest of the users to determine current user's place and how many points first place has
        const {data} = await axios.get("/api/users");
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].points > user.points && data.users[i].id != user.id){ 
                count++;
            }
            if (data.users[i].points > maxCount) {maxCount = data.users[i].points};
        }
        setPlace(count);
        setFirstPlace(maxCount);
    }

    useEffect (() => {
        getUserPlace();
    },[user])

    function previousDay() {
        if (activeDay > 18) setActiveDay(activeDay - 1);
        else setActiveDay(18);
    }

    function nextDay() {
        if (activeDay < 21) setActiveDay(activeDay + 1);
        else setActiveDay(21);
    }

    const onWheel = e => {
        e.preventDefault();
        const container = scrollRef.current;
        const containerScrollPosition = scrollRef.current.scrollLeft;
    
        container.scrollTo({
          top: 0,
          left: containerScrollPosition + e.deltaY,
        });
      };
    
    const scrollRef = useRef(null);

    console.log(activities);

    return (
        <div className="bg-white dark:bg-black h-screen bg-[url('/rectangle.png')] bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
            <Nav />
            <div className="flex gap-2 px-8 pt-20 h-full">
                {(status != "loading" && !activeScreen) ? (
                <Card isBlurred className="w-full">
                    <CardHeader className="dark:bg-black/40 border-b-1 border-default-600 dark:border-default-100 flex-row">
                        <div className="flex flex-grow gap-2 items-center p-2 justify-between">
                            <div className="flex flex-col text-neutral-700 dark:text-white/90 uppercase font-black text-2xl">
                                Welcome {user.name}
                            </div>
                            <ButtonGroup>
                                <Button onClick={() => setActiveScreen(0)} className="bg-[#023f65] text-white dark:bg-slate-300 dark:text-black border-1"> Enrolled Activities </Button>
                                <Button onClick={() => setActiveScreen(1)} className="dark:text-white dark:bg-transparent dark:border-gray-50 border-1"> Ranking </Button>
                            </ButtonGroup>
                        </div>
                    </CardHeader>
                    <CardBody className="dark:bg-black/40 flex flex-col">
                        <div className="flex flex-col gap-y-3">
                            <h className="mx-1 text-[#494748] dark:text-white font-semibold text-2xl"> Enrolled Activities </h>
                            <div className="mx-5 gap-4 flex flex-row items-center">
                                <h2 className="font-bold text-lg"> Day {activeDay} </h2>
                                <ButtonGroup className="border-1 rounded-full">
                                    <Button className="bg-transparent flex min-w-3" size='sm' onClick={() => previousDay()}> <SlArrowLeft size={'1em'}/> </Button>
                                    <FaRegCalendarAlt size={'1em'} />
                                    <Button className="bg-transparent flex min-w-3" size='sm' onClick={() => nextDay()}> <SlArrowRight size={'1em'}/> </Button>
                                </ButtonGroup>
                            </div>
                            <div className="mx-6 mt-1 -mb-3 flex flex-row h-8">
                                <ButtonGroup>
                                    <Button className={(type != "WORKSHOP") ? "text-white bg-neutral-500 dark:bg-transparent dark:border-gray-50 border-1" : "bg-[#023f65] text-white dark:bg-slate-300 dark:text-black border-1"} onClick={() => setType("WORKSHOP")}>
                                        Workshops : {workshops}
                                    </Button>
                                    <Button className={(type != "TALK") ? "text-white bg-neutral-500 dark:bg-transparent dark:border-gray-50 border-1" : "bg-[#023f65] text-white dark:bg-slate-300 dark:text-black border-1"} onClick={() => setType("TALK")}>
                                        Talks : {talks}
                                    </Button>
                                    <Button className={(type != "OTHER") ? "text-white bg-neutral-500 dark:bg-transparent dark:border-gray-50 border-1" : "bg-[#023f65] text-white dark:bg-slate-300 dark:text-black border-1"} onClick={() => setType("OTHER")}>
                                        Others : {others}
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <div id ="container" ref={scrollRef} onWheel={onWheel} className="overflow-x-hidden no-scrollbar mx-6 flex gap-4 flex-col md:flex-row w-[300px] md:w-auto mt-8">
                                { (activities.length > 0) ? (
                                    activities.map((enrollments, index) => (
                                        <Link href={`profile/activity/${enrollments.activity.id}`} className="flex" key={index}>
                                                <Card className="w-[300px] border-1 border-[#222327]">
                                                    <CardBody>
                                                        <h4 className="dark:text-white/90 font-bold text-xl">
                                                            {enrollments.activity.title}
                                                        </h4>
                                                        {enrollments.activity.description && (<p className="text-small dark:text-white/60 font-medium">
                                                            {enrollments.activity.description}
                                                        </p>
                                                        )}
                                                    </CardBody>
                                                    <CardFooter className="flex flex-row justify-center gap-2 p-3 px-5 bg-gray-200 dark:bg-gray-700/50 mt-1">
                                                        <p className="text-tiny dark:text-white/60 font-medium">
                                                            {enrollments.activity.speakers}
                                                        </p>
                                                        <div className="flex flex-row"> <p className="text-tiny"> Certificate </p> <TbFileDownload /> </div> 
                                                        <div className="flex flex-row ml-auto pl-5 items-center gap-3">
                                                            <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                                                                {enrollments.activity.startTime}h - {enrollments.activity.endTime}h
                                                            </p>
                                                            {enrollments.activity.location && (
                                                            <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                                                                {enrollments.activity.location}
                                                            </p>
                                                            )}            
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                        </Link>
                                    ))
                                ) : <p className="h-[117px]"> You're not enrolled in any activity of this type </p>
                                }
                            </div>   
                        </div>
                    </CardBody>    
                </Card>
                ) : ((activeScreen) ? (
                    <Card className="w-full">
                        <CardHeader className="dark:bg-black/40 border-b-1 border-default-600 dark:border-default-100 flex-row">
                            <div className="flex flex-grow gap-2 items-center p-2 justify-between">
                                <div className="flex flex-col dark:text-white/90 uppercase font-black text-2xl">
                                    Welcome {user.name}
                                </div>
                                <div>
                                    <ButtonGroup>
                                        <Button onClick={() => setActiveScreen(0)} className="dark:text-white dark:bg-transparent dark:border-gray-50 border-1"> Enrolled Activities </Button>
                                        <Button onClick={() => setActiveScreen(1)} className="bg-[#023f65] text-white dark:bg-slate-300 dark:text-black border-1"> Ranking </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="dark:bg-black/40 flex flex-col ">
                            <div className="px-1"> 
                                <h className="dark:text-white font-semibold text-l"> Ranking </h>
                                <div>
                                <p> You have {user.points} points </p> 
                                <p> You're in {place}º place </p>
                                {(place > 1) ? (<p> First place has {firstPlace} points</p>) : (<></>)}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    ) : (<Spinner color="white" size="lg"/>))}
            </div>
        </div>
    );
}