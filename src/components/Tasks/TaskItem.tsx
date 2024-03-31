import { useApp, useHistory } from "@hooks";
import { DifficultyPrice, StatusKeys } from "@hooks/useTasks/consts";
import { Status, Task } from "@hooks/useTasks/types";
import { Notice } from "obsidian";
import { useEffect, useState } from "react";

import styles from "./styles.module.css";

type Props = {
	task: Task;
	updateTask: (task: Task, newTask: Task) => any;
};

export default function TaskItem({ task, updateTask }: Props) {
	const [isCounterLoading, setIsCounterLoading] = useState(false);
	const workspace = useApp()?.workspace;
	const vault = useApp()?.vault;
	const [trigger, setTrigger] = useState(false);

	const { addHistoryRow } = useHistory();

	if (!workspace) {
		return <div>Workspace is not exists...</div>;
	}

	if (!vault) {
		return <div>Vault is not exists...</div>;
	}

	async function updateStatus(status: Status) {
		await updateTask(task, { ...task, status });

		if (task.counter) {
			return;
		}

		if (!task.difficulty) {
			return;
		}

		if (status === "done") {
			addHistoryRow({
				title: task.body,
				change: DifficultyPrice[task.difficulty],
			});

			new Notice(`You completed task: '${task.body}'`);
		}

		if (task.status === "done" && status !== "done") {
			addHistoryRow({
				title: task.body,
				change: -DifficultyPrice[task.difficulty],
			});
		}
	}

	const updateCounter = async (value: number) => {
		setIsCounterLoading(true);

		const current = Number(task.counter?.current);
		const goal = Number(task.counter?.goal);

		if (!current && !goal) {
			return;
		}

		const newCurrent = current + value;
		const isOutOfScope = (value: number) => value < 0 || value > goal;

		if (isOutOfScope(newCurrent)) {
			setTrigger((prev) => !prev);
			return;
		}

		const result = await updateTask(task, {
			...task,
			status: newCurrent === goal ? "done" : "doing",
			counter: { current: newCurrent, goal },
		});

		if (newCurrent === goal) {
			new Notice(`You completed task: '${task.body}'`);
		}

		if (result === "error") {
			new Notice("Error during counter update.");
		}

		if (task.difficulty) {
			addHistoryRow({
				title: task.body,
				change: DifficultyPrice[task.difficulty] * value,
			});
		}

		setTrigger((prev) => !prev);
	};

	const revealTask = (task: Task) => {
		const tFile = vault.getFileByPath(task.path);

		if (!tFile) {
			new Notice("Error: file associated with task is not found.");
			return;
		}

		const leaves = workspace.getLeavesOfType("markdown");

		const fileIsAlreadyOpen = leaves.some(
			// @ts-ignore
			(leaf) => leaf.view.file.path === task.path,
		);

		if (fileIsAlreadyOpen) {
			const leaf = leaves.find(
				// @ts-ignore
				(leaf) => leaf.view.file.path === task.path,
			);

			leaf?.openFile(tFile, { eState: { line: task.lineNumber } });
		} else {
			workspace.getLeaf("tab").openFile(tFile, {
				eState: { line: task.lineNumber },
			});
		}
	};

	useEffect(() => {
		setIsCounterLoading(false);
	}, [trigger]);

	return (
		<li className={`${styles.task} border`}>
			<select
				onChange={(e) => updateStatus(e.currentTarget.value as Status)}
				value={task.status}
			>
				{StatusKeys.map((status) => (
					<option>{status}</option>
				))}
			</select>

			<a onClick={() => revealTask(task)}>{task.body}</a>

			{task.counter && (
				<div className={styles.counter}>
					<p>
						{task.counter.current} / {task.counter.goal}
					</p>
					<button
						disabled={isCounterLoading}
						onClick={() => updateCounter(1)}
					>
						+
					</button>
					<button
						disabled={isCounterLoading}
						onClick={() => updateCounter(-1)}
					>
						-
					</button>
				</div>
			)}
		</li>
	);
}
