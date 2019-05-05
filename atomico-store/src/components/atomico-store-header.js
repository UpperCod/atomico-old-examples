import { h, customElement } from "@atomico/element";

function Header() {
	return (
		<host shadowDom>
			<style>
				{`
					:host {
						width: 100%;
						background: var(--theme-atomico-dark, black);
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 0.75rem;
						box-sizing: border-box;
					}
				`}
			</style>
			<slot />
		</host>
	);
}

export default customElement("atomico-store-header", Header);
