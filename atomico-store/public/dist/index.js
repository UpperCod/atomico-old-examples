import { a as useMemo, b as toList, c as createElement, d as useState, e as useEffect, f as customElement, g as useReducer, h as AtomicoStoreButton } from './chunk-edfac312.js';

let options = {
	/**
	 * @return {string} pathname
	 */
	pathname() {
		return location.pathname;
	},
	/**
	 * Dispatch history a new pathname
	 * @type {Redirect}
	 */
	redirect(pathname) {
		if (pathname == options.pathname()) return;
		history.pushState({}, "history", pathname);
		//history.go(history.length);
		window.dispatchEvent(new PopStateEvent("popstate"));
	},
	subscribe(handler) {
		window.addEventListener("popstate", handler);
		return () => window.removeEventListener("popstate", handler);
	}
};

let FOLDERS = /([^\/]+)/g;
let FOLDER = "[^\\/]";
let SPLIT = "(?:\\/){0,1}";
let PARAM = /^(:)(\w+)(\?|(\.){3}){0,1}/;
let PARAMS_EMPTY = {};
let MEMO = {};

function format(path) {
	return path.replace(/(\/){2,}/g, "/").replace(/([^\/]+)\/$/, "$1");
}

function parse(string) {
	let folders = string.match(FOLDERS) || [""];
	let params = [];
	let regexp = new RegExp(
		"^" +
			folders
				.map(folder => {
					let [string, param, field, type] = folder.match(PARAM) || [];
					if (param) {
						params.push(field);
						if (type === "...") {
							return `(.*)`;
						} else if (type === "?") {
							return `${SPLIT}(${FOLDER}*)`;
						} else {
							return `\\/(${FOLDER}+)`;
						}
					} else {
						return `\\/(?:${folder
							.replace(/(\.|\-)/g, "\\$1")
							.replace(/\*/g, FOLDER + "+")
							.replace(/\((?!\?\:)/g, "(?:")})`;
					}
				})
				.join("") +
			"$",
		"i"
	);

	return { regexp, params, logs: {} };
}
/**
 * permite comparar un patron de captura vs un ruta de entrada
 * @param {string} path - ruta de patron de captura
 * @param {string} value  - ruta de comparacion a patron
 * @return {array} - [ inRoute:boolean, params:object ];
 */
function match(path, value) {
	path = format(path);
	value = format(value);
	if (!MEMO[path]) {
		MEMO[path] = parse(path);
	}
	let { regexp, params, logs } = MEMO[path];
	if (logs[value]) {
		return logs[value];
	}
	let vs = value.match(regexp);
	return (logs[value] = [
		vs ? true : false,
		vs
			? vs.slice(1).reduce((next, value, index) => {
					next[params[index] || index] = value;
					return next;
			  }, {})
			: PARAMS_EMPTY
	]);
}

function useHistory() {
	let pathname = options.pathname();
	let [state, setState] = useState({ pathname });

	useEffect(() => {
		function handler() {
			let pathname = options.pathname();
			if (state.pathname != pathname) {
				state.pathname = pathname;
				setState(state);
			}
		}
		return options.subscribe(handler);
	}, []);
	return [pathname, options.redirect];
}

function useMatchRoute(path) {
	return match(path, options.pathname());
}

function useRoute(path) {
	useHistory();
	return useMatchRoute(path);
}

function useRedirect(path) {
	let redirect = options.redirect;
	return useMemo(() => (path ? path => redirect(path) : redirect), [
		path,
		redirect
	]);
}

function Router({ children }) {
	let [pathname] = useHistory();
	let nextChild;
	let nextParams;

	children = useMemo(() => toList(children), [children]);

	let length = children.length;

	for (let i = 0; i < length; i++) {
		let child = children[i];
		let props = child.props;
		if (props.path) {
			let [inRoute, params] = match(child.props.path, pathname);
			if (inRoute) {
				nextChild = child;
				nextParams = params;
				break;
			}
		}
		if (child.props.default) {
			nextChild = child;
		}
	}

	if (nextChild) {
		let { type, props } = nextChild;
		let nextProps = { ...props, params: nextParams };
		delete nextProps.path;
		delete nextProps.default;
		return createElement(type, nextProps);
	}
}

