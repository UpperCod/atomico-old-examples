import { h, customElement } from "@atomico/element";
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
