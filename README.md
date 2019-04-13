# rollup modern app

This configuration assumes that the developer works with a modern browser, compatible with mjs modules and dynamic import `import("...")`, additionally offers optional support to Typescript

> If your browser does not support dynamic import, consider using as polyfill [Shimport](https://github.com/Rich-Harris/shimport).

## Script

```bash
# development mode
npm run dev 
# production mode
npm run build
```

## Directory 
```bash
/src 
  index.js #entry code
/test
/public
  /dist #this directory is removed with each rollup cycle
  index.html
```

## package.json

By default, rollup loads the initial configuration from package.json:

```bash
{
  "input": "src/index.js", # define the input file for rollup
	"output": "public/dist", # define the output directory
	"public": "public", # define the directory to install the dev server
}
```

## support 

### CSS

The css is supported by the plugin [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss), this librarian allows to extract the css from the

```js
// inline inject css
import "style.js";
// get string css
import css from "style.css";
```

### JS Y TS

supported by [rollup-plugin-sucrase] (https://github.com/rollup/rollup-plugin-sucrase), this library allows manipulation of non-standardized JS and TS code.




