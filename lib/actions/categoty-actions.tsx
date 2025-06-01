import db from '../db';
import { Category } from '../generated/prisma';

export async function getAllCategories(): Promise<Category[]> {
  return await db.category.findMany();
}
