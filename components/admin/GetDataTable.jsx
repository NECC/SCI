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
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";

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
    key: "points",
    label: "POINTS",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

const columnsActivities = [
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
  {
    key: "deleteActivities",
    label: "DELETE",
  }
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
  }
];

export default function GetDataTable(props) {
  const { data, active, deleteUsers, deleteActivities } = props;
  const [columns, setColumns] = useState([...columnsActivities]);



  const renderCell = (item, columnKey) => {
    const uid = item.id;
    // console.log(item);

    switch (columnKey) {
      case "profile":
        return (
          <User
            name={uid}
            description={item.email}
            avatarProps={{ src: "/user.svg", isBordered: true, size: "sm" }}
            />
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaEye className="text-black" />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <MdModeEditOutline className="text-black" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span onClick={() => deleteUsers(uid)} className="text-lg text-danger cursor-pointer active:opacity-50">
                <IoMdTrash />
              </span>
            </Tooltip>
          </div>
        );
      case "deleteActivities":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip color="danger" content="Delete Activity">
              <span onClick={() => deleteActivities(uid)} className="text-lg text-danger cursor-pointer active:opacity-50">
                <IoMdTrash />
              </span>
            </Tooltip>
          </div>
        );
      case "profileEnrollments":
        return (
          <User
            name={item.userId}
            description={item.userName}
            avatarProps={{ src: "/user.svg", isBordered: true, size: "sm" }}
          />
        );
      default:
        return getKeyValue(item, columnKey);
    }
  };

  useEffect(() => {
    if (active == "users") {
      setColumns(columnsUsers);
    } else if (active == "activities") {
      setColumns(columnsActivities);
    } else if (active == "enrollments") {
      setColumns(columnsEnrollments);
    }
  }, [active]);

  return (
    <div className="w-full p-4 flex justify-center">
      <Table
        aria-label="Example static collection table"
        className="w-full max-w-[1700px] box-content"
        isStriped={true}
        selectionMode="single"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data selected"} items={data}>
          {(item) => (
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
