"use client";

import CreateUser from "@components/admin/CreateUser";
import GetDataTable from "@components/admin/GetDataTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (user.user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<UsersGetResponse>("/api/users?skip=0&take=-1");
      if (data.response === "success") {
        setUsers(data.users);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false);
    }
  };

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
    setEditPoints(userItem.points.toString());
    setEditRole(userItem.role);
    onOpen();
  };

  const handleSaveUserChanges = async () => {
    if (!selectedUser) return;
    try {
      const updatePayload: any = {};
      
      // Only include changed values
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
      <div className="bg-gradient-to-r from-custom-blue-1 to-custom-blue-3 min-h-screen flex items-center justify-center">
        <Spinner color="white" size="lg" />
      </div>
    );
  }
  if (user.user?.role !== "ADMIN" && user.loaded) router.push("/");

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const accreditedCount = users.filter((u) => u.accredited).length;

  return (
    <div className="bg-gradient-to-br from-custom-blue-1 via-custom-blue-2 to-custom-blue-3 min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Button
              isIconOnly
              variant="light"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10"
            >
              <FiArrowLeft size={24} />
            </Button>
            <h1 className="text-5xl font-bold text-white">User Management</h1>
          </div>
          <p className="text-white/60 text-lg ml-12">Manage users, roles, and permissions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 backdrop-blur-md hover:shadow-lg transition-shadow duration-300">
            <CardBody className="gap-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Users</p>
                  <p className="text-4xl font-bold text-white mt-2">{totalUsers}</p>
                </div>
                <FiUsers className="text-blue-300" size={40} />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 backdrop-blur-md hover:shadow-lg transition-shadow duration-300">
            <CardBody className="gap-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Admins</p>
                  <p className="text-4xl font-bold text-white mt-2">{adminCount}</p>
                </div>
                <FiShield className="text-purple-300" size={40} />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 backdrop-blur-md hover:shadow-lg transition-shadow duration-300">
            <CardBody className="gap-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Accredited</p>
                  <p className="text-4xl font-bold text-white mt-2">{accreditedCount}</p>
                </div>
                <FiCheckCircle className="text-green-300" size={40} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Table Section */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Users List</h2>
            <CreateUser onUserCreated={() => fetchUsers()} />
          </div>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
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
        <ModalContent className="bg-gradient-to-br from-custom-blue-2 to-custom-blue-3">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white border-b border-white/10">
                <p className="text-xl font-bold">Edit User</p>
                <p className="text-sm text-white/60">{selectedUser?.name}</p>
              </ModalHeader>
              <ModalBody className="gap-4 py-6">
                <div className="space-y-4">
                  <Input
                    label="Email"
                    value={selectedUser?.email}
                    isReadOnly
                    variant="flat"
                    className="bg-white/5"
                  />
                  <Input
                    label="Name"
                    value={selectedUser?.name}
                    isReadOnly
                    variant="flat"
                    className="bg-white/5"
                  />
                  <Input
                    label="Points"
                    type="number"
                    value={editPoints}
                    onChange={(e) => setEditPoints(e.target.value)}
                    className="bg-white/5"
                  />
                  <Select
                    label="Role"
                    selectedKeys={[editRole]}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="bg-white/5"
                  >
                    <SelectItem key="USER" value="USER">
                      User
                    </SelectItem>
                    <SelectItem key="STAFF" value="STAFF">
                      Staff
                    </SelectItem>
                    <SelectItem key="ADMIN" value="ADMIN">
                      Admin
                    </SelectItem>
                  </Select>
                  <Input
                    label="Course"
                    value={selectedUser?.graduation || "N/A"}
                    isReadOnly
                    variant="flat"
                    className="bg-white/5"
                  />
                  <Input
                    label="Academic Number"
                    value={selectedUser?.academicNumber || "N/A"}
                    isReadOnly
                    variant="flat"
                    className="bg-white/5"
                  />
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-white/10">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold"
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
