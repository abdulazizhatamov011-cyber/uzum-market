import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdmin, usingDevPassword, DEV_PASSWORD, adminPassword } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin — kirish", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-surface px-4">
      <Suspense>
        <LoginGate />
      </Suspense>
    </div>
  );
}

async function LoginGate() {
  if (await isAdmin()) redirect("/admin");
  return (
    <LoginForm
      devHint={usingDevPassword() ? DEV_PASSWORD : null}
      disabled={adminPassword() === null}
    />
  );
}
