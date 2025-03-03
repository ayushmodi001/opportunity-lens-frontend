import { NextResponse } from "next/server";
import { createUser } from "@/queries/users";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongo";

export const POST = async (request) => {
  try {
    const { Username, email, password, cpassword } = await request.json();
    console.log(Username, email, password, cpassword);
    
    // Validate password confirmation
    if (password !== cpassword) {
      return new NextResponse(
        JSON.stringify({ message: "Passwords do not match" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Create DB Connection
    // await dbConnect();

    // Encrypt the Password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Form for DB Payload
    const newUser = {
      Username,
      password: hashedPassword,
      email
    };

    // Update the DB
    await createUser(newUser);

    return new NextResponse(
      JSON.stringify({ message: "User has been created" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Registration failed", 
        error: error.message || "Unknown error" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};