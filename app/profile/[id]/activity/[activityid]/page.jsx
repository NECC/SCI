'use client'

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Link from "next/link"
import { MdArrowBackIosNew } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityPage({ params }) {
    console.log(params)
    const [activity, setActivity] = useState({});

    const getActivity = async () => {
        const { data } = await axios.get(`/api/activities/${params.activityid}`);
        setActivity(data.activity[0]); 
    }

    useEffect (() => {
        getActivity()
    },[])
    
    console.log(activity)
    console.log(activity.title)

    return (activity) ? (
        <div className="bg-gradient-to-b from-sky-400 to-sky-300 dark:bg-black h-screen bg-[url('/rectangle.png')] bg-no-repeat bg-top bg-cover overflow-y-scroll no-scrollbar">
            <div className="h-20 flex">
                <Link className="text-white my-auto align-middle pl-4 flex gap-x-2 text-center" href={`/profile/${params.id}`}>
                    <MdArrowBackIosNew size={'2em'} /> 
                    <p className="pt-0.5"> Go Back </p> 
                </Link>
            </div>
            <div className="flex gap-2 px-8 h-full">
                <Card isBlurred className="w-full">
                    <CardHeader className="dark:bg-black/40 flex-row">
                        <h4 className="flex flex-col text-neutral-700 dark:text-white/90 uppercase font-black text-2xl">
                            {activity.title}
                        </h4>
                    </CardHeader>
                    <CardBody className="dark:bg-black/40 flex flex-col">
                        {true && (<p className="text-small dark:text-white/60 font-medium">
                            Descrição
                        </p>
                        )}
                    </CardBody>
                    <CardFooter className="flex flex-row justify-center gap-2 p-3 px-5 bg-gray-200 dark:bg-gray-700/50 mt-1">
                        <p className="text-tiny dark:text-white/60 font-medium">
                            Oradores
                        </p>
                        <div className="flex flex-row"> <p className="text-tiny"> Certificate </p> </div>
                        <div className="flex flex-row ml-auto pl-5 items-center gap-3">
                            <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                                TempoInicioh - TempoFinalh
                            </p>
                            {true && (
                                <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                                    Localização
                                </p>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    ) : (<></>)
}   