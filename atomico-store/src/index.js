import { useReducer } from "@atomico/core";
import { Router, useRedirect, useRoute, Root } from "@atomico/router";
import { h, customElement } from "@atomico/element";
import { reducer, Actions } from "./reducer.js";
import AtomicoStoreHeader from "./components/atomico-store-header";
import AtomicoStoreButton from "./components/atomico-store-button";
import Products from "./pages/products";
import Cart from "./pages/cart";

function AtomicoStore({ products, location }) {
	let [cart, dispatch] = useReducer(reducer, []);
	let redirect = useRedirect();
	let [inRoute, params] = useRoute(`${location}/:page/:any...`);
	return (
		<host shadowDom>
			<style>
				{`
						:host {
							width: 100%;
							height: 100%;
							display: block;
							background: #f9fafc;
						}
					`}
			</style>
			<AtomicoStoreHeader>
				<AtomicoStoreButton
					onClick={() => redirect(location)}
					checked={params.page == null}
				>
					Products
				</AtomicoStoreButton>
				<AtomicoStoreButton
					counter={cart.reduce((total, { count }) => total + count, 0)}
					onClick={() => redirect(`${location}/cart`)}
					checked={params.page == "cart"}
				>
					Cart
				</AtomicoStoreButton>
			</AtomicoStoreHeader>
			<Router>
				<Products
					path={location}
					products={products}
					addCart={data => {
						dispatch({
							type: Actions.ADD_CART,
							data
						});
					}}
				/>
				<Cart
					path={`${location}/cart`}
					products={cart}
					remCart={data => {
						dispatch({
							type: Actions.REM_CART,
							data
						});
					}}
				/>
			</Router>
		</host>
	);
}

AtomicoStore.observables = {
	products: Array,
	location: String
};

customElement("atomico-store", AtomicoStore);
