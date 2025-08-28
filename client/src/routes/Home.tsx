import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[60vh] flex items-center bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 w-full">
        
        <h1 className="text-3xl font-bold text-center text-navy-dark">
          Hotel Guest Management
        </h1>
        <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-navy-dark" />

        
        <div className="mt-3">
          <Link
            to="/guests"
            className="block rounded-xl border shadow-sm hover:shadow-md transition-all bg-white"
          >
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-navy-dark mb-4">
                Guests
              </h2>
              <div className="flex justify-center">
                <span className="inline-block px-6 py-3 rounded-lg bg-navy-dark text-white text-lg">
                  Open
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
