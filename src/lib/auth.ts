import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(adminSecret: string) {
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return false;
  }

  // Create the session
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  const session = await encrypt({ admin: true, expires });

  // Save the session in a cookie
  (await cookies()).set("wallora_admin_session", session, { expires, httpOnly: true, secure: true });
  return true;
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("wallora_admin_session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("wallora_admin_session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (e) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("wallora_admin_session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "wallora_admin_session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
    secure: true
  });
  return res;
}
