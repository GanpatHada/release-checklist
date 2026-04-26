import { Routes, Route } from "react-router-dom";
import ReleasesList from "./pages/ReleasesList";
import CreateRelease from "./pages/CreateRelease";
import ReleaseDetails from "./pages/ReleaseDetails";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ReleasesList />} />
      <Route path="/create" element={<CreateRelease />} />
      <Route path="/release/:id" element={<ReleaseDetails />} />
    </Routes>
  );
}
