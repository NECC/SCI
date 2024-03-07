"use client";

import GetDataTable from "@components/admin/GetDataTable";
import TableFilter from "@components/admin/TableFilter";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { MdLocalActivity, MdScreenRotationAlt } from "react-icons/md";

export default function Admin() {
  const [user, setUser] = useState({});
  const [active, setActive] = useState("activities");
  const [rows, setRows] = useState([]);
  const [backupData, setBackupData] = useState([]);
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

  const getUsers = async () => {
    const { data } = await axios.get("/api/users");
    // console.log(data.users);
    setRows(data.users);
    setBackupData(data.users);
  };

  const deleteActivities = async (id) => {
    // console.log(id);
    const { data } = await axios.delete(`/api/activities/delete/${id}`);
    getActivities();
  }

  const deleteUsers = async (id) => {
    // console.log(id);
    const { data } = await axios.delete(`/api/users/delete/${id}`);
    getUsers();
  };

  const deleteEnrollments = async (id) => {
    // console.log(id);
    const { data } = await axios.delete(`/api/enrollments/delete/${id}`);
    getEnrollments();
  };

  const getActivities = async () => {
    const { data } = await axios.get("/api/activities");
    // console.log(data.activities);
    setRows(data.activities);
    setBackupData(data.activities);
  }

  const getEnrollments = async () => {
    const { data } = await axios.get("/api/enrollments");
    // console.log(data.enrollments);
    setRows(data.enrollments.map((enrollment) => {
      return {
        activityId: enrollment.activity.id,
        activityName: enrollment.activity.title,
        userId: enrollment.user.id,
        userName: enrollment.user.name,
        id: enrollment.id,
      }}));
    setBackupData(data.enrollments);
  }

  useEffect(() => {
    if (active == "users") {
      getUsers();
    } else if (active == "activities") {
      getActivities();
    } else if (active == "enrollments") {
      getEnrollments();
    }
  }, [active]);

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

        <TableFilter active={active} data={backupData} setData={setRows}/>

      </div>
      <GetDataTable data={rows} active={active} deleteUsers={deleteUsers} deleteActivities={deleteActivities} deleteEnrollments={deleteEnrollments}/>
    </div>
  );
}
