/**
 * @typedef {(Object<string,any>)} VnodeProps;
 * @typedef {(Function|string)} VnodeType;
 * @typedef {{type:VnodeType,props:VnodeProps}} Vnode
 **/

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

const ARRAY_EMPTY = [];
const EVENT_ALIAS = {};
const OBJECT_EMPTY = {};
const CONTEXT = "@ctx.";

const STATE = "@state";
const NODE_TYPE = "@type";

const NODE_HOST = "host";

const COMPONENT_CREATE = 0x61;
const COMPONENT_UPDATE = 0x74;
const COMPONENT_CREATED = 0x4f;
const COMPONENT_UPDATED = 0x4d;
const COMPONENT_CLEAR = 0x49;
const COMPONENT_REMOVE = 0x43;

const IGNORE = {
	children: 1
};

const IGNORE_CHILDREN = {
	innerHTML: 1,
	textContent: 1,
	contenteditable: 1
};

const CSS_PROPS = {};

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
		if (IGNORE[key]) continue;
		if (!(key in nextProps)) {
			setProperty(node, key, props[key], null, isSvg, handlers);
		}
	}
	let ignoreChildren;
	for (let key in nextProps) {
		if (IGNORE[key]) continue;
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
	if ((key == "checked" || key == "value") && key in node) {
		prevValue = node[key];
	}

	if (nextValue == prevValue) return;
	if (
		key[0] == "o" &&
		key[1] == "n" &&
		(typeof nextValue == "function" || typeof prevValue == "function")
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
			return;
		case "key":
			key = "data-key";
			if (nextValue == null) {
				delete node.dataset.key;
			} else {
				node.dataset.key = nextValue;
			}
			break;
		case "class":
		case "className":
			key = isSvg ? "class" : "className";
		default:
			if (key != "list" && !isSvg && key in node) {
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
	if (!EVENT_ALIAS[type]) {
		EVENT_ALIAS[type] = type.slice(2).toLocaleLowerCase();
	}
	// get the name of the event to use
	type = EVENT_ALIAS[type];
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
			if (!CSS_PROPS[key]) {
				CSS_PROPS[key] = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			}
			nextCss += `${CSS_PROPS[key]}:${nextValue[key]};`;
		}
	}
	if (prevCss != nextCss) {
		node.style.cssText = nextCss;
	}
}

