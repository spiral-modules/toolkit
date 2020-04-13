!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("@spiral-toolkit/core")):"function"==typeof define&&define.amd?define("@spiral-toolkit/locker",["@spiral-toolkit/core"],t):"object"==typeof exports?exports["@spiral-toolkit/locker"]=t(require("@spiral-toolkit/core")):e["@spiral-toolkit/locker"]=t(e["@spiral-toolkit/core"])}(window,(function(e){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=1)}([function(t,n){t.exports=e},function(e,t,n){e.exports=n(2)},function(e,t,n){const o=n(0).default,r=n(3).default;o.registerInstanceType(r),e.exports=r},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o);n(4);const i=function(e,t,n){this._construct(e,t,n)};(i.prototype=r.a.createModulePrototype()).name="lock",i.prototype._construct=function(e,t,n){this.init(e,t,n),this.progress=this.add(this.options.type,this.node)},i.prototype.add=function(e,t){if(!this.types.hasOwnProperty(e))return!1;const n=document.createElement("div");return n.classList.add(this.types[e].className||"js-sf-lock"),n.classList.add("locker"),n.innerHTML=this.types[e].html,t.appendChild(n),t.classList.add("locked"),this.types[e].progress},i.prototype.die=function(){this.remove()},i.prototype.remove=function(){this.node.classList.remove("locked");const e=this.node.querySelector(".js-sf-lock");return e&&this.node.removeChild(e),!0},i.prototype.types={spinner:{html:'<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>'},progress:{html:'<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div></div>',progress(e,t){this.context.getElementsByClassName("progress-bar")[0].style.width=e/t*100+"%"}}},i.prototype.types.default=i.prototype.types.spinner,t.default=i},function(e,t,n){var o=n(5),r=n(6);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var i={insert:"head",singleton:!1},s=(o(r,i),r.locals?r.locals:{});e.exports=s},function(e,t,n){"use strict";var o,r=function(){return void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o},i=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),s=[];function a(e){for(var t=-1,n=0;n<s.length;n++)if(s[n].identifier===e){t=n;break}return t}function c(e,t){for(var n={},o=[],r=0;r<e.length;r++){var i=e[r],c=t.base?i[0]+t.base:i[0],l=n[c]||0,u="".concat(c," ").concat(l);n[c]=l+1;var p=a(u),f={css:i[1],media:i[2],sourceMap:i[3]};-1!==p?(s[p].references++,s[p].updater(f)):s.push({identifier:u,updater:y(f,t),references:1}),o.push(u)}return o}function l(e){var t=document.createElement("style"),o=e.attributes||{};if(void 0===o.nonce){var r=n.nc;r&&(o.nonce=r)}if(Object.keys(o).forEach((function(e){t.setAttribute(e,o[e])})),"function"==typeof e.insert)e.insert(t);else{var s=i(e.insert||"head");if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(t)}return t}var u,p=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function f(e,t,n,o){var r=n?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(e.styleSheet)e.styleSheet.cssText=p(t,r);else{var i=document.createTextNode(r),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(i,s[t]):e.appendChild(i)}}function d(e,t,n){var o=n.css,r=n.media,i=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),i&&btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var v=null,h=0;function y(e,t){var n,o,r;if(t.singleton){var i=h++;n=v||(v=l(t)),o=f.bind(null,n,i,!1),r=f.bind(null,n,i,!0)}else n=l(t),o=d.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=r());var n=c(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var o=0;o<n.length;o++){var r=a(n[o]);s[r].references--}for(var i=c(e,t),l=0;l<n.length;l++){var u=a(n[l]);0===s[u].references&&(s[u].updater(),s.splice(u,1))}n=i}}}},function(e,t,n){(t=n(7)(!0)).push([e.i,".locked .form-content {\n  pointer-events: none;\n  filter: blur(3px);\n  opacity: .7;\n}\n\n.locker {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 80%;\n  text-align: center;\n}\n","",{version:3,sources:["styles.css"],names:[],mappings:"AAAA;EACE,oBAAoB;EACpB,iBAAiB;EACjB,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,gCAAgC;EAChC,UAAU;EACV,kBAAkB;AACpB",file:"styles.css",sourcesContent:[".locked .form-content {\n  pointer-events: none;\n  filter: blur(3px);\n  opacity: .7;\n}\n\n.locker {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 80%;\n  text-align: center;\n}\n"]}]),e.exports=t},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var r=(s=o,a=btoa(unescape(encodeURIComponent(JSON.stringify(s)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(c," */")),i=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(e," */")}));return[n].concat(i).concat([r]).join("\n")}var s,a,c;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,o){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var s=this[i][0];null!=s&&(r[s]=!0)}for(var a=0;a<e.length;a++){var c=[].concat(e[a]);o&&r[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),t.push(c))}},t}}])}));
//# sourceMappingURL=locker.js.map