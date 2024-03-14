import { TFile } from "obsidian";
import { useState } from "react";
import { useApp } from "../../hooks";
import { Task } from "../../hooks/useTasks/types";
import StatusBadge from "../StatusBadge";
import styles from "./styles.module.css";

type Props = {
	task: Task;
	updateTask: (task: Task, newTask: Task) => void;
};

export default function TaskItem({ task, updateTask }: Props) {
	const [completed, setCompleted] = useState<boolean>(task.completed || false);

	const workspace = useApp()?.workspace;

	if (!workspace) {
		return <div>Workspace not exists...</div>;
	}

	const openFile = (tFile: TFile) => workspace.getLeaf("tab").openFile(tFile);

	return (
		<li className={styles.task}>
			<input
				type="checkbox"
				checked={completed}
				onChange={() => {

					updateTask(task, {
						...task,
						completed: !task.completed,
						status: !task.completed ? "done" : "todo",
					});

					setCompleted(!task.completed);
				}}
			/>

			<a onClick={() => openFile(task.tFile)}>{task.body}</a>

			{task.status && <StatusBadge status={task.status} />}
		</li>
	);
}
