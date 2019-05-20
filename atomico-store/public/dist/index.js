/**
 * @param {VnodeType} type
 * @param {VnodeProps} [props]
 * @param {Vnode|Vnode[]} [children]
 * @returns {Vnode}
 **/
function createElement(type, props, children) {
	props = props || {};
	if (arguments.length > 3) {
		children = [children];
		for (let i = 3; i < arguments.length; i++) {
			children.push(arguments[i]);
		}
	}
	if (children != null) {
		props.children = children;
	}

	let vnode = { type, props },
		key = props.key;
	if (key != null) {
		vnode.key = "" + key;
	}
	/**@type {Vnode} */
	return vnode;
}
/**
 * Create or maintain a vnode, if this is boolean,
 * string or null returns a text type vnode
 * @param {(Vnode|string|null|boolean)} value
 * @returns {Vnode}
 **/
function toVnode(value) {
	if (value == null || typeof value == "boolean") value = "";

	if (typeof value == "string" || typeof value == "number") {
		return createElement(null, null, "" + value);
	}

	return value;
}

/**
 * @typedef {(Object<string,any>)} VnodeProps;
 *
 * @typedef {(Function|string)} VnodeType;
 *
 * @typedef {{type:VnodeType,props:VnodeProps}} Vnode
 **/

const ARRAY_EMPTY = [];
const OBJECT_EMPTY = {};

const STATE = Symbol("Atomico.state");
const NODE_TYPE = "localName";

const NODE_HOST = "host";

const COMPONENT_CREATE = 0x61;
const COMPONENT_UPDATE = 0x74;
const COMPONENT_CREATED = 0x4f;
const COMPONENT_UPDATED = 0x4d;
const COMPONENT_CLEAR = 0x49;
const COMPONENT_REMOVE = 0x43;

const IGNORE_PROPS = {
	children: 1
};

const IGNORE_CHILDREN = {
	innerHTML: 1,
	textContent: 1,
	contenteditable: 1
};

const HYDRATE_PROPS = {
	className: 1,
	id: 1,
	checked: 1,
	value: 1,
	selected: 1
};

const MEMO_EVENT_NAME = {};
const MEMO_CSS_PROPS = {};

/**
 * Return if value is array
 * @param {*}
 * @return {boolean}
 */
function isArray(value) {
	return Array.isArray(value);
}
/**
 * compare 2 array
 * @param {array} before
 * @param {array} after
 * @example
 * isEqualArray([1,2,3,4],[1,2,3,4]) // true
 * isEqualArray([1,2,3,4],[1,2,3])   // false
 * isEqualArray([5,1,2,3],[1,2,3,5]) // false
 * isEqualArray([],[]) // true
 * @returns {boolean}
 */
function isEqualArray(before, after) {
	let length = before.length;
	if (length !== after.length) return false;
	for (let i = 0; i < length; i++) {
		if (before[i] !== after[i]) return false;
	}
	return true;
}

function assign(master, commit) {
	for (let key in commit) {
		master[key] = commit[key];
	}
	for (let i = 2; i < arguments.length; i++) assign(master, arguments[i]);
	return master;
}

let defer = Promise.prototype.then.bind(Promise.resolve());

function isFunction(value) {
	return typeof value == "function";
}

/**
 *
 * @param {import("./render").HTMLNode} node
 * @param {Object} props
 * @param {Object} nextProps
 * @param {boolean} isSvg
 * @param {Object} handlers
 * @param {any} [bindEvent]
 **/
function diffProps(node, props, nextProps, isSvg, handlers, bindEvent) {
	props = props || {};

	for (let key in props) {
		if (IGNORE_PROPS[key]) continue;
		if (!(key in nextProps)) {
			setProperty(node, key, props[key], null, isSvg, handlers);
		}
	}
	let ignoreChildren;
	for (let key in nextProps) {
		if (IGNORE_PROPS[key]) continue;
		setProperty(
			node,
			key,
			props[key],
			nextProps[key],
			isSvg,
			handlers,
			bindEvent
		);
		ignoreChildren = ignoreChildren || IGNORE_CHILDREN[key];
	}
	return ignoreChildren;
}

