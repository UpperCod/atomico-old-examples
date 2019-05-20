import { useReducer } from "@atomico/core";
import { Router, useRedirect, useRoute } from "@atomico/router";
import { h, customElement } from "@atomico/element";

import { reducer, Actions } from "./reducer.js";
import AtomicoStoreHeader from "./web-components/atomico-store-header";
import AtomicoStoreButton from "./web-components/atomico-store-button";

import Products from "./pages/products";
import Cart from "./pages/cart";

import style from "./style.css";

function AtomicoStore({ products, location = "/" }) {
	let [cart, dispatch] = useReducer(reducer, []);
	let redirect = useRedirect();
	let [inRoute, params] = useRoute(`${location}/:page/:any...`);

	console.log(products);
	return (
		<host shadowDom>
			<style>{style}</style>
			<AtomicoStoreHeader>
				<AtomicoStoreButton
					onClick={() => redirect(location)}
					checked={params.page == null}
				>
					Products
				</AtomicoStoreButton>
				<AtomicoStoreButton
					counter={cart.reduce((total, { count }) => total + count, 0)}
					onClick={() => redirect(`${location}cart`)}
					checked={params.page == "cart"}
				>
					Cart
				</AtomicoStoreButton>
			</AtomicoStoreHeader>
			<Router>
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
				<Products
					default
					products={products}
					addCart={data => {
						console.log(dispatch);
						dispatch({
							type: Actions.ADD_CART,
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
