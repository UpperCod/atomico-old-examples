import { h, customElement } from "@atomico/element";

function Card({ labelButton }) {
	return (
		<host shadowDom>
			<style>{`
				:host {
					flex: 0%;
					padding: 1rem;
					box-sizing: border-box;
					margin: 1rem;
					background: white;
					border-radius: 5px;
					box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.05);
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;
				}
			`}</style>
			<slot />
		</host>
	);
}

Card.observables = {
	labelButton: String
};

export default customElement("atomico-store-card", Card);
