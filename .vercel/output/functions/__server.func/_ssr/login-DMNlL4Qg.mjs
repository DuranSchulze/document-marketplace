import { S as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as getRequest } from "./server-BGpc65_n.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CECeFJ7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DMNlL4Qg.js
var redirectIfAuthenticated_createServerFn_handler = createServerRpc({
	id: "756068f5114885a050c115559736aef13007c91cab6a583c7f7476592d5e770b",
	name: "redirectIfAuthenticated",
	filename: "src/routes/admin/login.tsx"
}, (opts) => redirectIfAuthenticated.__executeServer(opts));
var redirectIfAuthenticated = createServerFn().handler(redirectIfAuthenticated_createServerFn_handler, async () => {
	const { auth } = await import("../_libs/_.mjs").then((n) => n.n);
	const req = getRequest();
	const session = await auth.api.getSession({ headers: req.headers });
	const role = (session?.user)?.role;
	if (session && role === "admin") throw redirect({ to: "/admin/dashboard" });
	return null;
});
//#endregion
export { redirectIfAuthenticated_createServerFn_handler };
