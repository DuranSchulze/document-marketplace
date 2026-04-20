import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@posthog/react+[...].mjs";
import { t as authClient } from "./_ssr/auth-client-C1qlzQF7.mjs";
import { d as Link, f as useNavigate, i as useRouterState, s as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin-CDJ9IcY6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var navItems = [{
	to: "/admin/dashboard",
	label: "Documents",
	icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: "w-4 h-4",
		fill: "none",
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			strokeLinecap: "round",
			strokeLinejoin: "round",
			strokeWidth: 2,
			d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		})
	})
}, {
	to: "/admin/orders",
	label: "Orders",
	icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: "w-4 h-4",
		fill: "none",
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			strokeLinecap: "round",
			strokeLinejoin: "round",
			strokeWidth: 2,
			d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
		})
	})
}];
function AdminSidebar() {
	const { location } = useRouterState();
	const navigate = useNavigate();
	async function handleSignOut() {
		await authClient.signOut();
		navigate({ to: "/admin/login" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-56 shrink-0 border-r border-[rgba(23,58,64,0.08)] bg-white flex flex-col min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-6 border-b border-[rgba(23,58,64,0.08)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "island-kicker text-xs",
					children: "Admin Portal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[var(--sea-ink)] text-sm mt-0.5",
					children: "Document Marketplace"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 p-3 space-y-1",
				children: navItems.map((item) => {
					const active = location.pathname.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors ${active ? "bg-[rgba(79,184,178,0.14)] text-[var(--lagoon-deep)]" : "text-[var(--sea-ink-soft)] hover:bg-[rgba(23,58,64,0.04)] hover:text-[var(--sea-ink)]"}`,
						children: [item.icon, item.label]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 border-t border-[rgba(23,58,64,0.08)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] no-underline hover:bg-[rgba(23,58,64,0.04)] hover:text-[var(--sea-ink)] transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						})
					}), "View Store"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleSignOut,
					className: "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						})
					}), "Sign Out"]
				})]
			})
		]
	});
}
function GoogleStatusBanner() {
	const [state, setState] = (0, import_react.useState)({ kind: "loading" });
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [test, setTest] = (0, import_react.useState)({ kind: "idle" });
	const load = (0, import_react.useCallback)(async () => {
		try {
			const res = await fetch("/api/admin/google-status", { credentials: "include" });
			if (!res.ok) {
				setState({
					kind: "error",
					message: `HTTP ${res.status}`
				});
				return;
			}
			setState({
				kind: "ready",
				data: await res.json()
			});
		} catch (err) {
			setState({
				kind: "error",
				message: err instanceof Error ? err.message : "Network error"
			});
		} finally {
			setRefreshing(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const runTestWrite = (0, import_react.useCallback)(async () => {
		setTest({ kind: "running" });
		try {
			const res = await fetch("/api/admin/sheets-test-write", {
				method: "POST",
				credentials: "include"
			});
			const data = await res.json();
			if (data.ok) setTest({
				kind: "ok",
				cell: data.cell,
				value: data.value
			});
			else setTest({
				kind: "error",
				message: data.error ?? `HTTP ${res.status}`
			});
		} catch (err) {
			setTest({
				kind: "error",
				message: err instanceof Error ? err.message : "Network error"
			});
		}
	}, []);
	if (state.kind === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 rounded-md border border-[rgba(23,58,64,0.08)] bg-white px-3 py-1.5 text-xs text-[var(--sea-ink-soft)]",
		children: "Checking Google…"
	});
	if (state.kind === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700",
		children: ["Google status error: ", state.message]
	});
	const { drive, sheets } = state.data;
	const bothOk = drive.ok && sheets.ok;
	const noneOk = !drive.ok && !sheets.ok;
	const tone = bothOk ? {
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		text: "text-emerald-800"
	} : noneOk ? {
		bg: "bg-red-50",
		border: "border-red-200",
		text: "text-red-800"
	} : {
		bg: "bg-amber-50",
		border: "border-amber-200",
		text: "text-amber-900"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `mb-4 rounded-md border ${tone.border} ${tone.bg} ${tone.text} px-3 py-1.5 text-xs`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-x-4 gap-y-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					label: "Drive",
					status: drive,
					detail: drive.ok ? drive.folderName : drive.error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					label: "Sheets",
					status: sheets,
					detail: sheets.ok ? sheets.title : sheets.error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-3",
					children: [
						test.kind === "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-emerald-700",
							title: `Wrote "${test.value}" to ${test.cell}`,
							children: ["✓ wrote to ", test.cell]
						}),
						test.kind === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-red-700 truncate max-w-[20rem]",
							title: test.message,
							children: ["✗ ", test.message]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: runTestWrite,
							disabled: !sheets.ok || test.kind === "running",
							className: "rounded border border-current/30 px-2 py-0.5 font-medium hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed",
							children: test.kind === "running" ? "Writing…" : "Test write"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setRefreshing(true);
								load();
							},
							disabled: refreshing,
							className: "underline underline-offset-2 disabled:opacity-50",
							children: refreshing ? "…" : "Refresh"
						})
					]
				})
			]
		})
	});
}
function Pill({ label, status, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `inline-block h-1.5 w-1.5 rounded-full ${status.ok ? "bg-emerald-500" : "bg-red-500"}`,
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate max-w-[16rem] opacity-80",
				title: detail,
				children: status.ok ? detail ?? "ok" : detail ?? "not connected"
			})
		]
	});
}
/** Sign the admin out after this many ms of inactivity. */
var IDLE_LIMIT_MS = 1800 * 1e3;
/** How often to check whether the idle limit has been crossed. */
var CHECK_INTERVAL_MS = 60 * 1e3;
/** Throttle activity events so we only touch the ref at most every N ms. */
var ACTIVITY_THROTTLE_MS = 30 * 1e3;
var ACTIVITY_EVENTS = [
	"mousemove",
	"mousedown",
	"keydown",
	"scroll",
	"touchstart",
	"click"
];
/**
* Client-only watcher. Mount once inside the admin layout. Signs the user
* out + redirects to /admin/login?reason=idle after IDLE_LIMIT_MS of no
* activity. Uses a ref + throttled listeners to keep overhead tiny.
*/
function IdleTimeoutWatcher() {
	const navigate = useNavigate();
	const lastActivityRef = (0, import_react.useRef)(Date.now());
	const signedOutRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let lastMark = 0;
		const markActivity = () => {
			const now = Date.now();
			if (now - lastMark < ACTIVITY_THROTTLE_MS) return;
			lastMark = now;
			lastActivityRef.current = now;
		};
		ACTIVITY_EVENTS.forEach((evt) => {
			window.addEventListener(evt, markActivity, { passive: true });
		});
		const interval = window.setInterval(async () => {
			if (signedOutRef.current) return;
			if (Date.now() - lastActivityRef.current >= IDLE_LIMIT_MS) {
				signedOutRef.current = true;
				try {
					await authClient.signOut();
				} catch {}
				navigate({
					to: "/admin/login",
					search: { reason: "idle" }
				});
			}
		}, CHECK_INTERVAL_MS);
		return () => {
			ACTIVITY_EVENTS.forEach((evt) => {
				window.removeEventListener(evt, markActivity);
			});
			window.clearInterval(interval);
		};
	}, [navigate]);
	return null;
}
function AdminLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-[var(--foam)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleTimeoutWatcher, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 overflow-auto p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleStatusBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
			})
		]
	});
}
//#endregion
export { AdminLayout as component };
