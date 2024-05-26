import { HistoryRow } from "@hooks/useHistory";
import { Task } from "@hooks/useTasks/types";
import { Workspace } from "obsidian";
import { generatePastDaysArray, getAmountOfPastDays } from "./date";

/**
 * Use currying to set search filter and return callback to call in filter
 */
export const bySearch =
	(searchFilter: string) =>
		(task: Task): boolean =>
			task.body
				? task.body.toLowerCase().includes(searchFilter.toLowerCase())
				: true;

/**
 * Use currying to set tag filters and return callback to call in filter
 */
export const byTag =
	(tagFilter: string, hasOnlyThisTags: boolean) =>
		(task: Task): boolean => {
			if (tagFilter.length === 0) {
				return true;
			}

			const tags = tagFilter
				.split(",")
				.map((tag) => tag.trim())
				.filter((trimmedTag) => trimmedTag !== "")
				.map((tag) => "#" + tag);

			if (hasOnlyThisTags) {
				return tags.every((tag) => task.lineContent.includes(tag));
			} else {
				return tags.some((tag) => task.lineContent.includes(tag));
			}
		};

/**
 * Use currying to set note filters and return callback to call in filter
 */
export const byNote =
	(noteFilter: string, isFromCurrentNote: boolean, workspace: Workspace) =>
		(task: Task): boolean => {
			if (isFromCurrentNote) {
				const activeNote = workspace.getActiveFile();

				if (activeNote) {
					return task.path === activeNote.path;
				}

				return false;
			}

			if (noteFilter === "") {
				return true;
			}

			return task.path === noteFilter + ".md";
		};

/**
 * Use currying to set status filter and return callback to call in filter
 */
export const byStatus =
	(statusFilter: string) =>
		(task: Task): boolean => {
			if (statusFilter === "all") {
				return true;
			}

			if (!task.status) {
				return false;
			}

			if (statusFilter === task.status) {
				return true;
			}

			return false;
		};

/**
 * Use currying to set history rows and return callback to call in filter
 */
export const byToday =
	(historyRows: ReadonlyArray<HistoryRow>) =>
		(task: Task): boolean => {
			if (!task.every) {
				return false;
			}

			let amountOfDaysToShowAgain = getAmountOfPastDays(task.every);

			if (!amountOfDaysToShowAgain) {
				return false;
			}

			const pastDaysList = generatePastDaysArray(amountOfDaysToShowAgain);

			const dateRange = historyRows
				.filter((row) => pastDaysList.includes(row.date.split(" ")[0]))
				.map((row) => row.title);

			const isTaskNotAppearInPastDays = !dateRange.some(
				(title) => title === task.body,
			);

			if (task.counter && task.status === "doing") {
				console.log(task.status);
				const isCounterNotFull = task.counter.current !== task.counter.goal;

				if (isCounterNotFull) {
					return true;
				}
			}

			return isTaskNotAppearInPastDays;
		};

export const byRecurrance = (task: Task): boolean =>
	task.every ? true : false;
