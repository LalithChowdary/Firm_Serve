"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 1500;
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <p ref={ref} className="text-2xl mt-2">
      {count.toLocaleString()}
    </p>
  );
}

export default function Home() {
  const [data, setData] = useState({
    appointmentsToday: 0,
    activeCases: 0,
    staffCount: 0,
    clientCount: 0,
    paidBills: 0,
    pendingBills: 0,
    todayAppointments: [],
    activeCasesList: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    getData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Welcome, Admin</h1>
          <p className="text-gray-600">Here’s what’s happening today:</p>
        </header>

        <section className="mt-12 mb-6">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6  text-gray-800 border-b pb-2 border-gray-200"
          >
            📅 Today’s Appointments
          </motion.h2>

          {data.todayAppointments.length === 0 ? (
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-gray-500 text-lg mb-20"
            >
              No appointments scheduled for today.
            </motion.p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.todayAppointments.map((appt: any, index: number) => (
                <motion.div
                  key={appt.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-indigo-600">
                      {appt.purpose}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(appt.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    📍 <span className="font-medium">{appt.location}</span>
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    👤 <strong>Clients:</strong> {appt.clients.join(", ")}
                  </p>
                  <p className="text-sm text-gray-700">
                    🧑‍⚕️ <strong>Staff:</strong> {appt.staff.join(", ")}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 mb-[20px]">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200"
          >
            🩺 Active Cases
          </motion.h2>

          {data.activeCasesList.length === 0 ? (
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-gray-500 text-lg"
            >
              No active cases at the moment.
            </motion.p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.activeCasesList.map((c: any, index: number) => (
                <motion.div
                  key={c.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-red-600 mb-1">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    📝 <strong>Description:</strong> {c.description}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    👤 <strong>Client:</strong> {c.client}
                  </p>
                  <p className="text-sm text-gray-700">
                    🧑‍⚕️ <strong>Staff:</strong> {c.staff}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-semibold">Appointments Today</h3>
            <Counter value={data.appointmentsToday} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-semibold">Active Cases</h3>
            <Counter value={data.activeCases} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-semibold">Staff</h3>
            <Counter value={data.staffCount} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-semibold">Clients</h3>
            <Counter value={data.clientCount} />
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-semibold">Paid Bills</h3>
            <Counter value={data.paidBills} />
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-semibold">Unpaid Bills</h3>
            <Counter value={data.pendingBills} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
