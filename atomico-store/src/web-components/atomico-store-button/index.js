import { h, customElement } from "atomico";
import style from "./style.css";

function Button({ checked, counter }) {
	return (
		<host shadowDom class={checked ? "checked" : ""}>
			<style>{style}</style>
			<slot />
			{counter > 0 && <div class="counter">{counter}</div>}
		</host>
	);
}

Button.observables = {
	checked: Boolean,
	counter: Number
};

export default customElement("atomico-store-button", Button);
