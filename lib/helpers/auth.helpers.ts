import { auth } from "@/lib/auth";

export async function getUserId(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  return userId;
}
