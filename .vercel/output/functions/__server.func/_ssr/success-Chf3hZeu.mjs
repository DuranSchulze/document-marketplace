import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@posthog/react+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./success-D5ycYHoq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/success-Chf3hZeu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuccessPage() {
	const { orderId } = Route.useSearch();
	const [downloadUrl, setDownloadUrl] = (0, import_react.useState)(null);
	const [polling, setPolling] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!orderId) {
			setPolling(false);
			return;
		}
		let attempts = 0;
		const interval = setInterval(async () => {
			attempts++;
			try {
				const res = await fetch(`/api/orders/${orderId}`);
				if (res.ok) {
					const order = await res.json();
					if (order.status === "paid" && order.downloadUrl) {
						setDownloadUrl(order.downloadUrl);
						setPolling(false);
						clearInterval(interval);
					}
				}
			} catch {}
			if (attempts >= 12) {
				setPolling(false);
				clearInterval(interval);
			}
		}, 5e3);
		return () => clearInterval(interval);
	}, [orderId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page-wrap px-4 pb-16 pt-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-lg mx-auto text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "island-shell rounded-2xl p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-8 h-8 text-green-600",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M5 13l4 4L19 7"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-[var(--sea-ink)] mb-3",
						children: "Payment Successful!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[var(--sea-ink-soft)] mb-6",
						children: "Thank you for your purchase. A download link has been sent to your email address."
					}),
					polling && !downloadUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 text-sm text-[var(--sea-ink-soft)] mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "animate-spin w-4 h-4",
							viewBox: "0 0 24 24",
							fill: "none",
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
						}), "Preparing your download link…"]
					}),
					downloadUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: downloadUrl,
						className: "inline-block rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90 mb-4",
						children: "Download Now"
					}),
					!polling && !downloadUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[var(--sea-ink-soft)] mb-6",
						children: "Your download link will be emailed shortly. Please check your inbox."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "block text-sm text-[var(--lagoon-deep)] hover:underline mt-4",
						children: "Back to marketplace"
					})
				]
			})
		})
	});
}
//#endregion
export { SuccessPage as component };