function setProperty(
	node,
	key,
	prevValue,
	nextValue,
	isSvg,
	handlers,
	bindEvent
) {
	key = key == "class" && !isSvg ? "className" : key;
	// define empty value
	prevValue = prevValue == null ? null : prevValue;
	nextValue = nextValue == null ? null : nextValue;

	if (key in node && HYDRATE_PROPS[key]) {
		prevValue = node[key];
	}

	if (nextValue === prevValue) return;

	if (
		key[0] == "o" &&
		key[1] == "n" &&
		(isFunction(nextValue) || isFunction(prevValue))
	) {
		setEvent(node, key, nextValue, handlers, bindEvent);
		return;
	}

	switch (key) {
		case "ref":
			if (nextValue) nextValue.current = node;
			break;
		case "style":
			setStyle(node, prevValue || node.style.cssText, nextValue);
			break;
		case "shadowDom":
			if ("attachShadow" in node) {
				if (
					(node.shadowRoot && !nextValue) ||
					(!node.shadowRoot && nextValue)
				) {
					node.attachShadow({ mode: nextValue ? "open" : "closed" });
				}
			}
			break;
		case "key":
			key = "data-key";
			if (nextValue == null) {
				delete node.dataset.key;
			} else {
				node.dataset.key = nextValue;
			}
			break;
		default:
			if (!isSvg && key != "list" && key in node) {
				node[key] = nextValue == null ? "" : nextValue;
			} else if (nextValue == null) {
				node.removeAttribute(key);
			} else {
				node.setAttribute(key, nextValue);
			}
	}
}

/**
 *
 * @param {import("./render").HTMLNode} node
 * @param {string} type
 * @param {function} [nextHandler]
 * @param {object} handlers
 */
function setEvent(node, type, nextHandler, handlers, bindEvent) {
	// memorize the transformation
	if (!MEMO_EVENT_NAME[type]) {
		MEMO_EVENT_NAME[type] = type.slice(2).toLocaleLowerCase();
	}
	// get the name of the event to use
	type = MEMO_EVENT_NAME[type];
	// add handleEvent to handlers
	if (!handlers.handleEvent) {
		/**
		 * {@link https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler}
		 **/
		handlers.handleEvent = event => handlers[event.type].call(bindEvent, event);
	}
	if (nextHandler) {
		// create the subscriber if it does not exist
		if (!handlers[type]) {
			node.addEventListener(type, handlers);
		}
		// update the associated event
		handlers[type] = nextHandler;
	} else {
		// 	delete the associated event
		if (handlers[type]) {
			node.removeEventListener(type, handlers);
			delete handlers[type];
		}
	}
}
/**
 * define style as string inline,this generates less mutation
 * to the sun and cleans the previously defined properties.
 * @param {import("./render").HTMLNode} node
 * @param {(string|object)} prevValue
 * @param {(string|object)} nextValue
 */
function setStyle(node, prevValue, nextValue) {
	let prevCss = prevValue,
		nextCss = nextValue;
	if (typeof nextCss == "object") {
		nextCss = "";
		for (let key in nextValue) {
			if (!nextValue[key]) continue;
			// memorizes the transformations associated with CSS properties
			if (!MEMO_CSS_PROPS[key]) {
				MEMO_CSS_PROPS[key] = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			}
			nextCss += `${MEMO_CSS_PROPS[key]}:${nextValue[key]};`;
		}
	}
	if (prevCss != nextCss) {
		node.style.cssText = nextCss;
	}
}

/**
 * @type {ComponentSnap}
 */
let CURRENT_COMPONENT;
/**
 * @type {number}
 */
let CURRENT_COMPONENT_KEY_HOOK;
/**
 * Returns the concurrent component running
 * @returns {ComponentSnap}
 */
function getCurrentComponent() {
	if (!CURRENT_COMPONENT) {
		throw new Error(
			"the hooks can only be called from an existing functional component in the diff queue"
		);
	}
	return CURRENT_COMPONENT;
}
/**
 * Create or recover, the current state according to the global index
 * associated with the component
 * @param {Reducer} [reducer]
 * @param {*} state
 * @return {Hook};
 */
function useHook(reducer, state) {
	let component = getCurrentComponent().component;
	let index = CURRENT_COMPONENT_KEY_HOOK++;
	/**@type {Hook} */
	let hook;
	let isCreate;

	if (!component.hooks[index]) {
		isCreate = true;
		component.hooks[index] = [
			state,
			action => {
				if (hook[2]) {
					hook[0] = hook[2](hook[0], action);
				}
			}
		];
	}
	hook = component.hooks[index];
	hook[2] = reducer;
	if (isCreate) hook[1]({ type: COMPONENT_CREATE });
	return hook;
}

