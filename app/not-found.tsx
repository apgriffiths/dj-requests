import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo Area */}
      <div className="logo-container text-center mb-12 w-full max-w-md">
        <h1 className="neon-blue text-6xl md:text-7xl mb-3 tracking-[0.25em] pulse">
          <Link href="/" className="hover:underline">
            <span className="text-cyan-200">DJ</span> PHAT TONY
          </Link>
        </h1>
        <p className="text-cyan-200 text-xl tracking-wider">Page Not Found</p>
      </div>
      {/*<!-- Container -->*/}
      <div className="bg-black bg-opacity-50 rounded-xl p-8 w-full border-2 neon-border">
        <h2 className="text-cyan-100 text-2xl mb-6 text-center">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </h2>
      </div>
      {/*<!-- Footer -->*/}
    </main>
  );
}
