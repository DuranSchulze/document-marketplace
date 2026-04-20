import { f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./edit-CvHMnuD7.mjs";
import { t as DocumentForm } from "./DocumentForm-Y-p_MiZ9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-D3BMVkJU.js
var import_jsx_runtime = require_jsx_runtime();
function EditDocumentPage() {
	const document = Route.useLoaderData();
	const { id } = Route.useParams();
	const navigate = useNavigate();
	async function handleSubmit(data) {
		if (!(await fetch(`/api/admin/documents/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		})).ok) throw new Error("Failed to update document");
		navigate({ to: "/admin/dashboard" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "island-kicker mb-1",
			children: "Admin"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold text-[var(--sea-ink)]",
			children: "Edit Document"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentForm, {
			defaultValues: {
				title: document.title,
				description: document.description,
				price: document.price,
				category: document.category,
				driveFileId: document.driveFileId,
				driveFileName: document.driveFileName,
				driveFileUrl: document.driveFileUrl,
				thumbnailUrl: document.thumbnailUrl ?? "",
				isActive: document.isActive
			},
			onSubmit: handleSubmit,
			submitLabel: "Save Changes"
		})
	})] });
}
//#endregion
export { EditDocumentPage as component };
