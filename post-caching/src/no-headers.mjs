import { getView, sleep } from "./utils.mjs";

export default async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const [html, err] = await getView("index");
  if (err) {
    console.error(err);
    res.writeHead(500).end("Internal Server Error");
    return;
  }

  res.writeHead(200).end(html);
};
