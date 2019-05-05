import { h, customElement } from "@atomico/element";

function Button({ checked, counter }) {
	return (
		<host shadowDom class={checked ? "checked" : ""}>
			<style>
				{`
					:host {
						padding: 0.25rem 1rem;
						border-radius: 5px;
						cursor: pointer;
						display: inline-flex;
						align-items: center;
						background: var(--theme-atomico-dark, black);
						color: var(--theme-atomico-white, white);
					}
					:host(.checked) {
						background: var(--theme-atomico-white, white);
						color: var(--theme-atomico-dark, black);
					}

					.counter {
						width: 16px;
						height: 16px;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 10px;
						font-weight: bold;
						margin-left: 0.5rem;
						background: var(--theme-atomico-white, white);
						color: var(--theme-atomico-dark, black);
					}

					:host(.checked) .counter {
						background: var(--theme-atomico-dark, black);
						color: var(--theme-atomico-white, white);
					}
				`}
			</style>
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
