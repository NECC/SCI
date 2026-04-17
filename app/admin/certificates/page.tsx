"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { FiFileText, FiAward, FiDownload, FiSearch } from "react-icons/fi";
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function CertificatesPage() {
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]); // Placeholder data
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  useEffect(() => {
    if (session) {
      setUser({ user: session.user, loaded: true });
      // Simulate loading certificates
      setTimeout(() => {
        setCertificates([
          { id: 1, userName: "John Doe", activity: "Workshop A", date: "2024-01-15", status: "Ready" },
          { id: 2, userName: "Jane Smith", activity: "Workshop B", date: "2024-01-16", status: "Ready" },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user.user?.role !== "ADMIN" && user.loaded) {
    router.push("/");
    return null;
  }

  const filteredCertificates = certificates.filter(cert =>
    cert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "userName", label: "USER" },
    { key: "activity", label: "ACTIVITY" },
    { key: "date", label: "DATE" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTIONS" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
          Certificates
        </h1>
        <p className="text-white/70 text-xl">Generate, manage and download certificates</p>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="admin-gradient-card admin-stats-card from-purple-500/20 to-pink-600/20 border-purple-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide">Total Generated</p>
                <p className="text-4xl font-bold text-white mt-2">{filteredCertificates.length}</p>
              </div>
              <FiAward className="text-purple-300 text-5xl" />
            </div>
          </CardBody>
        </Card>
        <Card className="md:col-span-2 admin-gradient-card">
          <CardBody className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search certificates by user or activity..."
                startContent={<FiSearch className="text-white/50" />}
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="flex-1 bg-white/10 border-white/20"
              />
              <Button color="primary" variant="solid">
                Bulk Export
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card className="admin-gradient-card shadow-2xl">
        <CardHeader className="bg-white/5 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Certificates List</h3>
        </CardHeader>
        <CardBody className="p-0">
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-20">
              <FiFileText className="mx-auto h-16 w-16 text-white/30 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No certificates found</h3>
              <p className="text-white/60">Certificates will appear here once generated.</p>
            </div>
          ) : (
            <Table aria-label="Certificates table">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={filteredCertificates}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "actions" ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              color="success" 
                              variant="light"
                              startContent={<FiDownload size={14} />}
                              onPress={() => alert(`Download certificate ${item.id}`)}
                            >
                              Download
                            </Button>
                          </div>
                        ) : (
                          item[columnKey as keyof typeof item]
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

