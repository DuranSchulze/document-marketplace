import { t as getRequest } from "./server-BGpc65_n.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CECeFJ7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-dhil-v6s.js
var getAdminOrders_createServerFn_handler = createServerRpc({
	id: "278a9dc39dddb9e463e5ccaa2f561f671d7ee7f2a27bb10c930fe86834fc958f",
	name: "getAdminOrders",
	filename: "src/routes/_admin/admin/orders.tsx"
}, (opts) => getAdminOrders.__executeServer(opts));
var getAdminOrders = createServerFn().handler(getAdminOrders_createServerFn_handler, async () => {
	const { requireAdmin } = await import("./admin-guard-CPh0jmm7.mjs").then((n) => n.t);
	await requireAdmin(getRequest());
	const { prisma } = await import("./db-DQLY-yIg.mjs");
	return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
});
//#endregion
export { getAdminOrders_createServerFn_handler };
