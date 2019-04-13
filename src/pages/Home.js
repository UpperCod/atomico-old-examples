import { h } from "@atomico/core";
import Product from "../components/Product";

export default function Home({ products, buttonHandler }) {
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
					buttonLabel="add to cart"
					buttonHandler={() => buttonHandler(props)}
				/>
			))}
		</section>
	);
}
