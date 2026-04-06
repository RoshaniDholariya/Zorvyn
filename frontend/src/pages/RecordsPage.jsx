import { useEffect, useMemo, useState } from "react";
import {
  createRecordApi,
  deleteRecordApi,
  getRecordsApi,
  updateRecordApi,
} from "../api/recordsApi";
import { useAuth } from "../context/AuthContext";
import {
  addCategory,
  loadCategories,
  removeCategory,
  saveCategories,
} from "../utils/categories";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  PlusCircle,
  Tags,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const defaultRecordForm = {
  amount: "",
  type: "INCOME",
  category: "",
  date: "",
  note: "",
};

export default function RecordsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const categoryScopeKey = user?.id ? `user_${user.id}` : "guest";

  const [records, setRecords] = useState([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
    startDate: "",
    endDate: "",
    userId: "",
  });
  const [categories, setCategories] = useState(() =>
    loadCategories(categoryScopeKey),
  );
  const [categoryDraft, setCategoryDraft] = useState({
    INCOME: "",
    EXPENSE: "",
  });

  const [form, setForm] = useState(defaultRecordForm);
  const [editingId, setEditingId] = useState(null);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      type: filters.type || undefined,
      category: filters.category || undefined,
      search: filters.search || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      userId: isAdmin && filters.userId ? Number(filters.userId) : undefined,
    }),
    [page, pageSize, filters, isAdmin],
  );

  const activeFormCategories = categories[form.type] || [];
  const typeBadgeClass = (type) =>
    type === "INCOME"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
      : "border-rose-300 bg-rose-50 text-rose-700";

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecordsApi(queryParams);
      setRecords(data.data || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setPageSize(data.pageSize || 20);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [queryParams]);

  useEffect(() => {
    setCategories(loadCategories(categoryScopeKey));
    setCategoryDraft({ INCOME: "", EXPENSE: "" });
    setForm((prev) => ({ ...prev, category: "" }));
  }, [categoryScopeKey]);

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const onFormChange = (event) => {
    const { name, value } = event.target;
    if (name === "type") {
      setForm((prev) => ({ ...prev, type: value, category: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(defaultRecordForm);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setRecordModalOpen(true);
  };

  const openCreateModalWithType = (type) => {
    setEditingId(null);
    setForm({
      ...defaultRecordForm,
      type,
      date: new Date().toISOString().split("T")[0],
    });
    setRecordModalOpen(true);
  };

  const onSubmitRecord = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editingId) {
        await updateRecordApi(editingId, payload);
        toast.success("Record updated.");
      } else {
        await createRecordApi(payload);
        toast.success("Record created.");
      }
      setRecordModalOpen(false);
      resetForm();
      loadRecords();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (record) => {
    setEditingId(record.id);
    setForm({
      amount: String(record.amount),
      type: record.type,
      category: record.category,
      date: new Date(record.date).toISOString().split("T")[0],
      note: record.note || "",
    });
    setRecordModalOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await deleteRecordApi(id);
      toast.success("Record deleted.");
      loadRecords();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to delete record.");
    }
  };

  const onAddCategory = (type) => {
    const next = addCategory(categories, type, categoryDraft[type]);
    const saved = saveCategories(next, categoryScopeKey);
    if (saved[type]?.length === categories[type]?.length) {
      toast.error("Enter a unique category name.");
      return;
    }
    setCategories(saved);
    setCategoryDraft((prev) => ({ ...prev, [type]: "" }));
    toast.success(`${type} category added.`);
  };

  const onRemoveCategory = (type, name) => {
    const next = removeCategory(categories, type, name);
    const saved = saveCategories(next, categoryScopeKey);
    setCategories(saved);
    if (form.type === type && form.category === name) {
      setForm((prev) => ({ ...prev, category: "" }));
    }
    toast.success(`${name} category removed.`);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Transactions
              </p>
              <CardTitle>Financial Records</CardTitle>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
              <Button
                variant="outline"
                type="button"
                onClick={loadRecords}
                className="w-full sm:w-auto"
              >
                Refresh
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setCategoryModalOpen(true)}
                className="w-full sm:w-auto text-xs"
              >
                <Tags className="size-4" />
                Manage Categories
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => openCreateModalWithType("INCOME")}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="size-4" />
                Add Income
              </Button>
              <Button
                type="button"
                onClick={() => openCreateModalWithType("EXPENSE")}
                className="w-full sm:w-auto"
              >
                <CircleDollarSign className="size-4" />
                Add Expense
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={openCreateModal}
                className="col-span-2 w-full sm:col-auto sm:w-auto"
              >
                New Record
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4 rounded-xl border border-dashed bg-muted/40 p-3">
            <p className="text-sm font-medium">
              Quick actions are now available above for all users.
            </p>
            <p className="text-xs text-muted-foreground">
              Create a category first, then add income/expense records
              instantly.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <select
              name="type"
              value={filters.type}
              onChange={onFilterChange}
              className="h-10 rounded-lg border border-input px-2.5 text-sm"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            <Input
              name="category"
              placeholder="Category"
              value={filters.category}
              onChange={onFilterChange}
            />
            <Input
              name="search"
              placeholder="Search note/category"
              value={filters.search}
              onChange={onFilterChange}
            />
            <Input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={onFilterChange}
            />
            <Input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={onFilterChange}
            />
            {isAdmin ? (
              <Input
                name="userId"
                placeholder="User ID (admin scope)"
                value={filters.userId}
                onChange={onFilterChange}
                className="sm:col-span-2 lg:col-span-1"
              />
            ) : null}
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="h-10 rounded-lg border border-input px-2.5 text-sm"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <p className="text-sm font-medium text-destructive">{error}</p>
      ) : null}
      {loading ? (
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />
      ) : null}

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="border-b px-2 py-2">ID</th>
                  <th className="border-b px-2 py-2">User</th>
                  <th className="border-b px-2 py-2">Type</th>
                  <th className="border-b px-2 py-2">Category</th>
                  <th className="border-b px-2 py-2">Amount</th>
                  <th className="border-b px-2 py-2">Date</th>
                  <th className="border-b px-2 py-2">Note</th>
                  <th className="border-b px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className={`text-sm ${
                      record.type === "INCOME"
                        ? "border-l-4 border-l-emerald-500 bg-emerald-50/70"
                        : "border-l-4 border-l-rose-500 bg-rose-50/70"
                    }`}
                  >
                    <td className={`border-b px-2 py-2 ${record.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>{record.id}</td>
                    <td className={`border-b px-2 py-2 ${record.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>
                      {record.user.name || "-"}
                    </td>
                    <td className={`border-b px-2 py-2 ${record.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>
                      <Badge
                        variant="outline"
                        className={typeBadgeClass(record.type)}
                      >
                        {record.type === "INCOME" ? (
                          <ArrowUpCircle className="size-3.5" />
                        ) : (
                          <ArrowDownCircle className="size-3.5" />
                        )}
                        {record.type}
                      </Badge>
                    </td>
                    <td className={`border-b px-2 py-2 ${record.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>{record.category}</td>
                    <td className={`border-b px-2 py-2 font-semibold ${record.type === "INCOME" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"}`}>
                      Rs. {Number(record.amount).toFixed(2)}
                    </td>
                    <td className={`border-b px-2 py-2 ${record.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className={`border-b px-2 py-2 ${record.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>{record.note || "-"}</td>
                    <td className={`border-b px-2 py-2 ${record.type === "INCOME" ? "border-emerald-200" : "border-rose-200"}`}>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => onEdit(record)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => onDelete(record.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!records.length ? (
                  <tr>
                    <td
                      className="px-2 py-3 text-sm text-muted-foreground"
                      colSpan={8}
                    >
                      No records found for selected filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={recordModalOpen} onOpenChange={setRecordModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Record" : "Create Record"}
            </DialogTitle>
            <DialogDescription>
              Maintain transaction entries with your chosen categories.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={onSubmitRecord}>
            <div className="grid gap-3 md:grid-cols-12">
              <label className="grid gap-1 text-sm text-muted-foreground md:col-span-4">
                <span>Amount</span>
                <Input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={form.amount}
                  onChange={onFormChange}
                  required
                  className="h-10"
                />
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground md:col-span-4">
                <span>Type</span>
                <select
                  name="type"
                  value={form.type}
                  onChange={onFormChange}
                  className="h-10 rounded-lg border border-input px-2.5 text-sm"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground md:col-span-4">
                <span>Date</span>
                <Input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onFormChange}
                  required
                  className="h-10"
                />
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground md:col-span-4">
                <span>Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={onFormChange}
                  required
                  className="h-10 rounded-lg border border-input px-2.5 text-sm"
                >
                  <option value="">Select category</option>
                  {activeFormCategories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {!activeFormCategories.length ? (
                  <button
                    type="button"
                    onClick={() => setCategoryModalOpen(true)}
                    className="w-fit text-xs font-medium text-primary underline underline-offset-2"
                  >
                    No category available for {form.type}. Create one now.
                  </button>
                ) : null}
              </label>
              <label className="grid gap-1 text-sm text-muted-foreground md:col-span-8">
                <span>Note</span>
                <Input
                  name="note"
                  value={form.note}
                  onChange={onFormChange}
                  className="h-10"
                  placeholder="Add a short note"
                />
              </label>
            </div>
            <DialogFooter className="mt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setRecordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={submitting} type="submit">
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Record"
                    : "Create Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Categories are private to this account and used only for your
              records.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {["INCOME", "EXPENSE"].map((type) => (
              <section
                key={type}
                className={`flex min-h-[230px] flex-col gap-3 rounded-xl border p-4 ${
                  type === "INCOME"
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-rose-200 bg-rose-50/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{type}</h4>
                  <Badge variant="outline" className={typeBadgeClass(type)}>
                    {(categories[type] || []).length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={categoryDraft[type]}
                    onChange={(event) =>
                      setCategoryDraft((prev) => ({
                        ...prev,
                        [type]: event.target.value,
                      }))
                    }
                    placeholder={`Add ${type.toLowerCase()} category`}
                    className="h-10"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onAddCategory(type)}
                    className="h-10 shrink-0"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex max-h-40 flex-wrap content-start gap-2 overflow-auto rounded-lg border border-dashed p-2">
                  {(categories[type] || []).map((name) => (
                    <div
                      key={`${type}-${name}`}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                        type === "INCOME"
                          ? "border-emerald-200 bg-white text-emerald-800"
                          : "border-rose-200 bg-white text-rose-800"
                      }`}
                    >
                      <span className="font-medium">{name}</span>
                      <button
                        className="rounded-full bg-destructive/10 px-1 text-destructive"
                        type="button"
                        onClick={() => onRemoveCategory(type, name)}
                        aria-label={`Remove ${name}`}
                      >
                        x
                      </button>
                    </div>
                  ))}
                  {!categories[type]?.length ? (
                    <p className="text-xs text-muted-foreground">
                      No categories yet.
                    </p>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
