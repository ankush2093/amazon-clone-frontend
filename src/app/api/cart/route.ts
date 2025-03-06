import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const API_URL = "http://localhost:4000/api/cart";
  const token = req.headers.get("Authorization");

  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: { Authorization: token || "" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, items } = await req.json();
  const API_URL = "http://localhost:4000/api/cart";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") || "",
      },
      body: JSON.stringify({ userId, items }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Error saving cart" }, { status: 500 });
  }
}
