import{customElement as e,h as t,useState as o}from"atomico";var n="input{background:rgba(0,0,0,.003);width:100%;font-size:24px;color:inherit;padding:6px;border:1px solid #ccc;box-shadow:inset 0 -1px 5px 0 rgba(0,0,0,.2);box-sizing:border-box}";function a(e){return t("host",{shadowDom:!0},t("style",null,n),t("form",{onSubmit:t=>{t.preventDefault(),e.handlerChange&&e.handlerChange({text:t.target.input.value,id:Date.now()}),t.target.reset()}},t("input",{name:"input",type:"text",placeholder:e.placeholder})))}a.observables={handlerChange:Function,placeholder:String};var r=e("atomico-todo-input",a),l=':host{display:flex}input{text-align:center;border:none;-webkit-appearance:none;appearance:none;padding:.2rem .5rem;outline:none}input:after{content:url(\'data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23ededed"%20stroke-width%3D"3"/></svg>\')}input:checked:after{content:url(\'data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23bddad5"%20stroke-width%3D"3"/><path%20fill%3D"%235dc2af"%20d%3D"M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z"/></svg>\')}input:checked~.text{color:#d9d9d9;text-decoration:line-through}.group{display:flex;align-items:center}.text{flex:0%;padding:1rem;font-size:24px;text-align:left}button{color:#cc9a9a;background:none;border:0;font-size:30px;margin-right:1rem}';function d(e){return t("host",{shadowDom:!0,key:e.key},t("style",null,l),t("input",{type:"checkbox",onChange:e.handlerToggle,checked:e.checked}),t("div",{class:"text"},e.text),t("button",{onClick:e.handlerRemove},"x"))}d.observables={handlerToggle:Function,handlerRemove:Function,checked:Boolean,text:String};var i=e("atomico-todo-item",d),c=":host{display:block;box-shadow:0 2px 4px 0 rgba(0,0,0,.2),0 25px 50px 0 rgba(0,0,0,.1);background:#fff}";function h({task:e=[]}){let[n,a]=o(e);return t("host",{shadowDom:!0},t("style",null,c),t(r,{placeholder:"What needs to be done?",handlerChange:e=>{a(n.concat(e))}}),t("div",null,n.map(({text:e,checked:o,id:r},l)=>t(i,{key:r,text:e,checked:o,handlerRemove:()=>{a(n.filter((e,t)=>t!==l))},handlerToggle:()=>{a(n.map((e,t)=>t===l?{...e,checked:!e.checked}:e))}}))))}h.observables={task:Array},e("atomico-todo",h);
//# sourceMappingURL=index.js.map
