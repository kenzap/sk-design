!function(){"use strict";const t=t=>{let e=new URLSearchParams(window.location.search),n=e.get("sid")?e.get("sid"):"",a=-1==t.indexOf("?")?"?sid="+n:"&sid="+n;return t+a},e=()=>{let t=new URLSearchParams(window.location.search);return t.get("sid")?t.get("sid"):""},n=t=>{let e=t+"=",n=decodeURIComponent(document.cookie).split(";");for(let t=0;t<n.length;t++){let a=n[t];for(;" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(e))return a.substring(e.length,a.length)}return""},a={Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+n("kenzap_api_key"),"Kenzap-Locale":n("locale")?n("locale"):"en","Kenzap-Header":(()=>{let t=localStorage.hasOwnProperty("header")&&localStorage.hasOwnProperty("header-version")?localStorage.getItem("header-version"):0,a=window.location.hostname+"/"+e()+"/"+n("locale");return a!=n("check")&&(t=0,console.log("refresh")),((t,e,n)=>{let a="";if(n){let t=new Date;t.setTime(t.getTime()+24*n*60*60*1e3),a=";expires="+t.toUTCString()}document.cookie=t+"="+(escape(e)||"")+a+";path=/;domain=.kenzap.cloud"})("check",a,5),t})(),"Kenzap-Token":n("kenzap_token"),"Kenzap-Sid":e()},r=t=>{if(console.log(t),isNaN(t.code)){let a=t;try{a=JSON.stringify(a)}catch(t){}let r=new URLSearchParams;return r.append("cmd","report"),r.append("sid",e()),r.append("token",n("kenzap_token")),r.append("data",a),fetch("https://api-v1.kenzap.cloud/error/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:r}),void alert("Can not connect to Kenzap Cloud")}if(401===t.code){if(-1!=window.location.href.indexOf("localhost"))return void alert(t.reason);location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href}else alert(t.reason)},o=(t,e)=>{if(document.querySelector(t))for(let n of document.querySelectorAll(t))n.removeEventListener("click",e,!0),n.addEventListener("click",e,!0)};function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function c(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return i(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var a=0,r=function(){};return{s:r,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,c=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return c=t.done,t},e:function(t){s=!0,o=t},f:function(){try{c||null==n.return||n.return()}finally{if(s)throw o}}}}var s=function(){var t=new URLSearchParams(window.location.search),e=t.get("page")?t.get("page"):1;return parseInt(e)},l=function(t,e,n){if(void 0!==e){var a=e.limit+e.offset;a>e.total_records&&(a=e.total_records),document.querySelector("#listing_info").innerHTML=t("Showing %1$ to %2$ of %3$ entries",1+e.offset,a,e.total_records);var r=Math.ceil(e.total_records/e.limit);document.querySelector("#listing_paginate").style.display=r<2?"none":"block";var o=s(),i='<ul class="pagination d-flex justify-content-end pagination-flat mb-0">';i+='<li class="paginate_button page-item previous" id="listing_previous"><a href="#" aria-controls="order-listing" data-type="prev" data-page="0" tabindex="0" class="page-link"><span aria-hidden="true">&laquo;</span></li>';for(var l=0;l<r;)(++l>=o-3&&l<=o||l<=o+3&&l>=o)&&(i+='<li class="paginate_button page-item '+(o==l?"active":"")+'"><a href="#" aria-controls="order-listing" data-type="page" data-page="'+l+'" tabindex="0" class="page-link">'+l+"</a></li>");i+='<li class="paginate_button page-item next" id="order-listing_next"><a href="#" aria-controls="order-listing" data-type="next" data-page="2" tabindex="0" class="page-link"><span aria-hidden="true">&raquo;</span></a></li>',i+="</ul>",document.querySelector("#listing_paginate").innerHTML=i;var d,u=c(document.querySelectorAll(".page-link"));try{var p=function(){var t=d.value;t.addEventListener("click",(function(e){var a,o,i,c,l,d=parseInt(s()),u=d;switch(t.dataset.type){case"prev":(d-=1)<1&&(d=1);break;case"page":d=t.dataset.page;break;case"next":(d+=1)>r&&(d=r)}if(window.history.replaceState){var p=window.location.search;a="page",o=d,i=p,c=new RegExp("([?;&])"+a+"[^&;]*[;&]?"),p=((l=i.replace(c,"$1").replace(/&$/,"")).length>2?l+"&":"?")+(o?a+"="+o:""),window.history.replaceState("kenzap-cloud",document.title,window.location.pathname+p)}return u!=d&&n(),e.preventDefault(),!1}))};for(u.s();!(d=u.n()).done;)p()}catch(t){u.e(t)}finally{u.f()}}else document.querySelector("#listing_info").innerHTML=t("no records to display")},d=function(t,e){switch(e=parseInt(e)){case 0:return'<div class="badge bg-warning text-dark fw-light">'+t("Draft")+"</div>";case 1:return'<div class="badge bg-primary fw-light">'+t("Published")+"</div>";case 3:return'<div class="badge bg-secondary fw-light">'+t("Unpublished")+"</div>";default:return'<div class="badge bg-secondary fw-light">'+t("Drafts")+"</div>"}},u=function(t,e){switch(e=p(e),e=(Math.round(100*parseFloat(e))/100).toFixed(2),t.state.settings.currency_symb_loc){case"left":e=t.state.settings.currency_symb+e;break;case"right":e+=t.state.settings.currency_symb;break;case"left_space":e=t.state.settings.currency_symb+" "+e;break;case"right_space":e=e+" "+t.state.settings.currency_symb}return e},p=function(t){return t=t||0,t=parseFloat(t),t=Math.round(100*t)/100},m={state:{firstLoad:!0,settings:{},limit:10},init:function(){m.getData()},getData:function(){m.state.firstLoad&&(()=>{let t=document.querySelector(".loader");t&&(t.style.display="block")})();var t=document.querySelector(".search-cont input")?document.querySelector(".search-cont input").value:"";fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:a,body:JSON.stringify({query:{user:{type:"authenticate",fields:["avatar"],token:n("kenzap_token")},locale:{type:"locale",source:["extension"],key:"ecommerce"},settings:{type:"get",key:"ecommerce-settings",fields:["currency","currency_symb","currency_symb_loc","tax_calc","tax_auto_rate","tax_rate","tax_display"]},products:{type:"find",key:"ecommerce-product",fields:["_id","id","img","status","price","title","updated"],limit:m.state.limit,offset:t.length>0?0:s()*m.state.limit-m.state.limit,search:{field:"title",s:t},sortby:{field:"created",order:"DESC"}}}})}).then((function(t){return t.json()})).then((function(t){(()=>{let t=document.querySelector(".loader");t&&(t.style.display="none")})(),t.success?((t=>{if(t.header&&localStorage.setItem("header",t.header),!document.querySelector("#k-script")){let t=document.createElement("div");t.innerHTML=localStorage.getItem("header"),t=t.firstChild,document.body.prepend(t),Function(document.querySelector("#k-script").innerHTML).call("test")}t.locale&&window.i18n.init(t.locale)})(t),m.loadPageStructure(),m.renderPage(t),m.initListeners(),m.initPagination(t),m.initFooter(),m.state.firstLoad=!1):r(t)})).catch((function(t){r(t)}))},authUser:function(t){t.user&&t.user.success},loadPageStructure:function(){m.state.firstLoad&&(document.querySelector("#contents").innerHTML=function(t){return'\n    <div class="container">\n\n        <div class="d-md-flex justify-content-between bd-highlight mb-3">\n            <nav class="bc" aria-label="breadcrumb"></nav>\n            <button class="btn btn-primary btn-add mt-3 mb-1 mt-md-0 mb-md-0" type="button">'.concat(t("Add product"),'</button>\n        </div>\n\n        <div class="row">\n            <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">\n                <div class="card border-white shadow-sm border-0">\n                    <div class="card-body p-0">\n                        <div class="no-footer">\n                            <div class="row">\n                                <div class="col-sm-12">\n                                    <div class="table-responsive">\n                                        <table class="table table-hover table-borderless align-middle table-striped table-p-list mb-0" style="min-width: 800px;">\n                                            <thead>\n\n                                            </thead>\n                                            <tbody>\n\n                                            </tbody>\n                                        </table>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <div class="row my-2">\n                                <div class="col-sm-12 col-md-5 d-flex align-items-center">\n                                    <div class="dataTables_info mx-2 text-secondary fw-lighter " id="listing_info"\n                                        role="status" aria-live="polite">&nbsp;</div>\n                                </div>\n                                <div class="col-sm-12 col-md-7">\n                                    <div class="dataTables_paginate paging_simple_numbers m-2" id="listing_paginate">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class="modal" tabindex="-1">\n        <div class="modal-dialog">\n            <div class="modal-content">\n                <div class="modal-header">\n                    <h5 class="modal-title"></h5>\n                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n                </div>\n                <div class="modal-body">\n\n                </div>\n                <div class="modal-footer">\n                    <button type="button" class="btn btn-primary btn-modal"></button>\n                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">\n        <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive"\n            aria-atomic="true" data-bs-delay="3000">\n            <div class="d-flex">\n                <div class="toast-body"></div>\n                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"\n                    aria-label="Close"></button>\n            </div>\n        </div>\n    </div>\n    \n    ')}(__))},renderPage:function(e){if(m.state.firstLoad&&((t=>{let e='<ol class="breadcrumb mt-2 mb-0">';for(let n of t)void 0===n.link?e+=`<li class="breadcrumb-item">${n.text}</li>`:e+=`<li class="breadcrumb-item"><a href="${n.link}">${n.text}</a></li>`;e+="</ol>",document.querySelector(".bc").innerHTML=e})([{link:t("https://dashboard.kenzap.cloud"),text:__("Dashboard")},{link:t("/"),text:__("E-commerce")},{text:__("Product list")}]),document.querySelector(".table thead").innerHTML='\n                <tr>\n                    <th>\n                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#212529" class="bi justify-content-end bi-search mb-1" viewBox="0 0 16 16" >\n                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>\n                        </svg>\n                    </th>\n                    <th>\n                        <div class="search-cont input-group input-group-sm mb-0 justify-content-start">     \n                            <input type="text" placeholder="'.concat(__("Search products"),'" class="form-control border-top-0 border-start-0 border-end-0 rounded-0" aria-label="').concat(__("Search products"),'" aria-describedby="inputGroup-sizing-sm" style="max-width: 200px;">\n                        </div>\n                        <span>').concat(__("Title"),"</span>\n                    </th>\n                    <th>").concat(__("Status"),"</th>\n                    <th>").concat(__("Price"),"</th>\n                    <th>").concat(__("Last change"),"</th>\n                    <th></th>\n                </tr>")),0!=e.products.length){var n=(()=>{let t=new URLSearchParams(window.location.search);return t.get("sid")?t.get("sid"):""})();m.state.settings=e.settings;var a,r="";for(var o in e.products){var i="https://cdn.kenzap.com/loading.png";void 0===e.products[o].img&&(e.products[o].img=[]),e.products[o].img[0]&&(i=CDN+"/S"+n+"/product-"+e.products[o]._id+"-1-100x100.jpeg?"+e.products[o].updated),r+='\n                <tr>\n                    <td>\n                        <div class="timgc">\n                            <a href="'.concat(t("/product-edit/?id="+e.products[o]._id),'"><img src="').concat(i,'" data-srcset="').concat(i,'" class="img-fluid rounded" alt="').concat(__("Product placeholder"),'" srcset="').concat(i,'" ></a>\n                        </div>\n                    </td>\n                    <td class="destt" style="max-width:250px;min-width:250px;">\n                        <div class="my-1"> \n                            <a class="text-body" href="').concat(t("/product-edit/?id="+e.products[o]._id),'" >').concat(e.products[o].title,'<i style="color:#9b9b9b;font-size:15px;margin-left:8px;" title="').concat(__("Edit product"),'" class="mdi mdi-pencil menu-icon edit-page"></i></a>\n                        </div>\n                    </td>\n                    <td>\n                        <span>').concat(d(__,e.products[o].status),"</span>\n                    </td>\n                    <td>\n                        <span>").concat(u(m,e.products[o].price),"</span>\n                    </td>\n                    <td>\n                        <span>").concat((__,a=e.products[o].updated,new Date(1e3*parseInt(a)).toLocaleDateString()),'</span>\n                    </td>\n                    <td class="text-end"> \n                        <a href="#" data-id="').concat(e.products[o]._id,'" class="remove-product text-danger me-2">\n                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">\n                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>\n                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>\n                            </svg>\n                        </a>\n                        <i title="').concat(__("Remove this product"),'" data-key="').concat(e.products[o].id,'" class="mdi mdi-trash-can-outline list-icon remove-product"></i>\n                    </td>\n                </tr>')}document.querySelector(".table tbody").innerHTML=r}else document.querySelector(".table tbody").innerHTML='<tr><td colspan="6">'.concat(__("No products to display."),"</td></tr>")},initListeners:function(){o(".remove-product",m.listeners.removeProduct),o(".table-p-list .bi-search",m.listeners.searchProductsActivate),m.state.firstLoad&&(o(".btn-add",m.addProduct),o(".btn-modal",m.listeners.modalSuccessBtn))},listeners:{removeProduct:function(t){t.preventDefault(),confirm(__("Completely remove this product?"))&&fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:a,body:JSON.stringify({query:{product:{type:"delete",key:"ecommerce-product",id:t.currentTarget.dataset.id}}})}).then((function(t){return t.json()})).then((function(t){t.success?m.getData():r(t)})).catch((function(t){r(t)}))},searchProductsActivate:function(t){t.preventDefault(),document.querySelector(".table-p-list thead tr th:nth-child(2) span").style.display="none",document.querySelector(".table-p-list thead tr th:nth-child(2) .search-cont").style.display="flex",document.querySelector(".table-p-list thead tr th:nth-child(2) .search-cont input").focus(),((t,e)=>{if(document.querySelector(t))for(let n of document.querySelectorAll(t))n.removeEventListener("keyup",e,!0),n.addEventListener("keyup",e,!0)})(".table-p-list thead tr th:nth-child(2) .search-cont input",m.listeners.searchProducts)},searchProducts:function(t){t.preventDefault(),m.getData()},modalSuccessBtn:function(t){console.log("calling modalSuccessBtnFunc"),m.listeners.modalSuccessBtnFunc(t)},modalSuccessBtnFunc:null},addProduct:function(e){var n=document.querySelector(".modal"),o=new bootstrap.Modal(n);n.querySelector(".modal-title").innerHTML=__("Add Product"),n.querySelector(".btn-primary").innerHTML=__("Add"),n.querySelector(".btn-secondary").innerHTML=__("Cancel");var i='        <div class="form-cont">            <div class="form-group mb-3">                <label for="p-title" class="form-label">'.concat(__("Title"),'</label>                <input type="text" class="form-control" id="p-title" autocomplete="off" placeholder="" value="').concat("",'">            </div>            <div class="form-group mb-3">                <label for="p-sdesc" class="form-label">').concat(__("Short description"),'</label>                <input type="text" class="form-control" id="p-sdesc" autocomplete="off" placeholder="" value="').concat("",'">            </div>            <div class="form-group mb-3">                <label for="p-price" class="form-label">').concat(__("Price"),'</label>                <input type="text" class="form-control" id="p-price" autocomplete="off" placeholder="" value="').concat("",'">            </div>        </div>');n.querySelector(".modal-body").innerHTML=i,m.listeners.modalSuccessBtnFunc=function(e){e.preventDefault();var o={};o.title=n.querySelector("#p-title").value,o.sdesc=n.querySelector("#p-sdesc").value,o.price=n.querySelector("#p-price").value,o.status="0",o.img=[],o.cats=[],o.title.length<2?alert(__("Please provide longer title")):fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:a,body:JSON.stringify({query:{product:{type:"create",key:"ecommerce-product",data:o}}})}).then((function(t){return t.json()})).then((function(e){e.success?window.location.href=t("/product-edit/?id=".concat(e.product.id)):r(e)})).catch((function(t){r(t)}))},o.show(),setTimeout((function(){return n.querySelector("#p-title").focus()}),100)},initPagination:function(t){l(__,t.meta,m.getData)},initFooter:function(){var t,e;t=__("Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.",'<a class="text-muted" href="https://kenzap.com/" target="_blank">',"</a>",'<a class="text-muted" href="https://github.com/kenzap/ecommerce" target="_blank">',"</a>"),e="",document.querySelector("footer .row").innerHTML=`\n    <div class="d-sm-flex justify-content-center justify-content-sm-between">\n        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">${t}</span>\n        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">${e}</span>\n    </div>`}};m.init()}();