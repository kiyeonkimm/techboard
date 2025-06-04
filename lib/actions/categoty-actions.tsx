'use server';

import prisma from '../db';
import db from '../db';
import { Category } from '../generated/prisma';

export async function getAllCategories() {
  console.log('adfasd>>>>>>>>>>>>>>>>>>>');
  const categories = await prisma.category.findMany();
  console.log('categories', categories);
  return categories;
}
