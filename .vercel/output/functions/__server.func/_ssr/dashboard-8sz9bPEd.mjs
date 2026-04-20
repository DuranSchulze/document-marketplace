import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-emnyns9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-8sz9bPEd.js
var $$splitComponentImporter = () => import("./dashboard-B05wUmyO.mjs");
var getAdminDocuments = createServerFn().handler(createSsrRpc("912a64cbbffc2a4d2eb38da171f95874f393acb6c95525913e5405925b7a2564"));
var Route = createFileRoute("/_admin/admin/dashboard")({
	loader: () => getAdminDocuments(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
