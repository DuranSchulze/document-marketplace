import { c as lazyRouteComponent, l as createFileRoute } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./_ssr/ssr.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-emnyns9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-D_fwrTs-.js
var $$splitComponentImporter = () => import("./_id-CAq8ctUL.mjs");
var $$splitNotFoundComponentImporter = () => import("./_id-DCbuqVg7.mjs");
var getDocument = createServerFn().handler(createSsrRpc("e6964737eacbc878ab2053145f2cbe547d409e9c801a5722516496e9faaef8aa"));
var Route = createFileRoute("/documents/$id")({
	loader: ({ params }) => getDocument({ data: params.id }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
