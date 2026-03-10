/** Utility for conditionally joining class names (lightweight alternative to clsx) */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
