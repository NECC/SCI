"use client";

import { ActivityGetResponse } from "@app/api/activities/route";
import { EnrollmentGetResponse } from "@app/api/enrollments/route";
import { UsersGetResponse } from "@app/api/users/route";
import GetDataTable from "@components/admin/GetDataTable";
import TableFilter from "@components/admin/TableFilter";
import { Role } from "@node_modules/.prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { MdLocalActivity, MdScreenRotationAlt } from "react-icons/md";

export default function Admin() {
  const [user, setUser] = useState<{
    user: { name: string; email: string; role: Role } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [active, setActive] = useState("activities");
  const [prev, setPrev] = useState("activities");
  const [rows, setRows] = useState([]);
  const [backupData, setBackupData] = useState([]);
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

  const getUsers = async () => {
    if (prev != "users") setPage(0);
    const { data } = await axios.get<UsersGetResponse>(`/api/users?skip=${page}&take=10`);
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
        data.users.map((user) => {setRows([...rows,user])});
        data.users.map((user) => {setBackupData([...backupData,user])});
      }
    }
  };

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

  const getActivities = async () => {
    if (prev != "activities") setPage(0);
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
        data.activities.map((activity) => {setRows([...rows,activity])});
        data.activities.map((activity) => {setBackupData([...rows,activity])});
      }
    }
  };

  const getEnrollments = async () => {
    if (prev != "enrollments") setPage(0);
    const { data } = await axios.get<EnrollmentGetResponse>(`/api/enrollments?skip=${page}&take=20`);
    if (data.enrollments.length == 0){
      setMore(false);
    }
    else{
      // console.log(data.enrollments);
      setMore(true);
      if (page == 0 || prev != "enrollments"){
        setRows(
          data.enrollments.map((enrollment) => {
            return {
              activityId: enrollment.activity.id,
              activityName: enrollment.activity.title,
              userId: enrollment.user.id,
              userName: enrollment.user.name,
              id: enrollment.id,
            };
          })
        );
        setBackupData(data.enrollments);
      }
      else{
        data.enrollments.map((enrollment) => {setRows([...rows,{
          activityId: enrollment.activity.id,
          activityName: enrollment.activity.title,
          userId: enrollment.user.id,
          userName: enrollment.user.name,
          id: enrollment.id,
        }])});
        data.enrollments.map((enrollment) => {setBackupData([...rows,{
          activityId: enrollment.activity.id,
          activityName: enrollment.activity.title,
          userId: enrollment.user.id,
          userName: enrollment.user.name,
          id: enrollment.id,
        }])});
      }
    }
  };

  useEffect(() => {
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
  }, [active,page]);

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

  const activeClass = "bg-white text-black";
  const unactiveClass = "text-white/80 hover:bg-white/20";
  const optionsClass =
    "font-comfortaa font-bold p-4 flex cursor-pointer transition";
  const Icons = "text-lg mr-2 mt-[1px]";

  const handleActive = (e) => {
    const active = e.target.innerText?.toLowerCase();
    // console.log(active);
    setActive(active);
  };

  return (
    <div className="w-full p-3">
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
      <GetDataTable
        data={rows}
        active={active}
        page={page}
        changePage={setPage}
        more={more}
        deleteUsers={deleteUsers}
        deleteActivities={deleteActivities}
        deleteEnrollments={deleteEnrollments}
      />
    </div>
  );
}
