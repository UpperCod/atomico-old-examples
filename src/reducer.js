export let Actions = {
	INSERT: "INSERT",
	DELETE: "DELETE"
};

export function reducer(state, { type, data }) {
	switch (type) {
		case Actions.INSERT: {
			let nextState = new Map(state),
				{ count } = nextState.get(data.id) || { count: 0 };
			count++;
			return nextState.set(data.id, {
				...data,
				count
			});
		}
		case Actions.DELETE: {
			let nextState = new Map(state),
				{ count } = nextState.get(data.id) || {};
			if (count) {
				count--;
				if (count == 0) {
					nextState.delete(data.id);
				} else {
					nextState.set(data.id, {
						...data,
						count
					});
				}
				return nextState;
			}
			return state;
		}
		default:
			return state;
	}
}
