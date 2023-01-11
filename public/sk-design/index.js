
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

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

  /*
   * Translates string based on preloaded i18n locale values.
   * 
   * @param text {String} text to translate
   * @param p {String} list of parameters, to be replaced with %1$, %2$..
   * @returns {String} - text
   */
  const __ = (text, ...p) => {

      let match = (input, pa) => {

          pa.forEach((p, i) => { input = input.replace('%'+(i+1)+'$', p); }); 
          
          return input;
      };

      if(typeof window.i18n === 'undefined') return match(text, p);
      if(window.i18n.state.locale.values[text] === undefined) return match(text, p);



      return match(window.i18n.state.locale.values[text], p);
  };

  /*
   * Translates string based on preloaded i18n locale values.
   * 
   * @param text {String} text to translate
   * @param cb {Function} callback function to escape text variable
   * @param p {String} list of parameters, to be replaced with %1$, %2$..
   * @returns {String} - text
   */
  const __esc = (text, cb, ...p) => {

      let match = (input, pa) => {

          pa.forEach((p, i) => { input = input.replace('%'+(i+1)+'$', p); }); 
          
          return input;
      };

      if(typeof window.i18n === 'undefined') return match(text, p);
      if(window.i18n.state.locale.values[text] === undefined) return match(text, p);

      return match(cb(window.i18n.state.locale.values[text]), p);
  };

  /*
   * Converts special characters `&`, `<`, `>`, `"`, `'` to HTML entities and does translations
   * 
   * @param text {String}  text
   * @returns {String} - text
   */
  const __html = (text, ...p) => {

      text = String(text);

      if(text.length === 0){
  		return '';
  	}

      let cb = (text) => {

          return text.replace(/[&<>'"]/g, tag => (
              {
                  '&': '&amp;',
                  '<': '&lt;',
                  '>': '&gt;',
                  "'": '&apos;',
                  '"': '&quot;'
              } [tag]));
      };

      return __esc(text, cb, ...p);
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
   * @name onKeyUp
   * @description One row key up event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onKeyUp = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('keyup', fn, true);
          e.addEventListener('keyup', fn, true);
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
  var escape$1 = function escape(htmlStr) {
    return htmlStr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var unescape = function unescape(htmlStr) {
    htmlStr = htmlStr.replace(/&lt;/g, "<");
    htmlStr = htmlStr.replace(/&gt;/g, ">");
    htmlStr = htmlStr.replace(/&quot;/g, "\"");
    htmlStr = htmlStr.replace(/&#39;/g, "\'");
    htmlStr = htmlStr.replace(/&amp;/g, "&");
    return htmlStr;
  };
  var degToRad = function degToRad(deg) {
    return (deg - 90) * Math.PI / 180.0;
  };

  var HTMLContent = function HTMLContent() {
    return "\n  <div class=\"container p-sk-edit mt-4\">\n    <div class=\"row\">\n        <div class=\"col-lg-9 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n            <div class=\"sections\" id=\"sections\" role=\"tablist\" style=\"width:100%;\">\n\n                <div class=\"row\">\n                    <div class=\"col-12 grid-margin stretch-card\">\n                        <div class=\"card border-white shadow-sm p-sm-3\">\n                            <div class=\"card-body\">\n\n                                <div class=\"landing_status\"></div>\n                                <input type=\"hidden\" class=\"form-control\" id=\"landing-slug\" value=\"\">\n\n                                <h4 id=\"sketch-h\" class=\"card-title mb-4\">".concat(__html('Sketch'), "</h4>\n\n                                <div id=\"placeholders\">\n\n                                    <div class=\"mb-3\">\n                                        <label class=\"banner-descshort-l form-label d-none\" for=\"desc\">").concat(__html('Drawing'), "</label>\n                                        <div class=\"btn-group mb-3\" role=\"group\" aria-label=\"Basic radio toggle button group\">\n                                            <input type=\"radio\" class=\"btn-check\" name=\"sketchmode\" id=\"preview\" autocomplete=\"off\" checked>\n                                            <label class=\"btn btn-outline-primary\" for=\"preview\">").concat(__html('Upload'), "</label>\n\n                                            <input type=\"radio\" class=\"btn-check\" name=\"sketchmode\" id=\"drawing\" autocomplete=\"off\">\n                                            <label class=\"btn btn-outline-primary\" for=\"drawing\">").concat(__html('Drawing'), "</label>\n\n                                            <input type=\"radio\" class=\"btn-check\" name=\"sketchmode\" id=\"editing\" autocomplete=\"off\">\n                                            <label class=\"btn btn-outline-primary\" for=\"editing\">").concat(__html('Editing'), "</label>\n                                        </div>\n                                        <div class=\"drawing\"></div>\n                                        <div class=\"clearfix\"></div>\n                                    </div>\n\n                                    <div class=\"mb-3 \" style=\"max-width:600px;overflow:scroll;\">\n                                        <label class=\"banner-title-l form-label\" for=\"p-test\">").concat(__html('Input fields'), "</label>\n                                        <div class=\"input-fields\">\n\n                                        </div>\n                                        <p class=\"form-text\"> </p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw\">\n                                        <label class=\"form-label\" for=\"calc_price\">").concat(__html('Calculate price'), "</label>\n                                        <select id=\"calc_price\" class=\"form-select inp\" >\n                                            <option value=\"default\">").concat(__html('Default price'), "</option>\n                                            <option value=\"variable\">").concat(__html('Variable'), "</option>\n                                            <option value=\"sketch\">").concat(__html('By sketch'), "</option>\n                                            <option value=\"formula\">").concat(__html('By formula'), "</option>\n                                            <option value=\"complex\">").concat(__html('Complex product'), "</option>\n                                        </select>\n                                        <p class=\"form-text\"> </p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw variable_prices_cont\">\n                                        <input type=\"hidden\" id=\"price\" value=\"\" />\n                                        <button class=\"btn btn-sm btn-outline-primary btn-view-variations mb-2\" type=\"button\">").concat(__html('View variations'), "</button>\n                                        <p class=\"form-text\">").concat(__html('Override default prices by clicking on the button above.'), "</p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw formula_cont d-none\">\n                                        <label class=\"form-label\" for=\"formula\">").concat(__html('Formula footage'), "</label>\n                                        <input id=\"formula\" type=\"text\" class=\"form-control inp\" placeholder=\"").concat(__html('(A + B) * L'), "\">\n                                        <p class=\"form-text formula-hint\">").concat(__html('Square formula to calculate price.'), "</p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw fwl_cont\">\n                                        <div class=\"row\">\n                                            <div class=\"col-md-6\">\n                                                <label class=\"form-label\" for=\"formula\">").concat(__html('Formula width'), "</label>\n                                                <input id=\"formula_width\" type=\"text\" class=\"form-control inp\" placeholder=\"").concat(__html('A + B + C'), "\">\n                                                <p class=\"form-text formula_width-hint\">").concat(__html('Product width in mm.'), "</p>\n                                            </div>\n                                            <div class=\"col-md-6\">\n                                                <label class=\"form-label\" for=\"formula\">").concat(__html('Formula length'), "</label>\n                                                <input id=\"formula_length\" type=\"text\" class=\"form-control inp\" placeholder=\"").concat(__html('L'), "\">\n                                                <p class=\"form-text formula_length-hint\">").concat(__html('Product length in mm.'), "</p>\n                                            </div>\n                                        </div>\n                                    </div>\n\n                                    <div class=\"mb-3 mw formula_price_cont d-none\">\n                                        <label class=\"form-label\" for=\"formula_price\">").concat(__html('Formula price'), "</label>\n                                        <input id=\"formula_price\" type=\"text\" class=\"form-control inp\" placeholder=\"").concat(__html('B>1000?1.80:0.90'), "\">\n                                        <p class=\"form-text formula_price-hint\">").concat(__html('Final price = Formula footage + Price formula.'), "</p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw parts_cont d-none\">\n                                        <h4 id=\"parts-h\" class=\"card-title mb-4\">").concat(__html('Parts'), "</h4>\n                                        <textarea id=\"parts\" class=\"form-control mw\" name=\"parts\" rows=\"6\" data-type=\"text\" style=\"font-size:13px;font-family: monospace;\"></textarea>\n                                        <p class=\"form-text formula_price-hint\">").concat(__html('Provide one product ID per line.'), "</p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw \">\n                                        <input id=\"modelling\" class=\"form-check-input inp modelling\" name=\"modelling\" type=\"checkbox\" value=\"0\" data-type=\"checkbox\">\n                                        <label class=\"form-check-label\" for=\"modelling\">\n                                            ").concat(__html('3D Modelling'), "\n                                        </label>\n                                        <p class=\"form-text\">").concat(__html('Enable 3D modelling options when product is previewed.'), "</p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw \">\n                                        <label class=\"form-label\" for=\"tax_id\">").concat(__html('Tax ID'), "</label>\n                                        <input id=\"tax_id\" class=\"form-control inp tax_id\" name=\"tax_id\" type=\"text\" value=\"0\" data-type=\"text\">\n                                        <p class=\"form-text\">").concat(__html('Tax code for 0 VAT rates.'), "</p>\n                                    </div>\n\n                                    <div class=\"mb-3 mw\">\n                                        <div class=\"list-wrapper\">\n                                            <ul class=\"d-flex flex-column-reverse\"> </ul>\n                                        </div>\n                                        <p class=\"form-text\"> </p>\n                                    </div>\n\n                                </div>\n\n                                <div class=\"desc-repeater-cont\">\n\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                </div>\n\n            </div>\n        </div>\n    </div>\n  </div>\n\n  ");
  };

  var Polyline = _createClass(function Polyline(_data) {
    var _this = this;

    _classCallCheck(this, Polyline);

    _defineProperty(this, "draw", function (points) {
      if (_this.mode != 'drawing') return;
      var polyLine = "<g data-id=\"".concat(_this.id, "\" data-type=\"polyline\"><polyline data-id=\"").concat(_this.id, "\" points=\"").concat(_this.polyPoints(points), "\" style=\"stroke-width:").concat(_this.style.stroke_width, ";stroke:").concat(_this.style.stroke, ";fill:").concat(_this.style.fill, ";\"></polyline></g>");
      document.querySelector("#svg").insertAdjacentHTML('beforeend', polyLine);

      _this.drawCircle('start', points);

      return _this;
    });

    _defineProperty(this, "setCoords", function (data) {
      if (!document.querySelector('#svg polyline[data-id="' + _this.id + '"]')) return;
      var poly_points = document.querySelector('#svg polyline[data-id="' + _this.id + '"]').getAttribute('points');
      var poly_points_arr = poly_points.split(' ');

      if (data.mode == 'drawing') {
        if (poly_points_arr.length > 3) {
          poly_points_arr = poly_points_arr.splice(0, 2);
        }

        if (document.querySelector('#svg polyline[data-id="' + _this.id + '"]')) document.querySelector('#svg polyline[data-id="' + _this.id + '"]').setAttribute('points', (poly_points_arr.join(" ") + " " + _this.polyPoints(data.points)).trim());
      }

      if (data.mode == 'editing') {
        switch (_this.rect) {
          case 'start':
            poly_points_arr[0] = data.points[0].x;
            poly_points_arr[1] = data.points[0].y;
            break;

          case 'end':
            poly_points_arr[2] = data.points[0].x;
            poly_points_arr[3] = data.points[0].y;
            break;
        }

        if (document.querySelector('#svg polyline[data-id="' + _this.id + '"]')) document.querySelector('#svg polyline[data-id="' + _this.id + '"]').setAttribute('points', poly_points_arr.join(" "));

        if (document.querySelector('#svg rect[data-id="' + _this.rect + _this.id + '"]')) {
          document.querySelector('#svg rect[data-id="' + _this.rect + _this.id + '"]').setAttribute('x', data.points[0].x - 4);
          document.querySelector('#svg rect[data-id="' + _this.rect + _this.id + '"]').setAttribute('y', data.points[0].y - 4);
        }
      }
    });

    _defineProperty(this, "setEndCoords", function (points) {
      if (!document.querySelector('#svg polyline[data-id="' + _this.id + '"]')) return;

      _this.setCoords(points);

      _this.drawCircle('end', points.points);

      var poly_points = document.querySelector('#svg polyline[data-id="' + _this.id + '"]').getAttribute('points');
      var poly_points_arr = poly_points.split(' ');
      if (poly_points_arr[0] == poly_points_arr[2] && poly_points_arr[1] == poly_points_arr[3]) document.querySelector('#svg g[data-id="' + _this.id + '"]').remove();
    });

    _defineProperty(this, "drawCircle", function (type, points) {
      var rect = "<rect data-id=\"".concat(type + _this.id, "\" x=\"").concat(points[0].x - 4, "\" y=\"").concat(points[0].y - 4, "\" class=\"po\" data-type=\"polyline\" data-rect=\"").concat(type, "\" width=\"8\" height=\"8\" rx=\"8\" style=\"stroke-width:2px;stroke:").concat(_this.style.stroke, ";fill:rgba(255,255,255,1);\" />");
      if (document.querySelector('#svg g[data-id="' + _this.id + '"]')) document.querySelector('#svg g[data-id="' + _this.id + '"]').insertAdjacentHTML('beforeend', rect);
    });

    _defineProperty(this, "polyPoints", function (points) {
      return points.reduce(function (previousValue, currentItem) {
        return previousValue + currentItem.x + ' ' + currentItem.y + ' ';
      }, '').trim();
    });

    _defineProperty(this, "setSVGCoords", function (coords) {
      return _this;
    });

    _defineProperty(this, "getID", function () {
      return _this.id;
    });

    _defineProperty(this, "genID", function (len) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    });

    this.data = _data;
    this.id = _data.id ? _data.id : this.genID(6);
    this.mode = _data.mode ? _data.mode : 'drawing';
    this.rect = _data.rect ? _data.rect : '';
    this.selected = null;
    this.style = {
      stroke_width: '3px',
      stroke: '#00F',
      fill: 'rgba(255, 255, 255, 0)'
    };
    this.draw(_data.points);
  });
  var Arc = _createClass(function Arc(_data2) {
    var _this2 = this;

    _classCallCheck(this, Arc);

    _defineProperty(this, "draw", function (data) {
      if (_this2.mode == 'drawing') {
        var arc = "<g data-id=\"".concat(_this2.id, "\" data-type=\"arc\" data-params=\"").concat(escape$1(JSON.stringify(data.params)), "\" ><path data-id=\"").concat(_this2.id, "\" fill=\"transparent\" d=\"").concat(data.points, "\" style=\"stroke-width:").concat(_this2.style.stroke_width, ";stroke:").concat(_this2.style.stroke, ";fill:").concat(_this2.style.fill, ";\"></path></g>");
        document.querySelector("#svg").insertAdjacentHTML('beforeend', arc);

        _this2.drawCircle('start', data);

        _this2.drawCircle('end', data);
      }

      if (_this2.mode == 'editing') {
        var params = JSON.parse(unescape(document.querySelector('#svg g[data-id="' + _this2.id + '"]').dataset.params));
        var a = params.x - data.params.x;
        var b = params.y - data.params.y;
        var newDeg = Math.atan2(a, b) * 180 / Math.PI;
        newDeg = newDeg < 0 ? newDeg * -1 : 360 - newDeg;
        if (_this2.rect == 'start') params.startAngle = newDeg;
        if (_this2.rect == 'end') params.endAngle = newDeg;
        _this2.data.points = _this2.describeArc(params.x, params.y, params.radius, params.startAngle, params.endAngle);
        document.querySelector('#svg g[data-id="' + _this2.id + '"] path').setAttribute('d', _this2.data.points);
        document.querySelector('#svg g[data-id="' + _this2.id + '"]').dataset.params = escape$1(JSON.stringify(params));
        document.querySelector('#svg g[data-id="' + _this2.id + '"] rect[data-rect="' + _this2.rect + '"').setAttribute('x', params.x + data.params.radius * Math.cos(_this2.degToRad(newDeg)) - 4);
        document.querySelector('#svg g[data-id="' + _this2.id + '"] rect[data-rect="' + _this2.rect + '"').setAttribute('y', params.y + data.params.radius * Math.sin(_this2.degToRad(newDeg)) - 4);
      }

      return _this2;
    });

    _defineProperty(this, "drawCircle", function (type, data) {
      var angleInRadians = 0;
      if (type == 'start') angleInRadians = _this2.degToRad(data.params.startAngle);
      if (type == 'end') angleInRadians = _this2.degToRad(data.params.endAngle);
      var x = data.params.x + data.params.radius * Math.cos(angleInRadians) - 4;
      var y = data.params.y + data.params.radius * Math.sin(angleInRadians) - 4;
      var rect = "<rect data-id=\"".concat(type + _this2.id, "\" x=\"").concat(x, "\" y=\"").concat(y, "\" data-type=\"arc\" class=\"po\" data-rect=\"").concat(type, "\" width=\"8\" height=\"8\" rx=\"8\" style=\"stroke-width:2px;stroke:").concat(_this2.style.stroke, ";fill:rgba(255,255,255,1);\" />");
      if (document.querySelector('#svg g[data-id="' + _this2.id + '"]')) document.querySelector('#svg g[data-id="' + _this2.id + '"]').insertAdjacentHTML('beforeend', rect);
    });

    _defineProperty(this, "polarToCartesian", function (centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = _this2.degToRad(angleInDegrees);

      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    });

    _defineProperty(this, "describeArc", function (x, y, radius, startAngle, endAngle) {
      var endAngleOriginal = endAngle;

      if (endAngleOriginal - startAngle === 360) {
        endAngle = 359;
      }

      var start = _this2.polarToCartesian(x, y, radius, endAngle);

      var end = _this2.polarToCartesian(x, y, radius, startAngle);

      var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

      if (endAngleOriginal - startAngle === 360) {
        var d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y, "z"].join(" ");
      } else {
        var d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");
      }

      return d;
    });

    _defineProperty(this, "degToRad", function (deg) {
      return (deg - 90) * Math.PI / 180.0;
    });

    _defineProperty(this, "genID", function (len) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    });

    _defineProperty(this, "getPath", function () {
      return _this2.points;
    });

    _defineProperty(this, "getID", function () {
      return _this2.id;
    });

    this.data = _data2, this.id = _data2.id ? _data2.id : this.genID(6);
    this.mode = _data2.mode ? _data2.mode : 'drawing';
    this.rect = _data2.rect ? _data2.rect : '';
    this.style = {
      stroke_width: '3px',
      stroke: '#ff007d',
      fill: 'rgba(255, 255, 255, 0)'
    };
    this.selected = null;
    this.data.points = this.describeArc(_data2.params.x, _data2.params.y, _data2.params.radius, _data2.params.startAngle, _data2.params.endAngle);
    this.draw(this.data);
  });

  var CDN = 'https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/';
  var _this = {
    init: function init() {
      _this.getData();
    },
    state: {
      ajaxQueue: 0,
      settings: {},
      sk_settings: {},
      firstLoad: true,
      product: {
        input_fields: []
      },
      sketch: {
        mode: 'preview',
        type: '',
        mousedown: false,
        last: {
          id: null
        },
        angle: false
      }
    },
    getData: function getData() {
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
              fields: ['_id', 'id', 'test', 'modelling', 'tax_id', 'input_fields', 'formula', 'formula_price', 'formula_width', 'formula_length', 'calc_price', 'var_price', 'parts', 'updated']
            },
            settings: {
              type: 'get',
              key: 'ecommerce-settings',
              fields: ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display']
            },
            sk_settings: {
              type: 'get',
              key: 'sk-settings',
              fields: ['var_parent', 'price']
            },
            locale: {
              type: 'locale',
              source: ['extension'],
              key: 'sk-design'
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
          _this.state.sk_settings = response.sk_settings;
          _this.state.product = response.product;

          if (response.product.length == 0) {
            return;
          }

          document.querySelector('#contents').insertAdjacentHTML('beforeend', HTMLContent());

          _this.loadDrawing(response.product);

          _this.renderPage(response.product);

          _this.initListeners();
        }
      })["catch"](function (error) {
        parseApiError(error);
      });
    },
    renderPage: function renderPage(product) {
      var d = document;
      _this.state.sketch.mode = 'drawing';

      if (product.input_fields) {
        simulateClick(document.querySelector('#editing'));
        product.input_fields.forEach(function (obj) {
          var html = _this.structInputRow(obj);

          if (!document.querySelector('#field' + obj.id)) document.querySelector('.input-fields').insertAdjacentHTML('beforeend', html);

          if (!document.querySelector('#svg g[data-id="' + obj.id + '"]')) {
            switch (obj.type) {
              case 'polyline':
                var points_arr = obj.points.split(' ');
                _this.state.sketch.polyline = new Polyline({
                  points: [{
                    x: points_arr[0],
                    y: points_arr[1]
                  }],
                  mode: 'drawing',
                  id: obj.id
                });

                _this.state.sketch.polyline.setCoords({
                  points: [{
                    x: points_arr[2],
                    y: points_arr[3]
                  }],
                  mode: 'drawing'
                });

                _this.state.sketch.polyline.setEndCoords({
                  points: [{
                    x: points_arr[2],
                    y: points_arr[3]
                  }],
                  mode: 'drawing'
                });

                break;

              case 'arc':
                obj.params = typeof obj.params == 'string' ? {} : obj.params;
                _this.state.sketch.arc = new Arc({
                  params: {
                    x: obj.params.x,
                    y: obj.params.y,
                    radius: obj.params.radius,
                    startAngle: obj.params.startAngle,
                    endAngle: obj.params.endAngle
                  },
                  mode: 'drawing',
                  id: obj.id
                });
                break;
            }
          }
        });

        _this.refreshFields();
      }

      _this.listeners.inputFieldListeners();

      _this.state.sketch.polyline = null;
      d.querySelector("#calc_price").value = product.calc_price ? product.calc_price : 'default';
      d.querySelector("#formula").value = product.formula;
      d.querySelector("#formula_price").value = product.formula_price;
      d.querySelector("#formula_width").value = product.formula_width;
      d.querySelector("#formula_length").value = product.formula_length;
      d.querySelector("#price").value = JSON.stringify(product.var_price ? product.var_price : []);
      d.querySelector("#modelling").checked = product.modelling == 1 ? true : false;
      d.querySelector("#tax_id").value = product.tax_id;

      _this.listeners.priceContVisibility();

      document.querySelector("#formula").addEventListener('keyup', function (e) {
        var formula = e.currentTarget.value;
        var labels = "COATING ";
        formula = formula.replaceAll("COATING", 1);

        var _iterator = _createForOfIteratorHelper(document.querySelectorAll('.input-fields > div')),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var div = _step.value;
            labels += div.querySelector('.field-label').value + " ";
            formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        labels = labels.trim();
        var result = 0;

        try {
          document.querySelector(".formula-hint").innerHTML = '';
          result = eval(formula);
          document.querySelector("#formula").setCustomValidity("");
        } catch (e) {
          document.querySelector("#formula").setCustomValidity(__("Invalid formula"));
          document.querySelector(".formula-hint").innerHTML = __("Invalid formula. Use one of the following letters only: " + labels);
        }

        document.querySelector("#formula").parentElement.classList.add('was-validated');
        if (result > 0) document.querySelector(".formula-hint").innerHTML = __("Result: <b>" + result / 1000000 + " ㎡</b> based on the input fields default values", result);
      });
      document.querySelector("#formula_price").addEventListener('keyup', function (e) {
        var formula = e.currentTarget.value;
        var labels = "COATING ";
        formula = formula.replaceAll("COATING", 1);

        var _iterator2 = _createForOfIteratorHelper(_this.state.sk_settings.price),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var price = _step2.value;
            if (price.id.length == 0) continue;
            labels += price.id + " ";
            formula = formula.replaceAll(price.id, parseFloat(price.price));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll('.input-fields > div')),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var div = _step3.value;
            labels += div.querySelector('.field-label').value + " ";
            formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        labels = labels.trim();
        var result = 0;

        try {
          document.querySelector(".formula_price-hint").innerHTML = '';
          result = eval(formula);
          document.querySelector("#formula_price").setCustomValidity("");
        } catch (e) {
          document.querySelector("#formula_price").setCustomValidity(__("Invalid price formula"));
          document.querySelector(".formula_price-hint").innerHTML = __("Invalid price formula. Use one of the following letters only: " + labels);
        }

        document.querySelector("#formula_price").parentElement.classList.add('was-validated');
        if (result > 0) document.querySelector(".formula_price-hint").innerHTML = __("Result: <b>" + priceFormat(_this, result) + "</b> based on the input fields default values", result);
      });
      document.querySelector("#formula_width").addEventListener('keyup', function (e) {
        var formula = e.currentTarget.value;
        var labels = " ";

        var _iterator4 = _createForOfIteratorHelper(document.querySelectorAll('.input-fields > div')),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var div = _step4.value;
            labels += div.querySelector('.field-label').value + " ";
            formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        labels = labels.trim();
        var result = 0;

        try {
          document.querySelector(".formula_width-hint").innerHTML = '';
          result = eval(formula);
          document.querySelector("#formula_width").setCustomValidity("");
        } catch (e) {
          console.log(e);
          document.querySelector("#formula_width").setCustomValidity(__("Invalid width formula"));
          document.querySelector(".formula_width-hint").innerHTML = __("Invalid width formula. Use one of the following letters only: " + labels);
        }

        document.querySelector("#formula_width").parentElement.classList.add('was-validated');
      });
      document.querySelector("#formula_length").addEventListener('keyup', function (e) {
        var formula = e.currentTarget.value;
        var labels = " ";

        var _iterator5 = _createForOfIteratorHelper(document.querySelectorAll('.input-fields > div')),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var div = _step5.value;
            labels += div.querySelector('.field-label').value + " ";
            formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        labels = labels.trim();
        var result = 0;

        try {
          document.querySelector(".formula_length-hint").innerHTML = '';
          result = eval(formula);
          document.querySelector("#formula_length").setCustomValidity("");
        } catch (e) {
          console.log(e);
          document.querySelector("#formula_length").setCustomValidity(__("Invalid length formula"));
          document.querySelector(".formula_length-hint").innerHTML = __("Invalid length formula. Use one of the following letters only: " + labels);
        }

        document.querySelector("#formula_length").parentElement.classList.add('was-validated');
      });
      if (!product.parts) product.parts = [];
      if (!Array.isArray(product.parts)) product.parts = [];
      product.parts.forEach(function (part) {
        document.querySelector("#parts").value += part.id + '\n';
      });
    },
    initListeners: function initListeners() {
      if (!_this.state.firstLoad) return;
      onClick('.btn-save', _this.listeners.saveProduct);
      onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);
      onChange('#calc_price', _this.listeners.priceChange);
      _this.state.firstLoad = false;
    },
    listeners: {
      priceChange: function priceChange(e) {
        e.preventDefault();

        _this.listeners.priceContVisibility();
      },
      priceContVisibility: function priceContVisibility() {
        document.querySelector('.formula_cont').classList.add("d-none");
        document.querySelector('.formula_price_cont').classList.add("d-none");
        document.querySelector('.parts_cont').classList.add("d-none");
        document.querySelector('.variable_prices_cont').classList.add("d-none");
        var calc_price = document.querySelector('#calc_price').value;

        if (calc_price == "variable") {
          document.querySelector('.variable_prices_cont').classList.remove("d-none");
        }

        if (calc_price == "formula") {
          document.querySelector('.formula_cont').classList.remove("d-none");
          document.querySelector('.formula_price_cont').classList.remove("d-none");
        }

        if (calc_price == "complex") {
          document.querySelector('.parts_cont').classList.remove("d-none");
        }
      },
      viewVariations: function viewVariations(e) {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-dialog").classList.add('modal-lg');
        modal.querySelector(".modal-title").innerHTML = __html("Variations");
        modal.querySelector(".btn-primary").classList.add("d-none");
        modal.querySelector(".btn-secondary").innerHTML = __html('Close');
        var modalHTml = "\n\n                <div class=\"row\">\n                    <div class=\"col-sm-12\">\n                        <div class=\"table-responsive\">\n                            <table class=\"price-table order-form mb-3\">\n                                <theader>\n                                    <tr><th><div class=\"me-1 me-sm-3\">".concat(__html('Site'), "</div></th><th class=\"qty\"><div class=\"me-1 me-sm-3\">").concat(__html('Code'), "</div></th><th><div class=\"me-1 me-sm-3\">").concat(__html('Parent'), "</div></th><th><div class=\"me-1 me-sm-3\">").concat(__html('Title'), "</div></th><th class=\"tp\"><div class=\"me-1 me-sm-3\">").concat(__html('Price'), "</div></th><th class=\"tp\"><div class=\"me-1 me-sm-3\">").concat(__html('Unit'), "</div></th><th></th></tr>\n                                    <tr class=\"new-item-row\">\n                                        <td>\n            \n                                        </td>\n                                        <td class=\"tp\">\n                                            <div class=\"me-1 me-sm-3 mt-2\">\n                                                <input type=\"text\" value=\"\" autocomplete=\"off\" class=\"form-control price-id\" style=\"max-width:100px;\">\n                                            </div>\n                                        </td>\n                                        <td>\n                                            <div class=\"me-1 me-sm-3 mt-2\">\n                                                <input type=\"text\" value=\"\" autocomplete=\"off\" class=\"form-control price-parent\" style=\"max-width:120px;\">\n                                                <select class=\"form-select price-parent- inp d-none\" name=\"price_parent- \" data-type=\"select\">\n            \n                                                </select>\n                                            </div>\n                                        </td>\n                                        <td>\n                                        <div class=\"me-1 me-sm-3 mt-2\">\n                                            <input type=\"text\" value=\"\" autocomplete=\"off\" placeholder=\" \" class=\"form-control price-title\" data-id=\"\" data-index=\"\" list=\"item-suggestions\">\n                                        </div>\n                                        </td>\n                                        <td class=\"price\">\n                                            <div class=\"me-1 me-sm-3 mt-2\">\n                                                <input type=\"text\" value=\"\" autocomplete=\"off\" class=\"form-control text-right price-price\" style=\"max-width:80px;\">\n                                            </div>\n                                        </td>\n                                        <td class=\"price\">\n                                            <div class=\"me-1 me-sm-3 mt-2\">\n                                            <select class=\"form-select price-unit inp\" name=\"price_unit\" data-type=\"select\">\n                                                <option value=\"unit\" selected>").concat(__html('Unit'), "</option>\n                                                <option value=\"length\">").concat(__html('Length'), "</option>\n                                                <option value=\"m2\">").concat(__html('㎡'), "</option>\n                                                <option value=\"hour\">").concat(__html('Hour'), "</option>\n                                            </select>\n                                            </div>\n                                        </td>\n                                        <td class=\"align-middle text-center pt-2\"> \n                                            <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 16 16\" width=\"24\" height=\"24\" class=\"bi bi-plus-circle text-success align-middle add-price po\"><path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path><path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"></path></svg>\n                                        </td>\n                                    </tr>\n                                </theader>\n                                <tbody>");
        modalHTml += "</tbody>\n                            </table>\n                        </div>\n                    </div>\n                </div>";
        modal.querySelector(".modal-body").innerHTML = modalHTml;
        var price = JSON.parse(document.querySelector('#price').value),
            var_parent = [];
        var parent_options = '<option value="">' + __('None') + '</option>';
        if (price.length == 0) price = _this.state.sk_settings.price;
        if (_this.state.sk_settings.var_parent) var_parent = _this.state.sk_settings.var_parent;
        console.log(price);

        if (Array.isArray(price)) {
          price.forEach(function (price, i) {
            if (!price.parent) {
              document.querySelector('.price-table > tbody').insertAdjacentHTML("beforeend", _this.structCoatingRow(price, i));
            }
          });
          price.forEach(function (price, i) {
            if (price.parent) {
              if (document.querySelector('.price-table > tbody [data-parent="' + price.parent + '"]')) {
                document.querySelector('.price-table > tbody [data-parent="' + price.parent + '"]').insertAdjacentHTML("afterend", _this.structCoatingRow(price, i));
              } else {
                document.querySelector('.price-table > tbody').insertAdjacentHTML("beforeend", _this.structCoatingRow(price, i));
              }
            }
          });
        } else {
          price = [];
          document.querySelector('#price').value = '[]';
        }

        var_parent.split('\n').forEach(function (el) {
          parent_options += '<option value="' + el + '">' + el + '</option>';
        });
        document.querySelector('.price-parent').innerHTML = parent_options;
        onClick('.remove-price', _this.listeners.removePrice);
        onlyNumbers(".price-price", [8, 46]);
        onKeyUp('.price-price', _this.listeners.updatePrice);
        onClick('.price-public', _this.listeners.publicPrice);
        document.querySelector('#price').value = JSON.stringify(price);
        onClick('.add-price', _this.listeners.addPrice);
        modalCont.show();
      },
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
      inputFieldListeners: function inputFieldListeners(e) {
        onClick('.remove-input-field', _this.listeners.removeInputFields);
        onlyNumbers('.field-default', [8, 46]);
        onlyNumbers('.field-min', [8, 46]);
        onlyNumbers('.field-max', [8, 46]);
      },
      removeBlock: function removeBlock(e) {
        e.preventDefault();
        var c = confirm(__('Remove entire block?'));

        if (c) {
          e.currentTarget.parentNode.parentNode.remove();
        }

        console.log('removeBlock');
      },
      removeInputFields: function removeInputFields(e) {
        var c = confirm(__('Remove row?'));
        if (!c) return;
        var id = e.currentTarget.dataset.id;
        console.log('remove' + id);
        if (document.querySelector('#svg g[data-id="' + id + '"]')) document.querySelector('#svg g[data-id="' + id + '"]').remove();
        if (document.querySelector('.input-fields #field' + id)) document.querySelector('.input-fields #field' + id).remove();
        if (document.querySelector('.svg-input[data-id="' + id + '"]')) document.querySelector('.svg-input[data-id="' + id + '"]').remove();
      },
      inputFieldChange: function inputFieldChange(e) {
        console.log(e.currentTarget.value);
        var id = e.currentTarget.parentElement.parentElement.id.replace('field', '');
        document.querySelector('.svg-input[data-id="' + id + '"] > label').innerHTML = e.currentTarget.value;
      },
      saveProduct: function saveProduct(e) {
        e.preventDefault();
        setTimeout(function () {
          var data = {};
          data['input_fields'] = [];

          var _iterator6 = _createForOfIteratorHelper(document.querySelectorAll('.input-fields > div')),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var div = _step6.value;
              var obj = {};
              obj['id'] = div.id.replace('field', '');
              obj['points'] = div.dataset.points;
              obj['type'] = div.dataset.type;
              obj['params'] = obj['type'] == 'arc' ? JSON.parse(unescape(div.dataset.params)) : {};
              obj['label'] = div.querySelector('.field-label').value;
              obj['label_pos'] = div.querySelector('.field-label-pos').value;
              obj['default'] = parseFloat(div.querySelector('.field-default').value);
              obj['min'] = parseFloat(div.querySelector('.field-min').value);
              obj['max'] = parseFloat(div.querySelector('.field-max').value);
              data['input_fields'].push(obj);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          data['var_price'] = JSON.parse(document.querySelector('#price').value);
          data['calc_price'] = document.querySelector('#calc_price').value;
          data['formula'] = document.querySelector('#formula').value.trim();
          data['formula_price'] = document.querySelector('#formula_price').value.trim();
          data['formula_width'] = document.querySelector('#formula_width').value.trim();
          data['formula_length'] = document.querySelector('#formula_length').value.trim();
          data['modelling'] = document.querySelector('#modelling').checked ? 1 : 0;
          data['tax_id'] = document.querySelector('#tax_id').value;
          data['parts'] = [];
          document.querySelector("#parts").value.trim().split('\n').forEach(function (el) {
            data['parts'].push({
              id: el
            });
          });
          console.log(data);
          var id = getProductId();
          var sid = spaceID();
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
          })["catch"](function (error) {
            parseApiError(error);
          });
        }, 1000);
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
      sketchMode: function sketchMode(e) {
        _this.state.sketch.mode = e.currentTarget.id;

        if (e.currentTarget.id == 'preview') {
          document.querySelector("#svg").style.zIndex = '-2';
        } else {
          document.querySelector("#svg").style.zIndex = '2';
        }

        document.querySelector(".sketch-cont").dataset.mode = e.currentTarget.id;
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        console.log('calling modalSuccessBtnFunc');

        _this.listeners.modalSuccessBtnFunc(e);
      },
      stockManagement: function stockManagement(e) {
        var _iterator7 = _createForOfIteratorHelper(document.querySelectorAll('.stock-cont')),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var el = _step7.value;
            e.currentTarget.checked ? el.classList.remove('d-none') : el.classList.add('d-none');
            e.currentTarget.value = e.currentTarget.checked ? "1" : "0";
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      },
      addPrice: function addPrice(e) {
        var obj = {};
        obj.id = document.querySelector('.price-id').value;
        obj.title = document.querySelector('.price-title').value;
        document.querySelector('.price-title').value = '';
        obj.parent = document.querySelector('.price-parent').value;
        obj.price = document.querySelector('.price-price').value;
        obj.unit = document.querySelector('.price-unit').value;
        obj["public"] = true;
        if (obj.title.length < 1 || obj.price.length < 1) return false;
        var prices = document.querySelector('#price').value;

        if (prices) {
          prices = JSON.parse(prices);
        } else {
          prices = [];
        }

        if (Array.isArray(prices)) {
          prices.push(obj);
        } else {
          prices = [];
        }

        document.querySelector('#price').value = JSON.stringify(prices);

        if (document.querySelector('.price-table > tbody [data-parent="' + obj.parent + '"]:last-child')) {
          document.querySelector('.price-table > tbody [data-parent="' + obj.parent + '"]:last-child').insertAdjacentHTML("afterend", _this.structCoatingRow(obj, prices.length - 1));
        } else {
          document.querySelector('.price-table').insertAdjacentHTML("beforeend", _this.structCoatingRow(obj, prices.length - 1));
        }

        onClick('.remove-price', _this.listeners.removePrice);
        onlyNumbers(".price-price", [8, 46]);
        onKeyUp('.price-price', _this.listeners.updatePrice);
        onClick('.price-public', _this.listeners.publicPrice);
      },
      removePrice: function removePrice(e) {
        e.preventDefault();
        var c = confirm(__('Remove this record?'));
        if (!c) return;
        var hash = e.currentTarget.parentElement.parentElement.dataset.hash;
        var prices = JSON.parse(document.querySelector('#price').value);
        prices = prices.filter(function (obj) {
          return escape$1(obj.id + obj.title + obj.parent) != hash;
        });
        document.querySelector('#price').value = JSON.stringify(prices);
        e.currentTarget.parentElement.parentElement.remove();
      },
      updatePrice: function updatePrice(e) {
        e.preventDefault();
        var hash = e.currentTarget.parentElement.parentElement.parentElement.dataset.hash;
        if (!hash) return;
        var prices = JSON.parse(document.querySelector('#price').value);
        prices.forEach(function (obj, i) {
          if (escape$1(obj.id + obj.title + obj.parent) == hash) {
            prices[i].price = e.currentTarget.value;
          }
        });
        console.log(e.currentTarget.value);
        document.querySelector('#price').value = JSON.stringify(prices);
      },
      publicPrice: function publicPrice(e) {
        var hash = e.currentTarget.parentElement.parentElement.dataset.hash;
        var prices = JSON.parse(document.querySelector('#price').value);
        prices.forEach(function (obj, i) {
          if (escape$1(obj.id + obj.title + obj.parent) == hash) {
            prices[i]["public"] = e.currentTarget.checked ? true : false;
          }
        });
        document.querySelector('#price').value = JSON.stringify(prices);
      },
      modalSuccessBtnFunc: null
    },
    getNextLabel: function getNextLabel(type) {
      var alphabet_lines = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
      var alphabet_angles = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ"];

      var _iterator8 = _createForOfIteratorHelper(document.querySelectorAll('.input-fields > div .field-label[data-type="polyline"]')),
          _step8;

      try {
        var _loop = function _loop() {
          var label = _step8.value;
          alphabet_lines = alphabet_lines.filter(function (el) {
            return el !== label.value;
          });
        };

        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      var _iterator9 = _createForOfIteratorHelper(document.querySelectorAll('.input-fields > div .field-label[data-type="arc"]')),
          _step9;

      try {
        var _loop2 = function _loop2() {
          var label = _step9.value;
          alphabet_angles = alphabet_angles.filter(function (el) {
            return el !== label.value;
          });
        };

        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          _loop2();
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      return type == "polyline" ? alphabet_lines : alphabet_angles;
    },
    structInputRow: function structInputRow(obj) {
      var alphabet = _this.getNextLabel(obj.type);

      var options = '';
      alphabet.forEach(function (el) {
        options += '<option value="' + el + '" ' + (obj.label == el ? 'selected' : '') + '>' + el + '</option>';
      });
      return "\n                <div id=\"field".concat(obj.id, "\" class=\"d-flex flex-row bd-highlight mb-0\" data-type=\"").concat(obj.type, "\" data-points=\"").concat(obj.points, "\" data-params=\"").concat(escape$1(JSON.stringify(obj.params ? obj.params : {})), "\">\n                    <div class=\"me-3\" >\n                        <select class=\"form-select form-select-sm field-label\" style=\"width:64px\" data-type=\"").concat(obj.type, "\" aria-label=\"Default select example\">\n                            ").concat(options, "\n                        </select>\n                        <p class=\"form-text\">").concat(__('label'), "</p>\n                    </div>\n                    <div class=\"me-3\" >\n                        <select class=\"form-select form-select-sm field-label-pos\" style=\"width:150px\" data-type=\"").concat(obj.type, "\" aria-label=\"Default select example\">\n                            <option value=\"botom_right\" ").concat(obj.label_pos == 'botom_right' || !obj.label_pos ? 'selected' : '', ">").concat(__html('Bottom right'), "</option>\n                            <option value=\"bottom_left\" ").concat(obj.label_pos == 'bottom_left' ? 'selected' : '', ">").concat(__html('Bottom left'), "</option>\n                            <option value=\"top_right\" ").concat(obj.label_pos == 'top_right' ? 'selected' : '', ">").concat(__html('Top right'), "</option>\n                            <option value=\"top_left\" ").concat(obj.label_pos == 'top_left' ? 'selected' : '', ">").concat(__html('Top left'), "</option>\n                            <option value=\"left\" ").concat(obj.label_pos == 'left' ? 'selected' : '', ">").concat(__html('Left'), "</option>\n                            <option value=\"right\" ").concat(obj.label_pos == 'right' ? 'selected' : '', ">").concat(__html('Right'), "</option>\n                        </select>\n                        <p class=\"form-text\">").concat(__('label position'), "</p>\n                    </div>\n                    <div class=\"me-3\">\n                        <input type=\"text\" class=\"form-control form-control-sm field-default\" placeholder=\"").concat(__('0'), "\" value=\"").concat(obj["default"], "\"></input>\n                        <p class=\"form-text\">").concat(__('default value'), "</p>\n                    </div>\n                    <div class=\"me-3\">\n                        <input type=\"text\" class=\"form-control form-control-sm field-min\" placeholder=\"").concat(__('0'), "\" value=\"").concat(obj.min, "\"></input>\n                        <p class=\"form-text\">").concat(__('min value'), "</p>\n                    </div>\n                    <div class=\"me-3\">\n                        <input type=\"text\" class=\"form-control form-control-sm field-max\" placeholder=\"").concat(__('1000'), "\" value=\"").concat(obj.max, "\"></input>\n                        <p class=\"form-text\">").concat(__('max value'), "</p>\n                    </div>\n                    <a href=\"javascript:void(0);\" onclick=\"javascript:;\">\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"#ff0079\" class=\"remove-input-field bi bi-x-circle mt-1\" data-id=\"").concat(obj.id, "\" viewBox=\"0 0 16 16\">\n                            <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                            <path d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"></path>\n                        </svg>\n                    </a>\n                </div>\n            ");
    },
    loadDrawing: function loadDrawing(product) {
      var d = document;
      var id = getProductId();
      var sid = spaceID();
      var t = '';

      for (var i = 0; i < 1; i++) {
        var img = 'https://account.kenzap.com/images/placeholder.jpg';
        t += "\n          <div class=\"p-img-cont sketch-cont float-start\" data-mode=\"preview\" style=\"max-width:100%;\">\n            <div data-index=\"sketch".concat(i, "\" class=\"pe-3\" style=\"position: relative;\">\n              <img class=\"p-img images-sketch").concat(i, "\" data-index=\"sketch").concat(i, "\" src=\"").concat(img, "\" style=\"max-width:500px;max-height:500px;\"/>\n              <svg id=\"svg\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 100%; height: 100%;display: block; position: absolute; top: 0; left: 0; z-index: -2;\">\n                \n              </svg>\n              <span class=\"remove po hd\" title=\"").concat(__('Remove'), "\">\xD7</span>\n              <div class=\"labels\">\n\n              </div>\n            </div>\n            <input type=\"file\" name=\"img[]\" data-type=\"search\" data-index=\"sketch").concat(i, "\" class=\"sketchfile aif-sketch").concat(i, " d-none\">\n          </div>");
      }

      d.querySelector(".drawing").innerHTML = t;
      onClick('.drawing img', _this.listeners.openImage);
      onClick('.drawing .remove', _this.listeners.removeImage);
      onChange('.drawing .sketchfile', _this.listeners.previewImage);
      onClick('[name="sketchmode"]', _this.listeners.sketchMode);
      onClick(".btn-view-variations", _this.listeners.viewVariations);
      d.querySelector("#svg").addEventListener('mousedown', function (e) {
        e.preventDefault();
        _this.state.sketch.mousedown = true;

        if (_this.state.sketch.mode == 'drawing' && _this.state.sketch.requestAngle) {
          _this.state.sketch.arc = new Arc({
            params: {
              x: e.offsetX,
              y: e.offsetY,
              radius: 25,
              startAngle: 60,
              endAngle: 170
            },
            mode: 'drawing'
          });
          _this.state.sketch.type = "arc";
          return;
        }

        if (_this.state.sketch.mode == 'drawing') {
          _this.state.sketch.polyline = new Polyline({
            points: [{
              x: e.offsetX,
              y: e.offsetY
            }],
            mode: 'drawing'
          });
          _this.state.sketch.type = "polyline";
        }

        if (_this.state.sketch.mode == 'editing' && _this.state.sketch.type == "polyline") {
          _this.state.sketch.polyline = new Polyline({
            points: [{
              x: e.offsetX,
              y: e.offsetY
            }],
            mode: 'editing',
            id: _this.state.sketch.last.id,
            rect: _this.state.sketch.rect
          });
          _this.state.sketch.type = "polyline";
        }

        if (_this.state.sketch.mode == 'editing' && _this.state.sketch.type == "arc") {
          _this.state.sketch.arc = new Arc({
            params: {
              x: e.offsetX,
              y: e.offsetY,
              radius: 25,
              startAngle: 60,
              endAngle: 170
            },
            mode: 'editing',
            id: _this.state.sketch.last.id,
            rect: _this.state.sketch.rect
          });
          _this.state.sketch.type = "arc";
        }
      });
      d.querySelector("#svg").addEventListener('mousemove', function (e) {
        e.preventDefault();
        if (_this.state.sketch.polyline && _this.state.sketch.mode == 'drawing' && _this.state.sketch.type == "polyline") _this.state.sketch.polyline.setCoords({
          points: [{
            x: e.offsetX,
            y: e.offsetY
          }],
          mode: 'drawing'
        });
        if (_this.state.sketch.polyline && _this.state.sketch.mode == 'editing' && _this.state.sketch.type == "polyline") _this.state.sketch.polyline.setCoords({
          points: [{
            x: e.offsetX,
            y: e.offsetY
          }],
          mode: 'editing'
        });

        if (_this.state.sketch.arc && _this.state.sketch.mode == 'editing' && _this.state.sketch.type == "arc") {
          _this.state.sketch.arc = new Arc({
            params: {
              x: e.offsetX,
              y: e.offsetY,
              radius: 25,
              startAngle: 60,
              endAngle: 170
            },
            mode: 'editing',
            id: _this.state.sketch.last.id,
            rect: _this.state.sketch.rect
          });
          _this.state.sketch.type = "arc";
        }
      });
      d.querySelector("#svg").addEventListener('mouseup', function (e) {
        e.preventDefault();
        _this.state.sketch.mousedown = false;

        if (_this.state.sketch.polyline && _this.state.sketch.mode == 'drawing') {
          _this.state.sketch.polyline.setEndCoords({
            points: [{
              x: e.offsetX,
              y: e.offsetY
            }],
            mode: 'drawing'
          });
        }

        if ((_this.state.sketch.polyline || _this.state.sketch.arc) && (_this.state.sketch.mode == 'drawing' || _this.state.sketch.mode == 'editing')) {
          _this.refreshFields();
        }

        _this.state.sketch.polyline = null;
        _this.state.sketch.arc = null;

        if (document.querySelector('#svg rect')) {
          var _iterator10 = _createForOfIteratorHelper(document.querySelectorAll('#svg rect')),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var el = _step10.value;

              el.onmouseover = function (e) {
                if (_this.state.sketch.mousedown) return;
                _this.state.sketch.rect = e.currentTarget.dataset.rect;
                _this.state.sketch.last.id = e.currentTarget.dataset.id.replace('start', '').replace('end', '');
                _this.state.sketch.type = e.currentTarget.dataset.type;
              };

              el.onmouseleave = function (e) {
                if (_this.state.sketch.mousedown) return;
                _this.state.sketch.rect = null;
              };
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
        }

        if (document.querySelector('#svg polyline')) {
          var _iterator11 = _createForOfIteratorHelper(document.querySelectorAll('#svg polyline')),
              _step11;

          try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
              var _el = _step11.value;

              _el.onmouseover = function (e) {
                if (_this.state.sketch.mousedown) return;
                _this.state.sketch.last.id = e.currentTarget.dataset.id;
              };
            }
          } catch (err) {
            _iterator11.e(err);
          } finally {
            _iterator11.f();
          }
        }

        if (document.querySelector('#svg path')) {
          var _iterator12 = _createForOfIteratorHelper(document.querySelectorAll('#svg path')),
              _step12;

          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              var _el2 = _step12.value;

              _el2.onmouseover = function (e) {
                if (_this.state.sketch.mousedown) return;
                _this.state.sketch.last.id = e.currentTarget.dataset.id;
              };
            }
          } catch (err) {
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }
        }
      });

      document.querySelector('#svg').onmouseover = function (e) {
        _this.state.sketch.hover = true;
      };

      document.querySelector('#svg').onmouseleave = function (e) {
        _this.state.sketch.hover = false;
      };

      var keypress = function keypress(e) {
        if (e.which == 65 && _this.state.sketch.mode == 'drawing') {
          _this.state.sketch.requestAngle = true;
          console.log('REQUESTING');
          setTimeout(function () {
            _this.state.sketch.requestAngle = false;
          }, 2000);
        }

        if ((e.which == 8 || e.which == 27) && _this.state.sketch.mode == 'drawing' && _this.state.sketch.polyline) {
          console.log('removing');
          document.querySelector('#svg g[data-id="' + _this.state.sketch.polyline.getID() + '"]').remove();
        }

        if (e.which != 8 || _this.state.sketch.mode != 'editing' || !_this.state.sketch.hover) return;
        if (document.querySelector('#svg g[data-id="' + _this.state.sketch.last.id + '"]')) document.querySelector('#svg g[data-id="' + _this.state.sketch.last.id + '"]').remove();
        if (document.querySelector('.input-fields #field' + _this.state.sketch.last.id)) document.querySelector('.input-fields #field' + _this.state.sketch.last.id).remove();
        if (document.querySelector('.svg-input[data-id="' + _this.state.sketch.last.id + '"]')) document.querySelector('.svg-input[data-id="' + _this.state.sketch.last.id + '"]').remove();
      };

      document.removeEventListener('keydown', keypress, true);
      document.addEventListener('keydown', keypress, true);

      for (var fi = 0; fi < 1; fi++) {
        var image_url = CDN + '/S' + sid + '/sketch-' + id + '-' + (parseInt(fi) + 1) + '-500x500.jpeg?' + product.updated;
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
        }, 300, image_url, ".images-sketch", fi);
      }
    },
    refreshFields: function refreshFields() {
      var htmlLabels = "";

      if (document.querySelector('#svg g')) {
        var _iterator13 = _createForOfIteratorHelper(document.querySelectorAll('#svg g')),
            _step13;

        try {
          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
            var el = _step13.value;
            var id = el.dataset.id,
                obj = {},
                x = void 0,
                y = void 0;
            var label = document.querySelector('#field' + id + ' .field-label') ? document.querySelector('#field' + id + ' .field-label').value : _this.getNextLabel(el.dataset.type)[0];

            switch (el.dataset.type) {
              case 'polyline':
                obj = {
                  id: id,
                  label: label,
                  "default": 0,
                  min: 0,
                  max: 0,
                  type: el.dataset.type,
                  params: {},
                  points: el.querySelector('polyline').getAttribute('points')
                };
                var points = obj.points.split(' ');
                x = (parseFloat(points[0]) + parseFloat(points[2])) / 2;
                y = (parseFloat(points[1]) + parseFloat(points[3])) / 2;
                htmlLabels += "\n                    <div class=\"svg-input m-2 lable-line\" style=\"left:".concat(x, "px;top:").concat(y, "px;\" data-id=\"").concat(obj.id, "\">\n                        <label for=\"input").concat(obj.label, "\">").concat(obj.label, "</label>\n                    </div>\n                    ");
                break;

              case 'arc':
                obj = {
                  id: id,
                  label: label,
                  "default": 0,
                  min: 0,
                  max: 0,
                  type: el.dataset.type,
                  params: JSON.parse(unescape(el.dataset.params)),
                  points: el.querySelector('path').getAttribute('d')
                };
                var newDeg = obj.params.startAngle + (obj.params.endAngle - obj.params.startAngle) / 2;
                x = obj.params.x + obj.params.radius / 2 + obj.params.radius * 2 * Math.cos(degToRad(newDeg)) + 5;
                y = obj.params.y + obj.params.radius / 2 + obj.params.radius * 2 * Math.sin(degToRad(newDeg)) - 5;
                htmlLabels += "\n                    <div class=\"svg-input m-2 lable-angle\" style=\"left:".concat(x, "px;top:").concat(y, "px;\" data-id=\"").concat(obj.id, "\">\n                        <label for=\"input").concat(obj.label, "\">").concat(obj.label, "\xB0</label>\n                    </div>\n                    ");
                break;
            }

            var html = _this.structInputRow(obj);

            if (!document.querySelector('#field' + id)) {
              document.querySelector('.input-fields').insertAdjacentHTML('beforeend', html);
            } else {
              document.querySelector('#field' + id).setAttribute('data-points', obj.points);
              document.querySelector('#field' + id).setAttribute('data-params', escape$1(JSON.stringify(obj.params)));
            }

            _this.listeners.inputFieldListeners();
          }
        } catch (err) {
          _iterator13.e(err);
        } finally {
          _iterator13.f();
        }
      }

      document.querySelector('.labels').innerHTML = htmlLabels;
      onChange('.field-label', _this.listeners.inputFieldChange);
    },
    structCoatingRow: function structCoatingRow(obj, i) {
      return "\n        <tr class=\"new-item-row ".concat(obj.parent ? "pr-parent" : "", "\" data-parent=\"").concat(obj.parent ? obj.parent : "", "\" data-title=\"").concat(obj.title, "\" data-hash=\"").concat(escape$1(obj.id + obj.title + obj.parent), "\">\n            <td style=\"max-width:25px;\">\n                <input class=\"form-check-input price-public\" type=\"checkbox\" value=\"\" data-i=\"").concat(i, "\" ").concat(obj["public"] ? 'checked' : "", " >\n            </td>\n            <td class=\"tp\">\n                <div class=\"me-1 me-sm-3 my-1 \">\n                    ").concat(obj.id, "\n                </div>\n            </td>\n            <td>\n                <div class=\"me-1 me-sm-3 my-1\">\n                    ").concat(obj.parent ? obj.parent : "", "\n                </div>\n            </td>\n            <td>\n                <div class=\"me-1 me-sm-3 my-1\">\n                    ").concat(obj.title, "\n                </div>\n            </td>\n            <td class=\"price\">\n                <div class=\"me-1 me-sm-3 my-1\" >\n                    <input type=\"text\" autocomplete=\"off\" class=\"form-control form-control-sm text-right price-price\" style=\"max-width:80px;\" data-i=\"").concat(i, "\" value=\"").concat(obj.price, "\">\n                    <span class=\"d-none\"> ").concat(priceFormat(_this, obj.price), " </span>\n                </div>\n            </td>\n            <td class=\"price\">\n                <div class=\"me-1 me-sm-3 my-1\">\n                    ").concat(obj.unit, "\n                </div>\n            </td>\n            <td class=\"align-middle text-center pt-2\"> \n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"#ff0079\" class=\"remove-price bi bi-x-circle po\" data-i=\"").concat(i, "\" viewBox=\"0 0 16 16\">\n                    <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                    <path d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"></path>\n                </svg>\n            </td>\n        </tr>");
    },
    uploadImages: function uploadImages() {
      if (document.querySelector(".imgupnote")) document.querySelector(".imgupnote").remove();
      var fi = 0;

      var _iterator14 = _createForOfIteratorHelper(document.querySelectorAll(".sketchfile")),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var fileEl = _step14.value;
          fi += 1;
          var id = getProductId();
          var sid = spaceID();
          var file = fileEl.files[0];
          if (typeof file === "undefined") continue;
          var fd = new FormData();
          var sizes = '1000|500x500|250x250|100x100';
          fd.append('id', id);
          fd.append('sid', sid);
          fd.append('pid', id);
          fd.append('key', 'image');
          fd.append('sizes', sizes);
          fd.append('file', file);
          fd.append('slug', 'sketch-' + id + '-' + fi);
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
              toast(__("Sketch updated"));
              hideLoader();
            }
          });
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      if (_this.state.ajaxQueue == 0) {
        toast(__("Product updated"));
        hideLoader();
      }
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
