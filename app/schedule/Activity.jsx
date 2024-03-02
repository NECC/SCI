import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  user,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { FaCheck, FaLongArrowAltRight } from "react-icons/fa";
import { CiMapPin, CiClock2 } from "react-icons/ci";
import { BsQrCode } from "react-icons/bs";
import { TbFileDownload } from "react-icons/tb";
import { MdEventSeat } from "react-icons/md";
import { set } from "zod";
import QRCode from "easyqrcodejs";

// TODO: Loading state for the button

export default function Activity({ item, userId }) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [attended, setAttended] = useState(false);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  // console.log(attended);
  // console.log(userId);
  // console.log(item.enrollments.length, item.capacity, item.enrollments.length == item.capacity)
  console.log(item);

  // TODO: Handle the userId properly (it's undefined for now)
  const createEnrollment = async (activityId, userId) => {
    setLoading(true);
    const { data } = await axios.post("/api/enrollments", {
      activityId: activityId,
      userId: userId,
    });
    if (data.response === "success" || data.response === "already_enrolled") {
      item.alreadyEnrolled = true;
      item.enrollments.push({ userId: userId, activityId: activityId });
      setEnrolled(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    setEnrolled(item.alreadyEnrolled);
  }, [item.alreadyEnrolled]);

  useEffect(() => {
    const getAttended = async () => {
      if (userId == undefined) return;

      setLoading(true);
      const { data } = await axios.get(
        `/api/enrollments/attend/${item.id}/${userId}`
      );
      // console.log(data.attended);
      setAttended(data.attended);
      setLoading(false);
    };
    getAttended();
  }, [userId, item.id]);

  return (
    <>
      <Card className="min-w-[18rem] max-w-[300px]" shadow="sm">
        <CardBody className="gap-2 p-5 rounded-2xl">
          {item.speakers && (
            <div className="text-tiny text-black/60 dark:text-white/60 uppercase font-bold mb-1">
              {item.type}

              {enrolled && (
                <Chip color="success" size="sm" className="ml-2 text-white">
                  Enrolled
                </Chip>
              )}

              {item.capacity == item.enrollments?.length && (
                <Chip color="danger" size="sm" className="ml-2 text-white">
                  Full
                </Chip>
              )}
            </div>
          )}
          <h4 className="dark:text-white/90 font-bold text-xl">{item.title}</h4>
          {item.description && (
            <p className="text-small dark:text-white/60 font-medium mb-2">
              {item.description}
            </p>
          )}
          {item.location && (
            <div className="flex flex-row mr-auto items-center">
              <CiMapPin className="inline mr-2" />
              <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                {item.location}
              </p>
            </div>
          )}
          <div className="flex flex-row mr-auto items-center">
            <CiClock2 className="inline mr-2" />
            <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
              {item.startTime}h - {item.endTime}h
            </p>
          </div>
          {item.type == "WORKSHOP" && (item.enrollments?.length != 0) && (
            <div className="flex flex-row mr-auto items-center">
              <MdEventSeat className="inline mr-2" />
              <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                {item.enrollments?.length}/{item.capacity}
              </p>
            </div>
          )}
        </CardBody>
        {(item.location || item.speakers) && (
          <CardFooter className="flex flex-row gap-2 p-5 dark:bg-gray-700/50 mt-1">
            <Image
              src="https://avatars.githubusercontent.com/u/44109954?v=4"
              alt="logo"
              width={30}
              height={30}
            />
            <p className="text-tiny dark:text-white/60 font-medium">
              {item.speakers}
            </p>
            {item.enrollable && !item.alreadyEnrolled && (
              <div className="ml-auto">
                <Button
                  isLoading={loading}
                  className=""
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
                  Enroll
                </Button>
              </div>
            )}
            {item.alreadyEnrolled && userId && !attended && (
              <div className="ml-auto">
                <Button
                  size="sm"
                  radius="full"
                  color="primary"
                  className="text-tiny text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpen();
                    e.stopPropagation();
                  }}
                >
                  <BsQrCode className="text-medium" />
                </Button>
              </div>
            )}
            {attended && (
              <div className="flex flex-row ml-auto">
                <Button
                  size="sm"
                  radius="full"
                  color="success"
                  className="text-tiny text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Certificate <TbFileDownload />
                </Button>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Activitity QR Code
              </ModalHeader>
              <ModalBody>
                <p>
                  Show this QRCode to any staff member in the end of your
                  workshop to withdraw your certificate.
                </p>
                <Code activityId={item.id} userId={userId} />
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button color="danger" variant="solid" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const Code = ({ userId, activityId }) => {
  const qrcode = useRef(null);
  const currentUrl =
    process.env.NEXT_PUBLIC_MODE == "development"
      ? process.env.NEXT_PUBLIC_BACKOFFICE_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_BACKOFFICE_URL_PRODUCTION;

  // console.log(currentUrl);

  useEffect(() => {
    var options = {
      text: "Scan the QRCode to withdraw your certificate",
      width: 300,
      height: 300,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    };

    const code = new QRCode(qrcode.current, options);
    code.makeCode(`${currentUrl}/admin/qrcodes/${activityId}/${userId}`);
    return () => code.clear();
  }, [qrcode, currentUrl, userId, activityId]);

  return (
    <div className="dark:bg-black/40 h-full flex justify-center flex-col items-center">
      <div className="h-[1px] mb-4 bg-black/20 w-full"></div>
      <div ref={qrcode}></div>
    </div>
  );
};
