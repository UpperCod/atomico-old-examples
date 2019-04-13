import Element from "@atomico/element";
import { h, useReducer } from "@atomico/core";
import {
	useRoute,
	useRedirect,
	Router,
	options,
	useParentPath
} from "@atomico/router";
import Button from "./components/Button";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { reducer, Actions } from "./reducer";

options.setRootDefault(location.pathname);

let defaultProducts = [
	{ id: "p1", title: "Gaming Mouse", price: 29.99 },
	{ id: "p2", title: "Harry Potter 3", price: 9.99 },
	{ id: "p3", title: "Used plastic bottle", price: 0.99 },
	{ id: "p4", title: "Half-dried plant", price: 2.99 }
];

function formatMapCart(cart) {
	let length = 0,
		products = [...cart].map(([id, props]) => {
			length += props.count;
			return props;
		});
	return { length, products };
}

class AtomicoShop extends Element {
	render({ products = defaultProducts }) {
		let redirect = useRedirect();
		let [inRoot] = useRoute("/");
		let [inCart] = useRoute("/cart");
		let [cart, dispatch] = useReducer(reducer, new Map());

		cart = formatMapCart(cart);

		return (
			<host shadowDom>
				<style>{`
				@import url('https://fonts.googleapis.com/css?family=Muli');
				:host{
					width:100%;
					height:100%;
					font-family: 'Muli', sans-serif;
					display:flex;
					flex-flow:column wrap;
					background:#f1f1f9;					
				}
				#header{
					background:black;
					display:flex;
					justify-content:center;
					align-items:center;
					padding : .5rem;
					box-sizing:border-box;
				}
				#view{
					flex:0%;
				}
				`}</style>
				<header id="header">
					<Button onClick={() => redirect("/")} checked={inRoot}>
						Products
					</Button>
					<Button onClick={() => redirect("/cart")} checked={inCart}>
						Cart ({cart.length})
					</Button>
				</header>
				<Router>
					<Home
						path="/"
						products={products}
						buttonHandler={data => {
							dispatch({
								data,
								type: Actions.INSERT
							});
						}}
					/>
					<Cart
						path="/cart"
						products={cart.products}
						buttonHandler={data => {
							dispatch({
								data,
								type: Actions.DELETE
							});
						}}
					/>
				</Router>
			</host>
		);
	}
}

customElements.define("atomico-shop", AtomicoShop);
