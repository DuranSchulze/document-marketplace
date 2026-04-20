import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@posthog/react+[...].mjs";
import { d as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./_id-C1ZZ84W3.mjs";
import { t as BuyerFormSchema } from "./_ssr/schemas-CuZJJ1um.mjs";
import { t as Button } from "./_ssr/button-CN5bG2iO.mjs";
import { n as Label$1, t as Input } from "./_ssr/label-B8gd1bSk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-HPIwjiAF2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const document = Route.useLoaderData();
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		address: ""
	});
	const [fieldErrors, setFieldErrors] = (0, import_react.useState)({});
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setFieldErrors({});
		const result = BuyerFormSchema.safeParse(form);
		if (!result.success) {
			const errs = {};
			for (const issue of result.error.issues) errs[issue.path[0]] = issue.message;
			setFieldErrors(errs);
			return;
		}
		setIsSubmitting(true);
		try {
			const res = await fetch("/api/payment/create-invoice", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...result.data,
					documentId: document.id
				})
			});
			if (!res.ok) {
				setError((await res.json()).error ?? "Something went wrong. Please try again.");
				return;
			}
			const { paymentUrl } = await res.json();
			window.location.href = paymentUrl;
		} catch {
			setError("Network error. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page-wrap px-4 pb-16 pt-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/documents/$id",
					params: { id: document.id },
					className: "text-sm text-[var(--lagoon-deep)] hover:underline mb-6 inline-block",
					children: "← Back to document"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-[var(--sea-ink)] mb-8",
					children: "Complete your purchase"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "island-shell rounded-2xl p-5 lg:col-span-2 h-fit",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-3",
								children: "Order Summary"
							}),
							document.thumbnailUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: document.thumbnailUrl,
								alt: document.title,
								className: "w-full rounded-xl h-28 object-cover mb-3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-[var(--sea-ink)] text-sm mb-1",
								children: document.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[var(--sea-ink-soft)] mb-4",
								children: document.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-[rgba(23,58,64,0.1)] pt-3 flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-[var(--sea-ink-soft)]",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-[var(--sea-ink)]",
									children: ["₱", document.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "island-shell rounded-2xl p-6 lg:col-span-3 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-2",
								children: "Your Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
									htmlFor: "name",
									className: "text-sm font-medium text-[var(--sea-ink)]",
									children: "Full Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: form.name,
									onChange: (e) => setForm((f) => ({
										...f,
										name: e.target.value
									})),
									placeholder: "Juan dela Cruz",
									className: "mt-1"
								}),
								fieldErrors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-red-500 text-xs mt-1",
									children: fieldErrors.name
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
									htmlFor: "email",
									className: "text-sm font-medium text-[var(--sea-ink)]",
									children: "Email Address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									value: form.email,
									onChange: (e) => setForm((f) => ({
										...f,
										email: e.target.value
									})),
									placeholder: "juan@example.com",
									className: "mt-1"
								}),
								fieldErrors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-red-500 text-xs mt-1",
									children: fieldErrors.email
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
									htmlFor: "phone",
									className: "text-sm font-medium text-[var(--sea-ink)]",
									children: "Phone Number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									type: "tel",
									value: form.phone,
									onChange: (e) => setForm((f) => ({
										...f,
										phone: e.target.value
									})),
									placeholder: "09171234567",
									className: "mt-1"
								}),
								fieldErrors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-red-500 text-xs mt-1",
									children: fieldErrors.phone
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
									htmlFor: "address",
									className: "text-sm font-medium text-[var(--sea-ink)]",
									children: "Address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "address",
									value: form.address,
									onChange: (e) => setForm((f) => ({
										...f,
										address: e.target.value
									})),
									placeholder: "123 Main St, Quezon City",
									className: "mt-1"
								}),
								fieldErrors.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-red-500 text-xs mt-1",
									children: fieldErrors.address
								})
							] }),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: isSubmitting,
								className: "w-full rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90",
								children: isSubmitting ? "Redirecting to payment…" : `Pay ₱${document.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-center text-[var(--sea-ink-soft)]",
								children: "Secure payment powered by Xendit"
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { CheckoutPage as component };
