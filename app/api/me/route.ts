// app/api/me/route.ts
import { cookies } from "next/headers";
import {jwtDecode} from "jwt-decode";

export async function GET() {
    const useCookies = await cookies()
  const token = useCookies.get("token")?.value;
  if (!token) return Response.json(null);

  const decoded: { id: string } = jwtDecode(token);
  const res = {decoded, token}
  return Response.json(res);
}
