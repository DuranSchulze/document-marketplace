import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./routes-BHcayipV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BYGouzqa.js
var import_jsx_runtime = require_jsx_runtime();
function DocumentCard({ document, index = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "island-shell feature-card rise-in rounded-2xl overflow-hidden flex flex-col",
		style: { animationDelay: `${index * 80}ms` },
		children: [document.thumbnailUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: document.thumbnailUrl,
			alt: document.title,
			className: "w-full h-44 object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full h-44 bg-[rgba(79,184,178,0.1)] flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "w-12 h-12 text-[var(--lagoon-deep)] opacity-40",
				fill: "none",
				viewBox: "0 0 24 24",
				stroke: "currentColor",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: 1.5,
					d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 flex flex-col flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-block text-xs font-semibold uppercase tracking-wider text-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.14)] rounded-full px-2.5 py-0.5 mb-3 self-start",
					children: document.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold text-[var(--sea-ink)] mb-2 line-clamp-2",
					children: document.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[var(--sea-ink-soft)] line-clamp-3 mb-4 flex-1",
					children: document.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mt-auto pt-4 border-t border-[rgba(23,58,64,0.08)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold text-[var(--sea-ink)]",
						children: ["₱", document.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/documents/$id",
						params: { id: document.id },
						className: "rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-1.5 text-xs font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]",
						children: "View Details"
					})]
				})
			]
		})]
	});
}
function StorefrontPage() {
	const documents = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-wrap px-4 pb-16 pt-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 mb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "island-kicker mb-3",
					children: "Document Marketplace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mb-4 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl",
					children: "Ready-to-use documents"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-0 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg",
					children: "Browse our collection of professional documents. Purchase and download instantly after payment."
				})
			]
		}), documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center py-20 text-[var(--sea-ink-soft)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-medium mb-2",
				children: "No documents listed yet."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					"Run ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "font-mono bg-[rgba(23,58,64,0.08)] px-2 py-0.5 rounded",
						children: "npm run db:seed"
					}),
					" or add documents via the admin panel."
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: documents.map((doc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentCard, {
				document: doc,
				index: i
			}, doc.id))
		})]
	});
}
//#endregion
export { StorefrontPage as component };
