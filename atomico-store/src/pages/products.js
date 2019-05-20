import { h } from "@atomico/core";
import AtomicoStoreButton from "../web-components/atomico-store-button";
import AtomicoStoreCart from "../web-components/atomico-store-card";

export default function({ products, addCart }) {
	return (
		<section>
			{products.map(({ title, id, price }) => (
				<AtomicoStoreCart key={id}>
					<p>
						<strong>{title}</strong> - {price}
					</p>
					<AtomicoStoreButton
						onClick={() => {
							addCart({ title, id, price });
						}}
					>
						add to cart
					</AtomicoStoreButton>
				</AtomicoStoreCart>
			))}
		</section>
	);
}
