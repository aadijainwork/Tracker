import { useEffect, useState } from "react";
import { api } from "../api";

export default function UserSelect({
  onSelect
}) {

  const [users, setUsers] = useState([]);

  const [selected, setSelected] =
    useState("");

  useEffect(() => {
    api.teamMembers
      .list()
      .then(setUsers);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "400px"
        }}
      >
        <h1>
          Engineering Hub
        </h1>

        <p>
          Select User
        </p>

        <select
          value={selected}
          onChange={(e) =>
            setSelected(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px"
          }}
        >
          <option value="">
            Choose...
          </option>

          {users.map(user => (
            <option
              key={user.id}
              value={user.id}
            >
              {user.name}
            </option>
          ))}
        </select>

        <button
          style={{
            marginTop: "20px",
            width: "100%"
          }}
          disabled={!selected}
          onClick={() =>
            onSelect(
              users.find(
                u => u.id === selected
              )
            )
          }
        >
          Continue
        </button>
      </div>
    </div>
  );
}