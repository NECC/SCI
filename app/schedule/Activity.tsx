import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  Link,
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
import { MdOutlineEventSeat } from "react-icons/md";
import QRCode from "easyqrcodejs";
import { useRouter } from "next/navigation";
import Pdf from "@/components/Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Spinner } from "@nextui-org/react";
import { Activity as ActivityI, Enrollments, Speaker } from "@prisma/generated/zod";
import { EnrollmentPostResponse } from "@app/api/enrollments/route";
import { UserGetResponse } from "@app/api/users/[id]/route";
import { DeleteEnrrolmentResponse } from "@app/api/enrollments/deleteByUuid/route";
import { ActivityEnrolleesResponse } from "@app/api/activities/[id]/enrolled/route";
// TODO: Loading state for the button

interface ActivityProps {
  item: ActivityI & {
    speakers: Speaker[];
    enrollments: Enrollments[];
    enrollable: boolean;
    alreadyEnrolled: boolean;
    attended: boolean;
  };
  userId: string | null;
  userRole: string | null;
}

export default function Activity({ item, userId, userRole }: ActivityProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const [enrollees, setEnrollees] = useState<string[]>([]);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const { isOpen: isOpen2, onOpenChange: onOpenChange2, onOpen: onOpen2 } = useDisclosure();
  const { isOpen: isOpen3, onOpenChange: onOpenChange3, onOpen: onOpen3 } = useDisclosure();
  const [dados, setDados] = useState<UserGetResponse["user"]>();
  const router = useRouter();

  // TODO: Handle the userId properly (it's undefined for now)
  const createEnrollment = async (activityId: number, userId: string) => {
    if (!userId) {
      router.push("/auth/signup");
      return;
    }
    setLoading(true);
    const { data } = await axios.post<EnrollmentPostResponse>(
      "/api/enrollments",
      {
        activityId: activityId,
        userId: userId,
      }
    );
    if (data.response === "success" || data.response === "already_enrolled") {
      item.alreadyEnrolled = true;
      item.enrollments.push({ userId: userId, activityId: activityId });
      setEnrolled(true);
    }
    else console.log(data.error);
    setLoading(false);
  };

  const deleteEnrollment = async (activityId: number, userId: string) => {
    const { data } = await axios.delete<DeleteEnrrolmentResponse>(`/api/enrollments/deleteByUuid?userId=${userId}&activityId=${activityId}`);
    if (data.response === "success") {
      item.alreadyEnrolled = false;
      item.enrollments = item.enrollments.filter((enrollment) => enrollment.userId !== userId);
      setEnrolled(false);
    } else {
      console.log(data.error);
    }
  };

  const getEnrolled = async () => {
    const { data } = await axios.get<ActivityEnrolleesResponse>(`/api/activities/${item.id}/enrolled`);
    if (data.response === "success") {
      setEnrollees(data.userNames.sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())));
    } else {
      console.log(data.error);
    }
  }; 

  useEffect(() => {
    setEnrolled(item.alreadyEnrolled);
    getEnrolled();
  }, [item.alreadyEnrolled]);

  useEffect(() => {
    if (item.attended) {
      setLoading(true);

      const downloadCertificate = async () => {
        const { data } = await axios.get<UserGetResponse>(`/api/users/${userId}`);
        setDados(data.user);
      };

      downloadCertificate();
      setLoading(false);
    }
  }, [userId, item.attended]);

  return (
    <>
      <Card className="min-w-[18rem] max-w-[300px]" shadow="sm">
        <CardBody className="gap-2 pt-5 rounded-2xl">
          {item.speakers && item.type === "WORKSHOP" && (
            <div className="text-tiny text-black/60 dark:text-white/60 uppercase font-bold mb-1">
              {item.type}

              {item.enrollments && item.capacity == item.enrollments.length && item.capacity > 0 && (
                <Chip
                  color="danger"
                  variant="bordered"
                  size="sm"
                  className="ml-2"
                >
                  Full
                </Chip>
              )}
              {enrolled && (
                <Chip
                  color="success"
                  variant="bordered"
                  size="sm"
                  className="ml-2"
                >
                  Enrolled
                </Chip>
              )}

              {((item.capacity == item.enrollments?.length && item.capacity > 0) || item.capacity == -1) && (
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
          {item.url && item.capacity > 0 && (
            <Link href={item.url} target="_blank"> Enrollment Form </Link>
          )}
          <div className="flex flex-row mr-auto items-center">
            <CiClock2 className="inline mr-2" />
            <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
              {item.startTime}h - {item.endTime}h
            </p>
          </div>
          {item.location && (
            <div className="flex flex-row mr-auto items-center">
              <CiMapPin className="inline mr-2" />
              <p className="text-tiny dark:text-white/50 font-tiny">
                {item.location}
              </p>
            </div>
          )}
          {item.type == "WORKSHOP" && item.capacity > 0 &&(
              <div className="flex flex-row mr-auto items-center">
                <MdOutlineEventSeat className="inline mr-2" />
                <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                  {item.enrollments !== undefined ? item.enrollments.length : 0}
                  /{item.capacity}
                </p>
              </div>
            )}
        </CardBody>
        {item.capacity > 0 && item.speakers && item.type === "WORKSHOP" && (
          <CardFooter className="flex flex-row gap-2 dark:bg-gray-700/50 mt-1">
            <div className="flex flex-col gap-2">
              {item.speakers.map((speaker, key) => (
                <div key={key} className="flex flex-row gap-2">
                  <Image src={speaker.picUrl} alt="logo" width={30} height={30} />
                  <p className="text-tiny dark:text-white/60 font-medium items-center">
                        {speaker.name}
                  </p>
                </div>
              ))}
            </div>
            {!item.alreadyEnrolled && userRole == "USER" && (
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
                    if (userId == undefined) {
                      router.push("/auth/signup");
                      return;
                    }
                    createEnrollment(item.id, userId);
                  }}
                >
                  Enroll
                </Button>
              </div>
            )}
            {userRole != "USER" && (
              <div className="ml-auto flex flex-col">
                <Button
                  size="sm"
                  radius="full"
                  variant="faded"
                  color="primary"
                  className="text-tiny"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpen3();
                    e.stopPropagation();
                  }}
                >
                  Enrollees
                </Button>
              </div>
            )}

            {item.alreadyEnrolled && userRole == "USER" && userId && !item.attended && (
              <div className="ml-auto flex flex-col">
                <Button
                  size="sm"
                  radius="full"
                  variant="faded"
                  color="primary"
                  className="text-tiny"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpen();
                    e.stopPropagation();
                  }}
                >
                  <BsQrCode className="text-medium" />
                </Button>
                <Button
                  size="sm"
                  radius="full"
                  variant="solid"
                  color="danger"
                  className="text-tiny"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpen2();
                    e.stopPropagation();
                  }}
                >
                  Cancel Enroll
                </Button>
              </div>
            )}
            {item.attended && userRole == "USER" && dados?.name && (
              <div className="flex flex-row ml-auto">
                <PDFDownloadLink
                  document={<Pdf data={{name: dados.name, title: item.title}} user={{name: dados.name, title: item.title}} />}
                  fileName="certificate.pdf"
                >
                  <Button
                    isLoading={loading}
                    size="sm"
                    radius="full"
                    color="success"
                    className="text-tiny text-white"
                  >
                    Certificate <TbFileDownload />
                  </Button>
                </PDFDownloadLink>
              </div>
            )}
          </CardFooter>
        )}
        {( item.capacity == 0 || item.type !== "WORKSHOP") && (
          <CardFooter className="flex flex-row gap-2 p-5 dark:bg-gray-700/50 mt-1">
            <div className="flex flex-col gap-2">
              {item.speakers.map((speaker, key) => (
                <div key={key} className="flex flex-row gap-2">
                  <Image src={speaker.picUrl} alt="logo" width={30} height={30} />
                  <p className="text-tiny dark:text-white/60 font-medium items-center">
                        {speaker.name}
                  </p>
                </div>
              ))}
            </div>
            {userId && userRole == "USER" && !item.attended && (
              <div className="ml-auto">
                <Button
                  size="sm"
                  radius="full"
                  variant="faded"
                  color="primary"
                  className="text-tiny"
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
            {item.attended && userRole == "USER" && dados?.name && (
              <div className="flex flex-row ml-auto">
                <PDFDownloadLink
                  document={<Pdf data={{name: dados.name, title: item.title}} user={{name: dados.name, title: item.title}} />}
                  fileName="certificate.pdf"
                >
                  <Button
                    isLoading={loading}
                    size="sm"
                    radius="full"
                    color="success"
                    className="text-tiny text-white"
                  >
                    Certificate <TbFileDownload />
                  </Button>
                </PDFDownloadLink>
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
                {userId && <Code activityId={item.id} userId={userId} />}
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
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete enrollment
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to cancel your enrollment in this activity?
                </p>
              </ModalBody>
              <ModalFooter className="flex flex-row justify-center">
                <Button color="success" className="text-white" variant="solid" onPress={() => {
                  onClose();
                  deleteEnrollment(item.id, userId);
                }
                  }>
                  Yes
                </Button>
                <Button color="danger" variant="solid" onPress={onClose}>
                  No
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen3} onOpenChange={onOpenChange3} className="overflow-y-scroll h-[50vh]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                All Enrolled in this activity
              </ModalHeader>
              <ModalBody>
                { enrollees && enrollees.map((enrollee, key) => (
                  <p key={key} className="text-tiny dark:text-white/60 font-medium mb-2">
                    {enrollee}
                  </p>
                ))}
              </ModalBody>
              <ModalFooter className="flex flex-row justify-center">
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

const Code = ({ userId, activityId }: {userId: string, activityId: number}) => {
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
    code.makeCode(`attend;${userId};${activityId}`);
    return () => code.clear();
  }, [qrcode, currentUrl, userId, activityId]);

  return (
    <div className="dark:bg-black/40 h-full flex justify-center flex-col items-center">
      <div className="h-[1px] mb-4 bg-black/20 w-full"></div>
      <div ref={qrcode}></div>
    </div>
  );
};