/**
 * dispatches the state of the components to the hooks subscribed to the component
 * @param {ComponentSnap[]} components
 * @param {Action} action
 */
function dispatchComponents(components, action) {
	let length = components.length;
	for (let i = 0; i < length; i++) {
		let component = components[i],
			hooks = component.hooks,
			hooksLength = hooks.length;
		// Mark the component as deleted
		if (action.type === COMPONENT_REMOVE) {
			component.remove = true;
		}
		for (let i = 0; i < hooksLength; i++) {
			/**@type {Hook} */
			let hook = hooks[i];
			hook[1](action);
		}
	}
}
/**
 * this function allows creating a block that analyzes the tag
 * defined as a function, in turn creates a global update scope for hook management.
 * @param {import("./render").ConfigRender} config - name of space to store the components
 * @param {boolean} isSvg - inherit svg behavior
 */
function createComponent(config, isSvg) {
	/**@type {ComponentSnap[]} */
	let components = [];
	/**@type {Element} */
	let host;
	/**
	 * This function allows reducing the functional components based on
	 * their return, in turn creates a unique state for each component
	 * according to a depth index
	 * @param {Vnode} vnode
	 * @param {Context} context
	 * @param {number} deep - incremental index that defines the position of the component in the store
	 */
	function nextComponent(vnode, deep) {
		// if host does not exist as a node, the vnode is not reduced
		if (!host) return;
		vnode = toVnode(vnode);
		// if it is different from a functional node, it is sent to diff again
		if (!isFunction(vnode.type)) {
			dispatchComponents(components.splice(deep), {
				type: COMPONENT_REMOVE
			});
			host = diff(config, host, vnode, isSvg, updateComponent);
			// if the components no longer has a length, it is assumed that the updateComponent is no longer necessary
			if (components.length) host[config.id].updateComponent = updateComponent;

			return;
		}
		/**@type {ComponentSnap} */
		let component = components[deep] || {};
		/**
		 * @type {boolean} define whether the component is created or updated
		 */
		let isCreate;
		/**
		 * @type {boolean} Define whether the component should continue with the update
		 */
		let withNext;

		if (component.type != vnode.type) {
			// the elimination is sent to the successors of the previous component
			dispatchComponents(components.splice(deep), {
				type: COMPONENT_REMOVE
			});
			// stores the state of the component
			components[deep] = assign(
				{
					hooks: [],
					ref: {
						get current() {
							return host;
						}
					}
				},
				vnode
			);
			isCreate = true;
			withNext = true;
		}

		component = components[deep];
		/**@type {Vnode} */
		let nextProps = vnode.props;
		/**@type {Vnode} */
		let prevProps = component.props;

		// Compare previous props with current ones
		if (!withNext) {
			let length = Object.keys(prevProps).length,
				nextLength = 0;
			// compare the lake of properties
			for (let key in nextProps) {
				nextLength++;
				if (nextProps[key] != prevProps[key]) {
					withNext = true;
					break;
				}
			}
			withNext = withNext || length != nextLength;
		}

		component.props = nextProps;

		/**
		 * Create a snapshot of the current component
		 */
		function next() {
			if (component.remove) return host;

			CURRENT_COMPONENT = {
				component,
				/**
				 * updates the status of the component, forcing the update of this
				 */
				next() {
					if (!component.prevent) {
						component.prevent = true;
						defer(() => {
							component.prevent = false;
							next();
						});
					}
				}
			};

			CURRENT_COMPONENT_KEY_HOOK = 0;

			dispatchComponents([component], { type: COMPONENT_UPDATE });

			let vnextnode = component.type(component.props);
			// clean state constants
			CURRENT_COMPONENT = false;
			CURRENT_COMPONENT_KEY_HOOK = 0;

			nextComponent(vnextnode, deep + 1);

			dispatchComponents([component], {
				type: isCreate ? COMPONENT_CREATED : COMPONENT_UPDATED
			});

			isCreate = false;
		}
		if (withNext && !component.prevent) next();
	}
	/**
	 * allows to control HoCs and optimizes the executions
	 * of the components with the memo pattern
	 * @param {string} type - action to execute
	 * @param {Element} nextHost
	 * @param {Vnode} vnode
	 * @returns {Element}
	 */
	function updateComponent(type, nextHost, vnode) {
		switch (type) {
			case COMPONENT_UPDATE:
				host = nextHost;
				nextComponent(vnode, 0);
				return host;
			case COMPONENT_CLEAR:
				dispatchComponents([].concat(components).reverse(), { type });
				break;
			case COMPONENT_REMOVE:
				host = false;
				dispatchComponents(components.reverse(), { type });
				components = [];
				break;
		}
	}

	return updateComponent;
}

