import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@posthog/react+[...].mjs";
import { d as Link, m as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-CN5bG2iO.mjs";
import { t as Route } from "./dashboard-8sz9bPEd.mjs";
import { t as Badge } from "./badge-C0v3mpEz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B05wUmyO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const documents = Route.useLoaderData();
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const router = useRouter();
	async function handleDelete(id, title) {
		if (!confirm(`Archive "${title}"? It will be hidden from the storefront.`)) return;
		setDeleting(id);
		await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
		setDeleting(null);
		router.invalidate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "island-kicker mb-1",
			children: "Admin"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold text-[var(--sea-ink)]",
			children: "Documents"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin/documents/new",
			className: "rounded-full bg-[var(--lagoon-deep)] px-5 py-2 text-sm font-semibold text-white no-underline transition hover:opacity-90",
			children: "+ New Document"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "island-shell rounded-2xl overflow-hidden",
		children: documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-12 text-center text-[var(--sea-ink-soft)]",
			children: "No documents yet. Add your first one above."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-[rgba(23,58,64,0.08)] bg-[rgba(23,58,64,0.03)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]",
						children: "Title"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]",
						children: "Category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-right font-semibold text-[var(--sea-ink-soft)]",
						children: "Price"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]",
						children: "Actions"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-[rgba(23,58,64,0.06)]",
				children: documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-[rgba(23,58,64,0.02)] transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 font-medium text-[var(--sea-ink)]",
							children: doc.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 text-[var(--sea-ink-soft)]",
							children: doc.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-6 py-4 text-right text-[var(--sea-ink)]",
							children: ["₱", doc.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: doc.isActive ? "default" : "secondary",
								children: doc.isActive ? "Active" : "Archived"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-6 py-4 text-center space-x-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/documents/$id/edit",
								params: { id: doc.id },
								className: "text-xs text-[var(--lagoon-deep)] hover:underline",
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-xs text-red-500 hover:text-red-700 h-auto p-0",
								disabled: deleting === doc.id,
								onClick: () => handleDelete(doc.id, doc.title),
								children: deleting === doc.id ? "Archiving…" : "Archive"
							})]
						})
					]
				}, doc.id))
			})]
		})
	})] });
}
//#endregion
export { AdminDashboard as component };
