import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const columnsUsers = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "email",
    label: "EMAIL",
  },
  {
    key: "role",
    label: "ROLE",
  },
];

const columnsActivities = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "date",
    label: "DATE",
  },
  {
    key: "time",
    label: "TIME",
  },
  {
    key: "location",
    label: "LOCATION",
  },
  {
    key: "participants",
    label: "PARTICIPANTS",
  },
  {
    key: "capacity",
    label: "CAPACITY",
  },
];

export default function GetDataTable() {
  const [columns, setColumns] = useState([...columnsUsers]);
  const [rows, setRows] = useState([]);

  const handleColumns = (e) => {
    if (columns == columnsUsers) setColumns(columnsActivities);
    else setColumns(columnsUsers);
  };

  const getUsers = async () => {
    const res = await fetch("/api/users");
    const { users } = await res.json();
    console.log(users);
    setRows(users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="w-full p-10 flex justify-center">
      <Table
        aria-label="Example static collection table"
        className="w-full max-w-[1500px] box-content"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data selected"} items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