/**
 *
 * @typedef {{type:string}} Action
 *
 * @typedef {function(Object,Number):any} sample
 *
 * @typedef {function(Action):void} Dispatch
 *
 * @typedef {function(any,Action)} Reducer
 *
 * @typedef {[ any, Dispatch, Reducer ]} Hook - **[ state, dispatch , reducer ]**;
 *
 * @typedef {(HTMLElement|SVGElement|Text)} Element
 *
 * @typedef {import("./vnode").Vnode} Vnode
 *
 * @typedef {Hook[]} Hooks
 *
 * @typedef {object} ComponentSnap
 * @property {{current:(HTMLElement|SVGElement)}} ref
 * @property {boolean} prevent
 * @property {Hooks} hooks
 * @property {Function} next
 * @property {Function} type
 * @property {import("./vnode").VnodeProps} props
 **/

/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} node
 * @param {import("./vnode").Vnode} nextVnode
 * @param {boolean} isSvg
 * @param {Function} currentUpdateComponent
 * @return {import("./render").HTMLNode}
 **/
function diff(config, node, nextVnode, isSvg, currentUpdateComponent) {
	let { vnode, updateComponent, handlers = {} } =
		(node && node[config.id]) || {};

	if (vnode == nextVnode) return node;

	vnode = vnode || { props: {} };

	let { type, props } = nextVnode,
		{ shadowDom, children } = props,
		isComponent = isFunction(type);

	isSvg = isSvg || type == "svg";
	if (isComponent && !updateComponent) {
		updateComponent = createComponent(config, isSvg);
	}
	if (!isComponent && type != NODE_HOST && getNodeName(node) !== type) {
		let nextNode = createNode(type, isSvg),
			parent = node && node.parentNode;

		if (parent) {
			unmount(config, node, true, currentUpdateComponent);
			parent.replaceChild(nextNode, node);
		}

		node = nextNode;
		handlers = {};
	}
	if (updateComponent && currentUpdateComponent != updateComponent) {
		return updateComponent(COMPONENT_UPDATE, node, nextVnode);
	} else if (type == null) {
		if (node.nodeValue != children) {
			node.nodeValue = children;
		}
	} else {
		let ignoreChildren = diffProps(
			node,
			vnode.props,
			nextVnode.props,
			isSvg,
			handlers,
			config.bind
		);
		if (!ignoreChildren && vnode.props.children != children) {
			diffChildren(
				config,
				shadowDom ? node.shadowRoot || node : node,
				children,
				isSvg
			);
		}
	}
	node[config.id] = { vnode: nextVnode, handlers };
	return node;
}
/**
 *
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} parent
 * @param {import("./vnode").Vnode[]} [nextChildren]
 * @param {boolean} isSvg
 */
function diffChildren(config, parent, nextChildren, isSvg) {
	let keyes = [],
		children = toList(nextChildren, false, keyes),
		childrenLenght = children.length;

	let childNodes = parent.childNodes,
		childNodesKeyes = {},
		childNodesLength = childNodes.length,
		withKeyes = keyes.withKeyes,
		index = withKeyes
			? 0
			: childNodesLength > childrenLenght
			? childrenLenght
			: childNodesLength;
	for (; index < childNodesLength; index++) {
		let childNode = childNodes[index],
			key = index;
		if (withKeyes) {
			key = childNode.dataset.key;
			if (keyes.indexOf(key) > -1) {
				childNodesKeyes[key] = childNode;
				continue;
			}
		}
		unmount(config.id, childNode);
		index--;
		childNodesLength--;
		parent.removeChild(childNode);
	}
	for (let i = 0; i < childrenLenght; i++) {
		let child = children[i],
			indexChildNode = childNodes[i],
			key = withKeyes ? child.key : i,
			childNode = withKeyes ? childNodesKeyes[key] : indexChildNode;

		if (withKeyes && childNode) {
			if (childNode != indexChildNode) {
				parent.insertBefore(childNode, indexChildNode);
			}
		}

		let nextChildNode = diff(
			config,
			!childNode && isFunction(child.type) ? createNode(null) : childNode,
			child,
			isSvg
		);

		if (!childNode) {
			if (childNodes[i]) {
				parent.insertBefore(nextChildNode, childNodes[i]);
			} else {
				parent.appendChild(nextChildNode);
			}
		}
	}
}
/**
 * Remove the node and issue the deletion if it belongs to a component
 * @param {string} id
 * @param {import("./render").HTMLNode} node
 * @param {boolean} clear
 * @param {function} currentUpdateComponent
 */
