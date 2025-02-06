"use client";

import Pdf from "@components/Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UsersAdmin() {
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  useEffect(() => {
    if (session) {
      setUser({ user: session.user, loaded: true });
    }
  }, [session]);

  const [formData, setFormData] = useState({
    name: "",  
    title: "",
  });

  const handleChange = (e) => {
    //console.log(formData);
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

  return (
    <div className="flex justify-start items-start gap-3 my-4 mx-12">
            <Card className="w-[250px]">
                <CardHeader className="flex justify-center bg-black text-white">
                    Create Custom Certificate
                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col items-center justify-center gap-1">
                    <Input
                        key="primary"
                        color="default"
                        type="text"
                        label="User"
                        className="max-w-[220px]"
                        required={true}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <Input
                        key="workshop"
                        color="default"
                        type="workshop"
                        label="Workshop"
                        name="title"
                        className="max-w-[220px]"
                        required={true}
                        value={formData.title}
                        onChange={handleChange}
                    />
                </CardBody>
                <PDFDownloadLink className="flex justify-center bg-black hover:bg-slate-800 text-white py-1" document={<Pdf data={formData} user={formData} />} fileName="certificate.pdf">
                    <button>
                        Create Certificate
                    </button>
                </PDFDownloadLink>
            </Card>  
    </div>
  );
}