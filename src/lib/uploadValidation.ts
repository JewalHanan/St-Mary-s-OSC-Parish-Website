/**
 * uploadValidation.ts
 * Shared utilities for validating file uploads clientside before processing.
 */

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
]);

/** Check file size and MIME type before reading */
export function validateImageFile(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return `Unsupported file type "${file.type}". Please upload a JPEG, PNG, WebP, GIF, or AVIF image.`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`;
    }
    return null; // valid
}

/**
 * Verify the file is a real image by trying to draw it onto a canvas.
 * Returns a promise that resolves to true/false.
 */
export function verifyImageRenderable(file: File): Promise<boolean> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = e.target?.result as string;
        };
        reader.onerror = () => resolve(false);
        reader.readAsDataURL(file);
    });
}

/** Strip HTML tags from user-supplied text to prevent XSS */
export function sanitiseText(input: string, maxLength = 1000): string {
    return input
        .replace(/<[^>]*>/g, '')       // strip HTML tags
        .replace(/&[a-z]+;/gi, ' ')    // strip HTML entities
        .trim()
        .slice(0, maxLength);
}

/** Sanitise a URL — only allow http/https schemes */
export function sanitiseUrl(url: string, maxLength = 2048): string | null {
    try {
        const trimmed = url.trim().slice(0, maxLength);
        const parsed = new URL(trimmed);
        if (!['http:', 'https:'].includes(parsed.protocol)) return null;
        return trimmed;
    } catch {
        return null;
    }
}