function unmount(id, node, clear, currentUpdateComponent) {
	let { updateComponent } = node[id] || {},
		childNodes = node.childNodes,
		length = childNodes.length;
	if (updateComponent && updateComponent != currentUpdateComponent) {
		updateComponent(clear ? COMPONENT_CLEAR : COMPONENT_REMOVE);
	}
	for (let i = 0; i < length; i++) {
		unmount(id, childNodes[i]);
	}
}
/**
 *
 * @param {string} type
 * @param {boolean} isSvg
 * @returns {import("./render").HTMLNode}
 */
function createNode(type, isSvg) {
	let doc = document,
		nextNode;
	if (type != null) {
		nextNode = isSvg
			? doc.createElementNS("http://www.w3.org/2000/svg", type)
			: doc.createElement(type);
	} else {
		nextNode = doc.createTextNode("");
	}
	return nextNode;
}

/**
 * returns the localName of the node
 * @param {import("./render").HTMLNode} node
 */
function getNodeName(node) {
	if (!node) return;
	if (!node[NODE_TYPE]) {
		node[NODE_TYPE] = node.nodeName.toLowerCase();
	}
	let localName = node[NODE_TYPE];
	return localName == "#text" ? null : localName;
}
/**
 * generates a flatmap of nodes
 * @param {?Array} children
 * @param {function} [map]
 * @param {string[]} keyes
 * @param {import("./vnode").Vnode[]} list
 * @param {number} deep
 * @returns {import("./vnode").Vnode[]}
 */
function toList(children, map, keyes, list, deep = 0) {
	keyes = keyes || [];
	list = list || [];

	if (isArray(children)) {
		let length = children.length;
		for (let i = 0; i < length; i++) {
			toList(children[i], map, keyes, list, deep + 1);
		}
	} else {
		if (children == null && !deep) return ARRAY_EMPTY;
		let vnode = map ? map(children, list.length) : toVnode(children);
		if (!map) {
			if (typeof vnode == "object") {
				if (vnode.key != null) {
					if (keyes.indexOf(vnode.key) == -1) {
						keyes.push(vnode.key);
						keyes.withKeyes = true;
					}
				}
			}
		}
		list.push(vnode);
	}
	return list;
}

/**
 *
 * @param {import("./vnode").Vnode} vnode
 * @param {HTMLNode} parent
 * @param {Object} [options]
 **/
function render(vnode, parent, options = OBJECT_EMPTY) {
	/**@type {ConfigRender}*/
	let config = {
		id: options.id || STATE,
		bind: options.bind,
		host: options.host
	};

	vnode = toVnode(vnode);

	if (!config.host && vnode.type != NODE_HOST) {
		vnode = createElement(NODE_HOST, {}, vnode);
	}

	diff(config, parent, vnode);
}

function useState(initialState) {
	/**@type {RefUseState} */
	let ref = useHook(0, [])[0];
	if (!ref[1]) {
		let next = getCurrentComponent().next;
		ref.push(
			isFunction(initialState) ? initialState() : initialState,
			function setState(nextState) {
				ref[0] = isFunction(nextState) ? nextState() : nextState;
				next();
			}
		);
	}
	return ref;
}

