import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Badge } from "./badge-C0v3mpEz.mjs";
import { t as Route } from "./orders-B2W89p1W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DeUDB-Rn.js
var import_jsx_runtime = require_jsx_runtime();
var config = {
	pending: {
		label: "Pending",
		className: "bg-amber-100 text-amber-800 border-amber-200"
	},
	paid: {
		label: "Paid",
		className: "bg-green-100 text-green-800 border-green-200"
	},
	failed: {
		label: "Failed",
		className: "bg-red-100 text-red-800 border-red-200"
	}
};
function OrderStatusBadge({ status }) {
	const { label, className } = config[status] ?? config.pending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className,
		children: label
	});
}
function AdminOrders() {
	const orders = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "island-kicker mb-1",
			children: "Admin"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold text-[var(--sea-ink)]",
			children: "Orders"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "island-shell rounded-2xl overflow-hidden",
		children: orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-12 text-center text-[var(--sea-ink-soft)]",
			children: "No orders yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-[rgba(23,58,64,0.08)] bg-[rgba(23,58,64,0.03)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]",
						children: "Date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]",
						children: "Buyer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]",
						children: "Document"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-right font-semibold text-[var(--sea-ink-soft)]",
						children: "Amount"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]",
						children: "Download"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-[rgba(23,58,64,0.06)]",
				children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-[rgba(23,58,64,0.02)] transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 text-[var(--sea-ink-soft)] whitespace-nowrap",
							children: new Date(order.createdAt).toLocaleDateString("en-PH")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-6 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-[var(--sea-ink)]",
								children: order.buyerName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[var(--sea-ink-soft)]",
								children: order.buyerEmail
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 text-[var(--sea-ink)]",
							children: order.documentTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-6 py-4 text-right font-medium text-[var(--sea-ink)]",
							children: ["₱", order.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderStatusBadge, { status: order.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 text-center",
							children: order.downloadUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: order.downloadUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-xs text-[var(--lagoon-deep)] hover:underline",
								children: "Link"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[var(--sea-ink-soft)]",
								children: "—"
							})
						})
					]
				}, order.id))
			})]
		})
	})] });
}
//#endregion
export { AdminOrders as component };
