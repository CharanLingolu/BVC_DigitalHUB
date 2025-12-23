import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchStaff = () => {
    axios
      .get("http://localhost:5000/api/admin/staff", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStaff(res.data));
  };

  useEffect(fetchStaff, []);

  const addStaff = async () => {
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("photo", file);

    await axios.post("http://localhost:5000/api/admin/staff", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm({});
    setFile(null);
    fetchStaff();
  };

  const deleteStaff = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/admin/staff/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchStaff();
  };

  const filtered = staff.filter(
    (s) =>
      (dept === "" || s.department === dept) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />

      <main className="pt-24 px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Staff Management</h1>

        {/* ADD STAFF */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <select
  className="p-3 border rounded-xl"
  onChange={(e) =>
    setForm({ ...form, department: e.target.value })
  }
>
  <option value="">Select Department</option>
  <option value="CSE">CSE</option>
  <option value="ECE">ECE</option>
  <option value="EEE">EEE</option>
  <option value="MECH">MECH</option>
  <option value="CIVIL">CIVIL</option>
</select>

          <input placeholder="Qualification" onChange={(e)=>setForm({...form,qualification:e.target.value})}/>
          <input placeholder="Subjects (comma)" onChange={(e)=>setForm({...form,subjects:e.target.value})}/>
          <input placeholder="Experience" onChange={(e)=>setForm({...form,experience:e.target.value})}/>
          <textarea placeholder="Bio" onChange={(e)=>setForm({...form,bio:e.target.value})}/>
          <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
          <button onClick={addStaff} className="bg-blue-600 text-white py-2 rounded-xl">
            Add Staff
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4 mb-4">
          <input placeholder="Search name" className="p-3 border rounded-xl"
            onChange={(e)=>setSearch(e.target.value)} />
          <select onChange={(e)=>setDept(e.target.value)} className="p-3 border rounded-xl">
            <option value="">All</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </select>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((s)=>(
            <div key={s._id} className="bg-white p-4 rounded-xl shadow">
              {s.photo && <img src={s.photo} className="h-40 w-full object-cover rounded-lg"/>}
              <h3 className="font-bold mt-2">{s.name}</h3>
              <p>{s.department}</p>
              <button onClick={()=>deleteStaff(s._id)} className="text-red-600 mt-2">
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Staff;
