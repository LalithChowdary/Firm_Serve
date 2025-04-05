import Footer from "@/components/Footer";
import AdminHeader from "@/components/navbar/adminNav/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminHeader />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
