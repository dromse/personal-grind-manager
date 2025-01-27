import { GamifiedTasksSettings } from "@types";
import { App } from "obsidian";
import {
    SortOrderOptions,
    SortTypeOptions,
    TaskFilterOptions,
} from "./consts";

export type TaskFilterOptionsType = (typeof TaskFilterOptions)[number];
export type SortOrder = (typeof SortOrderOptions)[number];
export type SortType = (typeof SortTypeOptions)[number];

export type GroupMetadata = {
    id: string;
    title: string;
    color: string;
    priority: number;
};

export type Group = {
    metadata: GroupMetadata;
    tasks: Array<Task>;
};

/**
 * Represents the status options for filtering tasks.
 */
export type StatusFilterOption = "all" | Status;

/**
 * Represents the state for filtering or sorting tasks in the plugin.
 * @template T - The type of data which stores in a state, such as strings or objects.
 */
export type State<T> = {
    /**
     * Current value of state.
     */
    value: T;

    /**
     * Function responsible for updating the state with a new `value`.
     * @param {React.SetStateAction<T>} action - The new value or updater function to update the current state value.
     */
    setValue: React.Dispatch<React.SetStateAction<T>>;
};

/**
 * Represents the filters for tasks.
 */
export type TaskFilters = {
    /**
     * The limit of tasks to display.
     */
    limit: State<number | undefined>;

    /**
     * The search filter for tasks.
     */
    search: State<string>;

    /**
     * The status filter option for tasks.
     */
    status: State<StatusFilterOption>;

    /**
     * Indicates whether tasks are recurring.
     */
    recur: State<boolean>;

    /**
     *  List of tags to filter tasks.
     */
    tags: State<string>;

    /**
     *  Specify only show tasks with this tags or all tasks with matched tags
     */
    onlyThisTags: State<boolean>;

    /**
     * Show tasks from this note.
     */
    note: State<string>;

    /**
     * Show tasks from the current note.
     */
    shouldShowCurrentNoteTasks: State<boolean>;

    /**
     * Show tasks by success conditions.
     */
    showByCondition: State<boolean>;
};

/**
 * Represents the possible statuses of a task.
 */
export type Status = "todo" | "doing" | "done" | "denied" | "delay";

/**
 * Type defenition for a counter object.
 */
export type CounterT = {
    /**
     * The goal value of the counter.
     */
    goal?: number;

    /**
     * The current value of the counter.
     */
    current: number;
};

/**
 * Type defenition for a task object
 */
export type Task = {
    /**
     * The file associated with the task.
     */
    path: string;

    /**
     * The full content of the line containing the task.
     */
    lineContent: string;

    /**
     * The line number of the task in the file.
     */
    lineNumber: number;

    /**
     * The body content of the task.
     */
    body: string;

    /**
     * The indention level of the task in spaces.
     */
    indention?: number;

    /**
     * The completion timestamp of the task.
     */
    completedAt?: string;

    /**
     * The difficulty level of the task.
     */
    difficulty?: string;

    /**
     * The completion status of the task.
     */
    status?: Status;

    /**
     * The recurrence of the task.
     */
    every?: string;

    /**
     * Binding to YAML frontmatter property in daily note.
     */
    bind?: string;

    /**
     * The counter information of the task.
     */
    counter?: CounterT;

    /**
     * Group task tag.
     */
    group?: string;

    /**
     * Information about conditions
     */
    condition?: {
        /**
         * The name of condition.
         */
        name: string;

        /**
         * The resource file associated with a module to import dynamically through `import()`.
         */
        file: string;

        /**
         * The argument to assign to imported function from module
         */
        arg: string;
    };
};

/**
 * Type defenition for a middleware used for parsing and stringification.
 *
 * A middleware consists of two functions:
 * - parse: parse metadata from markdown line
 * - stringify: stringify metadata back to markdown line
 */
export type Middleware = {
    /**
     * Function for parsing metadata from a markdown line.
     *
     * This function takes a task object and extracts any metadata present in `body`.
     * If metadata is found, metadata is cleared from the `body`.
     *
     * @param task The task object with field `body` representing the markdown line to parse.
     * @param settings The plugin settings object (optional)
     * @returns The task object with metadata cleared from the body, if found or the same task object.
     */
    parse: (task: Task, settings?: GamifiedTasksSettings, app?: App) => Task;

    /**
     * Function for stringifying a task object to a markdown line.
     *
     * This function takes a task object and converts it into a markdown line.
     * If metadata wasn't found in the task object, it returns an empty string.
     *
     * @param task The task object to stringify.
     * @param settings The plugin settings object (optional)
     * @returns The markdown representation of the task, or an empty string if metadata wasn't found.
     */
    stringify: (task: Task, settings?: GamifiedTasksSettings) => string;
};
