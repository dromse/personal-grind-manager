import { RawFile } from "@hooks/types";
import { Vault } from "obsidian";

/** Get array of file lines */
export function getFileLines(fileContent: string): Array<string> {
	return fileContent.split("\n");
}

/** Get all markdown files in vault with their content */
export async function getRawFiles(vault: Vault): Promise<Array<RawFile>> {
	const rowFiles = await Promise.all(
		vault.getMarkdownFiles().map(async (file) => ({
			path: file.path,
			content: getFileLines(await vault.cachedRead(file)),
		})),
	);

	return rowFiles;
}

export const appendStartAndIgnoreFrontmatter = (
	data: string,
	contentToAppend: string,
): string => {
	const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
	const match = data.match(frontmatterRegex);

	let newContent;

	if (match) {
		// If frontmatter is found, append the content after the frontmatter
		newContent = `${match[0]}${contentToAppend}${data.slice(match[0].length)}`;
	} else {
		// If no frontmatter, append the content at the start
		newContent = `${contentToAppend}${data}`;
	}

	return newContent;
};
