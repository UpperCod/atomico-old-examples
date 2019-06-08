function e(e,t,n){if(t=t||{},arguments.length>3){n=[n];for(let e=3;e<arguments.length;e++)n.push(arguments[e])}null!=n&&(t.children=n);let o={type:e,props:t},r=t.key;return null!=r&&(o.key=""+r),o}function t(t){return null!=t&&"boolean"!=typeof t||(t=""),"string"==typeof t||"number"==typeof t?e(null,null,""+t):t}const n=[],o={},r=Symbol("Atomico.state"),l="localName",s="host",i=97,a=116,c=79,u=77,d=73,h=67,p={children:1},f={innerHTML:1,textContent:1,contenteditable:1},b={className:1,id:1,checked:1,value:1,selected:1},m={},y={};let g,k,v=Promise.prototype.then.bind(Promise.resolve());function x(e){return"function"==typeof e}function w(e,t,n,o,r,l,s){if(n=null==n?null:n,o=null==o?null:o,(t="class"!=t||r?t:"className")in e&&b[t]&&(n=e[t]),o!==n)if("o"!=t[0]||"n"!=t[1]||!x(o)&&!x(n))switch(t){case"ref":o&&(o.current=e);break;case"style":!function(e,t,n){let o=t,r=n;if("object"==typeof r){r="";for(let e in n)n[e]&&(y[e]||(y[e]=e.replace(/([A-Z])/g,"-$1").toLowerCase()),r+=`${y[e]}:${n[e]};`)}o!=r&&(e.style.cssText=r)}(e,n||e.style.cssText,o);break;case"shadowDom":"attachShadow"in e&&(e.shadowRoot&&!o||!e.shadowRoot&&o)&&e.attachShadow({mode:o?"open":"closed"});break;case"key":t="data-key",null==o?delete e.dataset.key:e.dataset.key=o;break;default:!r&&"list"!=t&&t in e?e[t]=null==o?"":o:null==o?e.removeAttribute(t):e.setAttribute(t,o)}else!function(e,t,n,o,r){m[t]||(m[t]=t.slice(2).toLocaleLowerCase());t=m[t],o.handleEvent||(o.handleEvent=e=>o[e.type].call(r,e));n?(o[t]||e.addEventListener(t,o),o[t]=n):o[t]&&(e.removeEventListener(t,o),delete o[t])}(e,t,o,l,s)}function D(){if(!g)throw new Error("the hooks can only be called from an existing functional component in the diff queue");return g}function C(e,t){let n=e.length;for(let o=0;o<n;o++){let n=e[o],r=n.hooks,l=r.length;t.type===h&&(n.remove=!0);for(let e=0;e<l;e++){r[e][1](t)}}}function A(e,n){let o,r=[];function l(i,d){if(!o)return;if(!x((i=t(i)).type))return C(r.splice(d),{type:h}),o=N(e,o,i,n,s),void(r.length&&(o[e.id].updateComponent=s));let p,f,b=r[d]||{};b.type!=i.type&&(C(r.splice(d),{type:h}),r[d]=function e(t,n){for(let e in n)t[e]=n[e];for(let n=2;n<arguments.length;n++)e(t,arguments[n]);return t}({hooks:[],ref:{get current(){return o}}},i),p=!0,f=!0),b=r[d];let m=i.props,y=b.props;if(!f){let e=Object.keys(y).length,t=0;for(let e in m)if(t++,m[e]!=y[e]){f=!0;break}f=f||e!=t}b.props=m,f&&!b.prevent&&function e(){if(b.remove)return o;g={component:b,next(){b.prevent||(b.prevent=!0,v(()=>{b.prevent=!1,e()}))}},k=0,C([b],{type:a});let t=b.type(b.props);g=!1,k=0,l(t,d+1),C([b],{type:p?c:u}),p=!1}()}function s(e,t,n){switch(e){case a:return o=t,l(n,0),o;case d:C([].concat(r).reverse(),{type:e});break;case h:o=!1,C(r.reverse(),{type:e}),r=[]}}return s}function N(e,o,r,i,c){let{vnode:u,updateComponent:d,handlers:h={}}=o&&o[e.id]||{};if(u==r)return o;u=u||{props:{}};let{type:b,props:m}=r,{shadowDom:y,children:g}=m,k=x(b);if(i=i||"svg"==b,k&&!d&&(d=A(e,i)),!k&&b!=s&&function(e){if(!e)return;e[l]||(e[l]=e.nodeName.toLowerCase());let t=e[l];return"#text"==t?null:t}(o)!==b){let t=L(b,i),n=o&&o.parentNode;n&&(S(e,o,!0,c),n.replaceChild(t,o)),o=t,h={}}if(d&&c!=d)return d(a,o,r);if(null==b)o.nodeValue!=g&&(o.nodeValue=g);else{(function(e,t,n,o,r,l){t=t||{};for(let l in t)p[l]||l in n||w(e,l,t[l],null,o,r);let s;for(let i in n)p[i]||(w(e,i,t[i],n[i],o,r,l),s=s||f[i]);return s})(o,u.props,r.props,i,h,e.bind)||u.props.children==g||function(e,o,r,l){let s=[],i=function e(o,r,l,s,i=0){l=l||[];s=s||[];if(a=o,Array.isArray(a)){let t=o.length;for(let n=0;n<t;n++)e(o[n],r,l,s,i+1)}else{if(null==o&&!i)return n;let e=r?r(o,s.length):t(o);r||"object"==typeof e&&null!=e.key&&-1==l.indexOf(e.key)&&(l.push(e.key),l.withKeyes=!0),s.push(e)}var a;return s}(r,!1,s),a=i.length,c=o.childNodes,u={},d=c.length,h=s.withKeyes,p=h?0:d>a?a:d;for(;p<d;p++){let t=c[p],n=p;h&&(n=t.dataset.key,s.indexOf(n)>-1)?u[n]=t:(S(e.id,t),p--,d--,o.removeChild(t))}for(let t=0;t<a;t++){let n=i[t],r=c[t],s=h?n.key:t,a=h?u[s]:r;h&&a&&a!=r&&o.insertBefore(a,r);let d=N(e,!a&&x(n.type)?L(null):a,n,l);a||(c[t]?o.insertBefore(d,c[t]):o.appendChild(d))}}(e,y&&o.shadowRoot||o,g,i)}return o[e.id]={vnode:r,handlers:h},o}function S(e,t,n,o){let{updateComponent:r}=t[e]||{},l=t.childNodes,s=l.length;r&&r!=o&&r(n?d:h);for(let t=0;t<s;t++)S(e,l[t])}function L(e,t){let n,o=document;return n=null!=e?t?o.createElementNS("http://www.w3.org/2000/svg",e):o.createElement(e):o.createTextNode("")}function E(n,l,i=o){let a={id:i.id||r,bind:i.bind,host:i.host};n=t(n),a.host||n.type==s||(n=e(s,{},n)),N(a,l,n)}function P(e){let t=function(e,t){let n,o,r=D().component,l=k++;return r.hooks[l]||(o=!0,r.hooks[l]=[t,e=>{n[2]&&(n[0]=n[2](n[0],e))}]),(n=r.hooks[l])[2]=e,o&&n[1]({type:i}),n}(0,[])[0];if(!t[1]){let n=D().next;t.push(x(e)?e():e,function(e){t[0]=x(e)?e(t[0]):e,n()})}return t}function R(e){return JSON.parse(e)}class T extends HTMLElement{constructor(){super(),this.props={},this.mounted=new Promise(e=>this.mount=e),this.unmounted=new Promise(e=>this.unmount=e)}connectedCallback(){this.mount()}disconnectedCallback(){this.unmount()}attributeChangedCallback(e,t,n){t!=n&&this.setProperty(e,n)}static get observedAttributes(){let e=this.observables||{},t=[],n=(e,t,n)=>{Object.defineProperty(this.prototype,e,{set(o){if(n===Boolean){let e=this.hasAttribute(t);if(o&&e||!o&&!e)return;this[o?"setAttribute":"removeAttribute"](t,"")}else this.setProperty(e,o)},get(){return this.props[e]}})};for(let o in e){let r=o.replace(/([A-Z])/g,"-$1").toLowerCase();t.push(r),name in this.prototype||n(o,r,e[o])}return t}setProperty(e,t){e=e.replace(/-(\w)/g,(e,t)=>t.toUpperCase());let n,{observables:o}=this.constructor,r=o[e];try{if("string"==typeof t)switch(r){case Boolean:t=1==R(t||"true");break;case Number:t=Number(t);break;case Object:case Array:t=R(t);break;case Function:t=window[t]}}catch(e){n=!0}if((n||{}.toString.call(t)!=`[object ${r.name}]`)&&null!=t)throw`the observable [${e}] must be of the type [${r.name}]`;this.props[e]!==t&&this.update({[e]:t})}}class B extends T{constructor(){let t;super();let n={id:Symbol("state"),bind:this,host:!0},{styles:o}=this.constructor;this.render=this.render.bind(this);let r={};this.update=l=>{for(let e in l)r[e]=l[e];t||(t=!0,this.mounted.then(()=>{let l=this.props={...this.props};for(let e in r){null==r[e]?delete l[e]:l[e]=r[e]}r={},E(e(this.render,l),this,n),t=!1,o&&this.shadowRoot&&(this.shadowRoot.adoptedStyleSheets=o,o=null)}))},this.unmounted.then(()=>E("",this,n)),this.update()}}function $(t,n){return customElements.define(t,n instanceof B?n:function(e){let t=class extends B{};return t.prototype.render=e,t.observables=e.observables,t.styles=e.styles,t}(n)),n=>e(t,n)}var j="input{background:rgba(0,0,0,.003);width:100%;font-size:24px;color:inherit;padding:6px;border:1px solid #ccc;box-shadow:inset 0 -1px 5px 0 rgba(0,0,0,.2);box-sizing:border-box}";function O(t){return e("host",{shadowDom:!0},e("style",null,j),e("form",{onSubmit:e=>{e.preventDefault(),t.handlerChange&&t.handlerChange({text:e.target.input.value,id:Date.now()}),e.target.reset()}},e("input",{name:"input",type:"text",placeholder:t.placeholder})))}O.observables={handlerChange:Function,placeholder:String};var z=$("atomico-todo-input",O),F=':host{display:flex}input{text-align:center;border:none;-webkit-appearance:none;appearance:none;padding:.2rem .5rem;outline:none}input:after{content:url(\'data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23ededed"%20stroke-width%3D"3"/></svg>\')}input:checked:after{content:url(\'data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23bddad5"%20stroke-width%3D"3"/><path%20fill%3D"%235dc2af"%20d%3D"M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z"/></svg>\')}input:checked~.text{color:#d9d9d9;text-decoration:line-through}.group{display:flex;align-items:center}.text{flex:0%;padding:1rem;font-size:24px;text-align:left}button{color:#cc9a9a;background:none;border:0;font-size:30px;margin-right:1rem}';function M(t){return e("host",{shadowDom:!0,key:t.key},e("style",null,F),e("input",{type:"checkbox",onChange:t.handlerToggle,checked:t.checked}),e("div",{class:"text"},t.text),e("button",{onClick:t.handlerRemove},"x"))}M.observables={handlerToggle:Function,handlerRemove:Function,checked:Boolean,text:String};var H=$("atomico-todo-item",M),K=":host{display:block;box-shadow:0 2px 4px 0 rgba(0,0,0,.2),0 25px 50px 0 rgba(0,0,0,.1);background:#fff}";function V({task:t=[]}){let[n,o]=P(t);return e("host",{shadowDom:!0},e("style",null,K),e(z,{placeholder:"What needs to be done?",handlerChange:e=>{o(n.concat(e))}}),e("div",null,n.map(({text:t,checked:r,id:l},s)=>e(H,{key:l,text:t,checked:r,handlerRemove:()=>{o(n.filter((e,t)=>t!==s))},handlerToggle:()=>{o(n.map((e,t)=>t===s?{...e,checked:!e.checked}:e))}}))))}V.observables={task:Array},$("atomico-todo",V);
//# sourceMappingURL=index.js.map
