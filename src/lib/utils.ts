<<<<<<< HEAD
import { clsx, type ClassValue } from "clsx"
=======
import { type ClassValue, clsx } from "clsx"
>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
<<<<<<< HEAD
=======

>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
