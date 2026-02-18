import { NextResponse } from "next/server";
import dbConnect from "@/db/connection";
import Category from "@/db/models/Category";

export async function GET() {
    try {
        const connection = await dbConnect();
        
        // If MongoDB is not configured, return empty permissions (all content is free)
        if (!connection) {
            return NextResponse.json({});
        }

        // Only return non-free categories to save bandwidth
        const categories = await Category.find({ accessLevel: { $ne: 'free' } }).select("slug accessLevel");

        const permissions: Record<string, string> = {};
        categories.forEach(cat => {
            permissions[cat.slug] = cat.accessLevel;
        });

        return NextResponse.json(permissions);
    } catch (error) {
        console.warn("Error fetching permissions, defaulting to open access:", error);
        // Return empty object instead of 500 error - this makes all content accessible
        return NextResponse.json({});
    }
}
