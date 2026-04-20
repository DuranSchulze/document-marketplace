import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/failed-CXCYPUNK.js
var $$splitComponentImporter = () => import("./failed-BbNILRX5.mjs");
var Route = createFileRoute("/payment/failed")({
	validateSearch: object({
		orderId: string().optional(),
		documentId: string().optional()
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
