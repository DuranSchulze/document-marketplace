import { c as lazyRouteComponent, l as createFileRoute } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./_ssr/ssr.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-emnyns9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-C1ZZ84W3.js
var $$splitComponentImporter = () => import("./_id-HPIwjiAF2.mjs");
var getDocument = createServerFn().handler(createSsrRpc("01f7ef4449bd28eba5d521339302f1ce76f109e3d13d8360c8495215ee1d5ef2"));
var Route = createFileRoute("/checkout/$id")({
	loader: ({ params }) => getDocument({ data: params.id }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
