import * as db from "./db.mjs";
import { getURL, getView, createETag, sleep } from "./utils.mjs";

export default async (req, res) => {
  console.info("Load on the server!");

  res.setHeader("Content-Type", "text/html");

  const tag = getURL(req).searchParams.get("tag");
  const posts = db.GET(tag);

  let [html, errView] = await getView("posts");
  if (errView) {
    console.error(errView);
    res.writeHead(500).end("Internal Server Error");
    return;
  }

  html = html.replace("%TAG%", tag ?? "all");
  html = html.replace(
    "%POSTS%",
    posts.map((post) => `<li>${post.title}</li>`).join("\n")
  );

  await sleep(3000);

  // Either this:
  // res.setHeader("Cache-Control", "max-age=3600");
  // Or:
  res.setHeader("Cache-Control", "max-age=120, stale-while-revalidate=300");

  const etag = createETag(html);
  res.setHeader("ETag", etag);
  const ifNoneMatch = new Headers(req.headers).get("If-None-Match");
  if (ifNoneMatch === etag) {
    res.writeHead(304).end();
    return;
  }

  res.writeHead(200).end(html);
};
