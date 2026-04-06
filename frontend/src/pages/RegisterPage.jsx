import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, logout } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      logout();
      toast.success("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      badgeIcon={<UserPlus className="h-5 w-5" />}
      eyebrow="Create Account"
      title="Register for Secure Access"
      description="New users join as viewer by default. Use admin signup code only when authorized."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Login here
          </Link>
        </p>
      }
    >
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm text-muted-foreground">
          <span>Full Name</span>
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            className="h-11"
            required
          />
        </label>
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
        <label className="grid gap-1 text-sm text-muted-foreground">
          <span>Admin Signup Code (Optional)</span>
          <Input
            type="text"
            name="adminCode"
            value={form.adminCode}
            onChange={onChange}
            className="h-11"
          />
        </label>
        <Button
          disabled={loading}
          type="submit"
          className="mt-1 h-11 w-full text-[15px] font-semibold"
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </AuthSplitLayout>
  );
}
