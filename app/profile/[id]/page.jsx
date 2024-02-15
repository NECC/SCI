"use client";

import Activity from "@app/schedule/Activity";
import QRCode from "easyqrcodejs";
import { useEffect, useRef, useState } from "react";
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
import Link from 'next/link'
import { Line } from "@components/Line";
import { ArrowRight } from "@components/ArrowRight";

export default function Profile ({ params: { id }} ) {
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

    const { status} = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/api/auth/signin");
        },
    });

    // get profile user
    useEffect(() => {
        const getUser = async () => {
            const { data } = await axios.get(`/api/users/${id}`);
            setUser(data.user);
        }
        getUser();
    }, [id]);

    console.log(user)

    function filterByUser(e) {
        if (e.userId == user.id) { 
            return true;
        }
        return false;
    }

    const getUserEnrollments = async () => {
        // gets enrollments and filters them by the current user
        const { data } = await axios.get("/api/enrollments");
        if (data.enrollments != null) {
            const fdata = data.enrollments.filter(filterByUser);
            setUserEnrollment(fdata);
            setType("WORKSHOP");
        }
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
    console.log(activities)

    return (
        <div className="bg-gradient-to-b from-sky-400 to-sky-300 dark:bg-black h-screen bg-[url('/rectangle.png')] bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
            <div className="gap-2 px-8 pt-20">                
                {status != "loading" ? (
                    <div className="bg-transparent w-full h-[625px]">
                        <Card className="bg-transparent shadow-none">
                        <CardHeader className="dark:bg-black/40 border-b-1 border-default-600 dark:border-default-100 flex-row">
                            <div className="flex flex-grow gap-2 items-center p-2 justify-between">
                                <div className="flex flex-col text-neutral-700 text-white uppercase font-black text-2xl">
                                    Perfil de {user.name}
                                </div>
                                <ButtonGroup className="px-2" disableRipple={true}>
                                    {(activeScreen == 0) && <Line/>}
                                    <Button radius={"none"} onClick={() => setActiveScreen(0)} className={(activeScreen != 0) ? "flex flex-col text-white bg-transparent" : "-ml-1.5 overflow-visible flex flex-row bg-custombutton text-white"}> 
                                        
                                        <p className="text-2xl font-roboto font-extrabold leading-5 mt-1.5 mb-1 ml-[17px] mr-1.5"> ENROLLED ACTIVITIES </p> 
                                    </Button>
                                    {(activeScreen == 1) && <Line/>}
                                    <Button radius={"none"} onClick={() => setActiveScreen(1)} className={(activeScreen != 1) ? "flex flex-col text-white bg-transparent" : "-ml-1.5 overflow-visible flex flex-row bg-custombutton text-white"}> 
                                        <p className="text-2xl font-roboto font-extrabold leading-5 mt-1.5 mb-1 ml-[17px] mr-1.5"> RANKING </p> 
                                    </Button>
                                    {(activeScreen == 2) && <Line/>}
                                    <Button radius={"none"} onClick={() => setActiveScreen(2)} className={(activeScreen != 2) ? "flex flex-col text-white bg-transparent" : "-ml-1.5 overflow-visible flex flex-row bg-custombutton text-white"}> 
                                        <p className="text-2xl font-roboto font-extrabold leading-5 mt-1.5 mb-1 ml-[17px] mr-1.5"> QRCODE </p> 
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </CardHeader>

                        {(activeScreen == 0) ? (

                            <ActivitiesSubscribed activeDay={activeDay} type={type} workshops={workshops} talks={talks} others={others} activities={activities} setType={setType} nextDay={nextDay} previousDay={previousDay} />

                        ) : (activeScreen == 1) ? (
                        
                            <Ranking user={user} place={place} firstPlace={firstPlace} />

                        ) : (activeScreen == 2) ? (

                            <Code userId={id}/>

                        ) : (<></>)}
                    </Card>
                    </div>
                ) : (
                    <Spinner color="white" size="lg"/>
                )}
                               
            </div>
        </div>
    );
}

