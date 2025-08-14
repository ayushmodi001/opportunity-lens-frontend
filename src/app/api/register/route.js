import { NextResponse } from "next/server";
import { registerUser } from "@/queries/users";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const { Username, email, password, cpassword } = await request.json();

    if (password !== cpassword) {
      return new NextResponse(
        JSON.stringify({ message: "Passwords do not match" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = {
      Username,
      email,
      password: hashedPassword,
    };

    await registerUser(newUser);

    return new NextResponse(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Registration error:", error);
    // Check for duplicate key error (email already exists)
    if (error.code === 11000) {
      return new NextResponse(
        JSON.stringify({
          message: "An account with this email already exists.",
        }),
        {
          status: 409, // Conflict
          headers: { "Content-Type": "application/json" },
        }
      );
    }
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
