import { h, customElement } from "atomico";
import style from "./style.css";

function Card({ labelButton }) {
	return (
		<host shadowDom>
			<style>{style}</style>
			<slot />
		</host>
	);
}

Card.observables = {
	labelButton: String
};

export default customElement("atomico-store-card", Card);
