!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("@spiral-toolkit/core",[],t):"object"==typeof exports?exports["@spiral-toolkit/core"]=t():e.sf=t()}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=17)}([function(e,t,n){"use strict";var r=n(3),o=Object.prototype.toString;function s(e){return"[object Array]"===o.call(e)}function i(e){return void 0===e}function a(e){return null!==e&&"object"==typeof e}function c(e){return"[object Function]"===o.call(e)}function u(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),s(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:s,isArrayBuffer:function(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:function(e){return null!==e&&!i(e)&&null!==e.constructor&&!i(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:a,isUndefined:i,isDate:function(e){return"[object Date]"===o.call(e)},isFile:function(e){return"[object File]"===o.call(e)},isBlob:function(e){return"[object Blob]"===o.call(e)},isFunction:c,isStream:function(e){return a(e)&&c(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:u,merge:function e(){var t={};function n(n,r){"object"==typeof t[r]&&"object"==typeof n?t[r]=e(t[r],n):t[r]=n}for(var r=0,o=arguments.length;r<o;r++)u(arguments[r],n);return t},deepMerge:function e(){var t={};function n(n,r){"object"==typeof t[r]&&"object"==typeof n?t[r]=e(t[r],n):t[r]="object"==typeof n?e({},n):n}for(var r=0,o=arguments.length;r<o;r++)u(arguments[r],n);return t},extend:function(e,t,n){return u(t,(function(t,o){e[o]=n&&"function"==typeof t?r(t,n):t})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}}},function(e,t,n){"use strict";n.d(t,"a",(function(){return m})),n.d(t,"b",(function(){return g})),n.d(t,"c",(function(){return y}));var r=class{constructor(){this.DOMEventsStorage=[]}add(e){(Array.isArray(e)?e:[e]).forEach(e=>{e.DOMNode.addEventListener(e.eventType,e.eventFunction,!!e.useCapture),this.DOMEventsStorage.push(e)},this)}removeAll(){this.DOMEventsStorage.forEach(e=>{e.DOMNode.removeEventListener(e.eventType,e.eventFunction,e.useCapture)}),this.DOMEventsStorage=[]}};var o={closest:(e,t)=>{let n,r=e;const o=(t="string"==typeof t?[t]:t).length,s=r.matches||r.msMatchesSelector;for(;r&&r.parentElement;){for(n=0;n<o;n+=1)if(s.call(r,t[n]))return r;r=r.parentElement}return!1}},s=n(2),i=n.n(s);class a{constructor(e){this.allowedEvents=e,this.storage={}}on(e,t){e.replace(/\s{2,}/g," ").split(" ").forEach(n=>{this.allowedEvents&&-1===this.allowedEvents.indexOf(n)?console.warn("Events. Try to register event %s, but event is not allowed",n):(this.storage[e]||(this.storage[n]=[]),this.storage[n].push(t))})}registerAction(e,t){return this.on(e,t)}off(e,t){e.replace(/\s{2,}/g," ").split(" ").forEach(e=>{this.allowedEvents&&-1===this.allowedEvents.indexOf(e)?console.warn("Events. Try to deregister event %s, but event is not allowed",e):this.storage[e]&&(this.storage[e]=this.storage[e].filter(e=>e!==t))})}trigger(e,t){this.allowedEvents&&-1===this.allowedEvents.indexOf(e)?console.warn("Events. Try to trigger event %s, but event is not allowed",e):this.storage[e]&&this.storage[e].forEach(e=>e(t))}performAction(e,t){return this.trigger(e,t)}}var c=class{constructor(e){this.headers={"X-Requested-With":"XMLHttpRequest"},this.currentRequests=0,this.events=new a(["beforeSend","load"]),e&&e.headers&&Object.assign(this.headers,e.headers)}send(e){null!==e.data&&void 0!==e.data&&"undefined"!==e.data||(e.data=null),e.method||(e.method="POST"),e.headers=e.headers?Object.assign(e.headers,this.headers,e.headers):Object.assign({},this.headers);const t=i.a.CancelToken.source(),n={url:e.url,method:e.method,headers:e.headers,data:e.data,onUploadProgress:t=>{e.onProgress&&e.onProgress(t.loaded,t.total)},cancelToken:t.token};this.cancel=t.cancel;const r=e=>(e.isSFAjaxError=!0,e);return new Promise((t,o)=>{e.url||(console.error("You should provide url"),o(new Error("You should provide url"))),this.currentRequests+=1,i.a.request(n).then(n=>{this.currentRequests-=1,n.status?n.status>199&&n.status<300?t(n):(n.status>399&&n.status<600||console.error("unknown status %d. Rejecting",n.status),o(r(n))):o(r(n)),e.response=n,this.events.trigger("load",e)}).catch(e=>{this.currentRequests-=1,e.response?o(r(e.response)):o(e)})})}},u=n(14),l=n.n(u),f=n(15),d=n.n(f),p=n(16),h=n.n(p);const m={Ajax:c,BaseDOMConstructor:l.a,DomMutations:d.a,Events:a,InstancesController:h.a},g={DOMEvents:r,domTools:o},y={resolveKeyPath:function(e,t,n){return e.split(".").reduce((e,t)=>n?e?e[t]:void 0:e[t],t||self)}}},function(e,t,n){e.exports=n(19)},function(e,t,n){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t,n){"use strict";var r=n(0);function o(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,n){if(!t)return e;var s;if(n)s=n(t);else if(r.isURLSearchParams(t))s=t.toString();else{var i=[];r.forEach(t,(function(e,t){null!=e&&(r.isArray(e)?t+="[]":e=[e],r.forEach(e,(function(e){r.isDate(e)?e=e.toISOString():r.isObject(e)&&(e=JSON.stringify(e)),i.push(o(t)+"="+o(e))})))})),s=i.join("&")}if(s){var a=e.indexOf("#");-1!==a&&(e=e.slice(0,a)),e+=(-1===e.indexOf("?")?"?":"&")+s}return e}},function(e,t,n){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,n){"use strict";(function(t){var r=n(0),o=n(25),s={"Content-Type":"application/x-www-form-urlencoded"};function i(e,t){!r.isUndefined(e)&&r.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var a,c={adapter:(("undefined"!=typeof XMLHttpRequest||void 0!==t&&"[object process]"===Object.prototype.toString.call(t))&&(a=n(7)),a),transformRequest:[function(e,t){return o(t,"Accept"),o(t,"Content-Type"),r.isFormData(e)||r.isArrayBuffer(e)||r.isBuffer(e)||r.isStream(e)||r.isFile(e)||r.isBlob(e)?e:r.isArrayBufferView(e)?e.buffer:r.isURLSearchParams(e)?(i(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):r.isObject(e)?(i(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};c.headers={common:{Accept:"application/json, text/plain, */*"}},r.forEach(["delete","get","head"],(function(e){c.headers[e]={}})),r.forEach(["post","put","patch"],(function(e){c.headers[e]=r.merge(s)})),e.exports=c}).call(this,n(24))},function(e,t,n){"use strict";var r=n(0),o=n(26),s=n(4),i=n(28),a=n(31),c=n(32),u=n(8);e.exports=function(e){return new Promise((function(t,l){var f=e.data,d=e.headers;r.isFormData(f)&&delete d["Content-Type"];var p=new XMLHttpRequest;if(e.auth){var h=e.auth.username||"",m=e.auth.password||"";d.Authorization="Basic "+btoa(h+":"+m)}var g=i(e.baseURL,e.url);if(p.open(e.method.toUpperCase(),s(g,e.params,e.paramsSerializer),!0),p.timeout=e.timeout,p.onreadystatechange=function(){if(p&&4===p.readyState&&(0!==p.status||p.responseURL&&0===p.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in p?a(p.getAllResponseHeaders()):null,r={data:e.responseType&&"text"!==e.responseType?p.response:p.responseText,status:p.status,statusText:p.statusText,headers:n,config:e,request:p};o(t,l,r),p=null}},p.onabort=function(){p&&(l(u("Request aborted",e,"ECONNABORTED",p)),p=null)},p.onerror=function(){l(u("Network Error",e,null,p)),p=null},p.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),l(u(t,e,"ECONNABORTED",p)),p=null},r.isStandardBrowserEnv()){var y=n(33),v=(e.withCredentials||c(g))&&e.xsrfCookieName?y.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in p&&r.forEach(d,(function(e,t){void 0===f&&"content-type"===t.toLowerCase()?delete d[t]:p.setRequestHeader(t,e)})),r.isUndefined(e.withCredentials)||(p.withCredentials=!!e.withCredentials),e.responseType)try{p.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&p.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&p.upload&&p.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){p&&(p.abort(),l(e),p=null)})),void 0===f&&(f=null),p.send(f)}))}},function(e,t,n){"use strict";var r=n(27);e.exports=function(e,t,n,o,s){var i=new Error(e);return r(i,t,n,o,s)}},function(e,t,n){"use strict";var r=n(0);e.exports=function(e,t){t=t||{};var n={},o=["url","method","params","data"],s=["headers","auth","proxy"],i=["baseURL","url","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"];r.forEach(o,(function(e){void 0!==t[e]&&(n[e]=t[e])})),r.forEach(s,(function(o){r.isObject(t[o])?n[o]=r.deepMerge(e[o],t[o]):void 0!==t[o]?n[o]=t[o]:r.isObject(e[o])?n[o]=r.deepMerge(e[o]):void 0!==e[o]&&(n[o]=e[o])})),r.forEach(i,(function(r){void 0!==t[r]?n[r]=t[r]:void 0!==e[r]&&(n[r]=e[r])}));var a=o.concat(s).concat(i),c=Object.keys(t).filter((function(e){return-1===a.indexOf(e)}));return r.forEach(c,(function(r){void 0!==t[r]?n[r]=t[r]:void 0!==e[r]&&(n[r]=e[r])})),n}},function(e,t,n){"use strict";function r(e){this.message=e}r.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},r.prototype.__CANCEL__=!0,e.exports=r},function(e,t){},function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));const r=(e,t)=>{e.events.on("load",e=>{const{response:n}=e;if(!n||!n.data)return;const{data:r}=n;if(r.action)if("string"==typeof r.action)t.trigger(r.action);else if("object"==typeof r.action){const n=Object.keys(r.action);-1!==n.indexOf("redirect")?setTimeout(()=>{t.trigger("redirect",{url:r.action.redirect,options:e})},+r.action.delay||0):-1!==n.indexOf("name")&&setTimeout(()=>{t.trigger(r.action.name,r.action.url)},+r.action.delay||0)}else console.error("Action from server. Something wrong. ",r.action)})}},function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));const r=e=>{e.on("redirect",e=>{const t="[object String]"===Object.prototype.toString.call(e)?e:e.url;if(/^(?:[a-z]+:)?\/\//i.test(t))self.location.href=t;else{const e=window.location.origin||`${window.location.protocol}//${window.location.hostname}${window.location.port?`:${window.location.port}`:""}`;self.location.href=e+("/"===t.charAt(0)?t:`/${t}`)}}),e.on("reload",()=>{window.location.reload()}),e.on("refresh",()=>{e.trigger("reload")}),e.on("close",()=>{self.close()})}},function(e,t){const n=function(){};n.prototype.init=function(e,t,n){this.sf=e,this.node=t,this.options=Object.assign(this.grabOptions(t),n)},n.prototype.optionsToGrab={},n.prototype.grabOptions=function(e){const t={};let n,r;return Object.keys(this.optionsToGrab).forEach(o=>{this.optionsToGrab.hasOwnProperty(o)&&(n=null,this.optionsToGrab.hasOwnProperty(o)&&(r=this.optionsToGrab[o],r.hasOwnProperty("value")&&(n=r.value),this.sf.options.instances[this.name]&&this.sf.options.instances[this.name].hasOwnProperty(o)&&(n=this.sf.options.instances[this.name][o]),r.hasOwnProperty("domAttr")&&e.attributes.hasOwnProperty(r.domAttr)&&(n=e.attributes[r.domAttr].value),r.hasOwnProperty("processor")&&(n=r.processor.call(this,e,n,r)),null!==n&&(t[o]=n)))}),t},e.exports=n},function(e,t){const n=function(e){if(!e)return void console.error("You should provide instancesController  for DOM Mutation. Because DOM Mutation  should known all classes and");if(!this.constructor)return void console.error("Please call DomMutations with new  - 'new DomMutations()' ");this.instancesController=e;const t=this;this.observer=new MutationObserver((function(){t.onDomMutate.apply(t,arguments)})),this.observer.observe(document,{attributes:!0,childList:!0,characterData:!0,characterDataOldValue:!0,subtree:!0,attributeOldValue:!0,attributeFilter:["class"]})};n.prototype.onDomMutate=function(e){const t=this.instancesController.getClasses(),n=`.${t.join(",.")}`;return 1!==n.length&&(e.forEach((function(e){switch(e.type){case"attributes":this.processMutationAttributes(e,t);break;case"characterData":break;case"childList":this.processMutationChildList(e.addedNodes,"addInstance",n,t),this.processMutationChildList(e.removedNodes,"removeInstance",n,t);break;case"default":default:console.error("Something wrong. Contact tech support")}}),this),!0)},n.prototype.processMutationAttributes=function(e,t){const n=this,r=e.target.className.split(" "),o=e.oldValue?e.oldValue.split(" "):[],s=r.filter(e=>-1===o.indexOf(e)),i=o.filter(e=>-1===r.indexOf(e)),a=s.filter(e=>-1!==t.indexOf(e));i.filter(e=>-1!==t.indexOf(e)).forEach(t=>{n.instancesController.removeInstance(n.instancesController.getInstanceNameByCssClass(t),e.target)}),a.forEach(t=>{n.instancesController.addInstance(n.instancesController.getInstanceNameByCssClass(t),e.target)})},n.prototype.processMutationChildList=function(e,t,n,r){const o=this;function s(e){r.forEach(n=>{e.classList.contains(n)&&o.instancesController[t](o.instancesController.getInstanceNameByCssClass(n),e)})}[].forEach.call(e,e=>1===e.nodeType&&"SCRIPT"!==e.nodeName&&"LINK"!==e.nodeName&&(s(e),[].forEach.call(e.querySelectorAll(n),s),!0))},n.prototype.stopObserve=function(){this.observer.disconnect()},e.exports=n},function(e,t){const n=function(e){this.spiral=e,this.constructor?(this._storage={instancesConstructors:{cssClasses:{},jsConstructors:{}},addons:{},instances:{}},this.events=new e.core.Events(["onRemoveInstance","onAddInstance"])):console.error("Please call InstancesController with new  - 'new InstancesController()' ")};n.prototype.registerInstanceType=function(e,t,n){const r=e.spiralFrameworkName||e.prototype.name;if(r||console.error("Instance constructor should have name inside it"),this._storage.instancesConstructors.jsConstructors.hasOwnProperty(r))console.error("Instance Constructor for type '%s' already added. Skipping",r);else if(t&&(this._storage.instancesConstructors.cssClasses[t]=r),this._storage.instancesConstructors.jsConstructors[r]=e,this._storage.instances[r]=[],!n){const e=document.getElementsByClassName(t);for(let t=0,n=e.length;t<n;t+=1)this.addInstance(r,e[t])}},n.prototype.addInstanceType=function(e,t,n){return console.warn("addInstanceType is deprecated. Please use registerInstanceType instead"),this.registerInstanceType(t,n)},n.prototype.addInstance=function(e,t,n){const r=this._storage.instancesConstructors.jsConstructors[e],o=this.getInstance(e,t);if(!r||o)return!1;const s=new r(this.spiral,t,n);return this._storage.instances[e].push({node:t,instance:s}),this.events.trigger("onAddInstance",{instance:s,type:e}),s},n.prototype.removeInstance=function(e,t){const n=this.getInstance(e,t,!0);if(!n)return!1;n.instance.die();const r=this._storage.instances[e].indexOf(n);return-1!==r&&this._storage.instances[e].splice(r,1),this.events.trigger("onRemoveInstance",{instance:n,type:e}),!0},n.prototype.getInstance=function(e,t,n){const r=this._storage.instances[e];let o=!1;if(!r)return!1;if(!(t=t instanceof HTMLElement?t:document.getElementById(t)))return!1;for(let e=0,s=r.length;e<s;e+=1)if(r[e].node===t){o=n?r[e]:r[e].instance;break}return o},n.prototype.getInstances=function(e){return this._storage.instances[e]||!1},n.prototype.registerAddon=function(e,t,n,r){this._storage.addons.hasOwnProperty(t)||(this._storage.addons[t]={}),this._storage.addons[t].hasOwnProperty(n)||(this._storage.addons[t][n]={}),this._storage.addons[t][n].hasOwnProperty(r)?console.error("The %s addon type %s already registered for instance %s! Skipping registration.",r,n,t):this._storage.addons[t][n][r]=e},n.prototype.getInstanceAddon=function(e,t,n){return!!(this._storage.addons.hasOwnProperty(e)&&this._storage.addons[e].hasOwnProperty(t)&&this._storage.addons[e][t].hasOwnProperty(n))&&this._storage.addons[e][t][n]},n.prototype.getClasses=function(){return Object.keys(this._storage.instancesConstructors.cssClasses)},n.prototype.getInstanceNameByCssClass=function(e){return this._storage.instancesConstructors.cssClasses[e]},e.exports=n},function(e,t,n){e.exports=n(18)},function(e,t,n){"use strict";n.r(t);var r=n(12),o=n(13),s=n(1),i=n(11);for(var a in i)"default"!==a&&function(e){n.d(t,e,(function(){return i[e]}))}(a);const c={core:s.a,helpers:s.b,tools:s.c,options:{instances:{}}};c.instancesController=new s.a.InstancesController(c),c.domMutation=new s.a.DomMutations(c.instancesController),c.events=new s.a.Events,Object(o.a)(c.events),c.ajax=new s.a.Ajax(window&&window.csrfToken?{headers:{"X-CSRF-Token":window.csrfToken}}:void 0),Object(r.a)(c.ajax,c.events),c.createModulePrototype=function(){return Object.create(s.a.BaseDOMConstructor.prototype)},c.registerInstanceType=c.instancesController.registerInstanceType.bind(c.instancesController),c.addInstance=c.instancesController.addInstance.bind(c.instancesController),c.removeInstance=c.instancesController.removeInstance.bind(c.instancesController),c.getInstance=c.instancesController.getInstance.bind(c.instancesController),c.getInstances=c.instancesController.getInstances.bind(c.instancesController),c.closest=s.b.domTools.closest,c.resolveKeyPath=s.c.resolveKeyPath,t.default=c},function(e,t,n){"use strict";var r=n(0),o=n(3),s=n(20),i=n(9);function a(e){var t=new s(e),n=o(s.prototype.request,t);return r.extend(n,s.prototype,t),r.extend(n,t),n}var c=a(n(6));c.Axios=s,c.create=function(e){return a(i(c.defaults,e))},c.Cancel=n(10),c.CancelToken=n(34),c.isCancel=n(5),c.all=function(e){return Promise.all(e)},c.spread=n(35),e.exports=c,e.exports.default=c},function(e,t,n){"use strict";var r=n(0),o=n(4),s=n(21),i=n(22),a=n(9);function c(e){this.defaults=e,this.interceptors={request:new s,response:new s}}c.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=a(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[i,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach((function(e){t.unshift(e.fulfilled,e.rejected)})),this.interceptors.response.forEach((function(e){t.push(e.fulfilled,e.rejected)}));t.length;)n=n.then(t.shift(),t.shift());return n},c.prototype.getUri=function(e){return e=a(this.defaults,e),o(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},r.forEach(["delete","get","head","options"],(function(e){c.prototype[e]=function(t,n){return this.request(r.merge(n||{},{method:e,url:t}))}})),r.forEach(["post","put","patch"],(function(e){c.prototype[e]=function(t,n,o){return this.request(r.merge(o||{},{method:e,url:t,data:n}))}})),e.exports=c},function(e,t,n){"use strict";var r=n(0);function o(){this.handlers=[]}o.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){r.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=o},function(e,t,n){"use strict";var r=n(0),o=n(23),s=n(5),i=n(6);function a(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return a(e),e.headers=e.headers||{},e.data=o(e.data,e.headers,e.transformRequest),e.headers=r.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),r.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||i.adapter)(e).then((function(t){return a(e),t.data=o(t.data,t.headers,e.transformResponse),t}),(function(t){return s(t)||(a(e),t&&t.response&&(t.response.data=o(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},function(e,t,n){"use strict";var r=n(0);e.exports=function(e,t,n){return r.forEach(n,(function(n){e=n(e,t)})),e}},function(e,t){var n,r,o=e.exports={};function s(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function a(e){if(n===setTimeout)return setTimeout(e,0);if((n===s||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:s}catch(e){n=s}try{r="function"==typeof clearTimeout?clearTimeout:i}catch(e){r=i}}();var c,u=[],l=!1,f=-1;function d(){l&&c&&(l=!1,c.length?u=c.concat(u):f=-1,u.length&&p())}function p(){if(!l){var e=a(d);l=!0;for(var t=u.length;t;){for(c=u,u=[];++f<t;)c&&c[f].run();f=-1,t=u.length}c=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===i||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];u.push(new h(e,t)),1!==u.length||l||a(p)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,t,n){"use strict";var r=n(0);e.exports=function(e,t){r.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))}},function(e,t,n){"use strict";var r=n(8);e.exports=function(e,t,n){var o=n.config.validateStatus;!o||o(n.status)?e(n):t(r("Request failed with status code "+n.status,n.config,null,n.request,n))}},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},function(e,t,n){"use strict";var r=n(29),o=n(30);e.exports=function(e,t){return e&&!r(t)?o(e,t):t}},function(e,t,n){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t,n){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,n){"use strict";var r=n(0),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,s,i={};return e?(r.forEach(e.split("\n"),(function(e){if(s=e.indexOf(":"),t=r.trim(e.substr(0,s)).toLowerCase(),n=r.trim(e.substr(s+1)),t){if(i[t]&&o.indexOf(t)>=0)return;i[t]="set-cookie"===t?(i[t]?i[t]:[]).concat([n]):i[t]?i[t]+", "+n:n}})),i):i}},function(e,t,n){"use strict";var r=n(0);e.exports=r.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function o(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=o(window.location.href),function(t){var n=r.isString(t)?o(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0}},function(e,t,n){"use strict";var r=n(0);e.exports=r.isStandardBrowserEnv()?{write:function(e,t,n,o,s,i){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(s)&&a.push("domain="+s),!0===i&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},function(e,t,n){"use strict";var r=n(10);function o(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var n=this;e((function(e){n.reason||(n.reason=new r(e),t(n.reason))}))}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var e;return{token:new o((function(t){e=t})),cancel:e}},e.exports=o},function(e,t,n){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}}])}));
//# sourceMappingURL=core.js.map