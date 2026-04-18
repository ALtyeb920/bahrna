import { redirect } from "next/navigation";

// Operator dashboard has been consolidated into the owner dashboard.
// This redirect ensures old operator yachts URLs still work.
export default function OperatorYachtsPage() {
  redirect("/dashboard/owner/yachts");
}
