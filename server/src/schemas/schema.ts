import { z } from "zod";

// Enums alineados con Prisma
export const TaskStatus = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);
export const Priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const SharePermission = z.enum(["VIEW", "EDIT", "ADMIN"]);

// Helpers
const uuidString = z.uuid();

// Users
export const createUserSchema = z.object({
	name: z.string().min(1, "El nombre es obligatorio"),
	email: z.email({ message: "Email inválido" }),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const userResponseSchema = z.object({
	id: uuidString,
	email: z.email(),
	name: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

// Tasks
const dueDatePreprocess = z.preprocess((arg) => {
	if (!arg) return undefined;
	// aceptar string o Date
	if (typeof arg === "string" || arg instanceof String) {
		const d = new Date(String(arg));
		return isNaN(d.getTime()) ? arg : d;
	}
	if (arg instanceof Date) return arg;
	return undefined;
}, z.date().optional());

export const createTaskSchema = z.object({
	name: z.string().min(1, "El nombre es obligatorio"),
	description: z.string().optional().nullable(),
	categoryId: uuidString,
	dueDate: dueDatePreprocess,
	priority: Priority.optional(),
	status: TaskStatus.optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
	completed: z.boolean().optional(),
});

export const getTasksQuerySchema = z.object({
	status: TaskStatus.optional(),
	categoryId: uuidString.optional(),
});

// Lists & Categories (esquemas básicos, se pueden ampliar cuando se añadan endpoints)
export const createListSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional().nullable(),
	ownerId: uuidString,
});

export const createCategorySchema = z.object({
	name: z.string().min(1),
	description: z.string().optional().nullable(),
	listId: uuidString,
});

// Tipos derivados
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

export type CreateListInput = z.infer<typeof createListSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export default {
	TaskStatus,
	Priority,
	SharePermission,
	createUserSchema,
	userResponseSchema,
	createTaskSchema,
	updateTaskSchema,
	getTasksQuerySchema,
	createListSchema,
	createCategorySchema,
};