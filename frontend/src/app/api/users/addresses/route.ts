import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { safeFindUserById, safeUpdateUser } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-secret-for-dev";

function getUserFromToken(req: NextRequest): { id: string; email: string; role: string } | null {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const tokenCookie = req.cookies.get("token");
      token = tokenCookie?.value || "";
    }
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { firstName, lastName, street, city, state, postalCode, country, phone, isDefault } = body;

    const newAddress = {
      id: `addr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      firstName: firstName || "",
      lastName: lastName || "",
      street: street || "",
      city: city || "",
      state: state || "",
      postalCode: postalCode || "",
      country: country || "US",
      phone: phone || "",
      isDefault: Boolean(isDefault || (user.addresses || []).length === 0),
    };

    let existingAddresses = user.addresses || [];

    if (newAddress.isDefault) {
      existingAddresses = existingAddresses.map((a: any) => ({ ...a, isDefault: false }));
    }

    const updatedAddresses = [...existingAddresses, newAddress];
    await safeUpdateUser(user.id, { addresses: updatedAddresses });

    return NextResponse.json({
      success: true,
      address: newAddress,
      addresses: updatedAddresses,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create address" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, firstName, lastName, street, city, state, postalCode, country, phone, isDefault } = body;

    if (!id) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    let existingAddresses = user.addresses || [];

    if (isDefault) {
      existingAddresses = existingAddresses.map((a: any) => ({ ...a, isDefault: false }));
    }

    const updatedAddresses = existingAddresses.map((addr: any) => {
      if (addr.id === id) {
        return {
          ...addr,
          firstName: firstName !== undefined ? firstName : addr.firstName,
          lastName: lastName !== undefined ? lastName : addr.lastName,
          street: street !== undefined ? street : addr.street,
          city: city !== undefined ? city : addr.city,
          state: state !== undefined ? state : addr.state,
          postalCode: postalCode !== undefined ? postalCode : addr.postalCode,
          country: country !== undefined ? country : addr.country,
          phone: phone !== undefined ? phone : addr.phone,
          isDefault: isDefault !== undefined ? isDefault : addr.isDefault,
        };
      }
      return addr;
    });

    await safeUpdateUser(user.id, { addresses: updatedAddresses });

    return NextResponse.json({
      success: true,
      addresses: updatedAddresses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedAddresses = (user.addresses || []).filter((a: any) => a.id !== addressId);
    await safeUpdateUser(user.id, { addresses: updatedAddresses });

    return NextResponse.json({
      success: true,
      addresses: updatedAddresses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete address" }, { status: 500 });
  }
}
