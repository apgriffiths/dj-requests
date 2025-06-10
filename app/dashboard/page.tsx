import SongRequestTable from "@/app/ui/dashboard/requests-table";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/server-auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Page() {
  const session = await requireAdmin();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="absolute top-6 right-6 flex flex-col items-center justify-center">
        <span className="text-cyan-200 text-xl tracking-wider">
          Welcome, {session.user.name || session.user.email}
        </span>
        <SignOutButton />
      </div>
      {/* Logo Area */}
      <div className="logo-container text-center mb-12 w-full max-w-md">
        <h1 className="neon-blue text-6xl md:text-7xl mb-3 tracking-[0.25em] pulse">
          <Link href="/" className="hover:underline">
            <span className="text-cyan-200">DJ</span> PHAT TONY
          </Link>
        </h1>
        <p className="text-cyan-200 text-xl tracking-wider">Dashboard</p>
      </div>
      {/*<!-- Container -->*/}
      <div className="bg-black bg-opacity-50 rounded-xl p-8 w-full border-2 neon-border">
        <h2 className="text-cyan-100 text-2xl mb-6 text-center">
          <SongRequestTable />
        </h2>
      </div>
      {/*<!-- Footer -->*/}
    </main>
  );
}
