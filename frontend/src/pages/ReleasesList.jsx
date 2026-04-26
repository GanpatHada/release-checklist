import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
export default function ReleasesList() {
  const [data, setData] = useState([]);
  const load = async () => {
    const res = await api.get("/");
    setData(res.data);
  };
  const remove = async (id) => {
    await api.delete(`/${id}`);
    load();
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="page">
      <div className="window">
        <div className="topbar"></div> <h1>ReleaseCheck</h1>
        <p>Your all-in-one release checklist tool</p>
        <div className="panel">
          <div className="panelHead">
            <span>All releases</span>
            <Link to="/create" className="btn">
              New release
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Release</th> <th>Date</th> <th>Status</th> <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No releases found
                  </td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${r.status}`}>{r.status}</span>
                    </td>
                    <td>
                      <Link to={`/release/${r.id}`}>View</Link>
                    </td>
                    <td>
                      <button
                        className="deleteBtn"
                        onClick={() => remove(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
