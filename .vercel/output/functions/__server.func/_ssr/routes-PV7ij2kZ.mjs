import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CECeFJ7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-PV7ij2kZ.js
var getDocuments_createServerFn_handler = createServerRpc({
	id: "89b109b4ae092eb49120e7c38025039f043a02462b83affd9d685c2cfda46dd2",
	name: "getDocuments",
	filename: "src/routes/index.tsx"
}, (opts) => getDocuments.__executeServer(opts));
var getDocuments = createServerFn().handler(getDocuments_createServerFn_handler, async () => {
	const { prisma } = await import("./db-DQLY-yIg.mjs");
	return prisma.document.findMany({
		where: { isActive: true },
		orderBy: { createdAt: "desc" }
	});
});
//#endregion
export { getDocuments_createServerFn_handler };
