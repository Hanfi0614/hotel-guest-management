import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { pb } from "../lib/pb";
import type { Guest } from "../types";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [q, setQ] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  
  useEffect(() => {
  pb.collection("guests").getFullList<Guest>({ sort: "-created" })
    .then(setGuests)
    .catch(() => {
      console.error("Failed to load guests"); 
    });
}, []); 


  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return guests;
    return guests.filter(g =>
      [
        g.first_name,
        g.last_name,
        g.email,
        g.phone ?? "",
        g.address ?? "",
        g.date_of_birth ?? "",
      ].some(v => v?.toString().toLowerCase().includes(s))
    );
  }, [q, guests]);

  function askDelete(id: string) {
    setPendingId(id);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!pendingId) return;
    try {
      await pb.collection("guests").delete(pendingId);
      setGuests(prev => prev.filter(g => g.id !== pendingId));
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setConfirmOpen(false);
      setPendingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-navy-dark text-center">Guests</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search name, email, phone, address, DOB…"
          className="w-full sm:max-w-md border rounded-lg px-3 py-2"
        />
        <Link
          to="/guests/new"
          className="inline-block px-4 py-2 rounded-lg bg-navy-dark text-white text-center hover:opacity-90 transition"
        >
          Add Guest
        </Link>
      </div>

      <div className="rounded-lg overflow-hidden shadow-lg bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-navy-dark text-white">
            <tr>
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Date of Birth</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(g => (
              <tr key={g.id} className="odd:bg-gray-50 even:bg-white">
                <td className="p-3">{g.first_name}</td>
                <td className="p-3">{g.last_name}</td>
                <td className="p-3">{g.email}</td>
                <td className="p-3">{g.phone ?? "-"}</td>
                <td className="p-3">{g.address ?? "-"}</td>
                <td className="p-3">
                  {g.date_of_birth ? g.date_of_birth.slice(0, 10) : "-"}
                </td>
                <td className="p-3 text-center space-x-3">
                  <Link
                    to={`/guests/${g.id}`}
                    className="px-3 py-1 rounded bg-navy-dark text-white hover:opacity-90"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => askDelete(g.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={7}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      <ConfirmDialog
        open={confirmOpen}
        title="Delete guest?"
        message="This action cannot be undone."
        confirmText="Yes, delete"
        cancelText="No"
        onConfirm={doDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingId(null);
        }}
      />
    </div>
  );
}
