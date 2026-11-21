import { NextRequest, NextResponse } from "next/server";
import { getAllFeedback } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const feedback = await getAllFeedback();
  const singleFeedback = feedback.find(f => f.id = id)

  if (!singleFeedback) return NextResponse.json(
    { error: `Feedback ${id} not found` },
    { status: 404 }
  )

  return NextResponse.json(singleFeedback, { status: 201 });
}
