import { NextResponse } from "next/server";
import dbConnect from "@/db/connection";
import Category from "@/db/models/Category";

export async function GET() {
    try {
        await dbConnect();
        // Only return non-free categories to save bandwidth, or return all?
        // Let's return only those that are NOT 'free' to keep packet small, 
        // or return object { [slug]: accessLevel }

        const categories = await Category.find({ accessLevel: { $ne: 'free' } }).select("slug accessLevel");

        const permissions: Record<string, string> = {};
        categories.forEach(cat => {
            permissions[cat.slug] = cat.accessLevel;
        });

        return NextResponse.json(permissions);
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return NextResponse.json({}, { status: 500 });
    }
}
