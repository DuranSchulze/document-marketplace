import { useState } from "react";
import { extractGoogleDriveFileId } from "@/lib/google-drive";
import { DocumentCreateSchema, type DocumentCreateInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/RichTextEditor";

const CATEGORIES = [
  "Legal",
  "Business",
  "Finance",
  "HR",
  "Academic",
  "Government",
  "Other",
];

interface Props {
  defaultValues?: Partial<DocumentCreateInput>;
  onSubmit: (data: DocumentCreateInput) => Promise<void>;
  submitLabel?: string;
}

export function DocumentForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [form, setForm] = useState<DocumentCreateInput>({
    title: defaultValues?.title ?? "",
    description: defaultValues?.description ?? "",
    price: defaultValues?.price ?? 0,
    category: defaultValues?.category ?? "",
    driveFileId: defaultValues?.driveFileId ?? "",
    driveFileName: defaultValues?.driveFileName ?? "",
    driveFileUrl: defaultValues?.driveFileUrl ?? "",
    thumbnailUrl: defaultValues?.thumbnailUrl ?? "",
    isActive: defaultValues?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    const result = DocumentCreateSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        nextErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="admin-panel rounded-2xl p-6 space-y-5"
    >
      {/* Title */}
      <div>
        <Label
          htmlFor="title"
          className="admin-field text-sm font-medium"
        >
          Title
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) =>
            setForm((current) => ({ ...current, title: e.target.value }))
          }
          placeholder="e.g. Business Proposal Template"
          className="mt-1"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label
          htmlFor="description"
          className="admin-field text-sm font-medium"
        >
          Description
        </Label>
        <div className="mt-1">
          <RichTextEditor
            value={form.description}
            onChange={(html) =>
              setForm((current) => ({ ...current, description: html }))
            }
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="price"
            className="admin-field text-sm font-medium"
          >
            Price (PHP)
          </Label>
          <Input
            id="price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.price === 0 ? "" : form.price}
            onChange={(e) => {
              const raw = e.target.value;
              setForm((current) => ({
                ...current,
                price: raw === "" ? 0 : Number(raw),
              }));
            }}
            placeholder="0"
            className="mt-1"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="category"
            className="admin-field text-sm font-medium"
          >
            Category
          </Label>
          <select
            id="category"
            value={form.category}
            onChange={(e) =>
              setForm((current) => ({ ...current, category: e.target.value }))
            }
            className="admin-field mt-1 flex h-9 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>
      </div>

      {/* Document file (Google Drive link) */}
      <div className="space-y-4">
        <Label className="admin-field text-sm font-medium block">
          Document File
        </Label>

        {form.driveFileId && (
          <>
            <div className="admin-alert-success flex items-center gap-3 rounded-xl px-4 py-3">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {form.driveFileName || "Drive file linked"}
                </p>
                <p className="text-xs opacity-80">
                  Google Drive file linked and ready for client download
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview((prev) => !prev)}
                className="text-xs underline shrink-0"
              >
                {showPreview ? "Hide preview" : "Show preview"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    driveFileId: "",
                    driveFileName: "",
                    driveFileUrl: "",
                  }));
                  setShowPreview(true);
                }}
                className="text-xs underline shrink-0"
              >
                Clear
              </button>
            </div>

            {showPreview && (
              <div className="admin-border overflow-hidden rounded-xl border bg-[var(--admin-panel)]">
                <div className="admin-border flex items-center justify-between gap-2 border-b px-4 py-2">
                  <p className="admin-muted text-xs font-medium">
                    File preview (Google Drive)
                  </p>
                  <a
                    href={`https://drive.google.com/file/d/${form.driveFileId}/view`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-link text-xs"
                  >
                    Open in Drive ↗
                  </a>
                </div>
                <iframe
                  key={form.driveFileId}
                  src={`https://drive.google.com/file/d/${form.driveFileId}/preview`}
                  title={form.driveFileName || "Document preview"}
                  className="block w-full bg-white dark:bg-slate-950"
                  style={{ height: 480 }}
                  allow="autoplay"
                  loading="lazy"
                />
                <p className="admin-border admin-muted px-4 py-2 text-[11px] border-t">
                  Preview only loads if the Drive file is shared with
                  &quot;Anyone with the link&quot; or with the viewer&apos;s
                  Google account.
                </p>
              </div>
            )}
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label
              htmlFor="driveFileUrl"
              className="admin-field text-sm font-medium"
            >
              Google Drive Link or File ID
            </Label>
            <Input
              id="driveFileUrl"
              value={form.driveFileUrl}
              onChange={(e) => {
                const value = e.target.value;
                const fileId = extractGoogleDriveFileId(value);
                setForm((current) => ({
                  ...current,
                  driveFileUrl: value,
                  driveFileId: fileId ?? "",
                }));
              }}
              placeholder="https://drive.google.com/file/d/... or Drive file ID"
              className="mt-1"
            />
            {errors.driveFileUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.driveFileUrl}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="driveFileName"
              className="admin-field text-sm font-medium"
            >
              Download File Name
            </Label>
            <Input
              id="driveFileName"
              value={form.driveFileName}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  driveFileName: e.target.value,
                }))
              }
              placeholder="e.g. business-proposal-template.pdf"
              className="mt-1"
            />
            {errors.driveFileName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.driveFileName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail URL */}
      <div>
        <Label
          htmlFor="thumbnailUrl"
          className="admin-field text-sm font-medium"
        >
          Thumbnail URL (optional)
        </Label>
        <Input
          id="thumbnailUrl"
          type="url"
          value={form.thumbnailUrl ?? ""}
          onChange={(e) =>
            setForm((current) => ({ ...current, thumbnailUrl: e.target.value }))
          }
          placeholder="https://…"
          className="mt-1"
        />
        {errors.thumbnailUrl && (
          <p className="text-red-500 text-xs mt-1">{errors.thumbnailUrl}</p>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="isActive"
          checked={form.isActive}
          onCheckedChange={(checked) =>
            setForm((current) => ({ ...current, isActive: checked }))
          }
        />
        <Label
          htmlFor="isActive"
          className="admin-field text-sm font-medium cursor-pointer"
        >
          Active (visible on storefront)
        </Label>
      </div>

      {submitError && (
        <div className="admin-alert-error rounded-lg px-4 py-3 text-sm">
          {submitError}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
