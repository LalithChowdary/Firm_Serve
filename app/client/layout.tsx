import Footer from "@/components/Footer";
import ClientNav from "@/components/navbar/clientNav/ClientNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