/**
 * It allows to load a component asynchronously.
 * @param {Function} callback
 * @return {object}
 */
function lazy(callback) {
	return ({ loading, ...props }) => {
		let state = useImport(callback, props);

		if (state.wait) return;

		return state.loading
			? loading
			: typeof state.default == "function"
			? createElement(state.default, props)
			: state.default;
	};
}
/**
 * It allows to load a component asynchronously.
 * @param {Function} callback
 * @param {object} [props]
 */
function useImport(callback, props) {
	let [state, setState] = useState({ wait: true });
	useEffect(() => {
		let loading = true;
		callback(props).then(md => {
			loading && setState(md);

			loading = false;
		});
		fps(() => {
			loading && setState({ loading: true });
		});
		return () => (loading = false);
	}, [callback]);
	return state;
}

function fps(callback, count = 3) {
	count-- ? requestAnimationFrame(() => fps(callback, count)) : callback();
}

let Actions = {
	ADD_CART: Symbol("ADD_CART"),
	REM_CART: Symbol("REM_CART")
};

function reducer(state, { type, data }) {
	switch (type) {
		case Actions.ADD_CART:
			let include;
			state = state.map(product => {
				if (product.id == data.id) {
					include = true;
					return {
						...product,
						count: product.count + 1
					};
				} else {
					return product;
				}
			});
			return include ? state : state.concat({ ...data, count: 1 });
		case Actions.REM_CART:
			return state
				.map(product =>
					product.id == data.id
						? { ...product, count: product.count - 1 }
						: product
				)
				.filter(product => product.count > 0);
	}
}

var style = ":host{width:100%;background:var(--theme-atomico-dark,#000);display:flex;justify-content:center;align-items:center;padding:.75rem;box-sizing:border-box}";

function Header() {
	return (
		createElement('host', { shadowDom: true,}
, createElement('style', null, style)
, createElement('slot', null )
)
	);
}

var AtomicoStoreHeader = customElement("atomico-store-header", Header);

var style$1 = ":host{width:100%;height:100%;display:block;background:#f9fafc}";

let Products = lazy(() => import('./products-03654883.js'));
let Cart = lazy(() => import('./cart-04aba04e.js'));

function AtomicoStore({ products, location = "/" }) {
	let [cart, dispatch] = useReducer(reducer, []);
	let redirect = useRedirect();
	let [inRoute, params] = useRoute(`${location}/:page/:any...`);

	return (
		createElement('host', { shadowDom: true,}
, createElement('style', null, style$1)
, createElement(AtomicoStoreHeader, null
, createElement(AtomicoStoreButton, {
					onClick: () => redirect(location),
					checked: params.page == null,}
				, "Products"

)
, createElement(AtomicoStoreButton, {
					counter: cart.reduce((total, { count }) => total + count, 0),
					onClick: () => redirect(`${location}cart`),
					checked: params.page == "cart",}
				, "Cart"

)
)
, createElement(Router, null
, createElement(Cart, {
					path: `${location}/cart`,
					loading: "...loading!",
					products: cart,
					remCart: data => {
						dispatch({
							type: Actions.REM_CART,
							data
						});
					},}
				)
, createElement(Products, {
					default: true,
					loading: "...loading!",
					products: products,
					addCart: data => {
						console.log(dispatch);
						dispatch({
							type: Actions.ADD_CART,
							data
						});
					},}
				)
)
)
	);
}

AtomicoStore.observables = {
	products: Array,
	location: String
};

customElement("atomico-store", AtomicoStore);
//# sourceMappingURL=index.js.map
