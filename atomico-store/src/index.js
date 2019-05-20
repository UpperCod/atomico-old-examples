import { useReducer } from "@atomico/core";
import { Router, useRedirect, useRoute } from "@atomico/router";
import { h, customElement } from "@atomico/element";
import { lazy } from "@atomico/lazy";

import { reducer, Actions } from "./reducer.js";
import AtomicoStoreHeader from "./web-components/atomico-store-header";
import AtomicoStoreButton from "./web-components/atomico-store-button";

import style from "./style.css";

let Products = lazy(() => import("./pages/products"));
let Cart = lazy(() => import("./pages/cart"));

function AtomicoStore({ products, location = "/" }) {
	let [cart, dispatch] = useReducer(reducer, []);
	let redirect = useRedirect();
	let [inRoute, params] = useRoute(`${location}/:page/:any...`);

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
					loading="...loading!"
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
					loading="...loading!"
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
