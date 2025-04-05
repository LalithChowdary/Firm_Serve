import Footer from "@/components/Footer";
import StaffNav from "@/components/navbar/staffNav/StaffNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StaffNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
