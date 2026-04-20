import { A as date, E as _enum, F as object, M as literal, P as number, R as string, k as boolean, z as union } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemas-CuZJJ1um.js
object({
	id: string(),
	title: string(),
	description: string(),
	price: number(),
	category: string(),
	driveFileId: string(),
	driveFileName: string(),
	driveFileUrl: string(),
	thumbnailUrl: string().optional().nullable(),
	isActive: boolean(),
	createdAt: union([string(), date()])
});
object({
	id: string(),
	documentId: string(),
	documentTitle: string(),
	buyerName: string(),
	buyerEmail: string(),
	buyerPhone: string(),
	buyerAddress: string().optional().nullable(),
	amount: number(),
	status: _enum([
		"pending",
		"paid",
		"failed"
	]),
	xenditInvoiceId: string().optional().nullable(),
	xenditPaymentUrl: string().optional().nullable(),
	downloadToken: string().optional().nullable(),
	downloadUrl: string().optional().nullable(),
	createdAt: union([string(), date()]),
	paidAt: union([string(), date()]).optional().nullable()
});
var BuyerFormSchema = object({
	name: string().min(2, "Name must be at least 2 characters"),
	email: string().email("Invalid email address"),
	phone: string().min(7, "Phone number must be at least 7 digits"),
	address: string().min(5, "Address must be at least 5 characters")
});
var DocumentCreateSchema = object({
	title: string().min(1, "Title is required"),
	description: string().min(1, "Description is required"),
	price: number().min(0, "Price must be positive"),
	category: string().min(1, "Category is required"),
	driveFileId: string().min(1, "File is required"),
	driveFileName: string().min(1, "File name is required"),
	driveFileUrl: string().url("Must be a valid URL"),
	thumbnailUrl: string().url("Must be a valid URL").or(literal("")).optional(),
	isActive: boolean().default(true)
});
var DocumentUpdateSchema = DocumentCreateSchema.partial();
//#endregion
export { DocumentCreateSchema as n, DocumentUpdateSchema as r, BuyerFormSchema as t };
