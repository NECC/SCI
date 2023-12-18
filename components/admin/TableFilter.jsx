import { Select, SelectItem, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CgSearch } from "react-icons/cg";

const choices = [
  { active: "users", select: ["EMAIL", "NAME", "ID"] },
  { active: "activities", select: ["TITLE", "ID"] },
  { active: "enrollments", select: ["ID", "USERID", "ACTIVITYID"] },
];

export default function TableFilter(props) {
  const { active, data, setData } = props;
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    console.log(data);
    setFilter(e.target.value);
  };

  useEffect(() => {
    setSearch("");
    setFilter("");
  }, [active]);

  useEffect(() => {
    const filterData = (data, filter) => {
      if (filter == "EMAIL") {
        const filteredData = data.filter((row) => {
          return row.email.toLowerCase().includes(search.toLowerCase());
        });
        setData(filteredData);
      } else if (filter == "NAME") {
        const filteredData = data.filter((row) => {
          return row.name.toLowerCase().includes(search.toLowerCase());
        });
        setData(filteredData);
      } else if (filter == "ID") {
        const filteredData = data.filter((row) => {
          return row.id.toString().includes(search);
        });
        setData(filteredData);
      } else if (filter == "TITLE") {
        const filteredData = data.filter((row) => {
          return row.title.toLowerCase().includes(search.toLowerCase());
        });
        setData(filteredData);
      }
    };
    filterData(data, filter);
  }, [search, filter, data, setData]);

  return (
    <>
      <Select
        isRequired
        startContent="Filter:"
        className="max-w-[150px]"
        radius="none"
        onChange={handleChange}
      >
        {choices.map((choice) => {
          if (choice.active == active) {
            return choice.select.map((select) => {
              return (
                <SelectItem key={select} value={select}>
                  {select}
                </SelectItem>
              );
            });
          }
        })}
      </Select>
      <Input
        type="text"
        placeholder="Type to search..."
        startContent={<CgSearch />}
        radius="none"
        variant="flat"
        className="max-w-[300px]"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </>
  );
}
