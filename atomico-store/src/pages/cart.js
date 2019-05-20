import { h } from "@atomico/core";
import AtomicoStoreButton from "../web-components/atomico-store-button";
import AtomicoStoreCart from "../web-components/atomico-store-card";

export default function({ products, remCart }) {
	return (
		<section>
			{products.map(({ title, id, price, count }) => (
				<AtomicoStoreCart key={id}>
					<p>
						<strong>{title}</strong> - {price} x {count}
					</p>
					<AtomicoStoreButton
						onClick={() => {
							remCart({ title, id, price });
						}}
					>
						remove to cart
					</AtomicoStoreButton>
				</AtomicoStoreCart>
			))}
		</section>
	);
}
