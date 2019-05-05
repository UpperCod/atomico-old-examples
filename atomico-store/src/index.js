import { useReducer } from "@atomico/core";
import { Router, useRedirect, useRoute, Root } from "@atomico/router";
import { h, customElement } from "@atomico/element";
import { reducer, Actions } from "./reducer.js";
import AtomicoStoreHeader from "./components/atomico-store-header";
import AtomicoStoreButton from "./components/atomico-store-button";
import Products from "./pages/products";
import Cart from "./pages/cart";

function App({ products }) {
	let [cart, dispatch] = useReducer(reducer, []);
	let redirect = useRedirect();
	let [inRoute, params] = useRoute("/:page/:any...");
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
					onClick={() => redirect("/")}
					checked={params.page == "products"}
				>
					Products
				</AtomicoStoreButton>
				<AtomicoStoreButton
					counter={cart.reduce((total, { count }) => total + count, 0)}
					onClick={() => redirect("/cart")}
					checked={params.page == "cart"}
				>
					Cart
				</AtomicoStoreButton>
			</AtomicoStoreHeader>
			<Router>
				<Products
					path="/"
					products={products}
					addCart={data => {
						dispatch({
							type: Actions.ADD_CART,
							data
						});
					}}
				/>
				<Cart
					path="/cart"
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

function AtomicoStore({ products, location }) {
	return (
		<Root path={location}>
			<App products={products} />
		</Root>
	);
}

AtomicoStore.observables = {
	products: Array,
	location: String
};

customElement("atomico-store", AtomicoStore);
