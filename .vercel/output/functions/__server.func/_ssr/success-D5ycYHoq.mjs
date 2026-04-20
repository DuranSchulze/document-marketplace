import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/success-D5ycYHoq.js
var $$splitComponentImporter = () => import("./success-Chf3hZeu.mjs");
var Route = createFileRoute("/payment/success")({
	validateSearch: object({ orderId: string().optional() }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
