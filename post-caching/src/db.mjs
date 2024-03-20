import { getJSONBody, sleep } from "./utils.mjs";

const POSTS = [
  { title: "Caching", tag: "code" },
  { title: "Headers", tag: "code" },
  { title: "Dogs", tag: "animals" },
];

export function GET(tag) {
  let posts = POSTS;
  if (tag) posts = posts.filter((post) => post.tag === tag);
  return posts;
}

export default async function db(req, res) {
  switch (req.method) {
    case "POST": {
      const [body, err] = await getJSONBody(req);
      if (err) {
        console.error(err);
        res.writeHead(500).end("Something went wrong");
        return;
      }

      POSTS.push(body);
      res.writeHead(201).end();
      return;
    }
    case "PATCH":
      const [body, err] = await getJSONBody(req);
      if (err) {
        console.error(err);
        res.writeHead(500).end("Something went wrong");
        return;
      }

      POSTS.at(body.index).title = body.title;
      res.writeHead(200).end();
      return;
  }
}
