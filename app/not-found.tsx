import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex flex-col items-center space-y-5 max-w-md">
        <div className="p-4 bg-error/10 text-error rounded-full">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">404 - Page Not Found</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The banking resource you are attempting to access does not exist, has been archived, or you lack the permission tokens to view it.
        </p>
        <Button variant="primary" asChild className="mt-2">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
