import { getView, getViewStats } from "./utils.mjs";

export default async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const [stats, errStats] = await getViewStats("index");
  if (errStats) {
    console.error(errStats);
    res.writeHead(500).end("Internal Server Error");
    return;
  }

  const lastModified = new Date(stats.mtime);
  lastModified.setMilliseconds(0);
  res.setHeader("Last-Modified", lastModified.toUTCString());

  const ifModifiedSince = new Headers(req.headers).get("If-Modified-Since");
  if (
    ifModifiedSince &&
    new Date(ifModifiedSince).getTime() >= lastModified.getTime()
  ) {
    res.writeHead(304).end();
    return;
  }

  const [html, errView] = await getView("index");
  if (errView) {
    console.error(errView);
    res.writeHead(500).end("Internal Server Error");
    return;
  }

  res.writeHead(200).end(html);
};
