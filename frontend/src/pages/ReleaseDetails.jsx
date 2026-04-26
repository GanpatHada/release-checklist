import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function ReleaseDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [item, setItem] = useState(null);
  const [steps, setSteps] = useState({});

  const load = async () => {
    const res = await api.get("/");
    const found = res.data.find((x) => x.id == id);

    setItem(found);
    setSteps(found.steps);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCheck = (step, value) => {
    setSteps({
      ...steps,
      [step]: value
    });
  };

  const saveAll = async () => {
    for (let key in steps) {
      await api.patch(`/${id}/steps`, {
        stepName: key,
        value: steps[key]
      });
    }

    await api.patch(`/${id}/info`, {
      additional_info: item.additional_info
    });

    alert("Saved Successfully");
    load();
  };

  const remove = async () => {
    await api.delete(`/${id}`);
    nav("/");
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="window">
        <h1>ReleaseCheck</h1>

        <div className="detailBox">
          <div className="detailHead">
            <Link to="/">All Releases</Link>
            <button onClick={remove}>Delete</button>
          </div>

          <input value={item.name} readOnly />

          <div className="checks">
            {Object.entries(steps).map(([k, v]) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={v}
                  onChange={(e) =>
                    handleCheck(k, e.target.checked)
                  }
                />
                {k}
              </label>
            ))}
          </div>

          <textarea
            value={item.additional_info || ""}
            onChange={(e) =>
              setItem({
                ...item,
                additional_info: e.target.value
              })
            }
          />

          <button className="btn" onClick={saveAll}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}