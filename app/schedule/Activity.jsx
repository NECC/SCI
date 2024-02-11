import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { FaCheck, FaLongArrowAltRight } from "react-icons/fa";
import { CiMapPin } from "react-icons/ci";

export default function Activity({ item }) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const createEnrollment = async (activityId, userId) => {
    setLoading(true);
    const { data } = await axios.post("/api/enrollments", {
      activityId: activityId,
      userId: userId,
    });
    if (data.response === "success" || data.response === "already_enrolled") {
      item.alreadyEnrolled = true;
      setEnrolled(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    setEnrolled(item.alreadyEnrolled);
  }, [item.alreadyEnrolled]);

  return (
    <Card className="min-w-[18rem] max-w-[300px]" shadow="sm">
      <CardBody className="gap-2 p-5 rounded-2xl">
        {item.speakers && (
          <p className="text-tiny text-black/60 dark:text-white/60 uppercase font-bold mb-1">
            {item.type}
          </p>
        )}
        <h4 className="dark:text-white/90 font-bold text-xl">{item.title}</h4>
        {item.description && (
          <p className="text-small dark:text-white/60 font-medium">
            {item.description}
          </p>
        )}
        {(item.enrollable || item.alreadyEnrolled) && (
          <div>
            <Button
              isLoading={loading}
              className="mt-4"
              size="sm"
              radius="full"
              color="primary"
              isDisabled={enrolled}
              variant="solid"
              endContent={!enrolled ? <FaLongArrowAltRight /> : <FaCheck />}
              onClick={(e) => {
                createEnrollment(item.id);
              }}
            >
              {enrolled ? "Enrolled" : "Enroll"}
            </Button>
          </div>
        )}
      </CardBody>
      {(item.location || item.speakers) && (
        <CardFooter className="flex flex-row gap-2 p-3 px-5 bg-gray-200 dark:bg-gray-700/50 mt-1">
          <Image
            src="https://avatars.githubusercontent.com/u/44109954?v=4"
            alt="logo"
            width={30}
            height={30}
          />
          <p className="text-tiny dark:text-white/60 font-medium">
            {item.speakers}
          </p>
          {item.location && (
            <div className="flex flex-row ml-auto pl-5 items-center">
              <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                {item.location}
              </p>
              <CiMapPin className="inline ml-2" />
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
