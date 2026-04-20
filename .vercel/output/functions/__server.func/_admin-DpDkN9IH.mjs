import { S as redirect } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as getRequest } from "./_ssr/server-BGpc65_n.mjs";
import { r as createServerFn } from "./_ssr/ssr.mjs";
import { t as createServerRpc } from "./_ssr/createServerRpc-CECeFJ7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin-DpDkN9IH.js
var checkAdminSession_createServerFn_handler = createServerRpc({
	id: "0a0f3826c77bea78fac5482c4ce30daa518af8025800efa6c731568c9817f261",
	name: "checkAdminSession",
	filename: "src/routes/_admin.tsx"
}, (opts) => checkAdminSession.__executeServer(opts));
var checkAdminSession = createServerFn().handler(checkAdminSession_createServerFn_handler, async () => {
	const { auth } = await import("./_libs/_.mjs").then((n) => n.n);
	const req = getRequest();
	const session = await auth.api.getSession({ headers: req.headers });
	const role = (session?.user)?.role;
	if (!session || role !== "admin") throw redirect({ to: "/admin/login" });
	return null;
});
//#endregion
export { checkAdminSession_createServerFn_handler };
