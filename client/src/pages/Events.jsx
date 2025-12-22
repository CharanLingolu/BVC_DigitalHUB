import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/info/events")
      .then((res) => setEvents(res.data))
      .catch(() => console.error("Failed to load events"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Events
        </h1>

        {events.length === 0 ? (
          <Empty text="No events available" />
        ) : (
          <div className="space-y-6">
            {events.map((e) => (
              <div
                key={e._id}
                className="bg-white dark:bg-[#161b22] p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-800"
              >
                <h3 className="text-xl font-bold">{e.title}</h3>
                <p className="text-sm text-slate-500">
                  {new Date(e.date).toDateString()}
                </p>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;

const Empty = ({ text }) => (
  <div className="text-center py-24 bg-white dark:bg-[#161b22] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
    {text}
  </div>
);
