import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const GEN_ROOT = path.join(ROOT, "src", "gen");
const INDEX_FILE = path.join(ROOT, "src", "index.ts");

async function walkFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map(async (dirent) => {
			const fullPath = path.join(dir, dirent.name);
			if (dirent.isDirectory()) {
				return walkFiles(fullPath);
			}
			return [fullPath];
		})
	);
	return files.flat();
}

function toPosixRelative(filePath) {
	return path.relative(path.join(ROOT, "src"), filePath).split(path.sep).join("/");
}

async function readFirstServiceSymbol(connectFilePath) {
	const content = await readFile(connectFilePath, "utf8");
	const match = content.match(/export const (\w+)\s*=\s*\{/);
	return match?.[1] ?? null;
}

async function main() {
	const allFiles = await walkFiles(GEN_ROOT);
	const pbFiles = allFiles
		.filter((file) => file.endsWith("_pb.ts"))
		.sort((a, b) => a.localeCompare(b));
	const connectFiles = allFiles
		.filter((file) => file.endsWith("_connect.ts"))
		.sort((a, b) => a.localeCompare(b));

	const lines = [];
	lines.push("// AUTO-GENERATED — do not edit manually.");
	lines.push("// Run: bun run proto:gen");
	lines.push("");

	for (const connectFile of connectFiles) {
		const serviceSymbol = await readFirstServiceSymbol(connectFile);
		if (!serviceSymbol) continue;
		const rel = toPosixRelative(connectFile).replace(/\.ts$/, ".js");
		lines.push(`export { ${serviceSymbol} as ${serviceSymbol}ConnectService } from "./${rel}";`);
	}

	if (connectFiles.length > 0) {
		lines.push("");
	}

	for (const pbFile of pbFiles) {
		const rel = toPosixRelative(pbFile).replace(/\.ts$/, ".js");
		lines.push(`export * from "./${rel}";`);
	}

	lines.push("");
	await writeFile(INDEX_FILE, `${lines.join("\n")}`);
}

void main();
