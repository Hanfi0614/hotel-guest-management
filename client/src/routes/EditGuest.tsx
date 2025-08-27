import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { pb } from "../lib/pb";
import type { Guest } from "../types";
import { useToast } from "../components/Toaster";

function todayStr() {
  return new Date().toISOString().slice(0, 10); // yyyy-mm-dd
}

export default function EditGuest() {
  const { id } = useParams();
  const nav = useNavigate();
  const [g, setG] = useState<Guest | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const toast = useToast(); // keep for success update

  // ---------- Load guest once (no error toast) ----------
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const rec = await pb.collection("guests").getOne<Guest>(id);
        if (!cancelled) setG(rec);
      } catch (err) {
        console.error("Failed to load guest:", err);
        if (!cancelled) setLoadErr(true); // no toast
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);
  // ------------------------------------------------------

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;

    const fd = new FormData(e.currentTarget);
    const phone = (fd.get("phone") as string | null)?.trim() ?? "";
    const dob = (fd.get("date_of_birth") as string | null) ?? "";

    // Validations
    if (!dob) {
      // no error toast requested? if you still want inline, you can add state.
      // keeping a small toast here is usually ok, but remove if you want total silence:
      // toast("Date of birth is required.", "error"); return;
      return;
    }
    {
      const d = new Date(dob + "T00:00:00");
      const now = new Date();
      if (Number.isNaN(d.getTime()) || d > now) {
        // toast("Date of birth must be a valid past date.", "error"); return;
        return;
      }
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      // toast("Phone must be exactly 10 digits (numbers only).", "error"); return;
      return;
    }

    try {
      await pb.collection("guests").update(id, Object.fromEntries(fd));
      toast("Guest updated"); // keep success toast
      nav("/guests");
    } catch (err) {
      console.error("Update failed:", err);
     
    }
  }

  if (loadErr) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-lg border bg-white p-6 text-gray-700">
          <h2 className="text-lg font-semibold text-navy-dark mb-2">
            Couldn’t load guest
          </h2>
          <p className="mb-4">The guest may not exist or the server is unreachable.</p>
          <Link
            to="/guests"
            className="inline-block px-4 py-2 rounded-lg bg-navy-dark text-white hover:opacity-90 transition"
          >
            Back to Guests
          </Link>
        </div>
      </div>
    );
  }

  if (!g) return <div className="p-6 text-navy-dark">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-navy-dark text-center">
        Edit Guest
      </h1>

      <form onSubmit={onSubmit} className="overflow-hidden rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-navy-dark text-white">
            <tr>
              <th colSpan={2} className="p-3 text-left">Guest Information</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            <tr>
              <td className="p-3 font-medium text-navy-dark">First Name</td>
              <td className="p-3">
                <input
                  name="first_name"
                  defaultValue={g.first_name}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </td>
            </tr>
            <tr className="bg-white">
              <td className="p-3 font-medium text-navy-dark">Last Name</td>
              <td className="p-3">
                <input
                  name="last_name"
                  defaultValue={g.last_name}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-navy-dark">Email</td>
              <td className="p-3">
                <input
                  name="email"
                  type="email"
                  defaultValue={g.email}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </td>
            </tr>
            <tr className="bg-white">
              <td className="p-3 font-medium text-navy-dark">Phone</td>
              <td className="p-3">
                <input
                  name="phone"
                  defaultValue={g.phone ?? ""}
                  inputMode="numeric"
                  pattern="\d{10}"
                  minLength={10}
                  maxLength={10}
                  placeholder="10 digits (e.g. 0712345678)"
                  className="w-full border px-3 py-2 rounded-lg"
                  title="Enter exactly 10 digits"
                />
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-navy-dark">Address</td>
              <td className="p-3">
                <input
                  name="address"
                  defaultValue={g.address ?? ""}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </td>
            </tr>
            <tr className="bg-white">
              <td className="p-3 font-medium text-navy-dark">Date of Birth</td>
              <td className="p-3">
                <input
                  name="date_of_birth"
                  type="date"
                  required
                  max={todayStr()}
                  min="1900-01-01"
                  defaultValue={g.date_of_birth ? g.date_of_birth.slice(0, 10) : ""}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="p-4 text-center bg-gray-100">
                <button className="px-6 py-2 rounded-lg bg-navy-dark text-white hover:opacity-90 transition duration-200">
                  Save
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
  );
}
