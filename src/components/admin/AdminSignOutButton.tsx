"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminSignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="mt-1 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink/60 transition hover:bg-line/50 hover:text-ink"
    >
      Sign out
    </button>
  );
}
