import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-emnyns9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-CvHMnuD7.js
var $$splitComponentImporter = () => import("./edit-D3BMVkJU.mjs");
var getDocument = createServerFn().handler(createSsrRpc("b449ba72fa033df9f2e5736c157390be7efca428e78bb8808fb1d92c1cc60757"));
var Route = createFileRoute("/_admin/admin/documents/$id/edit")({
	loader: ({ params }) => getDocument({ data: params.id }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
