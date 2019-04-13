import { h } from "@atomico/core";

export default function Header(props) {
	return (
		<header>
			<strong>{props.title}</strong> - <span>{props.price}</span>
		</header>
	);
}
