"use client";

import Nav from "@components/Nav";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    Button,
    Chip,
    Spinner,
  } from "@nextui-org/react";
  import axios from "axios";
  import { useRouter } from "next/navigation";

  
  

export default function Profile () {
    const [user, setUser] = useState({});
    const [enrollment, setEnrollment] = useState([]);
    const [count, setCount] = useState(0);
    const [place,setPlace] = useState(1);
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
        setEnrollment(fdata);
    }

    
    
    if(count == 0) getUserEnrollments() && setCount(1);

    return (
        <div className="bg-black h-screen bg-[url('/rectangle.png')] bg-no-repeat bg-top bg-cover">
            <Nav />
            <div className="gap-2 px-8 pt-20">
                {(status != "loading") ? (
                <Card isBlurred className="w-full h-[700px]">
                    <CardHeader className="bg-black/40 border-b-1 border-default-600 dark:border-default-100">
                        <div className="flex flex-grow gap-2 items-center p-2">
                            <div className="flex flex-col text-white/90 uppercase font-black text-2xl">
                                Bem-vindo {user.name}
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="bg-black/40 flex flex-col gap-10">
                        <div className="gap-2 flex flex-col">
                            <h className="px-1 text-white font-semibold text-l"> Atividades Inscritas </h>
                            <div className="flex gap-4 flex-col md:flex-row">
                                {
                                    enrollment.map((enrollments, index) => (
                                        <div className="flex" key={index}>
                                            { (enrollments.user.id == user.id) ? (
                                                <Card className="w-[300px]">
                                                    <CardBody>
                                                        <h4 className="dark:text-white/90 font-bold text-xl">
                                                            {enrollments.activity.title}
                                                        </h4>
                                                        {enrollments.activity.description && (<p className="text-small dark:text-white/60 font-medium">
                                                            {enrollments.activity.description}
                                                        </p>
                                                        )}
                                                    </CardBody>
                                                    <CardFooter className="flex flex-row gap-2 p-3 px-5 bg-gray-200 dark:bg-gray-700/50 mt-1">
                                                        <p className="text-tiny dark:text-white/60 font-medium">
                                                            {enrollments.activity.speakers}
                                                        </p>
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
                                            ) : (<></>)
                                            }
                                        </div>
                                    ))
                                }
                            </div>   
                        </div>
                        <div>
                            <h className="px-1 text-white font-semibold text-l"> Ranking </h>
                            <div>
                                <p> Atualmente tens {user.points} pontos </p> 
                                <p> Estás atualmente em {place}º lugar </p>
                            </div>
                        </div>
                    </CardBody>    
                </Card>
                ) : (<Spinner color="white" size="lg"/>)
                }
            </div>
        </div>
    );
}