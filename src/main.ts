import { DEFAULT_SETTINGS, GrindConsts } from "@consts";
import { GrindPluginSettings } from "@types";
import { logger } from "@utils/logger";
import { Plugin, WorkspaceLeaf } from "obsidian";
import { MyView, MY_VIEW_TYPE } from "./MyView";
import GrindSettingTab from "./SettingTab";

export default class GrindPlugin extends Plugin {
	settings: GrindPluginSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(() => {
			// @ts-expect-error: Obsidian Private API.
			this.settings.useMarkdownLinks = this.app.vault.config.useMarkdownLinks;

			const dailyPlugin =
				// @ts-expect-error: Obsidian Private API.
				this.app.internalPlugins.getEnabledPluginById("daily-notes");

			if (dailyPlugin) {
				const folder = dailyPlugin.options.folder;
				if (folder) {
					this.settings.pathToDaily = folder;
				}

				const format = dailyPlugin.options.format;
				if (format) {
					this.settings.dailyFormat = format;
				}
			}
		});

		this.addSettingTab(new GrindSettingTab(this.app, this));

		this.registerView(MY_VIEW_TYPE, (leaf) => new MyView(leaf, this.settings));

		this.addRibbonIcon("list-todo", "Show grind manager", () => {
			this.activateView();
		});

		logger(`v${this.manifest.version} is loaded.`);
	}

	async activateView(): Promise<void> {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(MY_VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: MY_VIEW_TYPE, active: true });
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload(): void {
		sessionStorage.removeItem(GrindConsts.sessionTasks);

		logger(`v${this.manifest.version} is unloaded.`);
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
