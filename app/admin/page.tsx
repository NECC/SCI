"use client";

import { ActivityGetResponse } from "@app/api/activities/route";
import { EnrollmentGetResponse } from "@app/api/enrollments/route";
import { UsersGetResponse } from "@app/api/users/route";
import GetDataTable from "@components/admin/GetDataTable";
import TableFilter from "@components/admin/TableFilter";
import { Role } from "@/lib/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { MdLocalActivity, MdScreenRotationAlt } from "react-icons/md";
import { Card, CardBody, CardHeader, Divider, Input, Spinner } from "@nextui-org/react";
import { FaRegCheckCircle } from "react-icons/fa";

export default function Admin() {
  const [user, setUser] = useState<{
    user: { name: string; email: string; role: Role } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [active, setActive] = useState("activities");
  const [prev, setPrev] = useState("activities");
  const [rows, setRows] = useState<any>([]);
  const [backupData, setBackupData] = useState<any>([]);
  const [edit, setEdit] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    role: "NO CHANGE",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  const [page,setPage] = useState(0);
  const [more,setMore] = useState(true);

  useEffect(() => {
    if (session) {
      setUser({ user: session.user, loaded: true });
    }
  }, [session]);

  const getUsers = useCallback(async () => {
    if (prev != "users") setPage(0);
    setLoading(true);
    const { data } = await axios.get<UsersGetResponse>(`/api/users?skip=${page}&take=50`);
    if (data.users.length == 0){
      setMore(false);
    }
    else{
      // console.log(data.users);
      setMore(true);
      if (page == 0 || prev != "users") {
        setRows(data.users);
        setBackupData(data.users);
      }
      else{
        setRows((rows: any[]) => [...rows,...data.users]);
        setBackupData((backupData: any) => [...backupData,...data.users]);
      }
    }
    setLoading(false);
  }, [page, prev]);

  const deleteActivities = async (id: string) => {
    // console.log(id);
    const { data } = await axios.delete(`/api/activities/delete/${id}`);
    getActivities();
  };

  const deleteUsers = async (id: string) => {
    // console.log(id);
    const { data } = await axios.delete(`/api/users/delete/${id}`);
    getUsers();
  };

  const deleteEnrollments = async (id: string) => {
    // console.log(id);
    const { data } = await axios.delete(`/api/enrollments/delete/${id}`);
    getEnrollments();
  };

  const getActivities = useCallback(async () => {
    if (prev != "activities") setPage(0);
    setLoading(true);
    const { data } = await axios.get<ActivityGetResponse>(`/api/activities?skip=${page}&take=10`);
    if (data.activities.length == 0){
      setMore(false);
    }
    else{
      // console.log(data.activities);
      setMore(true);
      if (page == 0 || prev != "activities"){
        setRows(data.activities);
        setBackupData(data.activities);
      }
      else{
        setRows((rows: any) => [...rows,...data.activities]);
        setBackupData((backupData: any) => [...backupData,...data.activities]);
      }
    }
    console.log("activities",data.activities);
    setLoading(false);
  }, [page, prev]);

  const getEnrollments = useCallback(async () => {
    if (prev != "enrollments") setPage(0);
    setLoading(true);
    const { data } = await axios.get<EnrollmentGetResponse>(`/api/enrollments?skip=${page}&take=20`);
    if (data.enrollments.length == 0){
      setMore(false);
    }
    else{
      // console.log(data.enrollments);
      setMore(true);
      if (page == 0 || prev != "enrollments"){
        setRows(data.enrollments);
        setBackupData(data.enrollments);
      }
      else{
        setRows((rows: any) => [...rows,...data.enrollments]);
        setBackupData((backupData: any) => [...backupData,...data.enrollments]);
      }
    }
    setLoading(false);
  }, [page, prev]);

  useEffect(() => {
    setEdit("");
    if (active == "users") {
      if (prev != active) {
        setRows([]);
        setPrev("users");
        setPage(0);
      }
      getUsers();
    } else if (active == "activities") {
      if (prev != "activities") {
        setRows([]);
        setPrev("activities");
        setPage(0);
      }
      getActivities();
    } else if (active == "enrollments") {
      if (prev != "enrollments") {
        setRows([]);
        setPrev("enrollments");
        setPage(0);
      }
      getEnrollments();
    }
  }, [active, page, getActivities, getEnrollments, getUsers, prev]);

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

  const activeClass = "bg-white text-black";
  const unactiveClass = "text-white/80 hover:bg-white/20";
  const optionsClass =
    "font-comfortaa font-bold p-4 flex cursor-pointer transition";
  const Icons = "text-lg mr-2 mt-[1px]";

  const handleActive = (e: any) => {
    const active = e.target.innerText?.toLowerCase();
    // console.log(active);
    setActive(active);
  };

  const editUser = (id: string) => {
    setEdit(id);
  }

  const handleChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    axios
      .put(`/api/users/edit/${edit}`, formData)
      .then((res) => {
        if (res.status == 200) {
          router.push("/admin");
        };
        console.log(res);
        setPage(0);
        getUsers();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
    setEdit("");
    setFormData({
      name: "",
      role: "NO CHANGE",
    });
  };

  return (
    <div className="w-full p-3">
      <div className={`${edit != "" ? "absolute z-20 text-white right-5" : "hidden"}`}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-1 mt-1"
        >
          <Card className="w-[250px]">
            <CardHeader className="flex justify-center bg-black text-white">
              Edit User: <br/> {edit}
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
                onChange={handleChange}
              />
              <select
                name="role"
                onChange={handleChange}
                required={true}
                value={formData.role}
                className="mx-2 rounded border p-2"
              >
                <option value="NOCHANGE">NO CHANGE</option>
                <option value="USER">USER</option>
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </CardBody>
            <button
              type="submit"
              className="flex bg-black hover:bg-slate-800 text-white justify-center items-center gap-1 p-2 w-full"
            >
              Confirm <FaRegCheckCircle />
            </button>
          </Card>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form> 
      </div>
      <div className="w-full flex rounded-lg bg-black border">
        <span className="text-white font-comfortaa font-bold text-base p-4 bg-white/20">
          Filter:{" "}
        </span>
        <div
          onClick={handleActive}
          className={`${optionsClass} ${
            active == "users" ? activeClass : unactiveClass
          }`}
        >
          <IoMdPerson className={`${Icons}`} />
          Users
        </div>
        <div
          onClick={handleActive}
          className={`${optionsClass} ${
            active == "activities" ? activeClass : unactiveClass
          }`}
        >
          <MdLocalActivity className={`${Icons}`} />
          Activities
        </div>
        <div
          onClick={handleActive}
          className={`${optionsClass} ${
            active == "enrollments" ? activeClass : unactiveClass
          }`}
        >
          <MdScreenRotationAlt className={`${Icons}`} />
          Enrollments
        </div>

        <TableFilter active={active} data={backupData} setData={setRows} />
      </div>
      {loading ? <div className="flex justify-center items-center h-[200px]"> <Spinner/> </div> : 
      <GetDataTable
        data={rows}
        active={active}
        page={page}
        changePage={setPage}
        more={more}
        deleteUsers={deleteUsers}
        deleteActivities={deleteActivities}
        deleteEnrollments={deleteEnrollments}
        edit={editUser}
      />}
    </div>
  );
}
