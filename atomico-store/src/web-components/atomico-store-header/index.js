import { h, customElement } from "atomico";
import style from "./style.css";
function Header() {
	return (
		<host shadowDom>
			<style>{style}</style>
			<slot />
		</host>
	);
}

export default customElement("atomico-store-header", Header);
