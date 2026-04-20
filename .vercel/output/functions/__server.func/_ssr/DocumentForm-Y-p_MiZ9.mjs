import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@posthog/react+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as DocumentCreateSchema } from "./schemas-CuZJJ1um.mjs";
import { t as cn } from "./utils-BP1wLzC5.mjs";
import { n as Thumb, t as Root } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { t as Button } from "./button-CN5bG2iO.mjs";
import { n as Label$1, t as Input } from "./label-B8gd1bSk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DocumentForm-Y-p_MiZ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("flex field-sizing-content min-h-16 w-full resize-none rounded-xl border border-input bg-input/30 px-3 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
		...props
	});
}
function Switch$1({ className, size = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		"data-slot": "switch",
		"data-size": size,
		className: cn("peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, {
			"data-slot": "switch-thumb",
			className: "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
		})
	});
}
var CATEGORIES = [
	"Legal",
	"Business",
	"Finance",
	"HR",
	"Academic",
	"Government",
	"Other"
];
function DocumentForm({ defaultValues, onSubmit, submitLabel = "Save" }) {
	const [form, setForm] = (0, import_react.useState)({
		title: defaultValues?.title ?? "",
		description: defaultValues?.description ?? "",
		price: defaultValues?.price ?? 0,
		category: defaultValues?.category ?? "",
		driveFileId: defaultValues?.driveFileId ?? "",
		driveFileName: defaultValues?.driveFileName ?? "",
		driveFileUrl: defaultValues?.driveFileUrl ?? "",
		thumbnailUrl: defaultValues?.thumbnailUrl ?? "",
		isActive: defaultValues?.isActive ?? true
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [submitError, setSubmitError] = (0, import_react.useState)("");
	const [uploadState, setUploadState] = (0, import_react.useState)("idle");
	const [uploadError, setUploadError] = (0, import_react.useState)("");
	const [isDragOver, setIsDragOver] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const handleFileUpload = (0, import_react.useCallback)(async (file) => {
		const category = form.category.trim();
		if (!category) {
			setUploadError("Select a category first before uploading a file.");
			return;
		}
		setUploadState("uploading");
		setUploadError("");
		try {
			const fd = new FormData();
			fd.append("file", file);
			fd.append("category", category);
			const res = await fetch("/api/admin/upload", {
				method: "POST",
				body: fd
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? "Upload failed");
			}
			const { driveFileId, driveFileName, driveFileUrl } = await res.json();
			setForm((f) => ({
				...f,
				driveFileId,
				driveFileName,
				driveFileUrl
			}));
			setUploadState("done");
		} catch (err) {
			setUploadError(err instanceof Error ? err.message : "Upload failed");
			setUploadState("error");
		}
	}, [form.category]);
	function handleDrop(e) {
		e.preventDefault();
		setIsDragOver(false);
		const file = e.dataTransfer.files[0];
		if (file) handleFileUpload(file);
	}
	function handleFileChange(e) {
		const file = e.target.files?.[0];
		if (file) handleFileUpload(file);
		e.target.value = "";
	}
	async function handleSubmit(e) {
		e.preventDefault();
		setErrors({});
		setSubmitError("");
		const result = DocumentCreateSchema.safeParse(form);
		if (!result.success) {
			const errs = {};
			for (const issue of result.error.issues) errs[issue.path[0]] = issue.message;
			setErrors(errs);
			return;
		}
		setIsSubmitting(true);
		try {
			await onSubmit(result.data);
		} catch (err) {
			setSubmitError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setIsSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "island-shell rounded-2xl p-6 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
					htmlFor: "title",
					className: "text-sm font-medium text-[var(--sea-ink)]",
					children: "Title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "title",
					value: form.title,
					onChange: (e) => setForm((f) => ({
						...f,
						title: e.target.value
					})),
					placeholder: "e.g. Business Proposal Template",
					className: "mt-1"
				}),
				errors.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-red-500 text-xs mt-1",
					children: errors.title
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
					htmlFor: "description",
					className: "text-sm font-medium text-[var(--sea-ink)]",
					children: "Description"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "description",
					value: form.description,
					onChange: (e) => setForm((f) => ({
						...f,
						description: e.target.value
					})),
					placeholder: "Describe what this document contains and who it's for…",
					rows: 4,
					className: "mt-1"
				}),
				errors.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-red-500 text-xs mt-1",
					children: errors.description
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
						htmlFor: "price",
						className: "text-sm font-medium text-[var(--sea-ink)]",
						children: "Price (PHP)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "price",
						type: "number",
						value: form.price,
						onChange: (e) => setForm((f) => ({
							...f,
							price: Number(e.target.value)
						})),
						placeholder: "0",
						className: "mt-1"
					}),
					errors.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-red-500 text-xs mt-1",
						children: errors.price
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
						htmlFor: "category",
						className: "text-sm font-medium text-[var(--sea-ink)]",
						children: "Category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "category",
						value: form.category,
						onChange: (e) => setForm((f) => ({
							...f,
							category: e.target.value
						})),
						className: "mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select category…"
						}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c
						}, c))]
					}),
					errors.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-red-500 text-xs mt-1",
						children: errors.category
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
					className: "text-sm font-medium text-[var(--sea-ink)] mb-1 block",
					children: "Document File"
				}),
				form.driveFileId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-5 h-5 text-emerald-600 shrink-0",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-emerald-800 truncate",
								children: form.driveFileName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-emerald-600",
								children: "Uploaded to Google Drive"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setForm((f) => ({
									...f,
									driveFileId: "",
									driveFileName: "",
									driveFileUrl: ""
								}));
								setUploadState("idle");
							},
							className: "text-xs text-emerald-700 hover:text-emerald-900 underline shrink-0",
							children: "Replace"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onDragOver: (e) => {
						e.preventDefault();
						setIsDragOver(true);
					},
					onDragLeave: () => setIsDragOver(false),
					onDrop: handleDrop,
					onClick: () => fileInputRef.current?.click(),
					className: `relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${isDragOver ? "border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.08)]" : "border-[rgba(23,58,64,0.2)] hover:border-[var(--lagoon-deep)] hover:bg-[rgba(79,184,178,0.04)]"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
						onChange: handleFileChange,
						className: "sr-only"
					}), uploadState === "uploading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "w-8 h-8 text-[var(--lagoon-deep)] animate-spin",
						fill: "none",
						viewBox: "0 0 24 24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							className: "opacity-25",
							cx: "12",
							cy: "12",
							r: "10",
							stroke: "currentColor",
							strokeWidth: "4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							className: "opacity-75",
							fill: "currentColor",
							d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[var(--sea-ink-soft)]",
						children: "Uploading to Google Drive…"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-10 h-10 text-[var(--lagoon-deep)] opacity-60",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 1.5,
								d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-[var(--sea-ink)]",
							children: "Drop file here or click to browse"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[var(--sea-ink-soft)]",
							children: "PDF, Word, Excel, PowerPoint"
						})
					] })]
				}),
				uploadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-red-500 text-xs mt-1",
					children: uploadError
				}),
				errors.driveFileId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-red-500 text-xs mt-1",
					children: "File is required — please upload a document."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
					htmlFor: "thumbnailUrl",
					className: "text-sm font-medium text-[var(--sea-ink)]",
					children: "Thumbnail URL (optional)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "thumbnailUrl",
					type: "url",
					value: form.thumbnailUrl ?? "",
					onChange: (e) => setForm((f) => ({
						...f,
						thumbnailUrl: e.target.value
					})),
					placeholder: "https://…",
					className: "mt-1"
				}),
				errors.thumbnailUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-red-500 text-xs mt-1",
					children: errors.thumbnailUrl
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
					id: "isActive",
					checked: form.isActive,
					onCheckedChange: (checked) => setForm((f) => ({
						...f,
						isActive: checked
					}))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
					htmlFor: "isActive",
					className: "text-sm font-medium text-[var(--sea-ink)] cursor-pointer",
					children: "Active (visible on storefront)"
				})]
			}),
			submitError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700",
				children: submitError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => history.back(),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: isSubmitting || uploadState === "uploading",
					className: "rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90",
					children: isSubmitting ? "Saving…" : submitLabel
				})]
			})
		]
	});
}
//#endregion
export { DocumentForm as t };
