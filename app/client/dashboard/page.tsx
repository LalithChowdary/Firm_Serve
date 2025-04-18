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

// --- START: Define detailed API response interfaces ---
interface ApiAppointment {
  appointment_id?: string;
  purpose?: string;
  location?: string;
  date?: string;
}

interface ApiClientAppointment {
  Appointment?: ApiAppointment;
}

interface ApiCases {
  case_id?: string;
  title?: string;
  description?: string;
}

interface ApiClientCase {
  Cases?: ApiCases;
}

interface ApiClient {
  client_id: string;
  name?: string;
  Appointment_Client?: (ApiClientAppointment | null | undefined)[];
  Client_Case?: (ApiClientCase | null | undefined)[];
}
// --- END: Define detailed API response interfaces ---

// Simplified interfaces for the dashboard state, now with clientName:
interface TodayAppointment {
  id: string;
  purpose: string;
  location: string;
  date: string;
}

interface ActiveCase {
  id: string;
  title: string;
  description: string;
}

interface DashboardData {
  clientName: string;
  myAppointmentsToday: number;
  myCases: number;
  totalAppointments: number;
  totalCases: number;
  todayAppointments: TodayAppointment[];
  activeCasesList: ActiveCase[];
}

export default function ClientDashboard() {
  const [data, setData] = useState<DashboardData>({
    clientName: "",
    myAppointmentsToday: 0,
    myCases: 0,
    totalAppointments: 0,
    totalCases: 0,
    todayAppointments: [],
    activeCasesList: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        console.log("Fetching client dashboard data...");
        // Adjust API endpoint to match your route (e.g. /api/client/dashboard)
        const res = await fetch("/api/client/dashboard");
        console.log("API response status:", res.status);
        const apiData: ApiClient[] = await res.json();
        console.log("API response data:", apiData);

        if (Array.isArray(apiData) && apiData.length > 0) {
          // Use the first client record from API
          const client = apiData[0];
          const clientName = client.name || "Client";

          const today = new Date().toISOString().split("T")[0];

          // Process appointments from Appointment_Client join
          const appointments: ApiAppointment[] =
            client.Appointment_Client?.flatMap((ac) =>
              ac?.Appointment ? [ac.Appointment] : []
            ) || [];

          const todayAppointments: TodayAppointment[] = appointments
            .filter((appt) => appt.date && appt.date.startsWith(today))
            .map((appt) => ({
              id: appt.appointment_id || "no-id",
              purpose: appt.purpose || "Appointment",
              location: appt.location || "Office",
              date: appt.date || "",
            }));

          // Process cases from Client_Case join
          const cases: ApiCases[] =
            client.Client_Case?.flatMap((cc) =>
              cc?.Cases ? [cc.Cases] : []
            ) || [];

          const activeCases: ActiveCase[] = cases.map((c) => ({
            id: c.case_id || "no-id",
            title: c.title || "Case",
            description: c.description || "No description available",
          }));

          setData({
            clientName,
            myAppointmentsToday: todayAppointments.length,
            myCases: cases.length,
            totalAppointments: appointments.length,
            totalCases: cases.length,
            todayAppointments,
            activeCasesList: activeCases,
          });
        } else {
          console.log("No client data found in API response.");
          setData({
            clientName: "Client",
            myAppointmentsToday: 0,
            myCases: 0,
            totalAppointments: 0,
            totalCases: 0,
            todayAppointments: [],
            activeCasesList: [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch or process dashboard data:", err);
        setData({
          clientName: "Client",
          myAppointmentsToday: 0,
          myCases: 0,
          totalAppointments: 0,
          totalCases: 0,
          todayAppointments: [],
          activeCasesList: [],
        });
      }
    };
    getData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">
            Welcome, {data.clientName || "Client"}
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening today:
          </p>
        </header>

        {/* Today's Appointments Section */}
        <section className="mt-12 mb-6">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200"
          >
            📅 Today&apos;s Appointments
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
              {data.todayAppointments.map((appt, index) => (
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
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Active Cases Section */}
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
              {data.activeCasesList.map((c, index) => (
                <motion.div
                  key={c.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    📝 <strong>Description:</strong> {c.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Statistics/Counters Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold">My Appointments Today</h3>
            <Counter value={data.myAppointmentsToday} />
          </motion.div>

          {/* Active Cases count */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold">Active Cases</h3>
            <Counter value={data.activeCasesList.length} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold">Total Appointments</h3>
            <Counter value={data.totalAppointments} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold">Total Cases</h3>
            <Counter value={data.totalCases} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
