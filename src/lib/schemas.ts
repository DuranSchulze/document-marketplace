import { z } from 'zod'

const DocumentFileFieldsSchema = z.object({
  driveFileId: z.string().trim().optional().default(''),
  driveFileName: z.string().trim().optional().default(''),
  driveFileUrl: z.string().trim().optional().default(''),
})

const DocumentFileUpdateFieldsSchema = z.object({
  driveFileId: z.string().trim().optional(),
  driveFileName: z.string().trim().optional(),
  driveFileUrl: z.string().trim().optional(),
})

const DocumentFileInputSchema = DocumentFileFieldsSchema.superRefine((value, ctx) => {
  if (!value.driveFileId && !value.driveFileUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['driveFileUrl'],
      message: 'Google Drive file ID or link is required',
    })
  }

  if ((value.driveFileId || value.driveFileUrl) && !value.driveFileName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['driveFileName'],
      message: 'File name is required',
    })
  }
})

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  driveFileId: z.string(),
  driveFileName: z.string(),
  driveFileUrl: z.string(),
  thumbnailUrl: z.string().optional().nullable(),
  isActive: z.boolean(),
  createdAt: z.union([z.string(), z.date()]),
})

export const OrderSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  documentTitle: z.string(),
  buyerName: z.string(),
  buyerEmail: z.string(),
  buyerPhone: z.string(),
  buyerAddress: z.string().optional().nullable(),
  amount: z.number(),
  status: z.enum(['pending', 'paid', 'failed']),
  xenditInvoiceId: z.string().optional().nullable(),
  xenditPaymentUrl: z.string().optional().nullable(),
  downloadToken: z.string().optional().nullable(),
  downloadUrl: z.string().optional().nullable(),
  createdAt: z.union([z.string(), z.date()]),
  paidAt: z.union([z.string(), z.date()]).optional().nullable(),
})

export const BuyerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

export const DocumentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  thumbnailUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  isActive: z.boolean().default(true),
}).and(DocumentFileInputSchema)

export const DocumentUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  thumbnailUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  isActive: z.boolean().optional(),
}).and(DocumentFileUpdateFieldsSchema)

export type Document = z.infer<typeof DocumentSchema>
export type Order = z.infer<typeof OrderSchema>
export type BuyerFormData = z.infer<typeof BuyerFormSchema>
export type DocumentCreateInput = z.infer<typeof DocumentCreateSchema>
export type DocumentUpdateInput = z.infer<typeof DocumentUpdateSchema>
