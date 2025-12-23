import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />

      <main className="pt-24 px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="Total Users" value="—" />
          <Card title="Departments" value="—" />
          <Card title="Events" value="—" />
          <Card title="Jobs" value="—" />
        </div>

        <div className="mt-12 bg-white p-8 rounded-2xl shadow">
          <h2 className="text-xl font-black mb-4">
            Welcome, Admin 👋
          </h2>
          <p className="text-slate-600">
            Use the navigation bar to manage users, staff, events,
            and job postings.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

const Card = ({ title, value }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <p className="text-slate-500 text-sm">{title}</p>
    <p className="text-3xl font-black mt-2">{value}</p>
  </div>
);
