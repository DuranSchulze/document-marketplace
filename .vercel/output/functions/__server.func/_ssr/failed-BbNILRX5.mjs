import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./failed-CXCYPUNK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/failed-BbNILRX5.js
var import_jsx_runtime = require_jsx_runtime();
function FailedPage() {
	const { documentId } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page-wrap px-4 pb-16 pt-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-lg mx-auto text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "island-shell rounded-2xl p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-8 h-8 text-red-600",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M6 18L18 6M6 6l12 12"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-[var(--sea-ink)] mb-3",
						children: "Payment Failed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[var(--sea-ink-soft)] mb-8",
						children: "Your payment was not completed. No charges were made. Please try again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [documentId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout/$id",
							params: { id: documentId },
							className: "rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90",
							children: "Try Again"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-sm text-[var(--lagoon-deep)] hover:underline",
							children: "Back to marketplace"
						})]
					})
				]
			})
		})
	});
}
//#endregion
export { FailedPage as component };
