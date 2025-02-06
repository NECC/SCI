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
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button, ButtonGroup } from "@node_modules/@nextui-org/button/dist";
import { IoMdTrash } from "react-icons/io";
import axios from "axios";
import { set } from "zod";
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
    key: "points",
    label: "POINTS",
  },
  {
    key: "accredited",
    label: "ACCREDITED",
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

export default function GetDataTable(props) {
  const { data, active, page, changePage, more, deleteUsers, deleteActivities, deleteEnrollments } = props;
  const [columns, setColumns] = useState([...columnsActivities]);
  const [loading, setLoading] = useState(false);
  const [checkChanged, setCheckChanged] = useState(false);

  const renderCell = (item, columnKey) => {
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
      setCheckChanged(!checkChanged);
      setLoading(false);
    };

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
          </div>
        );
      case "deleteActivities":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip color="danger" content="Delete Activity">
              <span
                onClick={() => deleteActivities(uid)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <IoMdTrash />
              </span>
            </Tooltip>
          </div>
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
        bottomContent={
          more && !loading ? (
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
          {(item: any) => ( // TODO: Fix this any by checking documentation of TableBody
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
/*<ButtonGroup>
          <Button onClick={() => changePage(page-1)}>
            <MdKeyboardArrowLeft/>
          </Button>
          <Button>
            {page}
          </Button>
          <Button onClick={() => changePage(page+1)}>
            <MdKeyboardArrowRight/>
          </Button>
        </ButtonGroup>*/