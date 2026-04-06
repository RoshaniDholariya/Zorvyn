import { useEffect, useState } from "react";
import { createUserApi, getUsersApi, updateUserRoleApi, updateUserStatusApi } from "../api/usersApi";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const defaultUserForm = {
  name: "",
  email: "",
  password: "",
  role: "VIEWER",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(defaultUserForm);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async ({ notifySuccess = false } = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsersApi({ page, pageSize });
      setUsers(data.data || []);
      setTotal(data.total || 0);
      if (notifySuccess) toast.success("Users refreshed.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, pageSize]);

  const onCreateUser = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createUserApi(form);
      setForm(defaultUserForm);
      setCreateModalOpen(false);
      toast.success("User created successfully.");
      loadUsers();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const onRoleChange = async (id, role) => {
    try {
      await updateUserRoleApi(id, role);
      toast.success(`Role updated to ${role}.`);
      loadUsers();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to update role.");
    }
  };

  const onStatusChange = async (id, isActive) => {
    try {
      await updateUserStatusApi(id, isActive);
      toast.success(`User marked as ${isActive ? "ACTIVE" : "INACTIVE"}.`);
      loadUsers();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to update status.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Admin Controls</p>
              <CardTitle>User Management</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" type="button" onClick={() => loadUsers({ notifySuccess: true })}>
                Refresh
              </Button>
              <Button type="button" onClick={() => setCreateModalOpen(true)}>
                Create User
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
      {loading ? <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" /> : null}

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="border-b px-2 py-2">ID</th>
                  <th className="border-b px-2 py-2">Name</th>
                  <th className="border-b px-2 py-2">Email</th>
                  <th className="border-b px-2 py-2">Role</th>
                  <th className="border-b px-2 py-2">Status</th>
                  <th className="border-b px-2 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="text-sm">
                    <td className="border-b px-2 py-2">{user.id}</td>
                    <td className="border-b px-2 py-2">{user.name}</td>
                    <td className="border-b px-2 py-2">{user.email}</td>
                    <td className="border-b px-2 py-2">
                      <select className="h-8 rounded-lg border border-input px-2.5 text-sm" value={user.role} onChange={(event) => onRoleChange(user.id, event.target.value)}>
                        <option value="VIEWER">VIEWER</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="border-b px-2 py-2">
                      <select
                        className="h-8 rounded-lg border border-input px-2.5 text-sm"
                        value={String(user.isActive)}
                        onChange={(event) => onStatusChange(user.id, event.target.value === "true")}
                      >
                        <option value="true">ACTIVE</option>
                        <option value="false">INACTIVE</option>
                      </select>
                    </td>
                    <td className="border-b px-2 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!users.length ? (
                  <tr>
                    <td className="px-2 py-3 text-sm text-muted-foreground" colSpan={6}>
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline" disabled={page <= 1} type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" disabled={page >= totalPages} type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
              Next
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <select className="h-8 rounded-lg border border-input px-2.5 text-sm" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a user and assign proper role access.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-3" onSubmit={onCreateUser}>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="grid gap-1 text-sm text-muted-foreground">
                <span>Full Name</span>
                <Input name="name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required className="h-10" />
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground">
                <span>Email</span>
                <Input name="email" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required className="h-10" />
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground">
                <span>Password</span>
                <Input name="password" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} required className="h-10" />
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground">
                <span>Role</span>
                <select className="h-10 rounded-lg border border-input px-2.5 text-sm" name="role" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}>
                  <option value="VIEWER">VIEWER</option>
                  <option value="ANALYST">ANALYST</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
            </div>
            <DialogFooter className="mt-2">
              <Button variant="outline" type="button" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button disabled={submitting} type="submit">
                {submitting ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
