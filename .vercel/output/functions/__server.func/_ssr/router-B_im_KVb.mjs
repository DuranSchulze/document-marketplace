import { o as __toESM } from "../_runtime.mjs";
import { R as string } from "../_libs/@better-auth/core+[...].mjs";
import { n as va, r as require_react, t as PostHogProvider } from "../_libs/@posthog/react+[...].mjs";
import { S as redirect, c as lazyRouteComponent, d as Link, i as useRouterState, l as createFileRoute, n as Scripts, o as createRouter, r as HeadContent, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as prisma } from "./db-DSYlLhCl.mjs";
import { n as number } from "../_libs/zod.mjs";
import { n as auth } from "./auth-Dz_UM7w5.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-emnyns9I.mjs";
import { t as Route$18 } from "../_id-D_fwrTs-.mjs";
import { t as Route$19 } from "../_id-C1ZZ84W3.mjs";
import { n as DocumentCreateSchema, r as DocumentUpdateSchema, t as BuyerFormSchema } from "./schemas-CuZJJ1um.mjs";
import { n as requireAdminApi } from "./admin-guard-CPh0jmm7.mjs";
import { t as Route$20 } from "./dashboard-8sz9bPEd.mjs";
import { t as Route$21 } from "./edit-CvHMnuD7.mjs";
import { t as Route$22 } from "./failed-CXCYPUNK.mjs";
import { t as Route$23 } from "./orders-B2W89p1W.mjs";
import { t as Route$24 } from "./routes-BHcayipV.mjs";
import { t as Route$25 } from "./success-D5ycYHoq.mjs";
import { t as require_jsonwebtoken } from "../_libs/jsonwebtoken+[...].mjs";
import { t as createEnv } from "../_libs/t3-oss__env-core.mjs";
import { t as require_src } from "../_libs/googleapis+[...].mjs";
import { t as require_nodemailer } from "../_libs/nodemailer.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as setupRouterSsrQueryIntegration } from "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import { Readable } from "node:stream";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B_im_KVb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jsonwebtoken = /* @__PURE__ */ __toESM(require_jsonwebtoken());
var import_src = require_src();
var import_nodemailer = /* @__PURE__ */ __toESM(require_nodemailer());
function Footer() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-[var(--sea-ink)]",
						children: "DocMarket"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xs text-xs leading-relaxed",
						children: "Your trusted source for professional, ready-to-use documents. Purchase and download instantly after payment."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-col gap-2 text-sm sm:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "transition hover:text-[var(--sea-ink)] no-underline",
							children: "Home"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://www.filepino.com/privacy-policy/",
							className: "transition hover:text-[var(--sea-ink)] no-underline",
							target: "_blank",
							rel: "noopener noreferrer",
							children: "Privacy Policy and Terms & Conditions"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-8 border-t border-[var(--line)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 text-center text-xs sm:flex-row sm:justify-between sm:text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "m-0",
						children: [
							"© ",
							year,
							" DocMarket. All rights reserved."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "m-0 flex items-center gap-1.5",
						children: [
							"Powered by",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://xendit.co",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "font-medium text-[var(--sea-ink)] transition hover:text-[var(--lagoon-deep)] no-underline",
								children: "Xendit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "&" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://filepino.com",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "font-medium text-[var(--sea-ink)] transition hover:text-[var(--lagoon-deep)] no-underline",
								children: "FilePino"
							})
						]
					})]
				})
			]
		})
	});
}
function getInitialMode() {
	if (typeof window === "undefined") return "auto";
	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto") return stored;
	return "auto";
}
function applyThemeMode(mode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? prefersDark ? "dark" : "light" : mode;
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);
	if (mode === "auto") document.documentElement.removeAttribute("data-theme");
	else document.documentElement.setAttribute("data-theme", mode);
	document.documentElement.style.colorScheme = resolved;
}
function ThemeToggle() {
	const [mode, setMode] = (0, import_react.useState)("auto");
	(0, import_react.useEffect)(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);
	(0, import_react.useEffect)(() => {
		if (mode !== "auto") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");
		media.addEventListener("change", onChange);
		return () => {
			media.removeEventListener("change", onChange);
		};
	}, [mode]);
	function toggleMode() {
		const nextMode = mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
		setMode(nextMode);
		applyThemeMode(nextMode);
		window.localStorage.setItem("theme", nextMode);
	}
	const label = mode === "auto" ? "Theme mode: auto (system). Click to switch to light mode." : `Theme mode: ${mode}. Click to switch mode.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: toggleMode,
		"aria-label": label,
		title: label,
		className: "rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5",
		children: mode === "auto" ? "Auto" : mode === "dark" ? "Dark" : "Light"
	});
}
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "m-0 flex-shrink-0 text-base font-semibold tracking-tight",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" }), "DocMarket"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "nav-link",
						activeProps: { className: "nav-link is-active" },
						children: "Browse"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-1.5 sm:gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/login",
						className: "rounded-xl px-3 py-1.5 text-sm font-medium text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]",
						children: "Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})]
				})
			]
		})
	});
}
if (typeof window !== "undefined" && "phc_xxx") va.init("phc_xxx", {
	api_host: "https://us.i.posthog.com",
	person_profiles: "identified_only",
	capture_pageview: false,
	defaults: "2025-11-30"
});
function PostHogProvider$1({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostHogProvider, {
		client: va,
		children
	});
}
var styles_default = "/assets/styles-9T8qGxJC.css";
var THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "DocMarket — Document Marketplace" }
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootDocument
});
function Devtools() {
	const [node, setNode] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {}, []);
	return node;
}
function RootDocument({ children }) {
	const { location } = useRouterState();
	const isAdminRoute = location.pathname.startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_INIT_SCRIPT } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PostHogProvider$1, { children: [
				!isAdminRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
				children,
				!isAdminRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Devtools, {})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
var $$splitComponentImporter$5 = () => import("./terms-CO8NVj9l.mjs");
var Route$16 = createFileRoute("/terms")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./privacy-DIt0EfX5.mjs");
var Route$15 = createFileRoute("/privacy")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_admin-CDJ9IcY6.mjs");
var checkAdminSession = createServerFn().handler(createSsrRpc("0a0f3826c77bea78fac5482c4ce30daa518af8025800efa6c731568c9817f261"));
var Route$14 = createFileRoute("/_admin")({
	beforeLoad: () => checkAdminSession(),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin-DIx23Zde.mjs");
var Route$13 = createFileRoute("/admin/")({
	beforeLoad: () => {
		throw redirect({ to: "/admin/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./login-DHarCnzG.mjs");
var redirectIfAuthenticated = createServerFn().handler(createSsrRpc("756068f5114885a050c115559736aef13007c91cab6a583c7f7476592d5e770b"));
var Route$12 = createFileRoute("/admin/login")({
	validateSearch: (search) => ({ reason: search.reason === "idle" || search.reason === "expired" ? search.reason : void 0 }),
	beforeLoad: () => redirectIfAuthenticated(),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var env = createEnv({
	server: {
		SERVER_URL: string().url().optional(),
		DATABASE_URL: string().min(1).optional(),
		BETTER_AUTH_SECRET: string().min(1).optional(),
		BETTER_AUTH_URL: string().url().optional(),
		XENDIT_SECRET_KEY: string().min(1).optional(),
		XENDIT_WEBHOOK_TOKEN: string().min(1).optional(),
		GOOGLE_DRIVE_ROOT_FOLDER_ID: string().min(1).optional(),
		GOOGLE_SHEETS_ID: string().min(1).optional(),
		GOOGLE_SERVICE_ACCOUNT_EMAIL: string().email().optional(),
		GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string().min(1).optional(),
		DOWNLOAD_TOKEN_SECRET: string().min(32).optional(),
		SMTP_HOST: string().optional(),
		SMTP_PORT: number().optional(),
		SMTP_USER: string().optional(),
		SMTP_PASS: string().optional(),
		SMTP_FROM: string().optional(),
		ADMIN_EMAIL: string().email().optional(),
		ADMIN_PASSWORD: string().optional()
	},
	clientPrefix: "VITE_",
	client: { VITE_APP_TITLE: string().min(1).optional() },
	runtimeEnv: {
		...typeof process !== "undefined" ? process.env : {},
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_POSTHOG_KEY": "phc_xxx"
	},
	emptyStringAsUndefined: true
});
function generateDownloadToken(payload) {
	return import_jsonwebtoken.default.sign(payload, env.DOWNLOAD_TOKEN_SECRET ?? "fallback-secret-change-me", {
		expiresIn: "72h",
		issuer: "document-marketplace"
	});
}
function verifyDownloadToken(token) {
	return import_jsonwebtoken.default.verify(token, env.DOWNLOAD_TOKEN_SECRET ?? "fallback-secret-change-me", { issuer: "document-marketplace" });
}
var XENDIT_BASE = "https://api.xendit.co";
function xenditFetch(path, init = {}) {
	const token = Buffer.from(`${env.XENDIT_SECRET_KEY ?? ""}:`).toString("base64");
	return fetch(`${XENDIT_BASE}${path}`, {
		...init,
		headers: {
			Authorization: `Basic ${token}`,
			"Content-Type": "application/json",
			...init.headers
		}
	});
}
async function createXenditInvoice(params) {
	const res = await xenditFetch("/v2/invoices", {
		method: "POST",
		body: JSON.stringify({
			external_id: params.externalId,
			amount: params.amount,
			payer_email: params.payerEmail,
			description: params.description,
			success_redirect_url: params.successRedirectUrl,
			failure_redirect_url: params.failureRedirectUrl,
			currency: "PHP"
		})
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Xendit error ${res.status}: ${text}`);
	}
	return res.json();
}
function verifyXenditWebhookToken(token) {
	return !!env.XENDIT_WEBHOOK_TOKEN && token === env.XENDIT_WEBHOOK_TOKEN;
}
function getSheetsClient() {
	const privateKey = (env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
	const auth = new import_src.google.auth.GoogleAuth({
		credentials: {
			client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: privateKey
		},
		scopes: ["https://www.googleapis.com/auth/spreadsheets"]
	});
	return import_src.google.sheets({
		version: "v4",
		auth
	});
}
function isSheetsConfigured() {
	return !!(env.GOOGLE_SHEETS_ID && env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
}
async function checkSheetsConnection() {
	if (!isSheetsConfigured()) return {
		ok: false,
		error: "Missing env vars (GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)"
	};
	try {
		return {
			ok: true,
			title: (await getSheetsClient().spreadsheets.get({
				spreadsheetId: env.GOOGLE_SHEETS_ID,
				fields: "properties.title"
			})).data.properties?.title ?? void 0
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Unknown Sheets error"
		};
	}
}
async function testSheetsWrite() {
	if (!isSheetsConfigured()) return {
		ok: false,
		error: "Sheets not configured"
	};
	try {
		const sheets = getSheetsClient();
		const cell = "Customers!Z1";
		const value = `health-check ${(/* @__PURE__ */ new Date()).toISOString()}`;
		await sheets.spreadsheets.values.update({
			spreadsheetId: env.GOOGLE_SHEETS_ID,
			range: cell,
			valueInputOption: "RAW",
			requestBody: { values: [[value]] }
		});
		return {
			ok: true,
			cell,
			value
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Unknown Sheets write error"
		};
	}
}
async function appendCustomerRecord(record) {
	if (!isSheetsConfigured()) return;
	try {
		const sheets = getSheetsClient();
		const row = [
			record.orderId,
			record.documentTitle,
			record.buyerName,
			record.buyerEmail,
			record.buyerPhone,
			record.buyerAddress,
			String(record.amount),
			record.purchasedAt
		];
		await sheets.spreadsheets.values.append({
			spreadsheetId: env.GOOGLE_SHEETS_ID,
			range: "Customers!A:H",
			valueInputOption: "RAW",
			requestBody: { values: [row] }
		});
	} catch (err) {
		console.error("Google Sheets error (appendCustomerRecord):", err);
	}
}
function getTransporter() {
	if (!env.SMTP_HOST) return null;
	return import_nodemailer.default.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT ?? 587,
		secure: (env.SMTP_PORT ?? 587) === 465,
		auth: env.SMTP_USER ? {
			user: env.SMTP_USER,
			pass: env.SMTP_PASS
		} : void 0
	});
}
async function sendDownloadEmail(opts) {
	const transporter = getTransporter();
	if (!transporter) {
		console.warn("SMTP not configured — skipping email delivery");
		return;
	}
	await transporter.sendMail({
		from: env.SMTP_FROM ?? "noreply@example.com",
		to: opts.to,
		subject: `Your purchase: ${opts.documentTitle}`,
		html: `
      <h2>Thank you for your purchase, ${opts.name}!</h2>
      <p>Your document <strong>${opts.documentTitle}</strong> is ready to download.</p>
      <p>
        <a href="${opts.downloadUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
          Download Now
        </a>
      </p>
      <p style="color:#6b7280;font-size:14px">This link expires in 72 hours.</p>
    `
	});
}
var Route$11 = createFileRoute("/api/payment/webhook")({ server: { handlers: { POST: async ({ request }) => {
	if (!verifyXenditWebhookToken(request.headers.get("x-callback-token") ?? "")) return new Response("Unauthorized", { status: 401 });
	let payload;
	try {
		payload = await request.json();
	} catch {
		return new Response("Invalid JSON", { status: 400 });
	}
	const { status, id: xenditInvoiceId } = payload;
	if (status === "PAID") {
		const order = await prisma.order.findFirst({
			where: { xenditInvoiceId },
			include: { document: true }
		});
		if (!order) return new Response("Order not found", { status: 404 });
		if (order.status === "paid") return new Response("OK", { status: 200 });
		const driveFileUrl = order.document.driveFileUrl;
		const baseUrl = env.SERVER_URL ?? new URL(request.url).origin;
		const token = generateDownloadToken({
			orderId: order.id,
			documentId: order.documentId,
			driveFileUrl,
			buyerEmail: order.buyerEmail
		});
		const downloadUrl = `${baseUrl}/api/download/${token}`;
		const paidAt = /* @__PURE__ */ new Date();
		await prisma.order.update({
			where: { id: order.id },
			data: {
				status: "paid",
				downloadToken: token,
				downloadUrl,
				paidAt
			}
		});
		await appendCustomerRecord({
			orderId: order.id,
			documentTitle: order.documentTitle,
			buyerName: order.buyerName,
			buyerEmail: order.buyerEmail,
			buyerPhone: order.buyerPhone,
			buyerAddress: order.buyerAddress ?? "",
			amount: order.amount,
			purchasedAt: paidAt.toISOString()
		});
		await sendDownloadEmail({
			to: order.buyerEmail,
			name: order.buyerName,
			documentTitle: order.documentTitle,
			downloadUrl
		});
	} else if (status === "EXPIRED" || status === "FAILED") await prisma.order.updateMany({
		where: { xenditInvoiceId },
		data: { status: "failed" }
	});
	return new Response("OK", { status: 200 });
} } } });
var BodySchema = BuyerFormSchema.extend({ documentId: string().min(1) });
var Route$10 = createFileRoute("/api/payment/create-invoice")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = BodySchema.parse(await request.json());
	} catch {
		return Response.json({ error: "Invalid request body" }, { status: 400 });
	}
	const document = await prisma.document.findUnique({ where: { id: body.documentId } });
	if (!document || !document.isActive) return Response.json({ error: "Document not found" }, { status: 404 });
	const orderId = crypto.randomUUID();
	const baseUrl = env.SERVER_URL ?? new URL(request.url).origin;
	const invoice = await createXenditInvoice({
		externalId: orderId,
		amount: document.price,
		payerEmail: body.email,
		description: `Purchase: ${document.title}`,
		successRedirectUrl: `${baseUrl}/payment/success?orderId=${orderId}`,
		failureRedirectUrl: `${baseUrl}/payment/failed?orderId=${orderId}&documentId=${document.id}`
	});
	await prisma.order.create({ data: {
		id: orderId,
		documentId: document.id,
		documentTitle: document.title,
		buyerName: body.name,
		buyerEmail: body.email,
		buyerPhone: body.phone,
		buyerAddress: body.address,
		amount: document.price,
		status: "pending",
		xenditInvoiceId: invoice.id,
		xenditPaymentUrl: invoice.invoice_url
	} });
	return Response.json({ paymentUrl: invoice.invoice_url });
} } } });
var Route$9 = createFileRoute("/api/orders/$id")({ server: { handlers: { GET: async ({ params }) => {
	const order = await prisma.order.findUnique({ where: { id: params.id } });
	if (!order) return Response.json({ error: "Not found" }, { status: 404 });
	return Response.json({
		id: order.id,
		status: order.status,
		downloadUrl: order.status === "paid" ? order.downloadUrl : null,
		documentTitle: order.documentTitle
	});
} } } });
var Route$8 = createFileRoute("/api/download/$token")({ server: { handlers: { GET: async ({ params }) => {
	try {
		const payload = verifyDownloadToken(params.token);
		return Response.redirect(payload.driveFileUrl, 302);
	} catch {
		return new Response("Invalid or expired download link", { status: 410 });
	}
} } } });
var Route$7 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
function getDriveClient() {
	const privateKey = (env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
	const auth = new import_src.google.auth.GoogleAuth({
		credentials: {
			client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: privateKey
		},
		scopes: ["https://www.googleapis.com/auth/drive"]
	});
	return import_src.google.drive({
		version: "v3",
		auth
	});
}
function isDriveConfigured() {
	return !!(env.GOOGLE_DRIVE_ROOT_FOLDER_ID && env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
}
async function checkDriveConnection() {
	if (!isDriveConfigured()) return {
		ok: false,
		error: "Missing env vars (GOOGLE_DRIVE_ROOT_FOLDER_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)"
	};
	try {
		return {
			ok: true,
			folderName: (await getDriveClient().files.get({
				fileId: env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
				fields: "id, name, mimeType",
				supportsAllDrives: true
			})).data.name ?? void 0
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Unknown Drive error"
		};
	}
}
function getDriveDirectUrl(fileId) {
	return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
async function getOrCreateCategoryFolder(categoryName) {
	const drive = getDriveClient();
	const rootFolderId = env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
	const existing = (await drive.files.list({
		q: `name='${categoryName}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
		fields: "files(id, name)",
		spaces: "drive"
	})).data.files?.[0];
	if (existing?.id) return existing.id;
	return (await drive.files.create({
		requestBody: {
			name: categoryName,
			mimeType: "application/vnd.google-apps.folder",
			parents: [rootFolderId]
		},
		fields: "id"
	})).data.id;
}
async function uploadFileToDrive(fileBuffer, fileName, mimeType, category) {
	const drive = getDriveClient();
	const folderId = await getOrCreateCategoryFolder(category);
	const uploaded = await drive.files.create({
		requestBody: {
			name: fileName,
			parents: [folderId]
		},
		media: {
			mimeType,
			body: Readable.from(fileBuffer)
		},
		fields: "id, name"
	});
	const fileId = uploaded.data.id;
	await drive.permissions.create({
		fileId,
		requestBody: {
			role: "reader",
			type: "anyone"
		}
	});
	return {
		fileId,
		fileName: uploaded.data.name ?? fileName,
		directUrl: getDriveDirectUrl(fileId)
	};
}
var Route$6 = createFileRoute("/api/admin/upload")({ server: { handlers: { POST: async ({ request }) => {
	const unauthorized = await requireAdminApi(request);
	if (unauthorized) return unauthorized;
	if (!isDriveConfigured()) return Response.json({ error: "Google Drive is not configured" }, { status: 503 });
	let formData;
	try {
		formData = await request.formData();
	} catch {
		return Response.json({ error: "Invalid form data" }, { status: 400 });
	}
	const file = formData.get("file");
	const category = formData.get("category");
	if (!(file instanceof File)) return Response.json({ error: "No file provided" }, { status: 400 });
	if (typeof category !== "string" || !category.trim()) return Response.json({ error: "Category is required" }, { status: 400 });
	const result = await uploadFileToDrive(Buffer.from(await file.arrayBuffer()), file.name, file.type, category.trim());
	return Response.json({
		driveFileId: result.fileId,
		driveFileName: result.fileName,
		driveFileUrl: result.directUrl
	});
} } } });
var Route$5 = createFileRoute("/api/admin/sheets-test-write")({ server: { handlers: { POST: async ({ request }) => {
	const unauthorized = await requireAdminApi(request);
	if (unauthorized) return unauthorized;
	const result = await testSheetsWrite();
	return Response.json(result, {
		status: result.ok ? 200 : 500,
		headers: { "Cache-Control": "no-store" }
	});
} } } });
var Route$4 = createFileRoute("/api/admin/google-status")({ server: { handlers: { GET: async ({ request }) => {
	const unauthorized = await requireAdminApi(request);
	if (unauthorized) return unauthorized;
	const [drive, sheets] = await Promise.all([checkDriveConnection(), checkSheetsConnection()]);
	return Response.json({
		drive,
		sheets,
		checkedAt: (/* @__PURE__ */ new Date()).toISOString()
	}, { headers: { "Cache-Control": "no-store" } });
} } } });
var Route$3 = createFileRoute("/api/admin/orders/")({ server: { handlers: { GET: async ({ request }) => {
	const unauthorized = await requireAdminApi(request);
	if (unauthorized) return unauthorized;
	const orders = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		include: { document: { select: {
			title: true,
			category: true
		} } }
	});
	return Response.json(orders);
} } } });
var Route$2 = createFileRoute("/api/admin/documents/")({ server: { handlers: {
	GET: async ({ request }) => {
		const unauthorized = await requireAdminApi(request);
		if (unauthorized) return unauthorized;
		const docs = await prisma.document.findMany({ orderBy: { createdAt: "desc" } });
		return Response.json(docs);
	},
	POST: async ({ request }) => {
		const unauthorized = await requireAdminApi(request);
		if (unauthorized) return unauthorized;
		let body;
		try {
			body = DocumentCreateSchema.parse(await request.json());
		} catch {
			return Response.json({ error: "Invalid body" }, { status: 400 });
		}
		const doc = await prisma.document.create({ data: body });
		return Response.json(doc, { status: 201 });
	}
} } });
var Route$1 = createFileRoute("/api/admin/documents/$id")({ server: { handlers: {
	PATCH: async ({ request, params }) => {
		const unauthorized = await requireAdminApi(request);
		if (unauthorized) return unauthorized;
		let body;
		try {
			body = DocumentUpdateSchema.parse(await request.json());
		} catch {
			return Response.json({ error: "Invalid body" }, { status: 400 });
		}
		const doc = await prisma.document.update({
			where: { id: params.id },
			data: body
		});
		return Response.json(doc);
	},
	DELETE: async ({ request, params }) => {
		const unauthorized = await requireAdminApi(request);
		if (unauthorized) return unauthorized;
		await prisma.document.update({
			where: { id: params.id },
			data: { isActive: false }
		});
		return Response.json({ ok: true });
	}
} } });
var $$splitComponentImporter = () => import("./new-rr87asCa.mjs");
var Route = createFileRoute("/_admin/admin/documents/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TermsRoute = Route$16.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$17
});
var PrivacyRoute = Route$15.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$17
});
var AdminRoute = Route$14.update({
	id: "/_admin",
	getParentRoute: () => Route$17
});
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var AdminIndexRoute = Route$13.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$17
});
var PaymentSuccessRoute = Route$25.update({
	id: "/payment/success",
	path: "/payment/success",
	getParentRoute: () => Route$17
});
var PaymentFailedRoute = Route$22.update({
	id: "/payment/failed",
	path: "/payment/failed",
	getParentRoute: () => Route$17
});
var DocumentsIdRoute = Route$18.update({
	id: "/documents/$id",
	path: "/documents/$id",
	getParentRoute: () => Route$17
});
var CheckoutIdRoute = Route$19.update({
	id: "/checkout/$id",
	path: "/checkout/$id",
	getParentRoute: () => Route$17
});
var AdminLoginRoute = Route$12.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$17
});
var ApiPaymentWebhookRoute = Route$11.update({
	id: "/api/payment/webhook",
	path: "/api/payment/webhook",
	getParentRoute: () => Route$17
});
var ApiPaymentCreateInvoiceRoute = Route$10.update({
	id: "/api/payment/create-invoice",
	path: "/api/payment/create-invoice",
	getParentRoute: () => Route$17
});
var ApiOrdersIdRoute = Route$9.update({
	id: "/api/orders/$id",
	path: "/api/orders/$id",
	getParentRoute: () => Route$17
});
var ApiDownloadTokenRoute = Route$8.update({
	id: "/api/download/$token",
	path: "/api/download/$token",
	getParentRoute: () => Route$17
});
var ApiAuthSplatRoute = Route$7.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$17
});
var ApiAdminUploadRoute = Route$6.update({
	id: "/api/admin/upload",
	path: "/api/admin/upload",
	getParentRoute: () => Route$17
});
var ApiAdminSheetsTestWriteRoute = Route$5.update({
	id: "/api/admin/sheets-test-write",
	path: "/api/admin/sheets-test-write",
	getParentRoute: () => Route$17
});
var ApiAdminGoogleStatusRoute = Route$4.update({
	id: "/api/admin/google-status",
	path: "/api/admin/google-status",
	getParentRoute: () => Route$17
});
var AdminAdminOrdersRoute = Route$23.update({
	id: "/admin/orders",
	path: "/admin/orders",
	getParentRoute: () => AdminRoute
});
var AdminAdminDashboardRoute = Route$20.update({
	id: "/admin/dashboard",
	path: "/admin/dashboard",
	getParentRoute: () => AdminRoute
});
var ApiAdminOrdersIndexRoute = Route$3.update({
	id: "/api/admin/orders/",
	path: "/api/admin/orders/",
	getParentRoute: () => Route$17
});
var ApiAdminDocumentsIndexRoute = Route$2.update({
	id: "/api/admin/documents/",
	path: "/api/admin/documents/",
	getParentRoute: () => Route$17
});
var ApiAdminDocumentsIdRoute = Route$1.update({
	id: "/api/admin/documents/$id",
	path: "/api/admin/documents/$id",
	getParentRoute: () => Route$17
});
var AdminRouteChildren = {
	AdminAdminDashboardRoute,
	AdminAdminOrdersRoute,
	AdminAdminDocumentsNewRoute: Route.update({
		id: "/admin/documents/new",
		path: "/admin/documents/new",
		getParentRoute: () => AdminRoute
	}),
	AdminAdminDocumentsIdEditRoute: Route$21.update({
		id: "/admin/documents/$id/edit",
		path: "/admin/documents/$id/edit",
		getParentRoute: () => AdminRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	PrivacyRoute,
	TermsRoute,
	AdminLoginRoute,
	CheckoutIdRoute,
	DocumentsIdRoute,
	PaymentFailedRoute,
	PaymentSuccessRoute,
	AdminIndexRoute,
	ApiAdminGoogleStatusRoute,
	ApiAdminSheetsTestWriteRoute,
	ApiAdminUploadRoute,
	ApiAuthSplatRoute,
	ApiDownloadTokenRoute,
	ApiOrdersIdRoute,
	ApiPaymentCreateInvoiceRoute,
	ApiPaymentWebhookRoute,
	ApiAdminDocumentsIdRoute,
	ApiAdminDocumentsIndexRoute,
	ApiAdminOrdersIndexRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
function getContext() {
	return { queryClient: new QueryClient() };
}
function getRouter() {
	const context = getContext();
	const router = createRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0
	});
	setupRouterSsrQueryIntegration({
		router,
		queryClient: context.queryClient
	});
	return router;
}
//#endregion
export { getRouter };
