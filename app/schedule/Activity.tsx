"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Divider,
} from "@nextui-org/react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { SiGithubsponsors } from "react-icons/si";
import { CiMapPin, CiClock2 } from "react-icons/ci";
import { BsQrCode } from "react-icons/bs";
import { TbFileDownload } from "react-icons/tb";
import { MdOutlineEventSeat } from "react-icons/md";
import { HiServerStack } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { QRCodeSVG } from "qrcode.react";

import Pdf from "@/components/Pdf";
import { Activity as ActivityI, Enrollments, Speaker } from "@prisma/generated/zod";
import { EnrollmentPostResponse } from "@app/api/enrollments/route";
import { UserGetResponse } from "@app/api/users/[id]/route";
import { DeleteEnrrolmentResponse } from "@app/api/enrollments/deleteByUuid/route";
import { ActivityEnrolleesResponse } from "@app/api/activities/[id]/enrolled/route";

interface ActivityProps {
  item: ActivityI & {
    speaker: Speaker | null;
    enrollments: Enrollments[];
    enrollable: boolean;
    alreadyEnrolled: boolean;
    attended: boolean;
  };
  userId: string | null;
  userRole: string | null;
}

export default function Activity({ item, userId, userRole }: ActivityProps) {
  const router = useRouter();
 

  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [enrolled, setEnrolled] = useState<boolean>(item.alreadyEnrolled);
  const [enrollees, setEnrollees] = useState<string[]>([]);
  const [dados, setDados] = useState<UserGetResponse["user"]>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2 } = useDisclosure();
  const { isOpen: isOpen3, onOpen: onOpen3, onOpenChange: onOpenChange3 } = useDisclosure();

  const isFull = item.capacity != null && item.capacity > 0 && (item.enrollments?.length ?? 0) >= item.capacity;
  //console.log("Achievement",item.achievement)

  useEffect(() => {
    setEnrolled(item.alreadyEnrolled);
  }, [item.alreadyEnrolled]);

  const createEnrollment = async (activityId: number, uId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post<EnrollmentPostResponse>("/api/enrollments", {
        activityId,
        userId: uId,
      });
      if (data.response === "success" || data.response === "already_enrolled") {
        setEnrolled(true);
        getEnrolled();
      }
    } catch (err) {
      console.error("Enrollment failed", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEnrollment = async (activityId: number, uId: string) => {
    setDeleteLoading(true);
    try {
      const { data } = await axios.delete<DeleteEnrrolmentResponse>(
        `/api/enrollments/deleteByUuid?userId=${uId}&activityId=${activityId}`
      );
      if (data.response === "success") {
        setEnrolled(false);
        getEnrolled();
      }
    } catch (err) {
      console.error("Deletion failed", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getEnrolled = useCallback(async () => {
    try {
      const { data } = await axios.get<ActivityEnrolleesResponse>(`/api/activities/${item.id}/enrolled`);
      if (data.response === "success") {
        setEnrollees([...data.userNames].sort((a, b) => a.localeCompare(b)));
      }
    } catch (err) {
      console.error("Could not fetch enrollees", err);
    }
  }, [item.id]);

  useEffect(() => {
    getEnrolled();
  }, [getEnrolled]);

  useEffect(() => {
    if (item.attended && userId) {
      const fetchUserData = async () => {
        const { data } = await axios.get<UserGetResponse>(`/api/users/${userId}`);
        setDados(data.user);
      };
      fetchUserData();
    }
  }, [userId, item.attended]);

  return (
    <>
      <Card className="min-w-[18rem] max-w-[320px] border border-default-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
        <CardBody className="gap-4 pt-5 px-5">
          <div className="flex justify-between items-start">
            <Chip size="sm" variant="flat" color="primary" className="uppercase font-bold tracking-wider text-[10px]">
              {item.type}
            </Chip>
            <div className="flex gap-2">
              {isFull && <Chip color="danger" variant="flat" size="sm" className="font-semibold">Full</Chip>}
              {enrolled && <Chip color="success" variant="flat" size="sm" className="font-semibold">Enrolled</Chip>}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-foreground leading-tight tracking-tight mb-2">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-sm text-default-500 line-clamp-3">
                {item.description}
              </p>
            )}
          </div>

          <div className="bg-default-50 dark:bg-default-100/50 rounded-xl p-3 space-y-2 border border-default-100">
            <div className="flex items-center text-sm text-default-600 font-medium">
              <CiClock2 className="mr-2 text-primary text-lg" />
              {item.startTime}h - {item.endTime}h
            </div>
            {item.location && (
              <div className="flex items-center text-sm text-default-600 font-medium">
                <CiMapPin className="mr-2 text-primary text-lg" />
                {item.location}
              </div>
            )}
            {item.capacity != null && item.capacity > 0 && (
              <div className="flex items-center text-sm text-default-600 font-medium">
                <MdOutlineEventSeat className="mr-2 text-primary text-lg" />
                {item.enrollments?.length || 0} / {item.capacity} Seats Filled
              </div>
            )}
            {item.sponsor != "Non" && item.sponsor != null &&(
              <div className="flex items-center text-sm text-default-600 font-medium">
                <SiGithubsponsors className="mr-2 text-primary text-lg" />
                Sponsor - {item.sponsor}
              </div>
            )}
            {(
            <div className="flex items-center text-sm text-default-600 font-medium">
              <HiServerStack className="mr-2 text-primary text-lg" />
              {item.achievement.toUpperCase()} - {item.points} Pontos
            </div>
          )}
          </div>
        </CardBody>

        <Divider className="opacity-50" />

        
        <CardFooter className="flex flex-row justify-between items-center px-5 py-4 bg-default-50/30">  
          {item.speaker && (
            <div className="flex flex-col gap-2 w-1/2">
              <p className="text-[10px] uppercase font-bold text-default-400 tracking-wider">
                Speaker
              </p>
              <div className="flex items-center gap-2">
                <Avatar
                  src={item.speaker.picUrl ?? undefined}
                  name={item.speaker.name}
                  size="sm"
                  className="w-6 h-6 text-tiny"
                />
                <p className="text-xs font-semibold text-default-700 truncate">
                  {item.speaker.name}
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 items-end w-1/2">
            {userRole === "USER" && !item.attended && (
              enrolled ? (
                <div className="flex gap-2">
                  <Button size="sm" isIconOnly variant="shadow" color="primary" onPress={onOpen}>
                    <BsQrCode size={16} />
                  </Button>
                  <Button size="sm" color="danger" variant="flat" isLoading={deleteLoading} onPress={onOpen2}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  isLoading={loading}
                  size="sm"
                  radius="full"
                  color="primary"
                  variant={isFull ? "flat" : "shadow"}
                  isDisabled={isFull}
                  endContent={isFull ? null : <FaLongArrowAltRight />}
                  className="font-semibold"
                  onPress={() => userId ? createEnrollment(item.id, userId) : router.push("/auth/signup")}
                >
                  {isFull ? "Waitlist" : "Enroll Now"}
                </Button>
              )
            )}

            {userRole !== "USER" && (
              <Button size="sm" radius="full" variant="flat" color="secondary" onPress={onOpen3} className="font-semibold">
                View Enrollees
              </Button>
            )}

            {item.attended && dados?.name && (
              <PDFDownloadLink
                document={<Pdf data={{ name: dados.name, title: item.title }} user={{ name: dados.name, title: item.title }} />}
                fileName={`${item.title}_Certificate.pdf`}
              >
                <Button size="sm" color="success" variant="shadow" className="text-white font-semibold">
                  <TbFileDownload size={16} /> Certificate
                </Button>
              </PDFDownloadLink>
            )}
          </div>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                Activity QR Code - {item.title}
              </ModalHeader>
              <ModalBody className="pb-6">
                <p className="text-default-500 text-sm mb-4">
                  Show this QR Code to any staff member at the end of the workshop to claim your certificate.
                </p>
                <div className="flex justify-center bg-white p-4 rounded-xl shadow-inner border border-default-200">
                  {userId && <Code activityId={item.id} userId={userId} />}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cancel Enrollment
              </ModalHeader>
              <ModalBody>
                <p className="text-default-500">
                  Are you sure you want to cancel your enrollment for <span className="font-semibold text-foreground">{item.title}</span>?
                  You might lose your spot if the event fills up.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Nevermind
                </Button>
                <Button color="danger" variant="shadow" onPress={() => {
                  onClose();
                  deleteEnrollment(item.id, userId!);
                }}>
                  Yes, Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen3} onOpenChange={onOpenChange3} backdrop="blur" scrollBehavior="inside">
        <ModalContent className="max-h-[70vh]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Enrolled Users ({enrollees.length})
              </ModalHeader>
              <ModalBody>
                {enrollees.length === 0 ? (
                  <p className="text-default-500 italic text-center py-4">No one is enrolled yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {enrollees.map((enrollee, key) => (
                      <div key={key} className="p-2 rounded-lg bg-default-100/50 text-sm font-medium text-foreground">
                        {key + 1}. {enrollee}
                      </div>
                    ))}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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

const Code = ({ userId, activityId }: { userId: string; activityId: number }) => {
  return (
    <div className="flex justify-center items-center p-2">
      <QRCodeSVG
        value={`attend;${userId};${activityId}`}
        size={250}
        level="H"
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
};