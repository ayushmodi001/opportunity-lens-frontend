import { NextResponse } from "next/server";
import { createUser } from "@/queries/users";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongo";

export const POST = async (request) => {
  try {
    const { Username, email, password, cpassword } = await request.json();
    console.log(Username, email, password, cpassword);

    // ✅ Immediately respond to client to prevent timeout
    const response = new NextResponse(
      JSON.stringify({ message: "Processing registration..." }),
      {
        status: 202, // ✅ Non-blocking response
        headers: { "Content-Type": "application/json" },
      }
    );

    // ✅ Process registration in the background
    registerUser(Username, email, password, cpassword);

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Registration failed",
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Background registration function (does NOT block API response)
const registerUser = async (Username, email, password, cpassword) => {
  try {
    if (password !== cpassword) {
      console.log("Passwords do not match");
      return;
    }

    // Connect to DB
    // await dbConnect();

    // Encrypt the Password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Form for DB Payload
    const newUser = {
      Username,
      password: hashedPassword,
      email,
    };

    // Update the DB
    await createUser(newUser);
    console.log("User has been created:", email);
  } catch (error) {
    console.error("Background registration error:", error);
  }
};
