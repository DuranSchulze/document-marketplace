import { S as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as auth, t as __exportAll } from "./auth-Dz_UM7w5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-guard-CPh0jmm7.js
var admin_guard_exports = /* @__PURE__ */ __exportAll({
	requireAdmin: () => requireAdmin,
	requireAdminApi: () => requireAdminApi
});
/**
* For route loaders/server functions — throws a redirect to /admin/login
* when the caller is not an authenticated admin.
*/
async function requireAdmin(request) {
	const session = await auth.api.getSession({ headers: request.headers });
	const role = (session?.user)?.role;
	if (!session || role !== "admin") throw redirect({ to: "/admin/login" });
	return session;
}
/**
* For API handlers — returns a 401 JSON Response when the caller is not
* an authenticated admin, or `null` when access is granted.
*
* Usage:
*   const unauthorized = await requireAdminApi(request)
*   if (unauthorized) return unauthorized
*/
async function requireAdminApi(request) {
	const session = await auth.api.getSession({ headers: request.headers });
	const role = (session?.user)?.role;
	if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
	if (role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
	return null;
}
//#endregion
export { requireAdminApi as n, admin_guard_exports as t };
