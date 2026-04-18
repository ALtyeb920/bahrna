import { redirect } from "next/navigation";

// Operator dashboard has been consolidated into the owner dashboard.
// This redirect ensures old operator bookings URLs still work.
export default function OperatorBookingsPage() {
  redirect("/dashboard/owner/bookings");
}
