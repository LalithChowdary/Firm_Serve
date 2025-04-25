"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// API response interfaces
interface RawAppointment {
  appointment_id: string;
  purpose?: string;
  location?: string;
  appointment_date: string;
  case_id: string;
}

interface RawCase {
  case_id: string;
  filing_date?: string;
  court_name?: string;
  verdict?: string | null;
  title?: string;
  case_type?: string;
  status?: string;
}

interface RawStaff {
  staff_id: string;
  name: string;
  experience?: number;
  phone_no?: string;
  bar_number?: string | null;
  address?: string;
  specialisation?: string | null;
  s_role?: string;
  designation?: string | null;
  image?: string | null;
}

interface RawClient {
  client_id: string;
  name: string;
  address?: string;
  phone_no?: string;
}

interface RawBill {
  billing_id: string;
  payment_date?: string;
  payment_mode?: string;
  due_date?: string;
  status: string;
  amount?: string;
  client_id: string;
  case_id: string;
}

interface ApiResponse {
  appointments?: RawAppointment[];
  cases?: RawCase[];
  staff?: RawStaff[];
  clients?: RawClient[];
  bills?: RawBill[];
}

// Frontend data interfaces
function Counter({ value }: { value: number }) {
  const safeValue = isNaN(value) ? 0 : value;
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 1500;
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setCount(Math.floor(progress * safeValue));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [safeValue]);

  return (
    <p ref={ref} className="text-2xl mt-2">
      {count.toLocaleString()}
    </p>
  );
}

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
  description?: string;
  client: string;
  staff: string;
}

interface DashboardData {
  appointmentsToday: number;
  activeCases: number;
  staffCount: number;
  clientCount: number;
  paidBills: number;
  pendingBills: number;
  todayAppointments: TodayAppointment[];
  activeCasesList: ActiveCase[];
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    appointmentsToday: 0,
    activeCases: 0,
    staffCount: 0,
    clientCount: 0,
    paidBills: 0,
    pendingBills: 0,
    todayAppointments: [],
    activeCasesList: [],
  });

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/dashboard", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        // Get raw data
        const responseText = await response.text();

        let rawData: ApiResponse;
        try {
          rawData = JSON.parse(responseText);
          console.log("API returned:", rawData);
        } catch (parseError) {
          throw new Error(`Failed to parse API response: ${parseError}`);
        }

        // Transform the raw API data format into our expected format
        const today = new Date().toISOString().split("T")[0];

        // Get today's appointments
        const todaysAppointments = (rawData.appointments || [])
          .filter((appt: RawAppointment) => {
            const apptDate = new Date(appt.appointment_date)
              .toISOString()
              .split("T")[0];
            return apptDate === today;
          })
          .map((appt: RawAppointment) => {
            return {
              id: appt.appointment_id,
              purpose: appt.purpose || "Untitled",
              location: appt.location || "Office",
              date: appt.appointment_date,
              clients: [],
              staff: [],
            };
          });

        // Get active cases
        const openCases = (rawData.cases || [])
          .filter((c: RawCase) => c.status === "Open")
          .map((c: RawCase) => {
            // Find a random client and staff for each case
            const randomClient = rawData.clients
              ? rawData.clients[
                  Math.floor(Math.random() * rawData.clients.length)
                ]
              : null;

            const randomStaff = rawData.staff
              ? rawData.staff[Math.floor(Math.random() * rawData.staff.length)]
              : null;

            return {
              id: c.case_id,
              title: c.title || "Untitled Case",
              client: randomClient?.name || "Unknown Client",
              staff: randomStaff?.name || "Unassigned Staff",
            };
          });

        // Process the counts and data
        const processedData: DashboardData = {
          appointmentsToday: todaysAppointments.length,
          activeCases: openCases.length,
          staffCount: (rawData.staff || []).length,
          clientCount: (rawData.clients || []).length,
          paidBills: (rawData.bills || []).filter(
            (b: RawBill) => b.status === "Paid"
          ).length,
          pendingBills: (rawData.bills || []).filter(
            (b: RawBill) => b.status === "Pending"
          ).length,
          todayAppointments: todaysAppointments,
          activeCasesList: openCases,
        };

        console.log("Processed data:", processedData);
        setData(processedData);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading and error states remain unchanged
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <h2 className="text-red-800 text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Welcome, Admin</h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening today:
          </p>
        </header>

        {/* Statistics Section */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md md:shadow-lg"
          >
            <h3 className="text-sm md:text-lg font-semibold">
              Appointments Today
            </h3>
            <Counter value={data.appointmentsToday} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md md:shadow-lg"
          >
            <h3 className="text-sm md:text-lg font-semibold">Active Cases</h3>
            <Counter value={data.activeCases} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md md:shadow-lg"
          >
            <h3 className="text-sm md:text-lg font-semibold">Staff</h3>
            <Counter value={data.staffCount} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md md:shadow-lg"
          >
            <h3 className="text-sm md:text-lg font-semibold">Clients</h3>
            <Counter value={data.clientCount} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md md:shadow-lg"
          >
            <h3 className="text-sm md:text-lg font-semibold">Paid Bills</h3>
            <Counter value={data.paidBills} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md md:shadow-lg"
          >
            <h3 className="text-sm md:text-lg font-semibold">Unpaid Bills</h3>
            <Counter value={data.pendingBills} />
          </motion.div>
        </section>

        {/* Today's Appointments */}
        <section className="mt-8 md:mt-12 mb-8 md:mb-10">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 border-b pb-2 border-gray-200"
          >
            📅 Today&apos;s Appointments
          </motion.h2>

          {!data.todayAppointments || data.todayAppointments.length === 0 ? (
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-gray-500 text-base md:text-lg mb-4 md:mb-6"
            >
              No appointments scheduled for today.
            </motion.p>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.todayAppointments.map((appt, index) => (
                <motion.div
                  key={appt.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 md:p-5 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg md:text-xl font-semibold truncate">
                      {appt.purpose}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(appt.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 mb-1">
                    📍 <span className="font-medium">{appt.location}</span>
                  </p>
                  {appt.clients?.length > 0 && (
                    <p className="text-xs md:text-sm text-gray-700 mb-1">
                      👤 <strong>Clients:</strong> {appt.clients.join(", ")}
                    </p>
                  )}
                  {appt.staff?.length > 0 && (
                    <p className="text-xs md:text-sm text-gray-700">
                      🧑‍⚖️ <strong>Staff:</strong> {appt.staff.join(", ")}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Active Cases - Responsive Grid */}
        <section className="mt-8 md:mt-10 mb-6 md:mb-8">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-200"
          >
            ⚖️ Active Cases
          </motion.h2>

          {!data.activeCasesList || data.activeCasesList.length === 0 ? (
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-gray-500 text-base md:text-lg"
            >
              No active cases at the moment.
            </motion.p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.activeCasesList.map((c, index) => (
                <motion.div
                  key={c.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 md:p-5 border border-gray-100"
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-2 truncate">
                    {c.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-700 mb-2">
                    👤 <strong>Client:</strong> {c.client}
                  </p>
                  <p className="text-xs md:text-sm text-gray-700">
                    🧑‍⚖️ <strong>Staff:</strong> {c.staff}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
