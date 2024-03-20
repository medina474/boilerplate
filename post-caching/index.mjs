import { createServer } from "http";
import * as endpoints from "./src/index.mjs";
import { getURL } from "./src/utils.mjs";

const routes = {
  "/no-headers": endpoints.noHeaders,
  "/last-modified": endpoints.lastModified,
  "/only-etag": endpoints.onlyETag,
  "/cache-control-and-etag": endpoints.cacheControlAndETag,
  "/db": endpoints.db,
};

createServer(async (req, res) => {
  const endpoint = routes[getURL(req).pathname];
  console.log(getURL(req))
  if (!endpoint) return res.writeHead(400).end();
  return await endpoint(req, res);
}).listen(8000, "127.0.0.1", () =>
  console.info(
    Object.keys(routes)
      .map((route) => `http://127.0.0.1:8000${route}`)
      .join("\n")
  )
);
