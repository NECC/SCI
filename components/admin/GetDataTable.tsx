import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Tooltip,
  User,
  Checkbox,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { Button } from "@nextui-org/button";
import { IoMdTrash } from "react-icons/io";
import axios from "axios";
import { UserPostAccreditationResponse } from "@app/api/users/accreditation/[id]/route";

const columnsUsers = [
  {
    key: "profile",
    label: "DATA",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "accredited",
    label: "ACCREDITED",
  },
  {
    key: "graduation",
    label: "COURSE",
  },
  {
    key: "points",
    label: "POINTS",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

const columnsActivitiesBase = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "date",
    label: "DATE",
  },
  {
    key: "startTime",
    label: "Start Time",
  },
  {
    key: "endTime",
    label: "End Time",
  },
  {
    key: "location",
    label: "Location",
  },
  {
    key: "capacity",
    label: "CAPACITY",
  },
];

const columnsEnrollments = [
  {
    key: "id",
    label: "Enrollment ID",
  },
  {
    key: "profileEnrollments",
    label: "PROFILE",
  },
  {
    key: "activityId",
    label: "ACTIVITY ID",
  },
  {
    key: "activityName",
    label: "ACTIVITY NAME",
  },
  {
    key: "deleteEnrollments",
    label: "DELETE",
  },
];

export default function GetDataTable(props: any) {
  const { data, active, page, changePage, more, deleteUsers, deleteActivities, deleteEnrollments, edit } = props;
  const [columns, setColumns] = useState([...columnsActivitiesBase, { key: "actions", label: "ACTIONS" }]);
  const [loading, setLoading] = useState(false);

  const renderCell = (item: any, columnKey: any) => {
    const uid = item.id;
    // console.log(item)

    // TODO: Error handling
    const updateAccreditation = async () => {
      setLoading(true);
      const { data } = await axios.post<UserPostAccreditationResponse>(`/api/users/accreditation/${uid}`);
      // console.log(data);
      if (data.response == "error") {
        console.log(data.error);
      }
      setLoading(false);
    };

    switch (columnKey) {
      case "profile":
        return (
          <User
            name={uid}
            description={item.email}
            avatarProps={{ src: "/user.svg", isBordered: true, size: "sm" }}
          />
        );
      case "accredited":
        return (
          <div className="ml-6">
            <Checkbox
              isDisabled={loading}
              defaultSelected={item.accredited}
              color="success"
              onValueChange={updateAccreditation}
            />
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => deleteUsers(uid)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <IoMdTrash />
              </span>
            </Tooltip>
            <Tooltip color="primary" content="Edit user">
              <span
                onClick={() => edit(uid)}
                className="text-lg text-primary cursor-pointer active:opacity-50"
              >
                <MdEdit />
              </span>
            </Tooltip>
          </div>
        );
      case "qrScanner":
        return (
          <Tooltip color="primary" content="QR Scanner">
            <span
              onClick={() => window.open(`/admin/qrcodes/${uid}`, '_blank')}
              className="text-lg text-primary cursor-pointer active:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25 9 8.25l5.25-3 5.25 3 5.25-3v11.25a2.625 2.625 0 0 1-2.625 2.625H2.625A2.625 2.625 0 0 1 0 13.5V2.25ZM7.5 15.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-1.5Z" />
              </svg>
            </span>
          </Tooltip>
        );
      case "deleteActivities":
        return (
          <Tooltip color="danger" content="Delete Activity">
            <span
              onClick={() => deleteActivities(uid)}
              className="text-lg text-danger cursor-pointer active:opacity-50"
            >
              <IoMdTrash />
            </span>
          </Tooltip>
        );
      case "deleteEnrollments":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip color="danger" content="Delete Enrollment">
              <span
                onClick={() => deleteEnrollments(uid)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <IoMdTrash />
              </span>
            </Tooltip>
          </div>
        );
      case "profileEnrollments":
        return (
          <User
            name={item.user?.name || "Unknown"}
            description={item.user?.email || ""}
            avatarProps={{ src: "/user.svg", isBordered: true, size: "sm" }}
          />
        );
      case "activityId":
        return (
          <>
            <div className="relative flex items-center gap-2"> 
              {item.activity?.id}
            </div>
          </>
        );
      case "activityName":
        return (
          <>
            <div className="relative flex items-center gap-2"> 
              {item.activity?.title}
            </div>
          </>
        );
      case "name":
        return (
          <>
            <div className="relative flex items-center gap-2"> 
              {getKeyValue(item,columnKey)}
            </div>
          </>
        );
      default:
        return getKeyValue(item, columnKey);
    }
  };

  useEffect(() => {
    if (active == "users") {
      setColumns(columnsUsers);
    } else if (active == "activities") {
      setColumns([...columnsActivitiesBase, { key: "qrScanner", label: "QR" }, { key: "deleteActivities", label: "DELETE" }]);
    } else if (active == "enrollments") {
      setColumns(columnsEnrollments);
    }
  }, [active]);

  return (
    <div className="w-full p-4 flex justify-center z-5">
      <Table
        bottomContent={
          more ? (
            <div className="flex w-full justify-center">
              <Button variant="flat" onClick={() => changePage(page+1)}>
                Load More
              </Button>
            </div>
          ) : <></>
        } 
        aria-label="Example static collection table"
        className="w-full max-w-[1700px] box-content"
        isStriped={true}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data selected"} items={data}>
          {(item: any) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody> 
      </Table>
    </div>
  );
}

