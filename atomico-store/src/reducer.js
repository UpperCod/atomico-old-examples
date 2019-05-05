export let Actions = {
	ADD_CART: Symbol("ADD_CART"),
	REM_CART: Symbol("REM_CART")
};

export function reducer(state, { type, data }) {
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
