(function(){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _createForOfIteratorHelper(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw i}}}}const showLoader=()=>{let e=document.querySelector(".loader");e&&(e.style.display="block")},hideLoader=()=>{let e=document.querySelector(".loader");e&&(e.style.display="none")},spaceID=()=>{let e=new URLSearchParams(window.location.search);return e.get("sid")?e.get("sid"):""},setCookie=(e,t,n)=>{let r="";if(n){let e=new Date;e.setTime(e.getTime()+24*n*60*60*1e3),r=";expires="+e.toUTCString()}document.cookie=e+"="+(escape(t)||"")+r+";path=/;domain=.kenzap.cloud"},getCookie=e=>{let t=e+"=",n=decodeURIComponent(document.cookie).split(";");for(let e=0;e<n.length;e++){let r=n[e];for(;" "==r.charAt(0);)r=r.substring(1);if(0==r.indexOf(t))return r.substring(t.length,r.length)}return""},checkHeader=()=>{let e=localStorage.hasOwnProperty("header")&&localStorage.hasOwnProperty("header-version")?localStorage.getItem("header-version"):0,t=window.location.hostname+"/"+spaceID()+"/"+getCookie("locale");return t!=getCookie("check")&&(e=0,console.log("refresh")),setCookie("check",t,5),e},headers={Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+getCookie("kenzap_api_key"),"Kenzap-Locale":getCookie("locale")?getCookie("locale"):"en","Kenzap-Header":checkHeader(),"Kenzap-Token":getCookie("kenzap_token"),"Kenzap-Sid":spaceID()},parseApiError=e=>{if(console.log(e),isNaN(e.code)){let t=e;try{t=JSON.stringify(t)}catch(e){}let n=new URLSearchParams;return n.append("cmd","report"),n.append("sid",spaceID()),n.append("token",getCookie("kenzap_token")),n.append("data",t),fetch("https://api-v1.kenzap.cloud/error/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:n}),void alert("Can not connect to Kenzap Cloud")}if(401===e.code){if(-1!=window.location.href.indexOf("localhost"))return void alert(e.reason);location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href}else alert(e.reason)},onClick=(e,t)=>{if(document.querySelector(e))for(let n of document.querySelectorAll(e))n.removeEventListener("click",t,!0),n.addEventListener("click",t,!0)},onChange=(e,t)=>{if(document.querySelector(e))for(let n of document.querySelectorAll(e))n.removeEventListener("change",t,!0),n.addEventListener("change",t,!0)},simulateClick=e=>{let t=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window});e.dispatchEvent(t)},toast=e=>{if(!document.querySelector(".toast")){let e='\n        <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">\n            <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">\n                <div class="d-flex">\n                    <div class="toast-body"></div>\n                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>\n                </div>\n            </div>\n        </div>';document.querySelector("body > div")&&document.querySelector("body > div").insertAdjacentHTML("afterend",e)}let t=new bootstrap.Toast(document.querySelector(".toast"));document.querySelector(".toast .toast-body").innerHTML=e,t.show()};var getProductId=function(){var e=new URLSearchParams(window.location.search);return e.get("id")?e.get("id"):""},onlyNumbers=function(e,t){document.querySelector(e)&&document.querySelector(e).addEventListener("keypress",(function(n){if(!t.includes(n.which)&&isNaN(String.fromCharCode(n.which))||32==n.which||document.querySelector(e).value.includes(String.fromCharCode(n.which))&&t.includes(n.which))return n.preventDefault(),!1}))},HTMLContent=function(e){return'\n  <div class="container p-sk-edit mt-4">\n    <div class="row">\n        <div class="col-lg-9 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">\n            <div class="sections" id="sections" role="tablist" style="width:100%;">\n\n                <div class="row">\n                    <div class="col-12 grid-margin stretch-card">\n                        <div class="card border-white shadow-sm p-sm-3">\n                            <div class="card-body">\n\n                                <div class="landing_status"></div>\n                                <input type="hidden" class="form-control" id="landing-slug" value="">\n\n                                <h4 id="elan" class="card-title mb-4">'.concat(e("Sketch"),'</h4>\n\n                                <div id="placeholders">\n\n                                    <div class="mb-3">\n                                        <label class="banner-descshort-l form-label d-none" for="desc">').concat(e("Drawing"),'</label>\n                                        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">\n                                            <input type="radio" class="btn-check" name="sketchmode" id="preview" autocomplete="off" checked>\n                                            <label class="btn btn-outline-primary" for="preview">').concat(e("Preview"),'</label>\n\n                                            <input type="radio" class="btn-check" name="sketchmode" id="drawing" autocomplete="off">\n                                            <label class="btn btn-outline-primary" for="drawing">').concat(e("Drawing"),'</label>\n\n                                            <input type="radio" class="btn-check" name="sketchmode" id="editing" autocomplete="off">\n                                            <label class="btn btn-outline-primary" for="editing">').concat(e("Editing"),'</label>\n                                        </div>\n                                        <div class="drawing"></div>\n                                        <div class="clearfix"></div>\n                                    </div>\n\n                                    <div class="mb-3 mw">\n                                        <label class="banner-title-l form-label" for="p-test">').concat(e("Input fields"),'</label>\n                                        <div class="input-fields">\n\n                                        </div>\n                                        \n                                        <p class="form-text"> </p>\n                                    </div>\n\n                                    <div class="mb-3 mw">\n                                        <label class="form-label" for="calc_price">').concat(e("Calculate price"),'</label>\n                                        <select id="calc_price" class="form-control inp" >\n                                            <option value="default">').concat(e("Flat price"),'</option>\n                                            <option value="sketch">').concat(e("By sketch"),'</option>\n                                            <option value="formula">').concat(e("By formula"),'</option>\n                                        </select>\n                                        <p class="form-text"> </p>\n                                    </div>\n\n                                    <div class="mb-3 mw">\n                                        <label class="form-label" for="formula">').concat(e("Formula"),'</label>\n                                        <input id="formula" type="text" class="form-control inp" placeholder="').concat(e("(A + B) * L"),'">\n                                        <p class="form-text formula-hint"> </p>\n                                    </div>\n\n                                    <div class="mb-3 mw">\n                                        <label class="form-label" for="p-test">').concat(e("Test field"),'</label>\n                                        <input type="text" class="form-control inp" id="p-test" placeholder="').concat(e("Test field.."),'">\n                                        <p class="form-text"> </p>\n                                    </div>\n\n                                    <div class="mb-3 mw">\n                                        <div class="list-wrapper">\n                                            <ul class="d-flex flex-column-reverse"> </ul>\n                                        </div>\n                                        <p class="form-text"> </p>\n                                    </div>\n\n                                </div>\n\n                                <div class="desc-repeater-cont">\n\n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n    </div>\n  </div>\n\n  ')},Polyline=_createClass((function e(t){var n=this;_classCallCheck(this,e),_defineProperty(this,"draw",(function(e){if("drawing"==n.mode){var t='<g data-id="'.concat(n.id,'"><polyline data-id="').concat(n.id,'" points="').concat(n.polyPoints(e),'" style="stroke-width:').concat(n.style.stroke_width,";stroke:").concat(n.style.stroke,";fill:").concat(n.style.fill,';"></polyline></g>');return document.querySelector("#svg").insertAdjacentHTML("beforeend",t),n.drawCircle("start",e),n}})),_defineProperty(this,"setCoords",(function(e){if(document.querySelector('#svg polyline[data-id="'+n.id+'"]')){var t=document.querySelector('#svg polyline[data-id="'+n.id+'"]').getAttribute("points").split(" ");if("drawing"==e.mode&&(t.length>3&&(t=t.splice(0,2)),document.querySelector('#svg polyline[data-id="'+n.id+'"]')&&document.querySelector('#svg polyline[data-id="'+n.id+'"]').setAttribute("points",(t.join(" ")+" "+n.polyPoints(e.points)).trim())),"editing"==e.mode){switch(n.part){case"start":t[0]=e.points[0].x,t[1]=e.points[0].y;break;case"end":t[2]=e.points[0].x,t[3]=e.points[0].y}document.querySelector('#svg polyline[data-id="'+n.id+'"]')&&document.querySelector('#svg polyline[data-id="'+n.id+'"]').setAttribute("points",t.join(" ")),document.querySelector('#svg rect[data-id="'+n.part+n.id+'"]')&&(document.querySelector('#svg rect[data-id="'+n.part+n.id+'"]').setAttribute("x",e.points[0].x-4),document.querySelector('#svg rect[data-id="'+n.part+n.id+'"]').setAttribute("y",e.points[0].y-4)),console.log(n.part+" editing "+n.id)}}})),_defineProperty(this,"setEndCoords",(function(e){n.setCoords(e),n.drawCircle("end",e.points);var t=document.querySelector('#svg polyline[data-id="'+n.id+'"]').getAttribute("points").split(" ");t[0]==t[2]&&t[1]==t[3]&&document.querySelector('#svg g[data-id="'+n.id+'"]').remove()})),_defineProperty(this,"drawCircle",(function(e,t){var r='<rect data-id="'.concat(e+n.id,'" x="').concat(t[0].x-4,'" y="').concat(t[0].y-4,'" width="8" height="8" rx="8" style="stroke-width:2px;stroke:').concat(n.style.stroke,';fill:rgba(255,255,255,1);" />');document.querySelector('#svg g[data-id="'+n.id+'"]').insertAdjacentHTML("beforeend",r)})),_defineProperty(this,"polyPoints",(function(e){return e.reduce((function(e,t){return e+t.x+" "+t.y+" "}),"").trim()})),_defineProperty(this,"setSVGCoords",(function(e){return n})),_defineProperty(this,"getID",(function(){return n.id})),_defineProperty(this,"genID",(function(e){for(var t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=0;r<e;r++)t+=n.charAt(Math.floor(Math.random()*n.length));return t})),this.data=t,this.id=t.id?t.id:this.genID(6),this.mode=t.mode?t.mode:"drawing",this.part="",this.selected=null,this.style={stroke_width:"3px",stroke:"#00F",fill:"rgba(255, 255, 255, 0)"},this.id.includes("start")?(this.id=this.id.replace("start",""),this.part="start"):this.id.includes("end")?(this.id=this.id.replace("end",""),this.part="end"):this.draw(t.points)})),_this={init:function(){_this.getData()},state:{ajaxQueue:0,settings:{},firstLoad:!0,sketch:{mode:"preview",polyline_last:{id:null}}},getData:function(){var e=getProductId();spaceID(),fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:headers,body:JSON.stringify({query:{user:{type:"authenticate",fields:["avatar"],token:getCookie("kenzap_token")},product:{type:"find",key:"ecommerce-product",id:e,fields:["_id","id","test","input_fields","formula","calc_price","updated"]},settings:{type:"get",key:"sk-design",fields:["currency","currency_symb","currency_symb_loc","tax_calc","tax_auto_rate","tax_rate","tax_display"]},locale:{type:"locale",source:["extension"],key:"sk-design"}}})}).then((function(e){return e.json()})).then((function(e){if(hideLoader(),e.success){if(e.success){if(_this.state.settings=e.settings,0==e.product.length)return;document.querySelector("#contents").insertAdjacentHTML("beforeend",HTMLContent(__)),_this.loadDrawing(e.product),_this.renderPage(e.product),_this.initListeners()}}else parseApiError(e)})).catch((function(e){parseApiError(e)}))},renderPage:function renderPage(product){var d=document;product.input_fields.forEach((function(e){var t=_this.structInputRow(e);if(document.querySelector("#field"+e.id)||document.querySelector(".input-fields").insertAdjacentHTML("beforeend",t),!document.querySelector('#svg g[data-id="'+e.id+'"]')){var n=e.points.split(" ");_this.state.sketch.polyline=new Polyline({points:[{x:n[0],y:n[1]}],mode:"drawing",id:e.id}),_this.state.sketch.polyline.setCoords({points:[{x:n[2],y:n[3]}],mode:"drawing"}),_this.state.sketch.polyline.setEndCoords({points:[{x:n[2],y:n[3]}],mode:"drawing"})}})),_this.listeners.inputFieldListeners(),_this.state.sketch.polyline=null,_this.state.sketch.mode="drawing",d.querySelector("#calc_price").value=product.calc_price,d.querySelector("#formula").value=product.formula,document.querySelector("#formula").addEventListener("keyup",(function(e){var formula=e.currentTarget.value,labels="",_iterator=_createForOfIteratorHelper(document.querySelectorAll(".input-fields > div")),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var div=_step.value;labels+=div.querySelector(".field-label").value+" ",formula=formula.replace(div.querySelector(".field-label").value,parseFloat(div.querySelector(".field-default").value))}}catch(e){_iterator.e(e)}finally{_iterator.f()}labels=labels.trim();var result=0;try{document.querySelector(".formula-hint").innerHTML="",result=eval(formula),document.querySelector("#formula").setCustomValidity("")}catch(e){document.querySelector("#formula").setCustomValidity(__("Invalid formula")),document.querySelector(".formula-hint").innerHTML=__("Invalid formula. Use one of the following letters only: "+labels)}document.querySelector("#formula").parentElement.classList.add("was-validated"),result>0&&(document.querySelector(".formula-hint").innerHTML=__("Result: <b>%1$</b> based on the input fields default values",result))}))},initListeners:function(){_this.state.firstLoad&&(onClick(".btn-save",_this.listeners.saveProduct),onClick(".p-modal .btn-primary",_this.listeners.modalSuccessBtn),_this.state.firstLoad=!1)},listeners:{editBlock:function(e){e.preventDefault();var t=document.querySelector(".add-mix-block");t.dataset.action="edit",t.dataset.index=e.currentTarget.dataset.index,setTimeout((function(){return simulateClick(t)}),10),console.log("editBlock")},inputFieldListeners:function(e){onClick(".remove-input-field",_this.listeners.removeInputFields),onlyNumbers(".field-default",[8,46]),onlyNumbers(".field-min",[8,46]),onlyNumbers(".field-max",[8,46])},removeBlock:function(e){e.preventDefault(),confirm(__("Remove entire block?"))&&e.currentTarget.parentNode.parentNode.remove(),console.log("removeBlock")},removeInputFields:function(e){if(confirm(__("Remove row?"))){var t=e.currentTarget.dataset.id;document.querySelector('#svg g[data-id="'+t+'"]')&&document.querySelector('#svg g[data-id="'+t+'"]').remove(),document.querySelector(".input-fields #field"+t)&&document.querySelector(".input-fields #field"+t).remove()}},saveProduct:function(e){e.preventDefault();var t,n={input_fields:[]},r=_createForOfIteratorHelper(document.querySelectorAll(".input-fields > div"));try{for(r.s();!(t=r.n()).done;){var o=t.value,i={};i.id=o.id.replace("field",""),i.points=o.dataset.points,i.label=o.querySelector(".field-label").value,i.default=parseFloat(o.querySelector(".field-default").value),i.min=parseFloat(o.querySelector(".field-min").value),i.max=parseFloat(o.querySelector(".field-max").value),n.input_fields.push(i)}}catch(e){r.e(e)}finally{r.f()}n.calc_price=document.querySelector("#calc_price").value,n.formula=document.querySelector("#formula").value,console.log(n);var a=getProductId(),s=spaceID();showLoader(),fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:headers,body:JSON.stringify({query:{product:{type:"update",key:"ecommerce-product",id:a,sid:s,data:n}}})}).then((function(e){return e.json()})).then((function(e){e.success?_this.uploadImages():parseApiError(e)})).catch((function(e){parseApiError(e)}))},openImage:function(e){e.preventDefault(),simulateClick(document.querySelector(".aif-"+e.currentTarget.dataset.index))},previewImage:function(e){e.preventDefault();var t=e.currentTarget;if(t.files&&t.files[0]){if("image/jpeg"!=t.files[0].type&&"image/jpg"!=t.files[0].type&&"image/png"!=t.files[0].type)return void toast(__("Please provide image in JPEG format"));if(t.files[0].size>5e6)return void toast(__("Please provide image less than 5 MB in size!"));var n=t.dataset.index,r=new FileReader;r.onload=function(e){document.querySelector(".images-"+n).setAttribute("src",e.currentTarget.result)},r.readAsDataURL(t.files[0]),e.currentTarget.parentElement.querySelector(".remove").classList.remove("hd")}},removeImage:function(e){var t=e.currentTarget.parentElement.dataset.index;document.querySelector(".aif-"+t).value="",document.querySelector(".images-"+t).setAttribute("src","https://account.kenzap.com/images/placeholder.jpg"),e.currentTarget.classList.add("hd")},sketchMode:function(e){_this.state.sketch.mode=e.currentTarget.id,console.log("sketchMode"+e.currentTarget.id),"preview"==e.currentTarget.id?document.querySelector("#svg").style.zIndex="-2":document.querySelector("#svg").style.zIndex="2",document.querySelector(".sketch-cont").dataset.mode=e.currentTarget.id},modalSuccessBtn:function(e){console.log("calling modalSuccessBtnFunc"),_this.listeners.modalSuccessBtnFunc(e)},stockManagement:function(e){var t,n=_createForOfIteratorHelper(document.querySelectorAll(".stock-cont"));try{for(n.s();!(t=n.n()).done;){var r=t.value;e.currentTarget.checked?r.classList.remove("d-none"):r.classList.add("d-none"),e.currentTarget.value=e.currentTarget.checked?"1":"0"}}catch(e){n.e(e)}finally{n.f()}},modalSuccessBtnFunc:null},structInputRow:function(e){var t,n=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],r=_createForOfIteratorHelper(document.querySelectorAll(".input-fields > div .field-label"));try{var o=function(){var e=t.value;n=n.filter((function(t){return t!==e.value}))};for(r.s();!(t=r.n()).done;)o()}catch(e){r.e(e)}finally{r.f()}var i="";return n.forEach((function(t){i+='<option value="'+t+'" '+(e.label==t?"selected":"")+">"+t+"</option>"})),'\n                <div id="field'.concat(e.id,'" class="d-flex flex-row bd-highlight mb-0" data-points="').concat(e.points,'">\n                    <div class="me-3" >\n                        <select class="form-select field-label" style="width:64px" aria-label="Default select example">\n                            ').concat(i,'\n                        </select>\n                        <p class="form-text">').concat(__("label"),'</p>\n                    </div>\n                    <div class="me-3">\n                        <input type="text" class="form-control field-default" placeholder="').concat(__("0"),'" value="').concat(e.default,'"></input>\n                        <p class="form-text">').concat(__("default value"),'</p>\n                    </div>\n                    <div class="me-3">\n                        <input type="text" class="form-control field-min" placeholder="').concat(__("0"),'" value="').concat(e.min,'"></input>\n                        <p class="form-text">').concat(__("min value"),'</p>\n                    </div>\n                    <div class="me-3">\n                        <input type="text" class="form-control field-max" placeholder="').concat(__("1000"),'" value="').concat(e.max,'"></input>\n                        <p class="form-text">').concat(__("max value"),'</p>\n                    </div>\n                    <a href="javascript:void(0);" onclick="javascript:;">\n                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" class="remove-input-field bi bi-x-circle mt-2" data-id="').concat(e.id,'" viewBox="0 0 16 16">\n                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>\n                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>\n                        </svg>\n                    </a>\n                </div>\n            ')},loadDrawing:function(e){for(var t=document,n=getProductId(),r=spaceID(),o="",i=0;i<1;i++){o+='\n          <div class="p-img-cont sketch-cont float-start" data-mode="preview" style="max-width:100%;">\n            <p data-index="sketch'.concat(i,'" style="position: relative;">\n              <img class="p-img images-sketch').concat(i,'" data-index="sketch').concat(i,'" src="').concat("https://account.kenzap.com/images/placeholder.jpg",'" />\n              <svg id="svg" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;display: block; position: absolute; top: 0; left: 0; z-index: -2;"></svg>\n              <span class="remove hd" title="').concat(__("Remove"),'">×</span>\n            </p>\n            <input type="file" name="img[]" data-type="search" data-index="sketch').concat(i,'" class="sketchfile aif-sketch').concat(i,' d-none">\n          </div>')}t.querySelector(".drawing").innerHTML=o,onClick(".drawing img",_this.listeners.openImage),onClick(".drawing .remove",_this.listeners.removeImage),onChange(".drawing .sketchfile",_this.listeners.previewImage),onClick('[name="sketchmode"]',_this.listeners.sketchMode),t.querySelector("#svg").addEventListener("mousedown",(function(e){e.preventDefault(),"drawing"==_this.state.sketch.mode&&(_this.state.sketch.polyline=new Polyline({points:[{x:e.offsetX,y:e.offsetY}],mode:"drawing"})),"editing"==_this.state.sketch.mode&&(_this.state.sketch.polyline=new Polyline({points:[{x:e.offsetX,y:e.offsetY}],mode:"editing",id:_this.state.sketch.rect}))})),t.querySelector("#svg").addEventListener("mousemove",(function(e){e.preventDefault(),_this.state.sketch.polyline&&"drawing"==_this.state.sketch.mode&&_this.state.sketch.polyline.setCoords({points:[{x:e.offsetX,y:e.offsetY}],mode:"drawing"}),_this.state.sketch.polyline&&"editing"==_this.state.sketch.mode&&_this.state.sketch.polyline.setCoords({points:[{x:e.offsetX,y:e.offsetY}],mode:"editing"})})),t.querySelector("#svg").addEventListener("mouseup",(function(e){if(e.preventDefault(),_this.state.sketch.polyline&&"drawing"==_this.state.sketch.mode&&_this.state.sketch.polyline.setEndCoords({points:[{x:e.offsetX,y:e.offsetY}],mode:"drawing"}),!_this.state.sketch.polyline||"drawing"!=_this.state.sketch.mode&&"editing"!=_this.state.sketch.mode||_this.refreshFields(),_this.state.sketch.polyline=null,document.querySelector("#svg rect")){var t,n=_createForOfIteratorHelper(document.querySelectorAll("#svg rect"));try{for(n.s();!(t=n.n()).done;){var r=t.value;r.onmouseover=function(e){_this.state.sketch.rect=e.currentTarget.dataset.id,_this.state.sketch.polyline_last.id=e.currentTarget.dataset.id.replace("start","").replace("end","")},r.onmouseleave=function(e){_this.state.sketch.rect=null}}}catch(e){n.e(e)}finally{n.f()}}if(document.querySelector("#svg polyline")){var o,i=_createForOfIteratorHelper(document.querySelectorAll("#svg polyline"));try{for(i.s();!(o=i.n()).done;){o.value.onmouseover=function(e){_this.state.sketch.polyline_last.id=e.currentTarget.dataset.id}}}catch(e){i.e(e)}finally{i.f()}}})),document.querySelector("#svg").onmouseover=function(e){_this.state.sketch.hover=!0},document.querySelector("#svg").onmouseleave=function(e){_this.state.sketch.hover=!1};var a=function(e){8==e.which&&"editing"==_this.state.sketch.mode&&_this.state.sketch.hover&&(document.querySelector('#svg g[data-id="'+_this.state.sketch.polyline_last.id+'"]')&&document.querySelector('#svg g[data-id="'+_this.state.sketch.polyline_last.id+'"]').remove(),document.querySelector(".input-fields #field"+_this.state.sketch.polyline_last.id)&&document.querySelector(".input-fields #field"+_this.state.sketch.polyline_last.id).remove())};document.removeEventListener("keydown",a,!0),document.addEventListener("keydown",a,!0);for(var s=0;s<1;s++){var l=CDN+"/S"+r+"/sketch-"+n+"-"+(parseInt(s)+1)+"-500x500.jpeg?"+e.updated;setTimeout((function(n,r,o){var i=!0;if(void 0!==e.img&&(e.img[o]||(i=!1)),i){var a=new Image;a.onload=function(){t.querySelector(r+o).setAttribute("src",n),t.querySelector(r+o).parentElement.querySelector(".remove").classList.remove("hd")},a.src=n}}),300,l,".images-sketch",s)}},refreshFields:function(){if(document.querySelector("#svg g")){var e,t=_createForOfIteratorHelper(document.querySelectorAll("#svg g"));try{for(t.s();!(e=t.n()).done;){var n=e.value,r=n.dataset.id,o={id:r,label:"",default:0,min:0,max:0,points:n.querySelector("polyline").getAttribute("points")},i=_this.structInputRow(o);document.querySelector("#field"+r)?document.querySelector("#field"+r).setAttribute("data-points",o.points):document.querySelector(".input-fields").insertAdjacentHTML("beforeend",i),_this.listeners.inputFieldListeners()}}catch(e){t.e(e)}finally{t.f()}}},uploadImages:function(){document.querySelector(".imgupnote")&&document.querySelector(".imgupnote").remove();var e,t=0,n=_createForOfIteratorHelper(document.querySelectorAll(".sketchfile"));try{for(n.s();!(e=n.n()).done;){var r=e.value;t+=1;var o=getProductId(),i=spaceID(),a=r.files[0];if(void 0!==a){var s=new FormData;s.append("id",o),s.append("sid",i),s.append("pid",o),s.append("key","image"),s.append("sizes","1000|500x500|250x250|100x100"),s.append("file",a),s.append("slug","sketch-"+o+"-"+t),s.append("token",getCookie("kenzap_token")),a.value="",_this.state.ajaxQueue+=1,fetch("https://api-v1.kenzap.cloud/upload/",{body:s,method:"post"}).then((function(e){return e.json()})).then((function(e){_this.state.ajaxQueue-=1,e.success&&0==_this.state.ajaxQueue&&(toast(__("Sketch updated")),hideLoader())}))}}}catch(e){n.e(e)}finally{n.f()}0==_this.state.ajaxQueue&&(toast(__("Product updated")),hideLoader())}};_this.init()})();