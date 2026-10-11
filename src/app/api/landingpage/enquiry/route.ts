import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fullName, businessName, workEmail, phone, primaryRequirement } = body;

    if (!fullName || !businessName || !workEmail || !phone || !primaryRequirement) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Since WARCM has self-hosted Supabase and email configs, log enquiry securely
    // In production, forward to internal notification channel, email, or a specific leads table.
    console.log("New Landing Page Enquiry Received:", {
      fullName,
      businessName,
      workEmail,
      phone,
      teamSize: body.teamSize || "N/A",
      primaryRequirement,
      message: body.message || "N/A",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Enquiry submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing enquiry:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
