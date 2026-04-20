import { T as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CECeFJ7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-CEJVMSjH.js
var getDocument_createServerFn_handler = createServerRpc({
	id: "b449ba72fa033df9f2e5736c157390be7efca428e78bb8808fb1d92c1cc60757",
	name: "getDocument",
	filename: "src/routes/_admin/admin/documents/$id/edit.tsx"
}, (opts) => getDocument.__executeServer(opts));
var getDocument = createServerFn().handler(getDocument_createServerFn_handler, async ({ data }) => {
	const { prisma } = await import("./db-DQLY-yIg.mjs");
	const document = await prisma.document.findUnique({ where: { id: data } });
	if (!document) throw notFound();
	return document;
});
//#endregion
export { getDocument_createServerFn_handler };
