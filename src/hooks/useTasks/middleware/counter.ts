import { Middleware, Task } from "../types";
import { cleanBody, findByRegex } from "@utils/middleware";

const parse = (task: Task): Task => {
	const regex = /#count\/(\d+)\/(\d+)/;

	const match = findByRegex(regex, task);

	if (!match) {
		return task;
	}

	const newBody = cleanBody(regex, task);

	return {
		...task,
		counter: {
			current: Number(match[1]),
			goal: Number(match[2]),
		},
		body: newBody,
	};
};

const stringify = (task: Task): string =>
	task.counter ? ` #count/${task.counter.current}/${task.counter.goal}` : "";

export default { parse, stringify } as Middleware;
