import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@posthog/react+[...].mjs";
import { t as authClient } from "./auth-client-C1qlzQF7.mjs";
import { f as useNavigate, p as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-CN5bG2iO.mjs";
import { n as Label$1, t as Input } from "./label-B8gd1bSk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DHarCnzG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLoginPage() {
	const navigate = useNavigate();
	const { reason } = useSearch({ from: "/admin/login" });
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const notice = reason === "idle" ? "You were signed out due to inactivity. Please sign in again." : reason === "expired" ? "Your session expired. Please sign in again." : null;
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		const { error: authError } = await authClient.signIn.email({
			email,
			password
		});
		if (authError) {
			setError(authError.message ?? "Invalid credentials");
			setIsLoading(false);
			return;
		}
		navigate({ to: "/admin/dashboard" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-[var(--foam)] px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "island-shell rounded-2xl p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "island-kicker mb-2",
						children: "Admin Portal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-[var(--sea-ink)]",
						children: "Sign In"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
							htmlFor: "email",
							className: "text-sm font-medium text-[var(--sea-ink)]",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "admin@example.com",
							required: true,
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
							htmlFor: "password",
							className: "text-sm font-medium text-[var(--sea-ink)]",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "password",
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••",
							required: true,
							className: "mt-1"
						})] }),
						notice && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900",
							children: notice
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: isLoading,
							className: "w-full rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90",
							children: isLoading ? "Signing in…" : "Sign In"
						})
					]
				})]
			})
		})
	});
}
//#endregion
export { AdminLoginPage as component };
