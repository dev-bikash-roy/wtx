import { WPCategory } from "@/data/wp-types";

// Cache permissions to avoid hammering the DB
let categoryPermissionsCache: Record<string, "free" | "paid"> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function getCategoryPermissions(): Promise<Record<string, "free" | "paid">> {
    const now = Date.now();
    if (categoryPermissionsCache && (now - cacheTimestamp < CACHE_TTL)) {
        return categoryPermissionsCache;
    }

    try {
        // We need an absolute URL for server-side fetches or a way to call the DB directly if server-side.
        // Since this might be called from Client or Server, let's try to be smart.
        // Actually, for Server Components, we should direct DB call if possible, or use full URL.
        // For simplicity and consistency, let's treat this as a Client-side helper primarily, 
        // or assume we have a public endpoint that lists restrictive categories.

        // BUT: The /api/admin/categories is protected. We need a PUBLIC endpoint to list "Premium categories".
        // Alternatively, we embed the logic in the page load.

        // Let's create a public endpoint first: /api/categories/permissions
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/categories/permissions`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return {};

        const permissions = await res.json();
        categoryPermissionsCache = permissions;
        cacheTimestamp = now;
        return permissions;
    } catch (error) {
        console.error("Failed to fetch category permissions", error);
        return {};
    }
}
