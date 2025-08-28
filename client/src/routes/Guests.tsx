import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { pb } from "../lib/pb";
import type { Guest } from "../types";
import { useToast } from "../components/Toaster";
import ConfirmDialog from "../components/ConfirmDialog";

const PER_PAGE = 10;

export default function Guests() {
  const toast = useToast();
  const queryClient = useQueryClient();

  
  const [q, setQ] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      return await pb.collection("guests").getList<Guest>(1, PER_PAGE, {
        sort: "-created",
      });
    },
    staleTime: 60 * 1000,
  });

  
  const items = data?.items ?? [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((g) =>
      [
        g.first_name,
        g.last_name,
        g.email,
        g.phone ?? "",
        g.address ?? "",
        g.date_of_birth ?? "",
      ].some((v) => v?.toString().toLowerCase().includes(s))
    );
  }, [q, items]);

  function askDelete(id: string) {
    setPendingId(id);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!pendingId) return;
    try {
      await pb.collection("guests").delete(pendingId);
      toast("Guest deleted");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    } catch {
      toast("Delete failed", "error");
    } finally {
      setConfirmOpen(false);
      setPendingId(null);
    }
  }

  if (isLoading) return <div className="p-6">Loading guests...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load guests</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-navy-dark text-center">Guests List</h1>

      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone, address, DOB…"
          aria-label="Search guests"
          className="w-full sm:max-w-md border rounded-lg px-3 py-2"
        />
        <Link
          to="/guests/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-dark text-white hover:opacity-90 transition"
          aria-label="Add Guest"
        >
          + Add Guest
        </Link>
      </div>

      <div className="rounded-lg overflow-hidden shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-navy-dark text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Date of Birth</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g: Guest) => (
              <tr key={g.id} className="odd:bg-gray-50 even:bg-white">
                <td className="p-3">{g.first_name} {g.last_name}</td>
                <td className="p-3">{g.email}</td>
                <td className="p-3">{g.phone ?? "-"}</td>
                <td className="p-3">{g.address ?? "-"}</td>
                <td className="p-3">{g.date_of_birth?.slice(0, 10) ?? "-"}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
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
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Guest?"
        message="Are you sure you want to delete this guest? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={doDelete}
        onCancel={() => { setConfirmOpen(false); setPendingId(null); }}
      />
    </div>
  );
}
