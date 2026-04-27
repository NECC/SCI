"use client";

import CreateUser from "@components/admin/CreateUser";
import GetDataTable from "@components/admin/GetDataTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Spinner,
  Card,
  CardBody,
} from "@nextui-org/react";
import { UsersGetResponse } from "@app/api/users/route";
import { FiUsers, FiShield, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

export default function UsersAdmin() {
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editPoints, setEditPoints] = useState("");
  const [editRole, setEditRole] = useState("");

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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<UsersGetResponse>(`/api/users?skip=${page * 50}&take=50`);
      if (data.users.length === 0) {
        setMore(false);
      } else {
        setMore(true);
        if (page === 0) {
          setUsers(data.users);
        } else {
          setUsers((prev) => [...prev, ...data.users]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    if (user.user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [fetchUsers, user]);

  const handleDeleteUser = async (userId: string) => {
    console.log("USER ID : ",userId);
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/delete/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleEditUser = (userItem: any) => {
    setSelectedUser(userItem);
    setEditPoints(userItem.points?.toString() || "0");
    setEditRole(userItem.role || "USER");
    onOpen();
  };

  const handleSaveUserChanges = async () => {
    if (!selectedUser) return;
    try {
      const updatePayload: any = {};
      
      if (parseInt(editPoints) !== selectedUser.points) {
        updatePayload.pointsAbsolute = parseInt(editPoints);
      }
      
      if (editRole !== selectedUser.role) {
        updatePayload.role = editRole;
      }
      
      if (Object.keys(updatePayload).length > 0) {
        await axios.put(`/api/users/${selectedUser.id}`, updatePayload);
      }
      
      onOpenChange();
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user.user?.role !== "ADMIN" && user.loaded) {
    router.push("/");
    return null;
  }

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const accreditedCount = users.filter((u) => u.accredited).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onClick={() => router.back()}
            className="text-white/80 hover:bg-white/20 transition-all"
          >
            <FiArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">Users Management</h1>
            <p className="text-white/70 text-lg mt-1">Manage users, roles, accreditation and permissions</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="admin-gradient-card admin-stats-card bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-indigo-600/30 border-blue-400/40 hover:scale-[1.02] transition-all">
          <CardBody className="gap-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Total Users</p>
                <p className="text-4xl font-bold text-white mt-2">{totalUsers}</p>
              </div>
              <FiUsers className="text-blue-300 text-5xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card bg-gradient-to-br from-purple-500/20 via-purple-600/20 to-violet-600/30 border-purple-400/40 hover:scale-[1.02] transition-all">
          <CardBody className="gap-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-semibold uppercase tracking-wide">Admins</p>
                <p className="text-4xl font-bold text-white mt-2">{adminCount}</p>
              </div>
              <FiShield className="text-purple-300 text-5xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-teal-600/30 border-emerald-400/40 hover:scale-[1.02] transition-all">
          <CardBody className="gap-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-semibold uppercase tracking-wide">Accredited</p>
                <p className="text-4xl font-bold text-white mt-2">{accreditedCount}</p>
              </div>
              <FiCheckCircle className="text-emerald-300 text-5xl" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Create User Card */}
        <Card className="lg:col-span-1 admin-gradient-card shadow-xl border-white/20">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <FiUsers className="text-emerald-400 text-2xl" />
              <h3 className="text-xl font-bold text-white">Add New User</h3>
            </div>
            <CreateUser onUserCreated={fetchUsers} />
          </CardBody>
        </Card>

        {/* Users Table */}
        <div className="lg:col-span-3">
          <Card className="admin-gradient-card shadow-2xl border-white/10">
            <CardBody className="p-0">
              <GetDataTable
                data={users}
                active="users"
                page={page}
                changePage={setPage}
                more={more}
                deleteUsers={handleDeleteUser}
                edit={handleEditUser}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" backdrop="blur">
        <ModalContent className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border-white/20">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 text-white border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold">Edit User</h3>
                <p className="text-white/70">{selectedUser?.email}</p>
              </ModalHeader>
              <ModalBody className="py-6 space-y-4">
                <Input
                  label="Name"
                  value={selectedUser?.name || ""}
                  isReadOnly
                  variant="bordered"
                  className="bg-white/5 text-white border-white/20"
                />
                <Input
                  label="Email"
                  value={selectedUser?.email || ""}
                  isReadOnly
                  variant="bordered"
                  className="bg-white/5 text-white border-white/20"
                />
                <Input
                  label="Points"
                  type="number"
                  value={editPoints}
                  onChange={(e) => setEditPoints(e.target.value)}
                  variant="bordered"
                  className="bg-white/10 text-white border-white/20"
                />
                <Select
                  label="Role"
                  selectedKeys={[editRole]}
                  onSelectionChange={(keys) => setEditRole(Array.from(keys)[0] as string)}
                  variant="bordered"
                  className="bg-white/10 text-white border-white/20"
                >
                  <SelectItem key="USER" value="USER">User</SelectItem>
                  <SelectItem key="STAFF" value="STAFF">Staff</SelectItem>
                  <SelectItem key="ADMIN" value="ADMIN">Admin</SelectItem>
                </Select>
                <Input
                  label="Course"
                  value={selectedUser?.graduation || "N/A"}
                  isReadOnly
                  variant="bordered"
                  className="bg-white/5 text-white border-white/20"
                />
                <Input
                  label="Academic Number"
                  value={selectedUser?.academicNumber || "N/A"}
                  isReadOnly
                  variant="bordered"
                  className="bg-white/5 text-white border-white/20"
                />
              </ModalBody>
              <ModalFooter className="border-t border-white/10 bg-white/5">
                <Button variant="light" color="danger" onPress={onClose}>Cancel</Button>
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg"
                  onPress={handleSaveUserChanges}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

