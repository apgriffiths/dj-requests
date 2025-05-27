import RequestForm from "../ui/requests/request-form";
import CurrentlyPlaying from "../ui/requests/currently-playing";
import RequestQueue from "../ui/requests/request-queue";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo Area */}
      <div className="logo-container text-center mb-12 w-full max-w-md">
        <h1 className="neon-blue text-6xl md:text-7xl mb-3 tracking-[0.25em] pulse">
          DJ PHAT TONY
        </h1>
        <p className="text-cyan-200 text-xl tracking-wider">
          Live Song Requests
        </p>
      </div>
      {/*<!-- Request Form Container -->*/}
      <div className="bg-black bg-opacity-50 rounded-xl p-8 w-full max-w-md border-2 neon-border">
        <h2 className="text-cyan-100 text-2xl mb-6 text-center">
          Request A Track
        </h2>
        <RequestForm />
        {/*<!-- Currently Playing (Optional) -->*/}
        <CurrentlyPlaying />
      </div>
      {/*<!-- Request Queue Section -->*/}
      <RequestQueue />
      {/*<!-- Footer -->*/}
      <div className="mt-8 mb-6 text-cyan-200 text-sm text-center opacity-70">
        <p>Your request will be added to the queue.</p>
        <p className="mt-1">Listen up and enjoy the music!</p>
      </div>
    </main>
  );
}
