import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: { bodyParser: false },
};

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
export default async function handler(req: NextRequest, res: NextResponse) {
//   const form = req; // Next.js will give you the raw request with file
  // Proxy the multipart to your FastAPI backend
  const response = await fetch("http://localhost:4000/detect-image/", {
    method: "POST",
    body: req.body,
    headers: { "content-type": req.headers["content-type"]! },
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
