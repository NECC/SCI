"use client"
import Nav from "@components/Nav";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  ButtonGroup,
  Chip,
} from "@nextui-org/react";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { ActivityGetResponseById } from "@app/api/activities/[id]/route";

// TODO: Do loading state
export default function Activity({ params }) {
  const [activity, setActivity] = useState<ActivityGetResponseById["activity"][0]>();
  
  useEffect(() => {
    const fetchActivity = async () => {
      const { data } = await axios.get<ActivityGetResponseById>(`/api/activities/${params.id}`);
      setActivity(data.activity[0]);
    };
    fetchActivity();
  }
  , []);

  const getActivityDay = () => {
      const date = new Date(activity.date);
      const day = date.getUTCDate();
      return day
  }

  return (
    <div className="bg-white dark:bg-black bg-[url('/rectangle_light.png')] dark:bg-[url('/rectangle.png')] h-screen bg-no-repeat bg-top bg-cover">
      <div className="p-2 pb-10 md:p-7 md:px-8 pt-[70px] md:pt-[100px] h-full">
        <Card isBlurred className="w-full h-full dark:bg-black/40">
          <CardHeader className="dark:bg-black/40 border-b-1 dark:border-default-600">
            <div className="flex gap-2 items-center p-2">
              <div className="flex flex-row dark:text-white/90 items-center gap-5">
                <Button>
                  <IoIosArrowBack />
                  <a href="/schedule">Back</a>
                </Button>
                <h2 className="uppercase font-black text-2xl">DAY {getActivityDay()}</h2>
              </div>
            </div>
          </CardHeader>
          <CardBody className="gap-2 p-5 rounded-2xl">
            <h1 className="dark:text-white/90 font-bold text-2xl">
              {activity.title}
            </h1>
            {activity.description && (
              <p className="text-small dark:text-white/60 font-medium">
                {activity.description}
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