const ActivitiesSubscribed = ({ activeDay, type, setType, workshops, talks, others, activities, nextDay, previousDay }) => {
    return (
        <CardBody className="dark:bg-black/40 flex flex-col">
            <div className="flex flex-col gap-y-1">
                <div className="gap-10 bg-gradient-to-r from-transparent from-20% via-custom-blue-1/60 to-transparent to-80% w-full flex flex-row justify-center items-center">
                    <p className="pt-2 mr-[20px] text-2xl font-poppins font-bold leading-5 text-center text-custom-grey tracking-[2.4px]">
                        {activeDay-1}
                    </p>
                    <p onClick={() => previousDay()}> <ArrowRight className={"rotate-180"}/> </p>
                    <p className="pt-2 px-4 text-2xl font-poppins font-bold leading-5 text-center text-white tracking-[2.4px]"> 
                        {activeDay} <br/> <span className="text-xl tracking-[2px] font-light"> MARCH </span> 
                    </p>
                    <p onClick={() => nextDay()}> <ArrowRight/> </p>
                    <p className="pt-2 ml-[18px] text-2xl font-poppins font-bold leading-5 text-center text-custom-grey tracking-[2.4px]">
                        {activeDay+1}
                    </p>
                </div>
                <div className="mx-6 mt-1 -mb-3 flex flex-row h-8">
                    <ButtonGroup>
                        <Button className={(type != "WORKSHOP") ? "text-white bg-neutral-500" : "bg-white text-black"} onClick={() => setType("WORKSHOP")}>
                            Workshops : {workshops}
                        </Button>
                        <Button className={(type != "OTHER") ? "text-white bg-neutral-500" : "bg-white text-black"} onClick={() => setType("OTHER")}>
                            Others : {others}
                        </Button>
                    </ButtonGroup>
                </div>
                <div className="no-scrollbar mx-6 flex flex-wrap gap-4 flex-col md:flex-row w-[300px] md:w-auto mt-8">
                    { (activities.length > 0) ? (
                        activities.map((enrollments, index) => (
                            <div key={index}>
                                <Link href={`${enrollments.user.id}/activity/${enrollments.activity.id}`}>
                                    <Activity item={enrollments.activity} attended={enrollments.attended}/>
                                </Link>                               
                            </div>
                        ))
                    ) : <p className="text-white h-[117px]"> Não estás inscrito em nenhuma atividade deste tipo </p>
                    }
                </div>   
            </div>
        </CardBody>    
    )
}

const Ranking = ({ user, place, firstPlace }) => {
    return (
        <CardBody className="dark:bg-black/40 flex flex-col ">
            <div className="px-1"> 
                <h2 className="dark:text-white font-semibold text-l"> Ranking </h2>
                <div>
                <p> Tens {user.points} pontos </p> 
                <p> Estás em {place}º lugar </p>
                {(place > 1) ? (<p> O primeiro lugar têm {firstPlace} pontos</p>) : (<></>)}
                </div>
            </div>
        </CardBody>
    )
}

const Code = ({ userId }) => {
    const qrcode = useRef(null)
    const currentUrl = process.env.NEXT_PUBLIC_MODE == "development" ? process.env.NEXT_PUBLIC_BACKOFFICE_URL_DEVELOPMENT : process.env.NEXT_PUBLIC_BACKOFFICE_URL_PRODUCTION
    console.log(currentUrl)
    useEffect(() => {

        var options = {
            text: "Bem-vindo ao evento",
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
            
        }

        const code = new QRCode(qrcode.current, options);
        code.makeCode(`${currentUrl}/ranking/${userId}`);
        return () => code.clear()
    }, [qrcode])

    return (
        <CardBody className="dark:bg-black/40 flex flex-col ">
            <div className="px-1"> 
                <h2 className="dark:text-white font-semibold text-l"> QRCode </h2>
                <div ref={qrcode}>

                </div>
            </div>
        </CardBody>
    )
}