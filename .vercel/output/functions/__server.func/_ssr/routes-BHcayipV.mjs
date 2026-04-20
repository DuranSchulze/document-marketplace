import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-emnyns9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BHcayipV.js
var $$splitComponentImporter = () => import("./routes-BYGouzqa.mjs");
var getDocuments = createServerFn().handler(createSsrRpc("89b109b4ae092eb49120e7c38025039f043a02462b83affd9d685c2cfda46dd2"));
var Route = createFileRoute("/")({
	loader: () => getDocuments(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
