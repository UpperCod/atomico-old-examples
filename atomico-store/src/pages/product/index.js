import { h } from "atomico";
import AtomicoStoreButton from "../../web-components/atomico-store-button";
import AtomicoStoreCart from "../../web-components/atomico-store-card";

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

console.log("\x1b[0m");
console.log("\x1b[7m  GZIP    BROTLI    FILE  ");
console.log("\x1b[0m  40.20KB    40.00KB    index.js");
console.log("\x1b[0m  50.20KB    50.00KB    index.js");
console.log("\x1b[0m  90.40KB    90.00KB");
console.log("\x1b[0m");
