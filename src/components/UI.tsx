import { FiltersContext } from "@context";
import useFilterTasks from "@hooks/useFilterTasks";
import React from "react";
import Tabs from "./reusable/Tabs";
import { History, Rewards, Tasks } from "./tabs";

export const UI = (): React.JSX.Element => {
	const { filters } = useFilterTasks();

	const tabs = [
		{ title: "Tasks", view: Tasks },
		{ title: "Rewards", view: Rewards },
		{ title: "History", view: History },
	];

	return (
		<FiltersContext.Provider value={filters}>
			<Tabs tabs={tabs} />
		</FiltersContext.Provider>
	);
};
