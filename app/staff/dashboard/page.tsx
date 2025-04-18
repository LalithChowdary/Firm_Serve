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
interface ApiClient {
  client_id?: string;
  name?: string;
}

interface ApiClientAppointment {
  Client?: ApiClient;
}

interface ApiAppointment {
  appointment_id?: string;
  purpose?: string;
  location?: string;
  date?: string;
  Client_Appointment?: ApiClientAppointment[];
}

interface ApiAppointmentStaff {
  Appointment?: ApiAppointment;
}

interface ApiClientCase {
  Client?: ApiClient;
}

interface ApiCases {
  case_id?: string;
  title?: string;
  description?: string;
  Client_Case?: ApiClientCase[];
}

interface ApiStaffCase {
  Cases?: ApiCases;
}

interface ApiStaffMember {
  staff_id: string;
  name?: string;
  Appointment_Staff?: ApiAppointmentStaff[];
  Staff_Case?: ApiStaffCase[];
}
// --- END: Define detailed API response interfaces ---

// Simplified interfaces for the dashboard state, now with staffName:
interface TodayAppointment {
  id: string;
  purpose: string;
  location: string;
  date: string;
  clients: string[];
  staff: string[];
}

interface ActiveCase {
  id: string;
  title: string;
  description: string;
  client: string;
}

interface DashboardData {
  staffName: string;
  myAppointmentsToday: number;
  myCases: number;
  totalAppointments: number;
  totalCases: number;
  clientCount: number;
  todayAppointments: TodayAppointment[];
  activeCasesList: ActiveCase[];
}

export default function StaffDashboard() {
  const [data, setData] = useState<DashboardData>({
    staffName: "",
    myAppointmentsToday: 0,
    myCases: 0,
    totalAppointments: 0,
    totalCases: 0,
    clientCount: 0,
    todayAppointments: [],
    activeCasesList: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        console.log("Fetching data from API...");
        const res = await fetch("/api/staff/dashboard");
        console.log("API response status:", res.status);
        const apiData: ApiStaffMember[] = await res.json();
        console.log("API response data:", apiData);

        if (Array.isArray(apiData) && apiData.length > 0) {
          // Use the first staff record from API
          const staff = apiData[0];

          // Set the staff name from API (from the staff table)
          const staffName = staff.name || "Staff";

          const today = new Date().toISOString().split("T")[0];

          const appointments: ApiAppointment[] =
            staff.Appointment_Staff?.flatMap(
              (as: ApiAppointmentStaff | null | undefined) =>
                as?.Appointment ? [as.Appointment] : []
            ) || [];

          const todayAppointments: TodayAppointment[] = appointments
            .filter(
              (appt: ApiAppointment) => appt.date && appt.date.startsWith(today)
            )
            .map((appt: ApiAppointment) => {
              const clients: string[] =
                appt.Client_Appointment?.reduce(
                  (
                    acc: string[],
                    ca: ApiClientAppointment | null | undefined
                  ) => {
                    if (ca?.Client?.name) {
                      acc.push(ca.Client.name);
                    }
                    return acc;
                  },
                  []
                ) || [];

              return {
                id: appt.appointment_id || "no-id",
                purpose: appt.purpose || "Appointment",
                location: appt.location || "Office",
                date: appt.date || "",
                clients: clients.length > 0 ? clients : ["Client"],
                staff: [staffName],
              };
            });

          const cases: ApiCases[] =
            staff.Staff_Case?.flatMap((sc: ApiStaffCase | null | undefined) =>
              sc?.Cases ? [sc.Cases] : []
            ) || [];

          const uniqueClients: Set<string> = new Set();

          const activeCases: ActiveCase[] = cases.map((c: ApiCases) => {
            let clientName = "Unknown client";
            const clientCase = c.Client_Case?.[0];
            if (clientCase?.Client) {
              clientName = clientCase.Client.name || "Unknown client";
              if (clientCase.Client.client_id) {
                uniqueClients.add(clientCase.Client.client_id);
              }
            }
            return {
              id: c.case_id || "no-id",
              title: c.title || "Case",
              description: c.description || "No description available",
              client: clientName,
            };
          });

          setData({
            staffName,
            myAppointmentsToday: todayAppointments.length,
            myCases: cases.length,
            totalAppointments: appointments.length,
            totalCases: cases.length,
            clientCount: uniqueClients.size,
            todayAppointments,
            activeCasesList: activeCases,
          });
        } else {
          console.log(
            "No staff data found in API response or response is not an array."
          );
          setData({
            staffName: "Staff",
            myAppointmentsToday: 0,
            myCases: 0,
            totalAppointments: 0,
            totalCases: 0,
            clientCount: 0,
            todayAppointments: [],
            activeCasesList: [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch or process dashboard data:", err);
        setData({
          staffName: "Staff",
          myAppointmentsToday: 0,
          myCases: 0,
          totalAppointments: 0,
          totalCases: 0,
          clientCount: 0,
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
            Welcome, {data.staffName || "Staff"}
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
              className="text-gray-500 text-lg mb-20" // Added mb-20 back for spacing
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
                  <p className="text-sm text-gray-700 mb-1">
                    👤 <strong>Clients:</strong>{" "}
                    {appt.clients.join(", ") || "None"}
                  </p>
                  <p className="text-sm text-gray-700">
                    🧑‍⚕️ <strong>Staff:</strong> {appt.staff.join(", ") || "None"}
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
                  <p className="text-sm text-gray-700 mb-1">
                    👤 <strong>Client:</strong> {c.client}
                  </p>
                </motion.div> // <-- Fixed: Added missing closing tag
              ))}
            </div>
          )}
        </section>

        {/* Statistics/Counters Section - Moved outside Active Cases section */}
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

          {/* Changed from "My Cases" and now uses data.activeCasesList.length */}
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

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold">Total Clients</h3>
            <Counter value={data.clientCount} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
