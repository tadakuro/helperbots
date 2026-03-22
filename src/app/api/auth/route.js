import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    const appPassword = process.env.APP_PASSWORD;

    if (!appPassword) {
      console.error("APP_PASSWORD env var is not set.");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    if (password !== appPassword) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Auth route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
