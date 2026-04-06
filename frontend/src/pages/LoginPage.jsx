import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(form);
      toast.success("Login successful.");
      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      badgeIcon={<ShieldCheck className="h-5 w-5" />}
      eyebrow="Welcome Back"
      title="Finance Workspace Login"
      description="Access analytics, transaction control, and role-managed operations."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <Link to="/register" className="font-semibold text-primary">
            Create one
          </Link>
        </p>
      }
    >
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm text-muted-foreground">
          <span>Email</span>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="h-11"
            required
          />
        </label>
        <label className="grid gap-1 text-sm text-muted-foreground">
          <span>Password</span>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="h-11"
            required
          />
        </label>
        <Button
          disabled={loading}
          type="submit"
          className="mt-1 h-11 w-full text-[15px] font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </AuthSplitLayout>
  );
}
