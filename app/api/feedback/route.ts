import { NextRequest, NextResponse } from "next/server";
import { getAllFeedback, addFeedback } from "@/lib/data";
import { Feedback } from "@/lib/types";

export async function GET(request: NextRequest) {
  const feedback = await getAllFeedback()

  const { searchParams } = request.nextUrl

  const courseSlug = searchParams.get("courseSlug")
  const lessonSlug = searchParams.get("lessonSlug")
  const minRating = searchParams.get("minRating")

  if (courseSlug) return NextResponse.json(feedback.filter((f) => f.courseSlug === courseSlug))
  if (lessonSlug) return NextResponse.json(feedback.filter((f) => f.lessonSlug === lessonSlug))
  if (minRating) {
    let min = feedback[0].rating;
    feedback.forEach((f, index) => {
      if (f.rating < min) min = f.rating
    })
    return NextResponse.json(feedback.find(f => f.rating === min))
  }

  return NextResponse.json(feedback);
}

export async function POST(request: NextRequest) {
  let body: Feedback;

  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    )
  }

  const { author, comment, courseSlug, lessonSlug, rating } = body

  if (!courseSlug || !lessonSlug || rating == null || !comment || !author)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )

  if (!Number.isInteger(rating || rating < 1 || rating > 5))
    return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 })

  const entry = await addFeedback(body)

  return NextResponse.json(entry, { status: 201 });
}
