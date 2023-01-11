
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35733/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * @name initHeader
   * @description Initiates Kenzap Cloud extension header and related scripts. Verifies user sessions, handles SSO, does cloud space navigation, initializes i18n localization. 
   * @param {object} response
   */
  const initHeader = (response) => {

      // cache header from backend
      if(response.header) localStorage.setItem('header', response.header);
    
      // load header to html if not present
      if(!document.querySelector("#k-script")){
    
          let child = document.createElement('div');
          child.innerHTML = localStorage.getItem('header');
          child = child.firstChild;
          document.body.prepend(child);
    
          // run header scripts
          Function(document.querySelector("#k-script").innerHTML).call('test');
      }
    
      // load locales if present
      if(response.locale) window.i18n.init(response.locale); 
  };

  /**
   * @name showLoader
   * @description Initiates full screen three dots loader.
   */
  const showLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'block';
  };

  /**
   * @name hideLoader
   * @description Removes full screen three dots loader.
   */
  const hideLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'none';
  };

  /**
   * @name initFooter
   * @description Removes full screen three dots loader.
   * @param {string} left - Text or html code to be present on the left bottom side of screen
   * @param {string} right - Text or html code to be present on the left bottom side of screen
   */
  const initFooter = (left, right) => {

      document.querySelector("footer .row").innerHTML = `
    <div class="d-sm-flex justify-content-center justify-content-sm-between">
        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">${left}</span>
        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">${right}</span>
    </div>`;
  };

  /**
   * @name link
   * @description Handles Cloud navigation links between extensions and its pages. Takes care of custom url parameters.
   * @param {string} slug - Any inbound link
   * 
   * @returns {string} link - Returns original link with kenzp cloud space ID identifier.
   */
  const link = (slug) => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let sid = urlParams.get('sid') ? urlParams.get('sid') : "";

      let postfix = slug.indexOf('?') == -1 ? '?sid='+sid : '&sid='+sid;

      return slug + postfix;
  };

  /**
   * @name spaceID
   * @description Gets current Kenzap Cloud space ID identifier from the URL.
   * 
   * @returns {string} id - Kenzap Cloud space ID.
   */
   const spaceID = () => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get('sid') ? urlParams.get('sid') : "";

      return id;
  };

  /**
   * @name setCookie
   * @description Set cookie by its name to all .kenzap.cloud subdomains
   * @param {string} name - Cookie name.
   * @param {string} value - Cookie value.
   * @param {string} days - Number of days when cookie expires.
   */
   const setCookie = (name, value, days) => {

      let expires = "";
      if (days) {
          let date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = ";expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (escape(value) || "") + expires + ";path=/;domain=.kenzap.cloud"; 
  };

  /**
   * @name getCookie
   * @description Read cookie by its name.
   * @param {string} cname - Cookie name.
   * 
   * @returns {string} value - Cookie value.
   */
  const getCookie = (cname) => {

      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  };

  /**
   * @name checkHeader
   * @description This function tracks UI updates, creates header version checksum and compares it after every page reload
   * @param {object} object - API response.
   */
   const checkHeader = () => {

      let version = (localStorage.hasOwnProperty('header') && localStorage.hasOwnProperty('header-version')) ? localStorage.getItem('header-version') : 0;
      let check = window.location.hostname + '/' + spaceID() + '/' + getCookie('locale');
      if(check != getCookie('check')){ version = 0; console.log('refresh'); }
      
      setCookie('check', check, 5);

      return version
  };

  /**
   * @name headers
   * @description Default headers object for all Kenzap Cloud fetch queries. 
   * @param {object} headers
   */
   const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
      'Kenzap-Locale': getCookie('locale') ? getCookie('locale') : "en",
      'Kenzap-Header': checkHeader(),
      'Kenzap-Token': getCookie('kenzap_token'),
      'Kenzap-Sid': spaceID(),
  };

  /**
   * @name parseApiError
   * @description Set default logics for different API Error responses.
   * @param {object} object - API response.
   */
   const parseApiError = (data) => {

      // outout to frontend console
      console.log(data);

      // unstructured failure
      if(isNaN(data.code)){
      
          // structure failure data
          let log = data;
          try{ log = JSON.stringify(log); }catch(e){ }

          let params = new URLSearchParams();
          params.append("cmd", "report");
          params.append("sid", spaceID());
          params.append("token", getCookie('kenzap_token'));
          params.append("data", log);
          
          // report error
          fetch('https://api-v1.kenzap.cloud/error/', { method: 'post', headers: { 'Accept': 'application/json', 'Content-type': 'application/x-www-form-urlencoded', }, body: params });

          alert('Can not connect to Kenzap Cloud');  
          return;
      }
      
      // handle cloud error codes
      switch(data.code){

          // unauthorized
          case 401:

              // dev mode
              if(window.location.href.indexOf('localhost')!=-1){ 

                  alert(data.reason); 
                  return; 
              }

              // production mode
              location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href; break;
          
          // something else
          default:

              alert(data.reason); 
              break;
      }
  };

  /**
   * @name initBreadcrumbs
   * @description Render ui breadcrumbs.
   * @param {array} data - List of link objects containing link text and url. If url is missing then renders breadcrumb as static text. Requires html holder with .bc class.
   */
  const initBreadcrumbs = (data) => {

      let html = '<ol class="breadcrumb mt-2 mb-0">';
      for(let bc of data){
          
          if(typeof(bc.link) === 'undefined'){

              html += `<li class="breadcrumb-item">${ bc.text }</li>`;
          }else {

              html += `<li class="breadcrumb-item"><a href="${ bc.link }">${ bc.text }</a></li>`;
          }
      }
      html += '</ol>';
      
      document.querySelector(".bc").innerHTML = html;
  };

  /**
   * @name onClick
   * @description One row click event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onClick = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('click', fn, true);
          e.addEventListener('click', fn, true);
      }
  };

  /**
   * @name onChange
   * @description One row change event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onChange = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('change', fn, true);
          e.addEventListener('change', fn, true);
      }
  };

  /**
   * @name simulateClick
   * @description Trigger on click event without user interaction.
   * @param {string} elem - HTML selector, id, class, etc.
   */
   const simulateClick = (elem) => {

  	// create our event (with options)
  	let evt = new MouseEvent('click', {
  		bubbles: true,
  		cancelable: true,
  		view: window
  	});

  	// if cancelled, don't dispatch the event
  	!elem.dispatchEvent(evt);
  };

  /**
   * @name toast
   * @description Triggers toast notification. Adds toast html to the page if missing.
   * @param {string} text - Toast notification.
   */
   const toast = (text) => {

      // only add once
      if(!document.querySelector(".toast")){

          let html = `
        <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">
            <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
                <div class="d-flex">
                    <div class="toast-body"></div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>`;
          if(document.querySelector('body > div')) document.querySelector('body > div').insertAdjacentHTML('afterend', html);
      }

      let toast = new bootstrap.Toast(document.querySelector('.toast'));
      document.querySelector('.toast .toast-body').innerHTML = text;  
      toast.show();
  };

  var getProductId = function getProductId() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id') ? urlParams.get('id') : "";
    return id;
  };
  var priceFormat = function priceFormat(_this, price) {
    price = makeNumber(price);
    price = (Math.round(parseFloat(price) * 100) / 100).toFixed(2);

    switch (_this.state.settings.currency_symb_loc) {
      case 'left':
        price = _this.state.settings.currency_symb + price;
        break;

      case 'right':
        price = price + _this.state.settings.currency_symb;
        break;

      case 'left_space':
        price = _this.state.settings.currency_symb + ' ' + price;
        break;

      case 'right_space':
        price = price + ' ' + _this.state.settings.currency_symb;
        break;
    }

    return price;
  };
  var makeNumber = function makeNumber(price) {
    price = price ? price : 0;
    price = parseFloat(price);
    price = Math.round(price * 100) / 100;
    return price;
  };
  var onlyNumbers = function onlyNumbers(sel, chars) {
    if (!document.querySelector(sel)) return;

    var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll(sel)),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var el = _step2.value;
        el.addEventListener('keypress', function (e) {
          if (!chars.includes(e.which) && isNaN(String.fromCharCode(e.which)) || e.which == 32 || document.querySelector(sel).value.includes(String.fromCharCode(e.which)) && chars.includes(e.which)) {
            e.preventDefault();
            return false;
          }
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  };
  var loadAddon = function loadAddon(dep, version, cb) {
    if (document.getElementById(dep)) {
      if (typeof cb === 'function') cb.call();
      return;
    }

    var t = dep.split('.').slice(-1)[0];

    switch (t) {
      case 'js':
        var js = document.createElement("script");
        js.setAttribute("src", dep);
        js.id = dep;

        js.onload = js.onreadystatechange = function () {
          if (!this.readyState || this.readyState == 'complete') if (typeof cb === 'function') cb.call();
        };

        document.body.appendChild(js);
        break;

      case 'css':
        var head = document.getElementsByTagName('head')[0];
        var css = document.createElement('link');
        css.id = dep;
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.href = dep;
        head.appendChild(css);
        break;
    }
  };

  var simpleTags = function simpleTags(__, element) {
    if (!element) {
      throw new Error("DOM Element is undifined! Please choose HTML target element.");
    }

    var DOMParent = element;
    var DOMList;
    var DOMInput;
    var dataAttribute;
    var arrayOfList;

    function DOMCreate() {
      var ul = document.createElement("ul");
      var input = document.createElement("input");
      input.setAttribute('placeholder', __('new category'));
      DOMParent.appendChild(ul);
      DOMParent.appendChild(input);
      DOMList = DOMParent.firstElementChild;
      DOMInput = DOMParent.lastElementChild;
    }

    function DOMRender() {
      DOMList.innerHTML = "";
      arrayOfList.forEach(function (currentValue, index) {
        currentValue = currentValue.trim();

        if (currentValue) {
          var li = document.createElement("li");
          li.innerHTML = "".concat(currentValue, " <a>&times;</a>");
          li.querySelector("a").addEventListener("click", function () {
            onDelete(index);
          });
          DOMList.appendChild(li);
        }
      });
      setAttribute();
    }

    function onKeyUp() {
      DOMInput.addEventListener("keyup", function (event) {
        var text = this.value.trim();

        if (text.includes(",") || event.keyCode === 13) {
          if (text.replace(",", "") !== "") {
            arrayOfList.push(text.replace(",", ""));
          }

          this.value = "";
        }

        DOMRender();
      });
    }

    function onDelete(id) {
      arrayOfList = arrayOfList.filter(function (currentValue, index) {
        if (index === id) {
          return false;
        }

        return currentValue;
      });
      DOMRender();
    }

    function getAttribute() {
      dataAttribute = DOMParent.getAttribute("data-simple-tags");
      dataAttribute = dataAttribute.split(",");
      arrayOfList = dataAttribute.map(function (currentValue) {
        return currentValue.trim();
      });
    }

    function setAttribute() {
      DOMParent.setAttribute("data-simple-tags", arrayOfList.toString());
    }

    getAttribute();
    DOMCreate();
    DOMRender();
    onKeyUp();
  };

  var HTMLContent = function HTMLContent(__) {
    return "\n  <div class=\"container p-edit\">\n    <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n        <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n        \n    </div>\n    <div class=\"row\">\n        <div class=\"col-lg-9 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n            <div class=\"sections\" id=\"sections\" role=\"tablist\" style=\"width:100%;\">\n\n                <div class=\"row\">\n                    <div class=\"col-12 grid-margin stretch-card\">\n                        <div class=\"card border-white shadow-sm p-sm-3\">\n                            <div class=\"card-body\">\n\n                                <div class=\"landing_status\"></div>\n                                <input type=\"hidden\" class=\"form-control\" id=\"landing-slug\" value=\"\">\n\n                                <h4 id=\"elan\" class=\"card-title mb-4\">".concat(__('Description'), "</h4>\n\n                                <div id=\"placeholders\">\n\n                                    <div class=\"mb-3\">\n                                        <label class=\"banner-title-l form-label\" for=\"p-title\">").concat(__('Title'), "</label>\n                                        <input type=\"text\" class=\"form-control inp\" id=\"p-title\" placeholder=\"").concat(__('Sushi set..'), "\">\n                                        <p class=\"form-text\"> </p>\n                                    </div>\n\n                                    <div class=\"mb-3\">\n                                        <label class=\"banner-descshort-l form-label\" for=\"p-sdesc\">").concat(__('Short Description'), "</label>\n                                        <textarea class=\"form-control inp\" id=\"p-sdesc\" placeholder=\"  \" maxlength=\"120\" rows=\"2\"></textarea>\n                                    </div>\n\n                                    <div class=\"mb-3\">\n                                        <label class=\"banner-descshort-l form-label\" for=\"desc\">").concat(__('Images'), "</label>\n                                        <div class=\"clearfix\"></div>\n                                        <div class=\"ic\"></div>\n                                        <div class=\"clearfix\"></div>\n                                    </div>\n\n                                    <div class=\"mb-3\">\n                                        <div class=\"clearfix\"></div>\n                                        <div style=\"clear:both;margin-top:16px;\"></div>\n                                        <label class=\"banner-descshort-l form-label\" for=\"p-desc\">").concat(__('Description'), "</label>\n                                        <textarea class=\"form-control inp\" id=\"p-ldesc\" placeholder=\" \" maxlength=\"2000\" rows=\"10\"></textarea>\n                                    </div>\n\n                                    <div class=\"mb-3 mw\">\n                                        <div class=\"list-wrapper\">\n                                            <ul class=\"d-flex flex-column-reverse features\"> </ul>\n                                        </div>\n                                        <p class=\"form-text\"> </p>\n                                    </div>\n\n                                    <div class=\"price_group mt-3 mb-3\">\n                                        <h4 class=\"card-title mb-3\">").concat(__('Price'), "</h4>\n                                        <div class=\"price_group_base\">\n                                            <div class=\"mb-3\">\n                                                <div class=\"input-group\">\n                                                    <div id=\"p-price-c\">\n                                                        <label for=\"p-price\" class=\"form-label\">").concat(__('Default'), " <span class=\"lang\"></span></label>\n                                                        <div class=\"input-group pe-3 mb-3\">\n                                                            <span id=\"p-price-symb\" class=\"input-group-text\">$</span>\n                                                            <input id=\"p-price\" type=\"text\" class=\"form-control inp\" placeholder=\"55.00\" autocomplete=\"off\">\n                                                        </div>\n                                                    </div>\n                                                    <div id=\"p-priced-c\" class=\"d-flex align-content-end flex-wrap\">\n                                                        <a class=\"btn btn-outline-secondary mb-3 add-discount\" href=\"#\" role=\"button\" id=\"btn-discount\" >\n                                                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"currentColor\" class=\"bi bi-plus\" viewBox=\"0 0 16 16\"><path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"/></svg>\n                                                            ").concat(__('discount'), "\n                                                        </a>\n                                                        <div class=\"d-none\">\n                                                            <label for=\"p-priced pe-3 mb-3\" class=\"form-label\">").concat(__('Discounted'), " <span class=\"lang\"></span></label>\n                                                            <input id=\"p-priced\" type=\"text\" class=\"form-control\" placeholder=\"45.00\" autocomplete=\"off\">\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                \n                                                <div class=\"discount-blocks mw\">\n                                                    <label class=\"discount-list form-label\" for=\"discount-list \">").concat(__('Discount list'), "</label>\n                                                    <ul class=\"mb-4\">\n                                               \n                                                    </ul>\n                                                </div>\n                                                <div class=\"add-mix-ctn text-left mt-3 mb-2\"><a class=\"add-mix-block\" href=\"#\" data-action=\"add\">").concat(__('+ add variation'), "</a></div>\n                                            </div>\n\n                                            <div class=\"variation-blocks\">\n                        \n                                            </div>\n\n                                            <div style='margin:24px 0 48px;border-bottom:0px solid #ccc;'></div>\n\n                                            <div class=\"mb-3 mw\">\n                                                <h4 id=\"elan\" class=\"card-title\">").concat(__('Inventory'), "</h4>\n                                                <label for=\"stock_sku\" class=\"form-label\"> <span class=\"lang\"></span></label>\n                                                <div class=\"input-group\">\n                                                    <input id=\"stock_sku\" type=\"text\" style=\"width:100%;\" class=\"form-control\" placeholder=\"\" maxlength=\"200\">\n                                                    <p class=\"form-text\">").concat(__('Product stock unit identification number or SKU.'), "</p>\n                                                </div>\n                                            </div>\n\n                                            <div class=\"mb-3 mw\">\n                                                <div class=\"form-check\">\n                                                    <input id=\"stock_management\" class=\"form-check-input stock-management\" name=\"stock_management\" type=\"checkbox\" value=\"0\" data-type=\"checkbox\">\n                                                    <label class=\"form-check-label\" for=\"stock_management\">\n                                                        ").concat(__('Stock management'), "\n                                                    </label>\n                                                </div>\n                                                <p class=\"form-text\">").concat(__('Enable stock management.'), "</p>\n                                            </div>\n\n                                            <div class=\"mb-3 mw stock-cont\">\n                                                <label class=\"form-label\" for=\"stock_quantity\">").concat(__('Stock quantity'), "</label>\n                                                <input id=\"stock_quantity\" type=\"text\" class=\"form-control\" placeholder=\"0\">\n                                                <p class=\"form-text\">").concat(__('Total number of products left.'), "</p>\n                                            </div>\n\n                                            <div class=\"mb-3 mw stock-cont\">\n                                                <label class=\"form-label\" for=\"stock_low_threshold\">").concat(__('Low stock'), "</label>\n                                                <input id=\"stock_low_threshold\" type=\"text\" class=\"form-control\" placeholder=\"0\">\n                                                <p class=\"form-text\">").concat(__('Low stock threshold.'), "</p>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n\n                                <div class=\"desc-repeater-cont\">\n\n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n        <div class=\"col-lg-3 mt-3 mt-lg-0 grid-margin grid-margin-lg-0 grid-margin-md-0\">\n\n            <div class=\"row\">\n                <div class=\"col-12 grid-margin stretch-card\">\n                    <div class=\"card border-white shadow-sm p-sm-3\">\n                        <div class=\"card-body\">\n\n                            <h4 class=\"card-title\" style=\"display:none;\">").concat(__('General'), "</h4>\n                            <div class=\"landing_status\"></div>\n                            <input type=\"hidden\" class=\"form-control\" id=\"landing-slug\" value=\"\">\n\n                            <h4 id=\"elan\" class=\"card-title mb-4\">").concat(__('Status'), "</h4>\n                            <div id=\"status-cont\" class=\"mb-3\">\n\n                                <div class=\"col-sm-12\">\n                                    <div class=\"form-check\">\n                                        <label class=\"form-check-label status-publish form-label\">\n                                            <input type=\"radio\" class=\"form-check-input\" name=\"p-status\"\n                                                id=\"p-status1\" value=\"1\">\n                                                ").concat(__('Published'), "\n                                        </label>\n                                    </div>\n                                </div>\n\n                                <div class=\"col-sm-12\">\n                                    <div class=\"form-check\">\n                                        <label class=\"form-check-label status-draft form-label\">\n                                            <input type=\"radio\" class=\"form-check-input\" name=\"p-status\"  id=\"p-status0\" value=\"0\">\n                                            ").concat(__('Draft'), "\n                                        </label>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <h4 id=\"elan\" class=\"card-title mb-4\">").concat(__('Categories'), "</h4>\n                            <div id=\"p-cats\" class=\"simple-tags mb-4\" data-simple-tags=\"\"></div>\n                            <div class=\"clearfix\"> </div>\n\n                            <div class=\"d-grid gap-2\">\n                                <button class=\"btn btn-primary btn-save\" type=\"button\">").concat(__('Save'), "</button>\n                            </div>\n\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n    </div>\n  </div>\n\n  <div class=\"modal p-modal\" tabindex=\"-1\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\"></h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n            </div>\n        </div>\n    </div>\n  </div>\n\n  <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\">\n    <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\"\n        aria-atomic=\"true\" data-bs-delay=\"3000\">\n        <div class=\"d-flex\">\n            <div class=\"toast-body\"></div>\n            <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n        </div>\n    </div>\n  </div>\n  ");
  };

  var _this = {
    init: function init() {
      _this.getData();
    },
    state: {
      ajaxQueue: 0,
      settings: {}
    },
    getData: function getData() {
      showLoader();
      var id = getProductId();
      spaceID();
      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
          query: {
            user: {
              type: 'authenticate',
              fields: ['avatar'],
              token: getCookie('kenzap_token')
            },
            product: {
              type: 'find',
              key: 'ecommerce-product',
              id: id,
              fields: ['_id', 'id', 'img', 'status', 'price', 'discounts', 'variations', 'title', 'sdesc', 'ldesc', 'stock', 'cats', 'updated']
            },
            settings: {
              type: 'get',
              key: 'ecommerce-settings',
              fields: ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display', 'scripts_product_edit']
            },
            locale: {
              type: 'locale',
              source: ['extension'],
              key: 'ecommerce'
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (!response.success) {
          parseApiError(response);
          return;
        }

        if (response.success) {
          _this.state.settings = response.settings;
          initHeader(response);
          document.querySelector('#contents').innerHTML = HTMLContent(__);

          if (response.product.length == 0) {
            _this.initListeners('all');

            return;
          }

          _this.renderPage(response.product);

          _this.loadImages(response.product);

          _this.initListeners('all');

          initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/ecommerce" target="_blank">', '</a>'), '');
          loadAddon('/sk-design/index.js');
          loadAddon('/sk-design/styles.css');
        }
      })["catch"](function (error) {
        parseApiError(error);
      });
    },
    renderPage: function renderPage(product) {
      var d = document;
      initBreadcrumbs([{
        link: link('https://dashboard.kenzap.cloud'),
        text: __('Dashboard')
      }, {
        link: link('/'),
        text: __('E-commerce')
      }, {
        link: link('/product-list/'),
        text: __('Product List')
      }, {
        text: __('Product Edit')
      }]);
      d.querySelector("#p-title").value = product.title;
      d.querySelector("#p-sdesc").value = product.sdesc;
      d.querySelector("#p-ldesc").value = product.ldesc;
      d.querySelector("#p-price").value = product.price;
      onlyNumbers('#p-price', [8, 46]);
      d.querySelector("#p-price-symb").innerHTML = _this.state.settings['currency_symb'] ? _this.state.settings['currency_symb'] : "";
      document.querySelector(".discount-blocks").dataset.data = encodeURIComponent(JSON.stringify(product.discounts ? product.discounts : []));

      _this.renderDiscounts();

      for (var m in product.variations) {
        var vr = product.variations[m];
        var data = [];
        data['title'] = vr['title'];
        data['type'] = vr['type'];
        data['required'] = vr['required'];
        data['index'] = m;
        d.querySelector(".variation-blocks").innerHTML += _this.structMixBlock(data);

        for (var n in vr['data']) {
          var vrd = vr['data'][n];
          var _data = [];
          _data['title'] = vrd['title'];
          _data['price'] = vrd['price'];
          _data['type'] = vr['type'];
          d.querySelector(".var-block[data-index='" + m + "'] .offer-pricef").innerHTML += _this.structMixRow(_data);
        }
      }

      if (!product['stock']) product['stock'] = {
        management: false,
        sku: "",
        qty: 0,
        low_threshold: 0
      };

      var _iterator = _createForOfIteratorHelper(document.querySelectorAll('.stock-cont')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          product['stock']['management'] == true ? el.classList.remove('d-none') : el.classList.add('d-none');
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      document.querySelector('#stock_sku').value = product['stock']['sku'] ? product['stock']['sku'] : "";
      document.querySelector('#stock_management').checked = product['stock']['management'];
      document.querySelector('#stock_quantity').value = product['stock']['qty'] ? makeNumber(product['stock']['qty']) : 0;
      document.querySelector('#stock_low_threshold').value = product['stock']['low_threshold'] ? makeNumber(product['stock']['low_threshold']) : 0;
      document.querySelector('#p-status' + product.status).checked = true;
      var pcats = document.querySelector('#p-cats');
      if (product.cats) pcats.setAttribute('data-simple-tags', product.cats);
      new simpleTags(__, pcats);
    },
    initListeners: function initListeners() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'partial';

      if (type == 'all') {
        onClick('.btn-save', _this.listeners.saveProduct);
        onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);
      }

      onClick('.add-discount', _this.listeners.addDiscountBlock);
      onClick('.add-mix-block', _this.listeners.addMixBlock);
      onClick('.edit-block', _this.listeners.editBlock);
      onClick('.remove-block', _this.listeners.removeBlock);
      onClick('.add-mix', _this.listeners.addMixOption);
      onClick('.remove-option', _this.listeners.removeOption);
      onClick('.stock-management', _this.listeners.stockManagement);
    },
    listeners: {
      editBlock: function editBlock(e) {
        e.preventDefault();
        var amb = document.querySelector('.add-mix-block');
        amb.dataset.action = 'edit';
        amb.dataset.index = e.currentTarget.dataset.index;
        setTimeout(function () {
          return simulateClick(amb);
        }, 10);
        console.log('editBlock');
      },
      removeBlock: function removeBlock(e) {
        e.preventDefault();
        var c = confirm(__('Remove entire block?'));

        if (c) {
          e.currentTarget.parentNode.parentNode.remove();
        }

        console.log('removeBlock');
      },
      addMixBlock: function addMixBlock(e) {
        e.preventDefault();
        var action = e.currentTarget.dataset.action;
        var index = e.currentTarget.dataset.index;
        e.currentTarget.dataset.action = 'add';
        console.log('index: ' + index);

        var modal_title = __('Add Variation Block');

        var title = "";
        var type = "";
        var required = 0;

        var modal_btn = __('Add'),
            modal_cancel_btn = __('Cancel');

        if (action == 'edit') {
          modal_title = __('Edit Variation Block');
          title = document.querySelector(".var-block[data-index='" + index + "']").dataset.title;
          type = document.querySelector(".var-block[data-index='" + index + "']").dataset.type;
          required = parseInt(document.querySelector(".var-block[data-index='" + index + "']").dataset.required);
          modal_btn = __('Save');
        }

        var pmodal = document.querySelector(".p-modal");
        var pmodalCont = new bootstrap.Modal(pmodal);
        pmodal.querySelector(".modal-title").innerHTML = modal_title;
        pmodal.querySelector(".btn-primary").innerHTML = modal_btn;
        pmodal.querySelector(".btn-secondary").innerHTML = modal_cancel_btn;
        pmodalCont.show();
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group mb-3\">\n                    <label for=\"mtitle\" class=\"form-label\">".concat(__('Save'), "</label>\n                    <input type=\"text\" class=\"form-control\" id=\"mtitle\" autocomplete=\"off\" placeholder=\"Rice type\" value=\"").concat(title, "\">\n                </div>\n                <div class=\"form-group mb-3\">\n                    <label for=\"mtype\" class=\"form-label\">").concat(__('Input type'), "</label>\n                    <select id=\"mtype\" class=\"form-control \" >\n                        <option ").concat(type == 'radio' ? 'selected="selected"' : '', " value=\"radio\">").concat(__('Radio buttons'), "</option>\n                        <option ").concat(type == 'checkbox' ? 'selected="selected"' : '', " value=\"checkbox\">").concat(__('Checkboxes'), "</option>\n                    </select>\n                    <p class=\"form-text\">").concat(__('Define how this renders on frontend.'), "</p>\n                </div>\n                <div class=\"form-group mb-3\">\n                    <div class=\"form-check\">\n                        <label for=\"id=\"mtype\"\" class=\"form-check-label form-label\">\n                            <input id=\"mrequired\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Required'), "\n                        </label>\n                    </div>\n                    <p class=\"form-text\">").concat(__('Make this variation mandatory for users.'), "</p>\n                </div>\n                <div class=\"form-group mb-3 dn\">\n                    <label for=\"mtype\" class=\"form-label\">").concat(__('Minimum required'), "</label>\n                    <select id=\"mtype\" class=\"form-control\" >\n                        <option value=\"1\">1</option>\n                        <option value=\"2\">2</option>\n                    </select>\n                </div>\n            </div>");
        pmodal.querySelector(".modal-body").innerHTML = modalHTml;
        setTimeout(function () {
          return pmodal.querySelector("#mtitle").focus();
        }, 100);

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var mtitle = pmodal.querySelector(".p-modal #mtitle").value;
          var mtype = pmodal.querySelector(".p-modal #mtype").value;
          var mrequired = pmodal.querySelector(".p-modal #mrequired:checked");
          mrequired = mrequired == null ? 0 : mrequired.value == "1" ? 1 : 0;

          if (mtitle.length < 2) {
            alert(__('Please provide longer title'));
            return;
          }

          var data = [];
          data['title'] = mtitle;
          data['type'] = mtype;
          data['required'] = mrequired;
          data['index'] = document.querySelectorAll(".var-block").length;

          if (action == 'edit') {
            document.querySelector(".var-block[data-index='" + index + "']").dataset.title = mtitle;
            document.querySelector(".var-block[data-index='" + index + "']").dataset.type = mtype;
            document.querySelector(".var-block[data-index='" + index + "']").dataset.required = mrequired;
            document.querySelector(".var-block[data-index='" + index + "'] .title").innerHTML = mtitle;
          }

          if (action == 'add') {
            if (document.querySelector(".variation-blocks .var-block") == null) {
              document.querySelector(".variation-blocks").innerHTML = _this.structMixBlock(data);
            } else {
              document.querySelector(".variation-blocks .var-block:last-of-type").insertAdjacentHTML('afterend', _this.structMixBlock(data));
            }
          }

          pmodalCont.hide();
          setTimeout(function () {
            return _this.initListeners('partial');
          }, 10);
        };
      },
      addMixOption: function addMixOption(e) {
        var block_el = e.currentTarget;
        e.preventDefault();
        var pmodal = document.querySelector(".p-modal");
        var pmodalCont = new bootstrap.Modal(pmodal);
        pmodalCont.show();
        pmodal.querySelector(".modal-title").innerHTML = __('Add Variation');
        pmodal.querySelector(".btn-primary").innerHTML = __('Add');
        pmodal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTML = "\n            <div class=\"form-cont\">\n                <div class=\"form-group\">\n                    <label for=\"mtitle\" class=\"form-label\">".concat(__('Title'), "</label>\n                    <input type=\"text\" class=\"form-control\" id=\"mtitle\" autocomplete=\"off\" placeholder=\"").concat(__('Brown rice'), "\">\n                </div>\n                <div class=\"form-group mt-3\">\n                    <label for=\"mprice\" class=\"form-label\">").concat(__('Price'), "</label>\n                    <div class=\"input-group mb-3\">\n                        <span class=\"input-group-text\">$</span>\n                        <input id=\"mprice\" type=\"text\" class=\"form-control\" placeholder=\"0.00\" value=\"\" >\n                        <p class=\"form-text\">").concat(__('You can change default currency under Dashboard &gt; Settings.'), "</p>\n                    </div>\n                </div>\n            </div>");
        pmodal.querySelector(".modal-body").innerHTML = modalHTML;
        setTimeout(function () {
          return pmodal.querySelector("#mtitle").focus();
        }, 100);

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var mtitle = pmodal.querySelector(".p-modal #mtitle").value;
          var mprice = pmodal.querySelector(".p-modal #mprice").value;

          if (mtitle.length < 2) {
            alert("Please provide longer title");
            return;
          }

          var data = [];
          data['title'] = mtitle;
          data['price'] = mprice;
          data['type'] = block_el.parentElement.parentElement.dataset.type;
          var sel = ".var-block[data-index='" + block_el.parentElement.parentElement.dataset.index + "']";
          console.log(sel);

          if (document.querySelector(sel + " .offer-pricef li") == null) {
            document.querySelector(sel + " .offer-pricef").innerHTML = _this.structMixRow(data);
          } else {
            document.querySelector(sel + " .offer-pricef li:last-of-type").insertAdjacentHTML('afterend', _this.structMixRow(data));
          }

          pmodalCont.hide();
          setTimeout(function () {
            return _this.initListeners('partial');
          }, 10);
        };
      },
      removeOption: function removeOption(e) {
        e.preventDefault();
        if (confirm('Remove option?')) e.currentTarget.parentElement.remove();
      },
      removeDiscount: function removeDiscount(e) {
        e.preventDefault();

        if (confirm('Remove discount?')) {
          e.currentTarget.parentElement.remove();
          var discounts = JSON.parse(decodeURIComponent(document.querySelector('.discount-blocks').dataset.data));
          discounts.splice(e.currentTarget.dataset.index, 1);
          document.querySelector(".discount-blocks").dataset.data = encodeURIComponent(JSON.stringify(discounts));
        }
      },
      addDiscountBlock: function addDiscountBlock(e) {
        e.preventDefault();
        var action = e.currentTarget.dataset.action;
        var index = e.currentTarget.dataset.index;
        e.currentTarget.dataset.action = 'add';

        var modal_title = __('Add discount');
        var type = "";
        var required = 0;

        var modal_btn = __('Add'),
            modal_cancel_btn = __('Cancel');

        if (action == 'edit') {
          modal_title = __('Edit Variation Block');
          document.querySelector(".var-block[data-index='" + index + "']").dataset.title;
          type = document.querySelector(".var-block[data-index='" + index + "']").dataset.type;
          required = parseInt(document.querySelector(".var-block[data-index='" + index + "']").dataset.required);
          modal_btn = __('Save');
        }

        var pmodal = document.querySelector(".p-modal");
        var pmodalCont = new bootstrap.Modal(pmodal);
        pmodal.querySelector(".modal-title").innerHTML = modal_title;
        pmodal.querySelector(".btn-primary").innerHTML = modal_btn;
        pmodal.querySelector(".btn-secondary").innerHTML = modal_cancel_btn;
        pmodalCont.show();
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group mb-3\">\n                    <div class=\"row\">\n                        <div class=\"col-lg-6\">\n                            <label for=\"discount-type\" class=\"form-label\">".concat(__('Type'), "</label>\n                            <select id=\"discount-type\" class=\"form-control\" >\n                                <option ").concat(type == 'percent' ? 'selected="selected"' : '', " value=\"percent\">").concat(__('By percent'), "</option>\n                                <option ").concat(type == 'value' ? 'selected="selected"' : '', " value=\"value\">").concat(__('By value'), "</option>\n                            </select>\n                        </div>\n                        <div id=\"discount-percent-cont\" class=\"col-lg-6\">\n                            <label for=\"discount-percent\" class=\"form-label\">").concat(__('Percent %'), "</label>\n                            <input type=\"text\" class=\"form-control\" id=\"discount-percent\" autocomplete=\"off\" placeholder=\"").concat(__('5'), "\">\n                        </div>\n                        <div id=\"discount-value-cont\" class=\"col-lg-6 d-none\">\n                            <label for=\"discount-value\" class=\"form-label\">").concat(__('Value'), "</label>\n                            <input type=\"text\" class=\"form-control\" id=\"discount-value\" autocomplete=\"off\" placeholder=\"").concat(__('12.00'), "\">\n                        </div>\n                    </div>\n                    <p class=\"form-text\">").concat(__('Define how big is the discount (numeric value only).'), "</p>\n                </div>\n                <div class=\"form-group mb-3\">\n                    <label for=\"discount-availability\" class=\"form-label\">").concat(__('Availability'), "</label>\n                    <select id=\"discount-availability\" class=\"form-control \" >\n                        <option ").concat('', " value=\"always\">").concat(__('Always'), "</option>\n                        <option ").concat('', " value=\"hourly\">").concat(__('Hourly'), "</option>\n                        <option ").concat('', " value=\"weekly\">").concat(__('Weekly'), "</option>\n                        <option class=\"d-none\" ").concat('', " value=\"monthly\">").concat(__('Monthly'), "</option>\n                    </select>\n                    <p class=\"form-text\">").concat(__('Restrict discount availability.'), "</p>\n                </div>\n                <div id=\"discount-weekly\" class=\"form-group mb-3 d-none\">\n                    <label for=\"mtype\" class=\"form-label\">").concat(__('Days of week'), "</label>\n                    <div class=\"form-check\">\n                        <label for=\"week-monday\" class=\"form-check-label form-label\">\n                            <input id=\"week-monday\" type=\"checkbox\" class=\"form-check-input \" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Monday'), "\n                        </label>\n                    </div>\n                    <div class=\"form-check\">\n                        <label for=\"week-tuesday\" class=\"form-check-label form-label\">\n                            <input id=\"week-tuesday\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Tuesday'), "\n                        </label>\n                    </div>\n                    <div class=\"form-check\">\n                        <label id=\"week-wednesday\" class=\"form-check-label form-label\">\n                            <input id=\"week-wednesday\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Wednesday'), "\n                        </label>\n                    </div>\n                    <div class=\"form-check\">\n                        <label id=\"week-thursday\" class=\"form-check-label form-label\">\n                            <input id=\"week-thursday\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Thursday'), "\n                        </label>\n                    </div>\n                    <div class=\"form-check\">\n                        <label id=\"week-friday\" class=\"form-check-label form-label\">\n                            <input id=\"week-friday\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Friday'), "\n                        </label>\n                    </div>\n                    <div class=\"form-check\">\n                        <label id=\"week-saturday\" class=\"form-check-label form-label\">\n                            <input id=\"week-saturday\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Saturday'), "\n                        </label>\n                    </div>\n                    <div class=\"form-check\">\n                        <label id=\"week-sunday\" class=\"form-check-label form-label\">\n                            <input id=\"week-sunday\" type=\"checkbox\" class=\"form-check-input\" ").concat(required == 1 ? 'checked="checked"' : '', " value=\"1\">\n                            ").concat(__('Sunday'), "\n                        </label>\n                    </div>\n                    <p class=\"form-text\">").concat(__('Days of the week when discount is available.'), "</p>\n                </div>\n                <div id=\"discount-hourly\" class=\"form-group mb-3 d-none\">\n                    <div class=\"row\">\n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group mb-3 mt-1\">\n                                <label for=\"discount-hour-from\" class=\"form-label\">").concat(__('From'), "</label>\n                                <input id=\"discount-hour-from\" type=\"text\" class=\"form-control\" maxlength=\"5\" autocomplete=\"off\" placeholder=\"").concat(__('12:00'), "\">\n                            </div>\n                        </div>\n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group mb-3 mt-1\">\n                                <label for=\"discount-hour-to\" class=\"form-label\">").concat(__('To'), "</label>\n                                <input id=\"discount-hour-to\" type=\"text\" class=\"form-control\" maxlength=\"5\" autocomplete=\"off\" placeholder=\"").concat(__('17:00'), "\">\n                            </div>\n                        </div>\n                    </div>\n                    <p class=\"form-text\">").concat(__('Time range when discount is available.'), "</p>\n                </div>\n                <div class=\"form-group mb-3\">\n                    <div class=\"form-group mb-3 mt-1\">\n                        <label for=\"discount-note\" class=\"form-label\">").concat(__('Note'), "</label>\n                        <input id=\"discount-note\" type=\"text\" class=\"form-control\" maxlength=\"25\" autocomplete=\"off\" placeholder=\"").concat(__(''), "\">\n                        <p class=\"form-text\">").concat(__('Example: •happy hour promo.'), "</p>\n                    </div>\n                </div> \n            </div>");
        pmodal.querySelector(".modal-body").innerHTML = modalHTml;
        setTimeout(function () {
          return pmodal.querySelector("#discount-type").focus();
        }, 100);
        onChange('#discount-availability', function (e) {
          console.log(e.currentTarget.value);

          switch (e.currentTarget.value) {
            case 'always':
              document.querySelector('#discount-weekly').classList.add('d-none');
              document.querySelector('#discount-hourly').classList.add('d-none');
              break;

            case 'hourly':
              document.querySelector('#discount-weekly').classList.add('d-none');
              document.querySelector('#discount-hourly').classList.remove('d-none');
              break;

            case 'weekly':
              document.querySelector('#discount-weekly').classList.remove('d-none');
              document.querySelector('#discount-hourly').classList.remove('d-none');
              break;
          }
        });
        onlyNumbers('#discount-percent', [8]);
        onlyNumbers('#discount-value', [8, 46]);
        onlyNumbers('#discount-hour-from', [8, 58]);
        onlyNumbers('#discount-hour-to', [8, 58]);
        onChange('#discount-type', function (e) {
          console.log(e.currentTarget.value);

          switch (e.currentTarget.value) {
            case 'percent':
              document.querySelector('#discount-percent-cont').classList.remove('d-none');
              document.querySelector('#discount-value-cont').classList.add('d-none');
              break;

            case 'value':
              document.querySelector('#discount-percent-cont').classList.add('d-none');
              document.querySelector('#discount-value-cont').classList.remove('d-none');
              break;
          }
        });

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var obj = {},
              allow = true;
          document.querySelector(".form-cont").classList.add("was-validated");
          document.querySelector("#discount-percent").setCustomValidity("");
          document.querySelector("#discount-hour-from").setCustomValidity("");
          document.querySelector("#discount-hour-to").setCustomValidity("");
          var discounts = document.querySelector(".discount-blocks").dataset.data;

          if (!discounts) {
            discounts = [];
          } else {
            discounts = JSON.parse(decodeURIComponent(discounts));
          }

          obj.note = document.querySelector("#discount-note").value;
          obj.type = document.querySelector("#discount-type").value;

          if (obj.type == 'percent') {
            obj.percent = document.querySelector("#discount-percent").value;

            if (obj.percent == "") {
              document.querySelector("#discount-percent").setCustomValidity("Percent field can not be empty.");
              allow = false;
            }
          } else if (obj.type == 'value') {
            obj.value = document.querySelector("#discount-value").value;

            if (obj.value == "") {
              document.querySelector("#discount-value").setCustomValidity("Value field can not be empty.");
              allow = false;
            }
          }

          obj.availability = document.querySelector("#discount-availability").value;

          if (obj.availability == 'always') ; else if (obj.availability == 'hourly') {
            obj.hours = {
              from: document.querySelector("#discount-hour-from").value,
              to: document.querySelector("#discount-hour-to").value
            };

            if (obj.hours.from.length < 2) {
              document.querySelector("#discount-hour-from").setCustomValidity("Wrong time format");
              allow = false;
            }

            if (obj.hours.to.length < 2) {
              document.querySelector("#discount-hour-to").setCustomValidity("Wrong time format");
              allow = false;
            }
          } else if (obj.availability == 'weekly') {
            obj.hours = {
              from: document.querySelector("#discount-hour-from").value,
              to: document.querySelector("#discount-hour-to").value
            };

            if (obj.hours.from.length < 2) {
              document.querySelector("#discount-hour-from").setCustomValidity("Wrong time format");
              allow = false;
            }

            if (obj.hours.to.length < 2) {
              document.querySelector("#discount-hour-to").setCustomValidity("Wrong time format");
              allow = false;
            }

            obj.dow = [];

            var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll('#discount-weekly input')),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var el = _step2.value;
                obj.dow.push(el.checked);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }

          if (!allow) {
            alert('Please enter all fields correctly.');
            return;
          }

          discounts.push(obj);
          document.querySelector(".discount-blocks").dataset.data = encodeURIComponent(JSON.stringify(discounts));

          _this.renderDiscounts();

          console.log(obj);
          pmodalCont.hide();
          setTimeout(function () {
            return _this.initListeners('partial');
          }, 10);
        };
      },
      saveProduct: function saveProduct(e) {
        e.preventDefault();
        var data = {};

        var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll('.inp')),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var inp = _step3.value;
            data[inp.id.replace("p-", "")] = inp.value.trim();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        data["cats"] = [];

        var _iterator4 = _createForOfIteratorHelper(document.querySelectorAll('#p-cats ul li')),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var cat = _step4.value;
            data["cats"].push(cat.innerHTML.replace('<a>×</a>', '').trim());
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        data["img"] = [];

        var _iterator5 = _createForOfIteratorHelper(document.querySelectorAll('.p-img')),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var img = _step5.value;
            var tf = !img.getAttribute('src').includes("placeholder") ? true : false;
            data["img"].push(tf);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        data["discounts"] = JSON.parse(decodeURIComponent(document.querySelector('.discount-blocks').dataset.data));
        data["stock"] = {};
        data['stock']['sku'] = document.querySelector('#stock_sku').value;
        data['stock']['management'] = document.querySelector('#stock_management').checked;
        data['stock']['qty'] = document.querySelector('#stock_quantity').value;
        data['stock']['low_threshold'] = document.querySelector('#stock_low_threshold').value;
        data["status"] = document.querySelector('input[name="p-status"]:checked').value;
        data["variations"] = [];
        var block_index = 0;

        var _iterator6 = _createForOfIteratorHelper(document.querySelectorAll('.variation-blocks .var-block')),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var block = _step6.value;
            var option_index = 0;

            var _iterator7 = _createForOfIteratorHelper(block.querySelectorAll('.offer-pricef li')),
                _step7;

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var option = _step7.value;
                if (typeof data["variations"][block_index] === 'undefined') data["variations"][block_index] = {
                  'title': block.getAttribute('data-title'),
                  'type': block.getAttribute('data-type'),
                  'required': block.getAttribute('data-required'),
                  'data': []
                };
                data["variations"][block_index]['data'][option_index] = {
                  'title': option.getAttribute('data-title'),
                  'price': option.getAttribute('data-price'),
                  'cond': option.getAttribute('data-cond')
                };
                option_index++;
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }

            block_index++;
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        var id = getProductId();
        var sid = spaceID();
        showLoader();
        fetch('https://api-v1.kenzap.cloud/', {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            query: {
              product: {
                type: 'update',
                key: 'ecommerce-product',
                id: id,
                sid: sid,
                data: data
              }
            }
          })
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            _this.uploadImages();
          } else {
            parseApiError(response);
          }

          console.log('Success:', response);
        })["catch"](function (error) {
          parseApiError(error);
        });
      },
      openImage: function openImage(e) {
        e.preventDefault();
        simulateClick(document.querySelector(".aif-" + e.currentTarget.dataset.index));
      },
      previewImage: function previewImage(e) {
        e.preventDefault();
        var input = e.currentTarget;

        if (input.files && input.files[0]) {
          if (input.files[0].type != 'image/jpeg' && input.files[0].type != 'image/jpg' && input.files[0].type != 'image/png') {
            toast(__("Please provide image in JPEG format"));
            return;
          }

          if (input.files[0].size > 5000000) {
            toast(__("Please provide image less than 5 MB in size!"));
            return;
          }

          var index = input.dataset.index;
          var reader = new FileReader();

          reader.onload = function (e) {
            document.querySelector('.images-' + index).setAttribute('src', e.currentTarget.result);
          };

          reader.readAsDataURL(input.files[0]);
          e.currentTarget.parentElement.querySelector('.remove').classList.remove("hd");
        }
      },
      removeImage: function removeImage(e) {
        var index = e.currentTarget.parentElement.dataset.index;
        document.querySelector('.aif-' + index).value = '';
        document.querySelector('.images-' + index).setAttribute('src', 'https://account.kenzap.com/images/placeholder.jpg');
        e.currentTarget.classList.add("hd");
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        console.log('calling modalSuccessBtnFunc');

        _this.listeners.modalSuccessBtnFunc(e);
      },
      stockManagement: function stockManagement(e) {
        var _iterator8 = _createForOfIteratorHelper(document.querySelectorAll('.stock-cont')),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var el = _step8.value;
            e.currentTarget.checked ? el.classList.remove('d-none') : el.classList.add('d-none');
            e.currentTarget.value = e.currentTarget.checked ? "1" : "0";
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      },
      modalSuccessBtnFunc: null
    },
    structMixBlock: function structMixBlock(data) {
      var html = "\n        <div class=\"mb-4 var-block mw\" data-title=\"".concat(data.title, "\" data-type=\"").concat(data.type, "\" data-required=\"").concat(data.required, "\" data-index=\"").concat(data.index, "\" >\n            <label for=\"offer-pricef\" class=\"form-label pb-2\"><span class=\"title\">").concat(data.title, "</span>\n                &nbsp;&nbsp;\n                <svg class=\"bi bi-pencil-fill edit-block ms-3\" title=\"edit block\" data-index=\"").concat(data.index, "\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\">\n                    <path d=\"M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z\"/>\n                </svg>\n                <svg class=\"bi bi-trash remove-block ms-3\" title=\"edit block\" data-index=\"").concat(data.index, "\"  xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"#ff0079\" viewBox=\"0 0 16 16\">\n                    <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"></path>                    <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"></path>\n                </svg>\n            </label>\n            <div class=\"list-wrapper\">\n                <ul class=\"d-flex flex-column-reverse offer-pricef\" >\n                \n                </ul>\n            </div>\n            <p class=\"form-text\"><a class=\"add-mix\" href=\"#\">").concat(__('+ add option'), "</a> ").concat(__('to differentiate price offering.'), "</p>\n            <div class=\"add-mix-ctn d-none\"><a class=\"add-mix\" href=\"#\">").concat(__('+ add option'), "</a></div>\n        </div>");
      return html;
    },
    structMixRow: function structMixRow(data) {
      return "\n        <li data-title=\"".concat(data.title, "\" data-price=\"").concat(data.price, "\" data-cond=\"\" class=\"pt-2 pb-2\"><div class=\"form-check\"><label class=\"form-check-label form-label\"><input class=\"").concat(data.type, " form-check-input\" type=\"").concat(data.type, "\" checked=\"\" data-ft=\"").concat(data.title, "\">").concat(data.title, " &nbsp;&nbsp;&nbsp; ").concat(priceFormat(_this, data.price), "</label></div>\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"#ff0079\" class=\"remove-option bi bi-x-circle\" viewBox=\"0 0 16 16\">                <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\n                <path d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"/>\n            </svg>\n        </li>");
    },
    loadImages: function loadImages(product) {
      var d = document;
      var id = getProductId();
      var sid = spaceID();
      var t = '';

      for (var i = 0; i < 5; i++) {
        var img = product.img !== undefined && product.img[i] == 'true' ? 'https://preview.kenzap.cloud/S' + spaceID() + '/_site/images/product-' + product.id + '-' + (i + 1) + '-100x100.jpeg?' + product.updated : 'https://account.kenzap.com/images/placeholder.jpg';
        t += "          <div class=\"p-img-cont float-start\">            <p data-index=\"".concat(i, "\">              <img class=\"p-img images-").concat(i, "\" data-index=\"").concat(i, "\" width=\"100\" height=\"100\" src=\"").concat(img, "\" />              <span class=\"remove hd\" title=\"").concat(__('Remove'), "\">\xD7</span>            </p>            <input type=\"file\" name=\"img[]\" data-type=\"search\" data-index=\"").concat(i, "\" class=\"file aif-").concat(i, " d-none\">          </div>");
      }

      d.querySelector(".ic").innerHTML = t;
      onClick('.p-img-cont img', _this.listeners.openImage);
      onClick('.p-img-cont .remove', _this.listeners.removeImage);
      onChange('.p-img-cont .file', _this.listeners.previewImage);

      for (var fi = 0; fi < 5; fi++) {
        var image_url = CDN + '/S' + sid + '/product-' + id + '-' + (parseInt(fi) + 1) + '-250.jpeg?' + product.updated;
        setTimeout(function (img, sel, _fi) {
          var allow = true;

          if (typeof product.img !== "undefined") {
            if (!product.img[_fi]) allow = false;
          }

          if (allow) {
            var _i = new Image();

            _i.onload = function () {
              d.querySelector(sel + _fi).setAttribute('src', img);
              d.querySelector(sel + _fi).parentElement.querySelector('.remove').classList.remove('hd');
            };

            _i.src = img;
          }
        }, 300, image_url, ".images-", fi);
      }
    },
    uploadImages: function uploadImages() {
      if (document.querySelector(".imgupnote")) document.querySelector(".imgupnote").remove();
      var fi = 0;

      var _iterator9 = _createForOfIteratorHelper(document.querySelectorAll(".file")),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var fileEl = _step9.value;
          fi += 1;
          var id = getProductId();
          var sid = spaceID();
          var file = fileEl.files[0];
          if (typeof file === "undefined") continue;
          var fd = new FormData();
          var sizes = '1000|500|250|100x100';
          fd.append('id', id);
          fd.append('sid', sid);
          fd.append('pid', id);
          fd.append('key', 'image');
          fd.append('sizes', sizes);
          fd.append('file', file);
          fd.append('slug', 'product-' + id + '-' + fi);
          fd.append('token', getCookie('kenzap_token'));
          file.value = '';
          _this.state.ajaxQueue += 1;
          fetch("https://api-v1.kenzap.cloud/upload/", {
            body: fd,
            method: "post"
          }).then(function (response) {
            return response.json();
          }).then(function (response) {
            _this.state.ajaxQueue -= 1;

            if (response.success && _this.state.ajaxQueue == 0) {
              toast(__("Product updated"));
              hideLoader();
            }
          });
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      if (_this.state.ajaxQueue == 0) {
        toast(__("Product updated"));
        hideLoader();
      }
    },
    renderDiscounts: function renderDiscounts() {
      var discounts = document.querySelector('.discount-blocks').dataset.data;
      var dow = [__('Monday'), __('Tuesday'), __('Wednesday'), __('Thursday'), __('Friday'), __('Saturday'), __('Sunday')];
      discounts = JSON.parse(decodeURIComponent(discounts));
      var html = '';
      discounts.forEach(function (el, index) {
        var dv = el.type == 'value' ? priceFormat(_this, el.value) : el.percent + '% (' + priceFormat(_this, makeNumber(document.querySelector("#p-price").value) * ((100 - el.percent) / 100)) + ')';
        var time = '';

        switch (el.availability) {
          case 'always':
            time = __('Always') + ' ' + dv;
            break;

          case 'hourly':
            time = el.hours.from + '-' + el.hours.to + ' ' + dv;
            break;

          case 'weekly':
            el.dow.forEach(function (day, index) {
              time += day == true ? dow[index] + ' ' : '';
            });
            time += '<b>' + el.hours.from + '-' + el.hours.to + '</b> ' + dv;
            break;
        }

        html += "\n            <li class=\"form-text mb-2\" >\n                ".concat(time, "\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"#ff0079\" class=\"remove-discount bi bi-x-circle\" data-index=").concat(index, " viewBox=\"0 0 16 16\"><path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path><path d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"></path></svg>\n            </li>");
      });

      if (html == '') {
        document.querySelector('.discount-list').classList.add('d-none');
      } else {
        document.querySelector('.discount-list').classList.remove('d-none');
      }

      document.querySelector('.discount-blocks ul').innerHTML = html;
      onClick('.remove-discount', _this.listeners.removeDiscount);
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