function useEffect(callback, args) {
	useHook((state, action) => {
		switch (action.type) {
			case COMPONENT_CREATE:
				return { args };
			case COMPONENT_UPDATE:
			case COMPONENT_REMOVE:
				if (state.clear) {
					let next =
						action.type == COMPONENT_REMOVE ||
						(args && state.args ? !isEqualArray(args, state.args) : true);
					if (next) state.clear.then(handler => handler && handler());
				}
				return { args };
			case COMPONENT_CREATED:
			case COMPONENT_UPDATED:
				let next =
						action.type == COMPONENT_CREATED ||
						(args && state.args ? !isEqualArray(args, state.args) : true),
					clear = state.clear;
				if (next) {
					clear = defer(callback);
				}
				return { clear, args };
		}
		return state;
	});
}

function useMemo(callback, args) {
	let ref = useHook(0, [])[0];
	if (!ref[0] || (ref[0] && !isEqualArray(ref[0], args))) {
		ref[1] = callback();
	}
	ref[0] = args;
	return ref[1];
}

function useReducer(reducer, initialState) {
	/** @type {RefUseReducer} */
	let ref = useHook(0, [])[0];
	if (!ref.current) {
		let next = getCurrentComponent().next;
		ref.push(initialState, action => {
			ref[0] = ref[2](ref[0], action);
			next();
		});
	}
	ref[2] = reducer;
	return ref;
}

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
 * Applies JSON.parse to extract the real value of an attribute from a string.
 * @param {string} value
 * @returns {(boolean|string|number|Object|Array)}
 **/
function parse$1(value) {
	return JSON.parse(value);
}

class Element extends HTMLElement {
	constructor() {
		super();
		/**@type {Object<string,any>} */
		this.props = {};
		/**@type {Promise} */
		this.mounted = new Promise(resolve => (this.mount = resolve));
		/**@type {Promise} */
		this.unmounted = new Promise(resolve => (this.unmount = resolve));
	}
	connectedCallback() {
		this.mount();
	}
	disconnectedCallback() {
		this.unmount();
	}
	attributeChangedCallback(name, oldValue, value) {
		if (oldValue == value) return;
		this.setProperty(name, value);
	}
	static get observedAttributes() {
		let observables = this.observables || {},
			attributes = [],
			/**
			 * @param {string} - add the setter and getter to the constructor prototype
			 */
			proxy = (name, attr, type) => {
				Object.defineProperty(this.prototype, name, {
					set(value) {
						// the attributes of the Boolean type will always be reflected in Element
						if (type === Boolean) {
							let state = this.hasAttribute(attr);
							if ((value && state) || (!value && !state)) return;
							this[value ? "setAttribute" : "removeAttribute"](attr, "");
						} else {
							this.setProperty(name, value);
						}
					},
					get() {
						return this.props[name];
					}
				});
			};
		for (let key in observables) {
			let attr = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			attributes.push(attr);
			if (!(name in this.prototype)) proxy(key, attr, observables[key]);
		}
		return attributes;
	}
	/**
	 * validate to `value`, and then deliver it to the` update` method.
	 * @param {name} name
	 * @param {*} value
	 */
	setProperty(name, value) {
		name = name.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
		let { observables } = this.constructor,
			error,
			type = observables[name];
		try {
			if (typeof value == "string") {
				switch (type) {
					case Boolean:
						value = parse$1(value || "true") == true;
						break;
					case Number:
						value = Number(value);
						break;
					case Object:
					case Array:
						value = parse$1(value);
						break;
					case Function:
						value = window[value];
						break;
				}
			}
		} catch (e) {
			error = true;
		}
		if (
			(!error && {}.toString.call(value) == `[object ${type.name}]`) ||
			value == null
		) {
			if (this.props[name] !== value) this.update({ [name]: value });
		} else {
			throw `the observable [${name}] must be of the type [${type.name}]`;
		}
	}
}

