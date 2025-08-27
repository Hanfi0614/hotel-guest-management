import { useNavigate } from "react-router-dom";
import { pb } from "../lib/pb";
import { useToast } from "../components/Toaster";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewGuest() {
  const nav = useNavigate();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const phone = (fd.get("phone") as string | null)?.trim() ?? "";
    const dob = (fd.get("date_of_birth") as string | null) ?? "";

    
    if (!dob) {
      toast("Date of birth is required.", "error");
      return;
    }
    {
      const d = new Date(dob + "T00:00:00");
      const now = new Date();
      if (Number.isNaN(d.getTime()) || d > now) {
        toast("Date of birth must be a valid past date.", "error");
        return;
      }
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      toast("Phone must be exactly 10 digits (numbers only).", "error");
      return;
    }
    // ---------------------

    try {
      await pb.collection("guests").create(Object.fromEntries(fd));
      toast("Guest created");
      nav("/guests");
    } catch {
      toast("Create failed", "error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-navy-dark text-center">
        Add New Guest
      </h1>

      <form onSubmit={onSubmit} className="overflow-hidden rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-navy-dark text-white">
            <tr>
              <th colSpan={2} className="p-3 text-left">Guest Information</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            <Row label="First Name"  name="first_name" required />
            <Row label="Last Name"   name="last_name"  required />
            <Row label="Email"       name="email"      type="email" required />
            <Row
              label="Phone"
              name="phone"
              inputProps={{
                inputMode: "numeric",
                pattern: "\\d{10}",
                minLength: 10,
                maxLength: 10,
                placeholder: "10 digits (e.g. 0712345678)",
                title: "Enter exactly 10 digits",
              }}
            />
            <Row label="Address" name="address" />
            <Row
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              required
              inputProps={{
                max: todayStr(),
                min: "1900-01-01",
              }}
            />
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="p-4 text-center bg-gray-100">
                <button className="px-6 py-2 rounded-lg bg-navy-dark text-white hover:opacity-90 transition duration-200">
                  Create
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
  );
}

function Row({
  label,
  name,
  type = "text",
  required = false,
  inputProps = {},
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <tr className="odd:bg-gray-50 even:bg-white">
      <td className="p-3 font-medium text-navy-dark">{label}</td>
      <td className="p-3">
        <input
          name={name}
          type={type}
          required={required}
          className="w-full border px-3 py-2 rounded-lg"
          {...inputProps}
        />
      </td>
    </tr>
  );
}
