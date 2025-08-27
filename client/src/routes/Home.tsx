import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[60vh] flex items-center bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 w-full">
        <h1 className="text-3xl font-bold text-center text-navy-dark">
          Hotel Guest Management
        </h1>
        <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-navy-dark" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 justify-center">
          <Link
            to="/guests"
            className="rounded-xl border shadow-sm hover:shadow-md transition-all bg-white"
          >
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-navy-dark mb-4">
                Guests
              </h2>
              <span className="inline-block px-5 py-2 rounded-lg bg-navy-dark text-white">
                Open
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
