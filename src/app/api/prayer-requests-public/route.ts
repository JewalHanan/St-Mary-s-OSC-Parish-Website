import { NextRequest, NextResponse } from "next/server";
import { readBlob, writeBlob } from "@/lib/blob-store";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const existing = await readBlob<any[]>("prayer-requests", []);
        const requests = Array.isArray(existing) ? existing : [];
        const newReq = {
            id: requests.length > 0 ? Math.max(...requests.map((r: any) => r.id)) + 1 : 1,
            ...body,
            status: "PENDING",
        };
        await writeBlob("prayer-requests", [...requests, newReq]);
        return NextResponse.json({ success: true, id: newReq.id });
    } catch (err) {
        console.error("[prayer-requests-public] POST error:", err);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
