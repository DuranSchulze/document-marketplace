import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-emnyns9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-B2W89p1W.js
var $$splitComponentImporter = () => import("./orders-DeUDB-Rn.mjs");
var getAdminOrders = createServerFn().handler(createSsrRpc("278a9dc39dddb9e463e5ccaa2f561f671d7ee7f2a27bb10c930fe86834fc958f"));
var Route = createFileRoute("/_admin/admin/orders")({
	loader: () => getAdminOrders(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
