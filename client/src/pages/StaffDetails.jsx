import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const StaffDetails = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    API.get(`/info/staff/${id}`)
      .then((res) => setStaff(res.data))
      .catch(() => {});
  }, [id]);

  if (!staff) {
    return <p className="text-center mt-40">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#161b22] rounded-3xl p-10 shadow-xl border">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {staff.name}
          </h1>

          <p className="text-slate-500 mt-1">{staff.department}</p>

          <div className="mt-8 space-y-4">
            <Info label="Qualification" value={staff.qualification} />
            <Info label="Experience" value={`${staff.experience} years`} />
            <Info
              label="Subjects"
              value={staff.subjects?.join(", ")}
            />
            <Info label="Bio" value={staff.bio} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDetails;

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="text-lg text-slate-900 dark:text-white">
      {value || "—"}
    </p>
  </div>
);
