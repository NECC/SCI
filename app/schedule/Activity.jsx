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
import { MdOutlineEventSeat } from "react-icons/md";
import QRCode from "easyqrcodejs";
import { useRouter } from "next/navigation";
import Pdf from "@/components/Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Spinner } from "@nextui-org/react";
// TODO: Loading state for the button

export default function Activity({ item, userId }) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [dados, setDados] = useState({});
  const router = useRouter();

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
    if (item.attended) {
      setLoading(true);

      const downloadCertificate = async () => {
        const { data } = await axios.get(`/api/users/${userId}`);
        setDados(data.user);
      };

      downloadCertificate();
      setLoading(false);
    }
  }, [userId, item.attended]);

  return (
    <>
      <Card className="min-w-[18rem] max-w-[300px]" shadow="sm">
        <CardBody className="gap-2 p-5 rounded-2xl">
          {item.speakers && item.type !== "OTHER" && (
            <div className="text-tiny text-black/60 dark:text-white/60 uppercase font-bold mb-1">
              {item.type}

              {item.enrollments && item.capacity == item.enrollments.length && (
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
          <div className="flex flex-row mr-auto items-center">
            <CiClock2 className="inline mr-2" />
            <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
              {item.startTime}h - {item.endTime}h
            </p>
          </div>
          {item.location && (
            <div className="flex flex-row mr-auto items-center">
              <CiMapPin className="inline mr-2" />
              <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                {item.location}
              </p>
            </div>
          )}
          {item.type == "WORKSHOP" &&
            item.enrollments?.length != 0 &&
            item.enrollments?.length && (
              <div className="flex flex-row mr-auto items-center">
                <MdOutlineEventSeat className="inline mr-2" />
                <p className="text-tiny dark:text-white/50 font-tiny whitespace-nowrap">
                  {item.enrollments !== undefined ? item.enrollments.length : 0}
                  /{item.capacity}
                </p>
              </div>
            )}
        </CardBody>
        {item.speakers && item.type !== "OTHER" && (
          <CardFooter className="flex flex-row gap-2 p-5 dark:bg-gray-700/50 mt-1">
            <Image src={item.picUrl} alt="logo" width={30} height={30} />
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
                    if (userId == undefined) {
                      router.push("/auth/signup");
                      return;
                    }
                    createEnrollment(item.id);
                  }}
                >
                  Enroll
                </Button>
              </div>
            )}

            {item.alreadyEnrolled && userId && !item.attended && (
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
            {item.attended && dados?.name && (
              <div className="flex flex-row ml-auto">
                <PDFDownloadLink
                  document={<Pdf data={item} user={dados} />}
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
    code.makeCode(`${currentUrl}admin/qrcodes/${activityId}/${userId}`);
    return () => code.clear();
  }, [qrcode, currentUrl, userId, activityId]);

  return (
    <div className="dark:bg-black/40 h-full flex justify-center flex-col items-center">
      <div className="h-[1px] mb-4 bg-black/20 w-full"></div>
      <div ref={qrcode}></div>
    </div>
  );
};
