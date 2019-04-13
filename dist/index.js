function e(e,t,n){var r=arguments;if(t=t||{},arguments.length>3){n=[n];for(var o=3;o<arguments.length;o++)n.push(r[o]);}null!=n&&(t.children=n);var a={type:e,props:t},u=t.key;return null!=u&&(a.key=""+u),a}function t(t){return null!=t&&"boolean"!=typeof t||(t=""),"string"==typeof t||"number"==typeof t?e(null,null,""+t):t}var n=[],r={},o={},a="@ctx.",u="@state",c="@type",i="host",s=97,f=116,l=79,p=77,v=73,d=67,h={children:1},y={innerHTML:1,textContent:1,contenteditable:1},g={};function m(e,t){var n=e.length;if(n!==t.length)return !1;for(var r=0;r<n;r++)if(e[r]!==t[r])return !1;return !0}function k(e,t){var n=arguments;for(var r in t)e[r]=t[r];for(var o=2;o<arguments.length;o++)k(e,n[o]);return e}var w,x,b=Promise.prototype.then.bind(Promise.resolve());function C(e,t,n,o,a,u){if(("checked"==t||"value"==t)&&t in e&&(n=e[t]),o!=n)if("o"!=t[0]||"n"!=t[1]||"function"!=typeof o&&"function"!=typeof n)switch(t){case"ref":o&&(o.current=e);break;case"style":!function(e,t,n){var r=t,o=n;if("object"==typeof o)for(var a in o="",n)n[a]&&(g[a]||(g[a]=a.replace(/([A-Z])/g,"-$1").toLowerCase()),o+=g[a]+":"+n[a]+";");r!=o&&(e.style.cssText=o);}(e,n||e.style.cssText,o);break;case"shadowDom":return void("attachShadow"in e&&(e.shadowRoot&&!o||!e.shadowRoot&&o)&&e.attachShadow({mode:o?"open":"closed"}));case"key":t="data-key",null==o?delete e.dataset.key:e.dataset.key=o;break;case"class":case"className":t=a?"class":"className";default:"list"!=t&&!a&&t in e?e[t]=null==o?"":o:null==o?e.removeAttribute(t):e.setAttribute(t,o);}else!function(e,t,n,o){r[t]||(r[t]=t.slice(2).toLocaleLowerCase()),t=r[t],o.handleEvent||(o.handleEvent=N),n?(o[t]||e.addEventListener(t,o),o[t]=n):o[t]&&(e.removeEventListener(t,o),delete o[t]);}(e,t,o,u);}function N(e){return this[e.type](e)}function E(){if(!w)throw new Error("the hooks can only be called from an existing functional component in the diff queue");return w}function L(e,t){var n,r,o=E().component,a=x++;return o.hooks[a]||(r=!0,o.hooks[a]={state:t}),(n=o.hooks[a]).reducer=e,r&&A(n,{type:s}),[n.state,function(e){return A(n,e)}]}function A(e,t){e.reducer&&(e.state=e.reducer(e.state,t));}function T(e,t){for(var n=e.length,r=0;r<n;r++){var o=e[r],a=o.hooks,u=a.length;t.type===d&&(o.remove=!0);for(var c=0;c<u;c++)A(a[c],t);}}function V(e,t,n,r){var o=(t[e]||{}).updateComponent,a=t.childNodes,u=a.length;o&&o!=r&&o(n?v:d);for(var c=0;c<u;c++)V(e,a[c]);}function j(e,t){var n,r=document;return (n=null!=e?t?r.createElementNS("http://www.w3.org/2000/svg",e):r.createElement(e):r.createTextNode(""))[c]=e,n}function O(e,r,o,a,u){if(void 0===u&&(u=0),o=o||[],a=a||[],Array.isArray(e))for(var c=e.length,i=0;i<c;i++)O(e[i],r,o,a,u+1);else{if(null==e&&!u)return n;var s=r?r(e,a.length):t(e);r||"object"==typeof s&&null!=s.key&&-1==o.indexOf(s.key)&&(o.push(s.key),o.withKeyes=!0),a.push(s);}return a}function P(n,r,a){a=a||u,n=t(n),a==u&&n.type!=i&&(n=e(i,{},n)),function e(n,r,o,a,u,s){var g=r&&r[n]||{},m=g.vnode,N=g.updateComponent,E=g.handlers;if(void 0===E&&(E={}),m==o)return r;m=m||{props:{}};var L=o.type,A=o.props,P=A.shadowDom,R=A.children,S="function"==typeof L;if(u=u||"svg"==L,S&&!N&&(N=function(n,r){var o,a=[];return function u(c,i,s,h){switch(c){case f:return o=i,function c(i,s,v){if(o){if("function"!=typeof(i=t(i)).type)return T(a.splice(v),{type:d}),o=e(n,o,i,s,r,u),void(a.length&&(o[n].updateComponent=u));var h,y,g=a[v]||{};g.type!=i.type&&(T(a.splice(v),{type:d}),a[v]=k({hooks:[]},i),h=!0,y=!0);var m=i.props,C=(g=a[v]).props;if(!y){var N=Object.keys(C).length,E=0;for(var L in m)if(E++,m[L]!=C[L]){y=!0;break}y=y||N!=E;}y=g.context!=s||y,g.props=m,g.context=s,y&&!g.prevent&&function e(){if(g.remove)return o;var t=w={component:g,context:s,next:function(){g.prevent||(g.prevent=!0,b(function(){g.prevent=!1,e();}));}};x=0,T([g],{type:f});var n=g.type(g.props);w=!1,x=0,c(n,t.context,v+1),T([g],{type:h?l:p}),h=!1;}();}}(s,h,0),o;case v:T([].concat(a).reverse(),{type:c});break;case d:o=!1,T(a.reverse(),{type:c}),a=[];}}}(n,u)),!S&&L!=i&&function(e){if(e){if(!e[c]){var t=e.nodeName.toLowerCase();e[c]="#text"==t?null:t;}return e[c]}}(r)!==L){var B=j(L,u),D=r&&r.parentNode;D&&(V(n,r,!0,s),D.replaceChild(B,r)),r=B,E={};}return N&&s!=N?N(f,r,o,a):(null==L?r.nodeValue!=R&&(r.nodeValue=R):function(e,t,n,r,o){for(var a in t=t||{})h[a]||a in n||C(e,a,t[a],null,r,o);var u;for(var c in n)h[c]||(C(e,c,t[c],n[c],r,o),u=u||y[c]);return u}(r,m.props,o.props,u,E)||m.props.children==R||function(t,n,r,o,a){for(var u=[],c=O(r,!1,u),i=c.length,s=n.childNodes,f={},l=s.length,p=u.withKeyes,v=p?0:l>i?i:l;v<l;v++){var d=s[v],h=v;p&&u.indexOf(h=d.dataset.key)>-1?f[h]=d:(V(t,d),v--,l--,n.removeChild(d));}for(var y=0;y<i;y++){var g=c[y],m=s[y],k=s[y+1],w=p?f[p?g.key:y]:m;p&&w!=m&&n.insertBefore(w,m);var x=e(t,w||"function"!=typeof g.type?w:j(null),g,o,a);w||(k?n.insertBefore(x,k):n.appendChild(x));}}(n,P&&r.shadowRoot||r,R,a,u),r[n]={vnode:o,handlers:E},r)}(a,r,n,o);}function R(e){var t=E().next,n=L(function(t,n){switch(n.type){case s:return "function"==typeof e?e():e;case 159:var r=n.state;return "function"==typeof r?r(t):r}return t}),r=n[1];return [n[0],function(e){r({state:e,type:159}),t();}]}function S(e,t){L(function(n,r){switch(r.type){case s:return {args:t};case f:case d:return n.clear&&(r.type==d||!t||!n.args||!m(t,n.args))&&n.clear.then(function(e){return e&&e()}),k({},n,{args:t});case l:case p:var o=r.type==l||!t||!n.args||!m(t,n.args),a=n.clear;return o&&(a=b(e)),k({},n,{clear:a,args:t})}return n});}function K(e,t){var n=E().next,r=L(function(n,r){switch(r.type){case s:return t;case 158:return e(n,r.use)}return n}),o=r[1];return [r[0],function(e){o({type:158,use:e}),n();}]}var q=0;function H(e){var t=e.id,n=e.defaultValue,r=E().context||{};return t in r?r[t]:n}function M(e){var t=a+q++,n={Provider:function(e){var n,r=e.value,o=e.children,a=E();return a.context[t]!=r&&(a.context=k({},a.context,((n={})[t]=r,n))),o},Consumer:function(e){return (0, e.children)(H(n))},id:t,defaultValue:e};return n}var Z=e;

