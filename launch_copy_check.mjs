import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./PROOFPATH_X_LAUNCH.md", import.meta.url), "utf8");
const sections = source.split(/^## post \d+$/m).slice(1);

sections.forEach((section, index) => {
  const post = section
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n\n");
  console.log(`post ${index + 1}: ${post.length} characters`);
});
