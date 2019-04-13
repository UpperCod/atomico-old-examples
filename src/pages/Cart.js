import { h } from "@atomico/core";
import Product from "../components/Product";

export default function Cart({ products, buttonHandler }) {
	return (
		<section shadowDom>
			<style>{`
      :host{
        display:flex;
        flex-flow:column;
      }
      `}</style>
			{products.map(props => (
				<Product
					{...props}
					buttonLabel="Remove from cart"
					buttonHandler={() => buttonHandler(props)}
				/>
			))}
		</section>
	);
}
