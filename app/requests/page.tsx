export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo Area */}
      <div className="logo-container text-center mb-12 w-full max-w-md">
        <h1 className="neon-blue text-6xl md:text-7xl mb-3 tracking-[0.25em] pulse">
          DJ PHATTONY
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

        <form className="space-y-12">
          {/*<!-- Song Name Input -->*/}
          <div>
            <label
              htmlFor="songName"
              className="block text-cyan-200 mb-2 pl-2 text-lg"
            >
              Song Name
            </label>
            <input
              type="text"
              id="songName"
              name="songName"
              placeholder="Enter song title"
              className="input-field w-full px-6 text-white placeholder-cyan-100 placeholder-opacity-70 focus:outline-none"
            ></input>
          </div>

          {/*<!-- Artist Input -->*/}
          <div>
            <label
              htmlFor="artist"
              className="block text-cyan-200 mb-2 pl-2 text-lg"
            >
              Artist
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              placeholder="Enter artist name"
              className="input-field w-full px-6 text-white placeholder-cyan-100 placeholder-opacity-70 focus:outline-none"
            ></input>
          </div>

          {/*<!-- Submit Button -->*/}
          <button
            type="submit"
            className="neon-button material-button w-full text-lg font-bold mt-16"
          >
            SEND REQUEST
          </button>
        </form>

        {/*<!-- Currently Playing (Optional) -->*/}
        <div className="mt-8 pt-6 border-t border-blue-900">
          <p className="text-cyan-200 text-center text-sm">CURRENTLY PLAYING</p>
          <p className="text-white text-center font-bold mt-1">
            Rhythm Is A Dancer - SNAP!
          </p>
        </div>
      </div>

      {/*<!-- Request Queue Section -->*/}
      <div className="w-full max-w-md mt-8 bg-black bg-opacity-50 rounded-xl p-6 border-2 neon-border">
        <h2 className="text-cyan-100 text-xl mb-4 text-center">
          Request Queue
        </h2>

        <div className="space-y-3">
          {/*<!-- Queue Items -->*/}
          <div className="flex items-center justify-between p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-cyan-800">
            <div>
              <p className="text-white font-bold">Dont Stop Believin</p>
              <p className="text-cyan-200 text-sm">Journey</p>
            </div>
            <span className="text-cyan-100 text-sm">Next</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-900 bg-opacity-20 rounded-lg border border-cyan-800">
            <div>
              <p className="text-white font-bold">Levels</p>
              <p className="text-cyan-200 text-sm">Avicii</p>
            </div>
            <span className="text-cyan-100 text-sm">#2</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-900 bg-opacity-20 rounded-lg border border-cyan-800">
            <div>
              <p className="text-white font-bold">Blinding Lights</p>
              <p className="text-cyan-200 text-sm">The Weeknd</p>
            </div>
            <span className="text-cyan-100 text-sm">#3</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-900 bg-opacity-10 rounded-lg border border-cyan-800">
            <div>
              <p className="text-white font-bold">One More Time</p>
              <p className="text-cyan-200 text-sm">Daft Punk</p>
            </div>
            <span className="text-cyan-100 text-sm">#4</span>
          </div>
        </div>
      </div>

      {/*<!-- Footer -->*/}
      <div className="mt-8 mb-6 text-cyan-200 text-sm text-center opacity-70">
        <p>Your request will be added to the queue.</p>
        <p className="mt-1">Listen up and enjoy the beats!</p>
      </div>
    </main>
  );
}
