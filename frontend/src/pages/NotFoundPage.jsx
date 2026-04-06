import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">404</p>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
