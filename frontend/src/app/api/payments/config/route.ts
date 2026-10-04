import { NextResponse } from "next/server";

export async function GET() {
  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51ThDDICdX0hvCWhczONjNi3TCevUCN7vYmjW5h5KaNeNiyjAAkIG3KL1ZkqSOauu8wIRirZmCuETnr6Xw65tK34T00DDtz8A5O";

  return NextResponse.json({
    success: true,
    publishableKey,
  });
}