let r$1=Promise.resolve(),s$1=0,i$1=Z("host");function a$1(t){return JSON.parse(t)}class Element extends HTMLElement{constructor(){let i;super(),this.props={},this.render=this.render.bind(this),this.renderID="@wc."+s$1++,this.update=(s=>{this.props={...this.props,...s},i||(i=!0,r$1.then(()=>{i=!1,P(Z(this.render,this.props),this,this.renderID);}));}),this.update();}static get observedAttributes(){let t=this.attributes||{},e=[];for(let r in t)e.push(r.replace(/([A-Z])/g,"-$1").toLowerCase());return e}disconnectedCallback(){P(i$1,this,this.renderID);}attributeChangedCallback(t,e,r){if(e==r)return;t=t.replace(/-(\w)/g,(t,e)=>e.toUpperCase());let s,{attributes:i}=this.constructor,o=i[t];try{switch(o){case Number:r=a$1(r);break;case Boolean:r=1==(r=""==r||a$1(r))||0==r?1==r:r;break;case Object:case Array:r=a$1(r);}}catch(t){s=!0;}if(s||{}.toString.call(r)!=`[object ${o.name}]`)throw`the attribute [${t}] must be of the type [${o.name}]`;this.update({[t]:r});}render(){return i$1}}

var i$2=/([^\/]+)/g,p$1="[^\\/]",c$1="(?:\\/){0,1}",u$1=/(:)(\w+)(\?|(\.){3}){0,1}/,v$1={},h$1={};function f$1(r,t){h$1[r]||(h$1[r]=function(r){var t=r.match(i$2)||[""],n=[];return {regexp:new RegExp("^"+t.map(function(r){var t=r.match(u$1)||[],e=(t[0],t[1]),a=t[2],o=t[3];return e?(n.push(a),"..."===o?"(.*)":"?"===o?c$1+"("+p$1+"*)":"\\/("+p$1+"+)"):"\\/(?:"+r.replace(/\./g,"\\.").replace(/\*/g,p$1+"+").replace(/\((?!\?\:)/g,"(?:")+")"}).join("")+"$","i"),params:n,logs:{}}}(r));var n=h$1[r],e=n.regexp,a=n.params,o=n.logs;if(o[t])return o[t];var f=t.match(e);return o[t]=[!!f,f?f.slice(1).reduce(function(r,t,n){return r[a[n]||n]=t,r},{}):v$1]}function m$1(r,t){return void 0===r&&(r=""),void 0===t&&(t=""),r.replace(/\/(:[\w]+...){0,1}$/,"")+"/"+t.replace(/^\//,"")}function s$2(r,t){var n={};for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&-1===t.indexOf(e)&&(n[e]=r[e]);return n}var d$1={pathname:function(){return location.pathname},redirect:function(r){r!=d$1.pathname()&&(history.pushState({},"history",r),window.dispatchEvent(new PopStateEvent("popstate")));}},l$1=M("/"),w$1=M("");function g$1(){var r=d$1.pathname(),e=R({pathname:r}),a=e[0],o=e[1];return S(function(){function r(){var r=d$1.pathname();a.pathname!=r&&(a.pathname=r,o(a));}return window.addEventListener("popstate",r),function(){return window.removeEventListener("popstate",r)}},[]),[d$1.pathname(),d$1.redirect]}function x$1(){var r=H(l$1);return m$1(H(w$1),r)}function y$1(){var r=H(w$1);return function(t){d$1.redirect(m$1(r,t));}}function E$1(r){var t=g$1()[0];return f$1(m$1(x$1(),r),t).concat([t])}function P$1(r){var t=r.children,n=E$1("/:pathname...")[0],e=d$1.pathname(),i=x$1();if(n){t=O(t);for(var p=0;p<t.length;p++){var c=t[p],u=c.type,v=c.props,h=v.path,w=s$2(v,["path"]),g=m$1(i,h),y=f$1(g,e),P=y[0],O$1=y[1];if(P)return w.params=O$1,Z(l$1.Provider,{value:g},Z(u,w))}}}

function Button({ children, checked, dark, ...props }) {
	return (
		Z('div', { ...props, shadowDom: true,}
, Z('style', null
, `
					:host{
						padding:.5rem 1rem;
						border-radius:5px;
						cursor:pointer;
						display:inline-flex;
						align-items:center;
						${
							dark
								? `background:black;color:white;`
								: checked
								? `background:white`
								: `color:white`
						}
					}
					`
)
, children
)
	);
}

function Box(props) {
	return (
		Z('article', { shadowDom: true,}
, Z('style', null, `
			:host{
				flex:0%;
				padding:1rem;
				box-sizing:border-box;
				margin : 1rem;
				background:white;
				border-radius:5px;
				box-shadow:0px 6px 12px rgba(0,0,0,.05);
				display:flex;
				align-items:center;
				justify-content:space-between;
			}
			`)
, props.children
)
	);
}

function Header(props) {
	return (
		Z('header', null
, Z('strong', null, props.title), " - "  , Z('span', null, props.price)
)
	);
}

function Product(props) {
	return (
		Z(Box, null
, Z(Header, {
				title: props.title,
				price: props.price + (props.count != null ? " x " + props.count : ""),}
			)
, Z(Button, { dark: true, onClick: props.buttonHandler,}
, props.buttonLabel
)
)
	);
}

function Home({ products, buttonHandler }) {
	return (
		Z('section', { shadowDom: true,}
, Z('style', null, `
      :host{
        display:flex;
        flex-flow:column;
      }
      `)
, products.map(props => (
				Z(Product, {
					...props,
					buttonLabel: "add to cart"  ,
					buttonHandler: () => buttonHandler(props),}
				)
			))
)
	);
}

function Cart({ products, buttonHandler }) {
	return (
		Z('section', { shadowDom: true,}
, Z('style', null, `
      :host{
        display:flex;
        flex-flow:column;
      }
      `)
, products.map(props => (
				Z(Product, {
					...props,
					buttonLabel: "Remove from cart"  ,
					buttonHandler: () => buttonHandler(props),}
				)
			))
)
	);
}

let Actions = {
	INSERT: "INSERT",
	DELETE: "DELETE"
};

function reducer(state, { type, data }) {
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
		let redirect = y$1();
		let [inRoot] = E$1("/");
		let [inCart] = E$1("/cart");
		let [cart, dispatch] = K(reducer, new Map());

		cart = formatMapCart(cart);

		return (
			Z('host', { shadowDom: true,}
, Z('style', null, `
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
				`)
, Z('header', { id: "header",}
, Z(Button, { onClick: () => redirect("/"), checked: inRoot,}, "Products"

)
, Z(Button, { onClick: () => redirect("/cart"), checked: inCart,}, "Cart ("
 , cart.length, ")"
)
)
, Z(P$1, null
, Z(Home, {
						path: "/",
						products: products,
						buttonHandler: data => {
							dispatch({
								data,
								type: Actions.INSERT
							});
						},}
					)
, Z(Cart, {
						path: "/cart",
						products: cart.products,
						buttonHandler: data => {
							dispatch({
								data,
								type: Actions.DELETE
							});
						},}
					)
)
)
		);
	}
}

customElements.define("atomico-shop", AtomicoShop);
//# sourceMappingURL=index.js.map
