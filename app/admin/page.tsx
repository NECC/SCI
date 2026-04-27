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
import { Card, CardBody, CardHeader, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { FiUsers, FiActivity, FiList, FiBarChart, FiCheckCircle } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function Admin() {
  const [user, setUser] = useState<{
    user: { name: string; email: string; role: Role } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [active, setActive] = useState("activities");
  const [prev, setPrev] = useState("activities");
  const [rows, setRows] = useState<any>([]);
  const [backupData, setBackupData] = useState<any[]>([]);
  const [editId, setEditId] = useState("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    role: "NO CHANGE" as "NO CHANGE" | "USER" | "STAFF" | "ADMIN",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalEnrollments: 0,
  });

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  const [page, setPage] = useState(0);
  const [more, setMore] = useState(true);

  useEffect(() => {
    if (session) {
      setUser({ user: session.user, loaded: true });
    }
  }, [session]);

  // Load stats
  const loadStats = async () => {
    try {
      const [usersRes, activitiesRes, enrollRes] = await Promise.all([
        axios.get<UsersGetResponse>('/api/users'),
        axios.get<ActivityGetResponse>('/api/activities'),
        axios.get<EnrollmentGetResponse>('/api/enrollments'),
      ]);
      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalActivities: activitiesRes.data.activities?.length || 0,
        totalEnrollments: enrollRes.data.enrollments?.length || 0,
      });
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getUsers = useCallback(async () => {
    if (prev !== "users") setPage(0);
    setLoading(true);
    try {
      const { data } = await axios.get<UsersGetResponse>(`/api/users?skip=${page * 50}&take=50`);
      if (data.users.length === 0) {
        setMore(false);
      } else {
        setMore(true);
        if (page === 0 || prev !== "users") {
          setRows(data.users);
          setBackupData(data.users);
        } else {
          setRows((prevRows: any[]) => [...prevRows, ...data.users]);
          setBackupData((prevData: any) => [...prevData, ...data.users]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users');
    }
    setLoading(false);
  }, [page, prev]);

  const deleteActivities = async (id: string) => {
    await axios.delete(`/api/activities/delete/${id}`);
    getActivities();
  };

  const deleteUsers = async (id: string) => {
    await axios.delete(`/api/users/delete/${id}`);
    getUsers();
  };

  const deleteEnrollments = async (id: string) => {
    await axios.delete(`/api/enrollments/delete/${id}`);
    getEnrollments();
  };

  const getActivities = useCallback(async () => {
    if (prev !== "activities") setPage(0);
    setLoading(true);
    try {
      const { data } = await axios.get<ActivityGetResponse>(`/api/activities?skip=${page * 10}&take=10`);
      if (data.activities.length === 0) {
        setMore(false);
      } else {
        setMore(true);
        if (page === 0 || prev !== "activities") {
          setRows(data.activities);
          setBackupData(data.activities);
        } else {
          setRows((prevRows: any) => [...prevRows, ...data.activities]);
          setBackupData((prevData: any) => [...prevData, ...data.activities]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch activities');
    }
    setLoading(false);
  }, [page, prev]);

  const getEnrollments = useCallback(async () => {
    if (prev !== "enrollments") setPage(0);
    setLoading(true);
    const { data } = await axios.get<EnrollmentGetResponse>(`/api/enrollments?skip=${page}&take=20`);
    if (data.enrollments.length == 0){
      setMore(false);
    }
    else{
      // console.log(data.enrollments);
      // console.log(JSON.stringify(data.enrollments, null, 2));
      setMore(true);
      if (page == 0 || prev != "enrollments"){
        setRows(data.enrollments);
        setBackupData(data.enrollments);
      }
      else{
        setRows((rows: any) => [...rows,...data.enrollments]);
        setBackupData((backupData: any) => [...backupData,...data.enrollments]);
      }
    } catch (err) {
      console.error('Failed to fetch enrollments');
    }
    setLoading(false);
  }, [page, prev]);

  useEffect(() => {
    setEditId("");
    if (active === "users") {
      if (prev !== active) {
        setRows([]);
        setPrev("users");
        setPage(0);
      }
      getUsers();
    } else if (active === "activities") {
      if (prev !== "activities") {
        setRows([]);
        setPrev("activities");
        setPage(0);
      }
      getActivities();
    } else if (active === "enrollments") {
      if (prev !== "enrollments") {
        setRows([]);
        setPrev("enrollments");
        setPage(0);
      }
      getEnrollments();
    }
  }, [active, page, getActivities, getEnrollments, getUsers, prev]);

  if (status === "loading") return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  if (user.user?.role !== "ADMIN" && user.loaded) router.push("/");

  const tabs = [
    { key: 'users', label: 'Users', icon: IoMdPerson, count: stats.totalUsers },
    { key: 'activities', label: 'Activities', icon: MdLocalActivity, count: stats.totalActivities },
    { key: 'enrollments', label: 'Enrollments', icon: MdScreenRotationAlt, count: stats.totalEnrollments },
  ];

  const handleTabChange = (key: string) => setActive(key);

  const editUser = (id: string) => {
    // Find user data
    const userData = backupData.find((row: any) => row.id === id);
    if (userData) {
      setEditFormData({ name: userData.name || '', role: 'NO CHANGE' });
    }
    setEditId(id);
    onOpen();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData.role === "NO CHANGE") return;
    setErrorMessage("");
    try {
      await axios.put(`/api/users/edit/${editId}`, editFormData);
      getUsers(); // Refresh if users
      onOpenChange();
    } catch (err: any) {
      setErrorMessage(err.message || "Update failed");
    }
  };

  const EmptyState = () => (
    <div className="text-center py-20">
<FiBarChart className="mx-auto h-16 w-16 text-white/50 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">No data yet</h3>
      <p className="text-white/60">Start by creating users, activities, or enrollments.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="admin-header">Dashboard</h1>
        </div>
        <p className="text-white/70 text-lg">Overview & quick actions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="admin-gradient-card admin-stats-card from-blue-500/20 to-blue-600/20 border-blue-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
              </div>
              <FiUsers className="text-blue-300 text-4xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card from-emerald-500/20 to-emerald-600/20 border-emerald-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wide">Activities</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalActivities}</p>
              </div>
              <FiActivity className="text-emerald-300 text-4xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card from-purple-500/20 to-purple-600/20 border-purple-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide">Enrollments</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalEnrollments}</p>
              </div>
              <FiList className="text-purple-300 text-4xl" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs/Filter */}
      <Card className="admin-gradient-card">
        <CardBody className="p-0">
          <div className="flex flex-wrap gap-2 p-4 bg-white/5 border-b border-white/10">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <Button
                key={key}
                variant={active === key ? "solid" : "light"}
                color="primary"
                className={`font-comfortaa font-bold ${active === key ? 'bg-white/20 backdrop-blur-sm' : 'text-white/80 hover:bg-white/10'}`}
                onPress={() => handleTabChange(key)}
                startContent={<Icon size={18} />}
                endContent={count > 0 && <span className="ml-1 text-xs bg-white/20 px-2 py-1 rounded-full">{count}</span>}
              >
                {label}
              </Button>
            ))}
            <div className="flex-1 flex justify-end">
              <TableFilter active={active} data={backupData} setData={setRows} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card className="admin-gradient-card border-white/10 shadow-2xl">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : rows.length === 0 ? (
            <EmptyState />
          ) : (
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
            />
          )}
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900">Edit User Role</h3>
              </ModalHeader>
              <form onSubmit={handleEditSubmit}>
                <ModalBody className="py-4">
                  <Input
                    label="Name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="mb-4"
                  />
                  <Select
                    label="Role"
                    name="role"
                    selectedKeys={editFormData.role === "NO CHANGE" ? [] : [editFormData.role]}
                    onChange={handleEditChange}
                    className="w-full"
                  >
                    <SelectItem key="USER">USER</SelectItem>
                    <SelectItem key="STAFF">STAFF</SelectItem>
                    <SelectItem key="ADMIN">ADMIN</SelectItem>
                  </Select>
                  {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>Cancel</Button>
                  <Button color="primary" type="submit">Update Role</Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

