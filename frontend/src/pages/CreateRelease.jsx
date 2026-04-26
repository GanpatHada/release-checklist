import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
export default function CreateRelease() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", date: "", additional_info: "" });
  const submit = async (e) => {
    e.preventDefault();
    await api.post("/", form);
    nav("/");
  };
  return (
    <div className="page">
      <div className="window">
        <div className="topbar"></div> <h1>ReleaseCheck</h1>
        <form className="formBox" onSubmit={submit}>
          <Link to="/">← Back</Link>
          <input
            placeholder="Release Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="datetime-local"
            required
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <textarea
            placeholder="Additional Info"
            onChange={(e) =>
              setForm({ ...form, additional_info: e.target.value })
            }
          />
          <button className="btn">Create</button>
        </form>
      </div>
    </div>
  );
}
