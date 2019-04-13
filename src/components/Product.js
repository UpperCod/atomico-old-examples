import { h } from "@atomico/core";
import Box from "../components/Box";
import Header from "../components/Header";
import Button from "../components/Button";

export default function Product(props) {
	return (
		<Box>
			<Header
				title={props.title}
				price={props.price + (props.count != null ? " x " + props.count : "")}
			/>
			<Button dark onClick={props.buttonHandler}>
				{props.buttonLabel}
			</Button>
		</Box>
	);
}
