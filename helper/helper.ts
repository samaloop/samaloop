export function generateSlug(value: string) {
    return value
        .toLowerCase()                      // Convert to lowercase
        .trim()                             // Remove leading and trailing whitespace
        .replace(/[^a-z0-9\s-]/g, '')       // Remove special characters
        .replace(/\s+/g, '-')               // Replace multiple spaces with a single hyphen
        .replace(/-+/g, '-');              // Replace multiple hyphens with a single hyphen
}

export function stripHTML(value: string) {
    return value.replace(/(&lt;([^>]+)>)/gi, "");
}