/**
 * @typedef {(HTMLElement|SVGElement|Text)} Element
 *
 * @typedef {import("./vnode").Vnode} Vnode
 *
 * @typedef {Object<string,any>} Context
 *
 * @typedef {Function[]} Hooks
 *
 * @typedef {{prevent:boolean,context:Context,hooks:Hooks,next:Function,type:Function,props:import("./vnode").VnodeProps}} ComponentSnap
 *
 * @typedef {{type:string}} Action
 *
 **/

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
 * @param {(Function|null)} reducer
 * @param {*} state
 * @return {[*,(state:any,action:{type:any}]};
 */
function useHook(reducer, state) {
	let component = getCurrentComponent().component,
		index = CURRENT_COMPONENT_KEY_HOOK++,
		hook,
		isCreate;
	if (!component.hooks[index]) {
		isCreate = true;
		component.hooks[index] = { state };
	}
	hook = component.hooks[index];
	hook.reducer = reducer;
	if (isCreate) dispatchHook(hook, { type: COMPONENT_CREATE });
	return [hook.state, action => dispatchHook(hook, action)];
}
/**
 * dispatch the hook
 * @param {{reducer:(Function=),state}} hook
 * @param {Action} action
 */
function dispatchHook(hook, action) {
	if (hook.reducer) {
		hook.state = hook.reducer(hook.state, action);
	}
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
			dispatchHook(hooks[i], action);
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
	function nextComponent(vnode, context, deep) {
		// if host does not exist as a node, the vnode is not reduced
		if (!host) return;
		vnode = toVnode(vnode);
		// if it is different from a functional node, it is sent to diff again
		if (typeof vnode.type != "function") {
			dispatchComponents(components.splice(deep), {
				type: COMPONENT_REMOVE
			});
			host = diff(config, host, vnode, context, isSvg, updateComponent);
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
			components[deep] = assign({ hooks: [], context: {} }, vnode);
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

		withNext = component.context != context || withNext;

		component.props = nextProps;

		// the current context is componentsd in the cache
		component.context = context;

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

			nextComponent(vnextnode, component.context, deep + 1);

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
	 * @param {Context} context
	 * @returns {Element}
	 */
	function updateComponent(type, nextHost, vnode, context) {
		switch (type) {
			case COMPONENT_UPDATE:
				host = nextHost;
				nextComponent(vnode, context, 0);
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
 * @param {import("./render").ConfigRender} config
 * @param {import("./render").HTMLNode} node
 * @param {import("./vnode").Vnode} nextVnode
 * @param {object} context
 * @param {boolean} isSvg
 * @param {Function} currentUpdateComponent
 * @return {import("./render").HTMLNode}
 **/
function diff(
	config,
	node,
	nextVnode,
	context,
	isSvg,
	currentUpdateComponent
) {
	let { vnode, updateComponent, handlers = {} } =
		(node && node[config.id]) || {};

	if (vnode == nextVnode) return node;

	vnode = vnode || { props: {} };

	let { type, props } = nextVnode,
		{ shadowDom, children } = props,
		isComponent = typeof type == "function";

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
		return updateComponent(COMPONENT_UPDATE, node, nextVnode, context);
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
				context,
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
 * @param {Object} context
 * @param {boolean} isSvg
 */
function diffChildren(config, parent, nextChildren, context, isSvg) {
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
			nextSiblingChildNode = childNodes[i + 1],
			key = withKeyes ? child.key : i,
			childNode = withKeyes ? childNodesKeyes[key] : indexChildNode;

		if (withKeyes) {
			if (childNode != indexChildNode) {
				parent.insertBefore(childNode, indexChildNode);
			}
		}

		let nextChildNode = diff(
			config,
			!childNode && typeof child.type == "function"
				? createNode(null)
				: childNode,
			child,
			context,
			isSvg
		);

		if (!childNode) {
			if (nextSiblingChildNode) {
				parent.insertBefore(nextChildNode, nextSiblingChildNode);
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
	nextNode[NODE_TYPE] = type;
	return nextNode;
}

/**
 * returns the localName of the node
 * @param {import("./render").HTMLNode} node
 */
function getNodeName(node) {
	if (!node) return;
	// store the process locally in the node to avoid transformation
	if (!node[NODE_TYPE]) {
		let nodeName = node.nodeName.toLowerCase();
		node[NODE_TYPE] = nodeName == "#text" ? null : nodeName;
	}
	return node[NODE_TYPE];
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
 * @typedef {Object} ConfigRender
 * @property {string} id - namespace to store the state of the virtual-dom
 * @property {any} [bind] - Allows to bin events to a context this
 * @property {boolean} [host] - Allows a component to manipulate the main container
 **/

/**
 * @typedef {(HTMLElement|SVGElement|Text)} HTMLNode
 **/

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

	diff(config, parent, vnode, OBJECT_EMPTY);
}

function useState(initialState) {
	let next = getCurrentComponent().next,
		type = 0x9f;
	let [state, dispatch] = useHook((state, action) => {
		switch (action.type) {
			case COMPONENT_CREATE:
				return typeof initialState == "function"
					? initialState()
					: initialState;
			case type:
				let nextState = action.state;
				return typeof nextState == "function" ? nextState(state) : nextState;
		}
		return state;
	});
	return [
		state,
		state => {
			dispatch({ state, type });
			next();
		}
	];
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
				return assign({}, state, { args });
			case COMPONENT_CREATED:
			case COMPONENT_UPDATED:
				let next =
						action.type == COMPONENT_CREATED ||
						(args && state.args ? !isEqualArray(args, state.args) : true),
					clear = state.clear;
				if (next) {
					clear = defer(callback);
				}
				return assign({}, state, { clear, args });
		}
		return state;
	});
}

function useMemo(callback, args) {
	let [ref] = useHook(false, {});
	if (!ref.args) {
		ref.value = callback();
	} else {
		if (!isEqualArray(ref.args, args)) {
			ref.value = callback();
		}
	}
	ref.args = args;
	return ref.value;
}

function useReducer(reducer, initialState) {
	let next = getCurrentComponent().next,
		type = 0x9e;
	let [state, dispatch] = useHook((state, action) => {
		switch (action.type) {
			case COMPONENT_CREATE:
				return initialState;
			case type:
				return reducer(state, action.use);
		}
		return state;
	});
	return [
		state,
		use => {
			dispatch({ type, use });
			next();
		}
	];
}

/**
 * @typedef {import("./vnode").Vnode} Vnode
 */
/**@type {number} */
let counter = 0;
/**
 * @param {{id:string,defaultValue:any}}
 */
function useContext({ id, defaultValue }) {
	let component = getCurrentComponent().component;
	return id in component.context ? component.context[id] : defaultValue;
}
/**
 * create a context object, which manipulates the context of the tree
 * @param {*} defaultValue
 */
function createContext(defaultValue) {
	let id = CONTEXT + counter++,
		Context = { Provider, Consumer, id, defaultValue };
	/**
	 * create a new context for children
	 * @param {{value:any,children:Vnode}}
	 * @returns {Vnode}
	 */
	function Provider({ value, children }) {
		let { component } = getCurrentComponent();
		if (component.context[id] != value) {
			component.context = assign({}, component.context, {
				[id]: value
			});
		}
		return children;
	}
	/**
	 * Get the current context
	 * @param {{children:Function}}
	 * @returns {Vnode}
	 */
	function Consumer({ children }) {
		return children(useContext(Context));
	}
	return Context;
}

let h = createElement;

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
/**
 * Permite unificar 2 rutas
 * @param {*} a
 * @param {*} b
 */
function resolve(a = "", b = "") {
	return format(
		a.replace(/\/(:[\w]+...){0,1}$/, "") + "/" + b.replace(/^\//, "")
	);
}

/**
 * Vnode prepare
 * @typedef {Object<string,any>} Props
 **/

/**
 * @typedef {(Function|String)} Type
 */

/**
 * @typedef {{type:Type,props:Props}} Vnode
 **/

/**
 * @typedef {string} MatchPath - route pattern for parameter capture
 * @example
 * //  require
 * "/folder"
 * // param
 * "/:folder"
 * // optional
 * "/:folder?"
 * // rest param
 * "/:folder..."
 **/

/**
 * @typedef {[boolean,Object<string,string>]} MatchReturn
 */

/**
 * redirects the browser
 * @callback Redirect
 * @param {string} pathname
 * @return {void}
 **/

/**
 * @namespace options
 * @property {Function} pathname
 **/
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
		window.dispatchEvent(new PopStateEvent("popstate"));
	},
	setRootDefault(path) {
		RootPath.defaultValue = path;
	}
};

/**@type {{Provider:Function,Consumer:Function}} */
let ParentPath = createContext("/");

let RootPath = createContext("");
/**
 * Crea una suscripcion al evento popstate del navegador
 * @returns {[string,Redirect]}
 */
function useHistory() {
	let pathname = options.pathname();
	let [state, setState] = useState({ pathname });

	useEffect(() => {
		function handler() {
			let pathname = options.pathname();
			// usa el estado como ref, para comparar el valor actual con el proximo, para asi forzar la update.
			if (state.pathname != pathname) {
				state.pathname = pathname;
				setState(state);
			}
		}
		window.addEventListener("popstate", handler);
		return () => window.removeEventListener("popstate", handler);
	}, []);
	return [pathname, options.redirect];
}
/**
 *
 * @param {MatchPath} path
 * @return {MatchReturn}
 */
function useMatchRoute(path) {
	let pathname = options.pathname();
	let parentPath = useParentPath();
	// almacena el retorno del match, esto permite evitar update, si en concurrencia los valores no cambian.
	return useMemo(() => [...match(resolve(parentPath, path), pathname)], [
		path,
		pathname,
		parentPath
	]);
}
/**
 * @return {string}
 */
function useParentPath() {
	let parentPath = useContext(ParentPath);
	let rootPath = useContext(RootPath);
	return resolve(rootPath, parentPath);
}
/**
 * @type {Redirect}
 * @return {Function}
 */
function useRedirect() {
	let rootPath = useContext(RootPath);
	return useMemo(
		() => path => {
			options.redirect(resolve(rootPath, path));
		},
		[rootPath]
	);
}
/**
 *
 * @param {MatchPath} path
 * @return {MatchReturn}
 */
function useRoute(path) {
	useHistory();
	return useMatchRoute(path);
}
/**
 *
 * @param {{children:Vnode[]}}
 * @returns {Vnode}
 */
function Router({ children }) {
	let [inRoute] = useRoute("/:pathname...");
	let pathname = options.pathname();
	let parentPath = useParentPath();

	if (!inRoute) return;

	children = toList(children);

	for (let i = 0; i < children.length; i++) {
		let { type, props } = children[i];
		let { path, ...nextProps } = props;
		let value = resolve(parentPath, path);
		let [inRoute, params] = match(value, pathname);
		if (inRoute) {
			nextProps.params = params;
			return h(ParentPath.Provider, { value }, h(type, nextProps));
		}
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
			proxy = name => {
				Object.defineProperty(this.prototype, name, {
					set(value) {
						this.setProperty(name, value);
					},
					get() {
						return this.props[name];
					}
				});
			};
		for (let key in observables) {
			let attr = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			attributes.push(attr);
			if (!(name in this.prototype)) proxy(key);
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
		if (!error && {}.toString.call(value) == `[object ${type.name}]`) {
			this.update({ [name]: value });
		} else {
			throw `the observable [${name}] must be of the type [${type.name}]`;
		}
	}
}

let ID = 0;

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
			id: "@wc." + ID++,
			bind: this,
			host: true
		};
		/**
		 * add support {@link https://developer.mozilla.org/es/docs/Web/API/CSSStyleSheet}
		 */
		let { styles } = this.constructor;
		this.render = this.render.bind(this);
		/**
		 * @param {Object<string,any>} - Properties to update the component
		 */
		this.update = props => {
			this.props = { ...this.props, ...props };
			if (!prevent) {
				prevent = true;
				this.mounted.then(() => {
					prevent = false;
					render(h(this.render, this.props), this, options);
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
	return props => h(tagName, props);
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

function Header() {
	return (
		h('host', { shadowDom: true,}
, h('style', null
, `
					:host {
						width: 100%;
						background: var(--theme-atomico-dark, black);
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 0.75rem;
						box-sizing: border-box;
					}
				`
)
, h('slot', null )
)
	);
}

var AtomicoStoreHeader = customElement("atomico-store-header", Header);

function Button({ checked, counter }) {
	return (
		h('host', { shadowDom: true, class: checked ? "checked" : "",}
, h('style', null
, `
					:host {
						padding: 0.25rem 1rem;
						border-radius: 5px;
						cursor: pointer;
						display: inline-flex;
						align-items: center;
						background: var(--theme-atomico-dark, black);
						color: var(--theme-atomico-white, white);
					}
					:host(.checked) {
						background: var(--theme-atomico-white, white);
						color: var(--theme-atomico-dark, black);
					}

					.counter {
						width: 16px;
						height: 16px;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 10px;
						font-weight: bold;
						margin-left: 0.5rem;
						background: var(--theme-atomico-white, white);
						color: var(--theme-atomico-dark, black);
					}

					:host(.checked) .counter {
						background: var(--theme-atomico-dark, black);
						color: var(--theme-atomico-white, white);
					}
				`
)
, h('slot', null )
, counter > 0 && h('div', { class: "counter",}, counter)
)
	);
}

Button.observables = {
	checked: Boolean,
	counter: Number
};

var AtomicoStoreButton = customElement("atomico-store-button", Button);

function Card({ labelButton }) {
	return (
		h('host', { shadowDom: true,}
, h('style', null, `
				:host {
					flex: 0%;
					padding: 1rem;
					box-sizing: border-box;
					margin: 1rem;
					background: white;
					border-radius: 5px;
					box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.05);
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;
				}
			`)
, h('slot', null )
)
	);
}

Card.observables = {
	labelButton: String
};

var AtomicoStoreCart = customElement("atomico-store-card", Card);

function Products({ products, addCart }) {
	return (
		h('section', null
, products.map(({ title, id, price }) => (
				h(AtomicoStoreCart, { key: id,}
, h('p', null
, h('strong', null, title), " - "  , price
)
, h(AtomicoStoreButton, {
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
		h('section', null
, products.map(({ title, id, price, count }) => (
				h(AtomicoStoreCart, { key: id,}
, h('p', null
, h('strong', null, title), " - "  , price, " x "  , count
)
, h(AtomicoStoreButton, {
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

function AtomicoStore({ products, location }) {
	let [cart, dispatch] = useReducer(reducer, []);
	let redirect = useRedirect();
	let [inRoute, params] = useRoute(`${location}/:page/:any...`);
	return (
		h('host', { shadowDom: true,}
, h('style', null
, `
						:host {
							width: 100%;
							height: 100%;
							display: block;
							background: #f9fafc;
						}
					`
)
, h(AtomicoStoreHeader, null
, h(AtomicoStoreButton, {
					onClick: () => redirect(location),
					checked: params.page == null,}
				, "Products"

)
, h(AtomicoStoreButton, {
					counter: cart.reduce((total, { count }) => total + count, 0),
					onClick: () => redirect(`${location}/cart`),
					checked: params.page == "cart",}
				, "Cart"

)
)
, h(Router, null
, h(Products, {
					path: location,
					products: products,
					addCart: data => {
						dispatch({
							type: Actions.ADD_CART,
							data
						});
					},}
				)
, h(Cart, {
					path: `${location}/cart`,
					products: cart,
					remCart: data => {
						dispatch({
							type: Actions.REM_CART,
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
