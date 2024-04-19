import React from "react";

import styles from "../styles.module.css";

type Props = { isRecur: boolean; setIsRecur: Function };

export default function RecurFilter(props: Props): React.JSX.Element {
	const { isRecur, setIsRecur } = props;

	return (
		<div className={styles.checkbox}>
			<input
				type="checkbox"
				name="is-recur"
				id="is-recur"
				checked={isRecur}
				onChange={() => setIsRecur(!isRecur)}
			/>

			<label htmlFor="is-recur">Is task recurring? (today)</label>
		</div>
	);
}
