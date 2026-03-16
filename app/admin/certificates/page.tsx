"use client";

import Pdf from "@components/Pdf";
import { Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RolePdf from "@components/RolePdf";

const days = [
  {key: "22", label: "22"},
  {key: "23", label: "23"},
  {key: "24", label: "24"}
]

const roles = [
  {key: "Organização", label: "Organização"},
  {key: "Staff", label: "Staff"}
]

export default function UsersAdmin() {
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const router = useRouter();
  const [certificate, setCerificate] = useState("Emergency");

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

  // keep "days" as an array since the NextUI <Select> in multiple mode
  // expects an array value.  initializing it to an empty string caused the
  // component to try to access `value.hasOwnProperty` and blow up when the
  // organisation certificate view was rendered.
  const [formData, setFormData] = useState<{ name: string; title: string; role: string; days: string[] }>({
    name: "",
    title: "",
    role: "",
    days: [],
  });

  // separate handlers for plain inputs and for NextUI selects.  the latter
  // doesn't fire a native event, it simply passes the new value(s), so the
  // old generic handler was reading `e.target` and eventually triggered a
  // runtime error (undefined.hasOwnProperty).
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // unused now, kept for reference in case other selects are added later
  // but not invoked anywhere in this component.
  const handleSelectChange = (name: string) => (value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? value : [value],
    }));
  };

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

  return (
    <div className="flex flex-col justify-start items-start gap-3 my-4 mx-12">
      <ButtonGroup>
        <Button className={certificate == "Emergency" ? "text-white bg-black" : ""} onPress={() => setCerificate("Emergency")}> Emergency certificate </Button>
        <Button className={certificate == "Organization" ? "text-white bg-black" : ""} onPress={() => setCerificate("Organization")}> Organization certificate </Button>
      </ButtonGroup>
      {certificate == "Emergency" && 
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                  />
              </CardBody>
              <button
                className="flex justify-center bg-black hover:bg-slate-800 text-white py-1"
                onClick={async () => {
                  try {
                    const resp = await fetch("/api/generate-certificate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        certificateType: "Emergency",
                        formData,
                      }),
                    });
                    if (!resp.ok) throw new Error("Server error");
                    const blob = await resp.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "certificate.pdf";
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("PDF generation failed", err);
                  }
                }}
              >
                Create Certificate
              </button>
          </Card>  
        </div>
      }
      {certificate == "Organization" && 
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
                      label="Name"
                      className="max-w-[220px]"
                      required={true}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                  />
                  <Select 
                    label="Select days of participation" 
                    selectionMode="multiple"
                    name="days"
                    selectedKeys={new Set(formData.days)}
                    onSelectionChange={(keys) => {
                      // `keys` is a Set in NextUI
                      const selectedArray = Array.from(keys).map(String);
                      setFormData(prev => ({ ...prev, days: selectedArray }));
                    }}
                  >
                    {days.map((day) => (
                      <SelectItem key={day.key}>{day.label}</SelectItem>
                    ))}
                  </Select>
                  <Select 
                    label="Select role"
                    name="role"
                    selectedKeys={formData.role ? new Set([formData.role]) : new Set()}
                    onSelectionChange={(keys) => {
                      // `keys` is a Set in NextUI; items are Key type (string | number)
                      const selectedArray = Array.from(keys);
                      setFormData(prev => ({ ...prev, role: selectedArray.length > 0 ? String(selectedArray[0]) : "" }));
                    }}
                  >
                    {roles.map((role) => (
                      <SelectItem key={role.key}>{role.label}</SelectItem>
                    ))}
                  </Select>
              </CardBody>
              <button
                className="flex justify-center bg-black hover:bg-slate-800 text-white py-1"
                onClick={async () => {
                  try {
                    const resp = await fetch("/api/generate-certificate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        certificateType: "Organization",
                        formData,
                      }),
                    });
                    if (!resp.ok) throw new Error("Server error");
                    const blob = await resp.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "certificate.pdf";
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("PDF generation failed", err);
                  }
                }}
              >
                Create Certificate
              </button>
          </Card>  
        </div>
      }
    </div>
  );
}