class Element$1 extends Element {
	constructor() {
		super();
		/**@type {boolean} */
		let prevent;
		/**
		 * @namespace
		 * @property {string} id - identifier to store the state of the virtual-dom
		 * @property {HTMLElement} bind - allows bindear events defining as context the same customElement
		 * @property {boolean} host - allows to enable control over the main container, in this case the customElement
		 */
		let options = {
			id: Symbol("state"),
			bind: this,
			host: true
		};
		/**
		 * add support {@link https://developer.mozilla.org/es/docs/Web/API/CSSStyleSheet}
		 */
		let { styles } = this.constructor;
		this.render = this.render.bind(this);
		let nextProps = {};
		/**
		 * @param {Object<string,any>} - Properties to update the component
		 */
		this.update = props => {
			for (let key in props) nextProps[key] = props[key];
			if (!prevent) {
				prevent = true;
				this.mounted.then(() => {
					let props = (this.props = { ...this.props });
					for (let key in nextProps) {
						let value = nextProps[key];
						if (value == null) {
							delete props[key];
						} else {
							props[key] = nextProps[key];
						}
					}
					nextProps = {};
					render(createElement(this.render, props), this, options);
					prevent = false;
					if (styles && this.shadowRoot) {
						this.shadowRoot.adoptedStyleSheets = styles;
						styles = null;
					}
				});
			}
		};

		this.unmounted.then(() => render("", this, options));

		this.update();
	}
}
/**
 * @param {Function} component
 * @example
 * // define a functional component
 * function MyWc(props){}
 * // define the observables of the component
 * MyWc.observables = {value:String}
 * // when using the toClass function the functional component will be a class
 * customElements.define("my-wc",createClass(MyWc));
 */
function createClass(component) {
	let CustomElement = class extends Element$1 {};
	CustomElement.prototype.render = component;
	CustomElement.observables = component.observables;
	CustomElement.styles = component.styles;
	return CustomElement;
}
/**
 * register the component, be it a class or function
 * @param {string} tagName
 * @param {Function} component
 * @return {Object} returns a jsx component
 */
function customElement(tagName, component) {
	customElements.define(
		tagName,
		component instanceof Element$1 ? component : createClass(component)
	);
	return props => createElement(tagName, props);
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

var style$1 = ":host{padding:.25rem 1rem;border-radius:5px;cursor:pointer;display:inline-flex;align-items:center;background:var(--theme-atomico-dark,#000);color:var(--theme-atomico-white,#fff)}.counter,:host(.checked){background:var(--theme-atomico-white,#fff);color:var(--theme-atomico-dark,#000)}.counter{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-left:.5rem}:host(.checked) .counter{background:var(--theme-atomico-dark,#000);color:var(--theme-atomico-white,#fff)}";

function Button({ checked, counter }) {
	return (
		createElement('host', { shadowDom: true, class: checked ? "checked" : "",}
, createElement('style', null, style$1)
, createElement('slot', null )
, counter > 0 && createElement('div', { class: "counter",}, counter)
)
	);
}

Button.observables = {
	checked: Boolean,
	counter: Number
};

var AtomicoStoreButton = customElement("atomico-store-button", Button);

var style$2 = ":host{flex:0%;padding:1rem;box-sizing:border-box;margin:1rem;background:#fff;border-radius:5px;box-shadow:0 6px 12px rgba(0,0,0,.05);display:flex;align-items:center;justify-content:space-between;font-size:14px}";

function Card({ labelButton }) {
	return (
		createElement('host', { shadowDom: true,}
, createElement('style', null, style$2)
, createElement('slot', null )
)
	);
}

Card.observables = {
	labelButton: String
};

var AtomicoStoreCart = customElement("atomico-store-card", Card);

function Products({ products, addCart }) {
	return (
		createElement('section', null
, products.map(({ title, id, price }) => (
				createElement(AtomicoStoreCart, { key: id,}
, createElement('p', null
, createElement('strong', null, title), " - "  , price
)
, createElement(AtomicoStoreButton, {
						onClick: () => {
							addCart({ title, id, price });
						},}
					, "add to cart"

)
)
			))
)
	);
}

function Cart({ products, remCart }) {
	return (
		createElement('section', null
, products.map(({ title, id, price, count }) => (
				createElement(AtomicoStoreCart, { key: id,}
, createElement('p', null
, createElement('strong', null, title), " - "  , price, " x "  , count
)
, createElement(AtomicoStoreButton, {
						onClick: () => {
							remCart({ title, id, price });
						},}
					, "remove to cart"

)
)
			))
)
	);
}

var style$3 = ":host{width:100%;height:100%;display:block;background:#f9fafc}";

function AtomicoStore({ products, location = "/" }) {
	let [cart, dispatch] = useReducer(reducer, []);
	let redirect = useRedirect();
	let [inRoute, params] = useRoute(`${location}/:page/:any...`);

	console.log(products);
	return (
		createElement('host', { shadowDom: true,}
, createElement('style', null, style$3)
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
