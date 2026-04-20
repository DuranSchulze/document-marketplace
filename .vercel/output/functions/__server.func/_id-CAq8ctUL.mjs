import { d as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./_id-D_fwrTs-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CAq8ctUL.js
var import_jsx_runtime = require_jsx_runtime();
function DocumentDetailPage() {
	const document = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page-wrap px-4 pb-16 pt-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-sm text-[var(--lagoon-deep)] hover:underline mb-6 inline-block",
				children: "← Back to marketplace"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "island-shell rounded-2xl overflow-hidden",
				children: [document.thumbnailUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: document.thumbnailUrl,
					alt: document.title,
					className: "w-full h-56 object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block text-xs font-semibold uppercase tracking-wider text-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.14)] rounded-full px-3 py-1 mb-4",
							children: document.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold text-[var(--sea-ink)] mb-4",
							children: document.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--sea-ink-soft)] mb-8 leading-relaxed",
							children: document.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-[rgba(23,58,64,0.1)] pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[var(--sea-ink-soft)] mb-1",
								children: "Price"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-3xl font-bold text-[var(--sea-ink)]",
								children: ["₱", document.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/checkout/$id",
								params: { id: document.id },
								className: "rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90",
								children: "Buy Now"
							})]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { DocumentDetailPage as component };
