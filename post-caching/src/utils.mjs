import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

export function to(promise) {
  return promise.then((res) => [res, null]).catch((err) => [null, err]);
}

export async function getView(name) {
  const filepath = path.resolve(process.cwd(), "src", "views", name + ".html");
  return await to(fs.readFile(filepath, "utf-8"));
}

export async function getViewStats(name) {
  const filepath = path.resolve(process.cwd(), "src", "views", name + ".html");
  return await to(fs.stat(filepath));
}

export function getURL(req) {
  return new URL(req.url, `http://${req.headers.host}`);
}

export async function getJSONBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("error", (err) => resolve([null, err]));
    req.on("end", () => resolve([JSON.parse(body), null]));
  });
}

export async function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function createETag(resource) {
  return createHash("md5").update(resource).digest("hex");
}
