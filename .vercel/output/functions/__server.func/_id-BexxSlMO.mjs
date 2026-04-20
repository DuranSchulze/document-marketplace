import { T as notFound } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./_ssr/ssr.mjs";
import { t as createServerRpc } from "./_ssr/createServerRpc-CECeFJ7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BexxSlMO.js
var getDocument_createServerFn_handler = createServerRpc({
	id: "e6964737eacbc878ab2053145f2cbe547d409e9c801a5722516496e9faaef8aa",
	name: "getDocument",
	filename: "src/routes/documents/$id.tsx"
}, (opts) => getDocument.__executeServer(opts));
var getDocument = createServerFn().handler(getDocument_createServerFn_handler, async ({ data }) => {
	const { prisma } = await import("./_ssr/db-DQLY-yIg.mjs");
	const document = await prisma.document.findUnique({ where: { id: data } });
	if (!document || !document.isActive) throw notFound();
	return document;
});
//#endregion
export { getDocument_createServerFn_handler };
