"use client";

import { Button } from "@/app/ui/button";
import { createRequest, State } from "@/app/lib/actions";
import { useActionState } from "react";

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createRequest, initialState);
  return (
    <form className="space-y-12" action={formAction}>
      {/*<!-- Song Name Input -->*/}
      <div>
        <label
          htmlFor="trackName"
          className="block text-cyan-200 mb-2 pl-2 text-lg"
        >
          Track Name
        </label>
        <input
          type="text"
          id="trackName"
          name="trackName"
          placeholder="Enter track title"
          required
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
      {/*<!-- Request Type -->*/}
      <div id="request-success" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="mt-2 text-sm text-green-500 text-center">
            {state.message}
          </p>
        )}
      </div>
      <div id="request-error" aria-live="polite" aria-atomic="true">
        {state.errors?.trackName &&
          state.errors.trackName.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        {state.errors?.artist &&
          state.errors.artist.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      {/*<!-- Submit Button -->*/}
      <Button type="submit">SEND REQUEST</Button>
    </form>
  );
}
