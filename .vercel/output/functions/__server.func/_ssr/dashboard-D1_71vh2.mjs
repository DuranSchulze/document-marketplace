import { t as getRequest } from "./server-BGpc65_n.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CECeFJ7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-D1_71vh2.js
var getAdminDocuments_createServerFn_handler = createServerRpc({
	id: "912a64cbbffc2a4d2eb38da171f95874f393acb6c95525913e5405925b7a2564",
	name: "getAdminDocuments",
	filename: "src/routes/_admin/admin/dashboard.tsx"
}, (opts) => getAdminDocuments.__executeServer(opts));
var getAdminDocuments = createServerFn().handler(getAdminDocuments_createServerFn_handler, async () => {
	const { requireAdmin } = await import("./admin-guard-CPh0jmm7.mjs").then((n) => n.t);
	await requireAdmin(getRequest());
	const { prisma } = await import("./db-DQLY-yIg.mjs");
	return prisma.document.findMany({ orderBy: { createdAt: "desc" } });
});
//#endregion
export { getAdminDocuments_createServerFn_handler };
