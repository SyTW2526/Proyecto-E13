export default async function handler(req: any, res: any) {
  const { app } = await import("../server/src/server.js");
  return app(req, res);
}
