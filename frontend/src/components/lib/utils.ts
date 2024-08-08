import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const specialCharacter = (input: string) => {
  return /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(input);
};
