
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
  const __init = (locale) => {

      if(typeof locale !== 'object' || locale === null) return;

      if(typeof window.i18n === 'undefined') window.i18n = {};

      if(typeof window.i18n.state === 'undefined') window.i18n.state = { locale: {} };
     
      window.i18n.state.locale = locale;
  };

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
   * Converts special characters `&`, `<`, `>`, `"`, `'` to HTML entities.
   * 
   * @param text {String}  text
   * @returns {String} - text
   */
  const attr = (text) => {

      text = String(text);

      if(text.length === 0){
  		return '';
  	}

      return text.replace(/[&<>'"]/g, tag => (
          {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              "'": '&apos;',
              '"': '&quot;'
          } [tag]));
  };

  /*
   * Converts special characters `&`, `<`, `>`, `"`, `'` to HTML entities and does translation
   * 
   * @param text {String}  text
   * @returns {String} - text
   */
  const __attr = (text, ...p) => {

      text = String(text);

      if(text.length === 0){
  		return '';
  	}

      let cb = (text) => {

          return text.replace(/[<>'"]/g, tag => (
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
   * @name spaceID
   * @description Gets current Kenzap Cloud space ID identifier from the URL.
   * 
   * @returns {string} id - Kenzap Cloud space ID.
   */
   const spaceID$1 = () => {
      
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
   const setCookie$1 = (name, value, days) => {

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
      let check = window.location.hostname + '/' + spaceID$1() + '/' + getCookie('locale');
      if(check != getCookie('check')){ version = 0; console.log('refresh'); }
      
      setCookie$1('check', check, 5);

      return version
  };

  /**
   * @name headers
   * @description Default headers object for all Kenzap Cloud fetch queries. 
   * @param {object} headers
   */
   ({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
      'Kenzap-Locale': getCookie('locale') ? getCookie('locale') : "en",
      'Kenzap-Header': checkHeader(),
      'Kenzap-Token': getCookie('kenzap_token'),
      'Kenzap-Sid': spaceID$1(),
  });

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
          params.append("sid", spaceID$1());
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

  var CDN = "https://cdn.kenzap.cloud/";
  var API_KEY = "Qz3fOs8Ghi7rpaW8BOlNgUyo7ANWYoKbRoUa8UkYd2I4FlAgUYFqzPM33IxqoFYa";
  var spaceID = function spaceID() {
    return "1002170";
  };
  var sortAlphaNum = function sortAlphaNum(a, b) {
    return a['title'].localeCompare(b['title'], 'en', {
      numeric: true
    });
  };
  var randomString = function randomString(length_) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

    if (typeof length_ !== "number") {
      length_ = Math.floor(Math.random() * chars.length_);
    }

    var str = '';

    for (var i = 0; i < length_; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }

    return str;
  };
  var mt = function mt(val) {
    return ("" + val).length < 2 ? "0" + val : val;
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
  var timeConverterAgo = function timeConverterAgo(__, now, time) {
    now = parseInt(now);
    time = parseInt(time);
    var past = now - time;
    if (past < 60) return __('moments ago');
    if (past < 3600) return __('%1$ minutes ago', parseInt(past / 60));
    if (past < 86400) return __('%1$ hours ago', parseInt(past / 60 / 60));
    var a = new Date(time * 1000);
    var months = [__('Jan'), __('Feb'), __('Mar'), __('Apr'), __('May'), __('Jun'), __('Jul'), __('Aug'), __('Sep'), __('Oct'), __('Nov'), __('Dec')];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    a.getHours();
    a.getMinutes();
    a.getSeconds();
    var time = date + ' ' + month + ' ' + year;
    return time;
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
  var lazyLoad = function lazyLoad() {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    if (document.querySelector("body").dataset.lazyLoading != '1') {
      document.querySelector("body").dataset.lazyLoading = '1';
      setTimeout(function () {
        lazyImages.forEach(function (lazyImage) {
          if (lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0 && getComputedStyle(lazyImage).display !== "none") {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");
            lazyImages = lazyImages.filter(function (image) {
              return image !== lazyImage;
            });
          }
        });
        document.querySelector("body").dataset.lazyLoading = '0';
      }, 0);
    }
  };
  var degToRad = function degToRad(deg) {
    return (deg - 90) * Math.PI / 180.0;
  };
  var setCookie = function setCookie(name, value, days) {
    var expires = "";

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = ";expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (escape$1(value) || "") + expires + ";path=/";
  };

  var HTMLContent = function HTMLContent() {
    return "\n        <div class=\"cat-controls\">\n            <div class=\"tags-holder\">\n                <div class=\"cata-sub-nav head\">\n                    <div class=\"arrow-holder-prev arrow-holder d-none\">\n                        <div class=\"nav-prev arrow\">\n                            <span>&lt;</span>\n                        </div>\n                    </div>\n                    <div class=\"slideset\">\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"".concat(__attr("Rainwater systems"), "\" class=\"cl\">").concat(__html("Rainwater systems"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Window sill"), "\" class=\" cl\">").concat(__html("Window sill"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Stovepipe cap"), "\" class=\" cl\">").concat(__html("Stovepipe cap"), "</a></div>\n                        <div class=\"slide d-none\"><a href=\"#\" data-cat=\"").concat(__attr("Sheet metal"), "\" class=\" cl\">").concat(__html("Sheet metal"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Roofing"), "\" class=\" cl\">").concat(__html("Roofing"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Flange"), "\" class=\" cl\">").concat(__html("Flange"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Eaves element"), "\" class=\" cl\">").concat(__html("Eaves element"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Parapet"), "\" class=\" cl\">").concat(__html("Parapet"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Rake edge"), "\" class=\" cl\">").concat(__html("Rake edge"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Ridge"), "\" class=\" cl\">").concat(__html("Ridge"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Roof hatch"), "\" class=\" cl\">").concat(__html("Roof hatch"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Snow barrier system"), "\" class=\" cl\">").concat(__html("Snow barrier system"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Ventilation"), "\" class=\" cl\">").concat(__html("Ventilation"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Roof valley"), "\" class=\" cl\">").concat(__html("Roof valley"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Drip edge"), "\" class=\" cl\">").concat(__html("Drip edge"), "</a></div>\n                        <div class=\"slide\"><a href=\"#\" data-cat=\"").concat(__attr("Other Designs"), "\" class=\" cl d-none\">").concat(__html("Other Designs"), "</a></div>\n                    </div>\n                    <div class=\"arrow-holder-next arrow-holder\" style=\"display: none;\">\n                        <div class=\"nav-next arrow\">\n                            <span>&gt;</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"d-flex flex-nowrap bd-highlight align-items-center\">\n            <input id=\"search\" autocomplete=\"off\" class=\"form-control my-3 border-0\" type=\"text\" placeholder=\"").concat(__attr("Search.."), "\" style=\"max-width:200px;\" aria-label=\"default input example\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"#212529\" class=\"clear-search bi bi-x-circle po text-start ms-3 d-none\" data-i=\"0\" viewBox=\"0 0 16 16\">\n            <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n            <path d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"></path>\n            </svg>\n        </div>\n\n        <h3 class=\"search-title mb-4 d-none\"></h3>\n\n        <div class=\"contain\"> \n            <div class=\"search-results row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 g-lg-3 d-none\">\n\n\n            </div>\n        </div>\n\n        <div class=\"accordion\" id=\"accordionPanelsStayOpenExample\">\n\n            <div class=\"accordion-item border-0\">\n            <h2 class=\"accordion-header\" id=\"acc-heading-2\">\n                <button class=\"accordion-button first collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#acc-2\" aria-expanded=\"false\" aria-controls=\"panelsStayOpen-collapseTwo\" data-cats=\"").concat(__attr("Stovepipe cap"), "|").concat(__attr("Drip edge"), "|").concat(__attr("Flange"), "|").concat(__attr("Rake edge"), "|").concat(__attr("Ridge"), "|").concat(__attr("Roof hatch"), "|").concat(__attr("Roofing panel"), "|").concat(__attr("Ventilation Element"), "|").concat(__attr("Snow Barrier System"), "\">\n                ").concat(__html('ROOFING ELEMENTS'), "\n                </button>\n            </h2>\n            <div id=\"acc-2\" class=\"accordion-collapse collapse\" aria-labelledby=\"acc-heading-2\">\n                <div class=\"accordion-body p-0 pt-4 bg-light row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 g-lg-3\" data-cats=\"Stovepipe cap|Drip edge|Flange|Rake edge|Ridge|Roof hatch|Roofing panel|Ventilation Element|Snow Barrier System\">\n\n\n                </div>\n            </div>\n            </div>\n\n            <div class=\"accordion-item border-0\">\n            <h2 class=\"accordion-header\" id=\"acc-heading-3\">\n                <button class=\"accordion-button  collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#acc-3\" aria-expanded=\"false\" aria-controls=\"panelsStayOpen-collapseThree\" data-cats=\"").concat(__attr("Window sill"), "|").concat(__attr("Metal cap"), "|").concat(__attr("Parapet"), "\">\n                ").concat(__html('FOR FACADES'), "\n                </button>\n            </h2>\n            <div id=\"acc-3\" class=\"accordion-collapse collapse\" aria-labelledby=\"acc-heading-3\">\n                <div class=\"accordion-body p-0 pt-4 bg-light row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 g-lg-3\" >\n\n                \n                </div>\n            </div>\n            </div>\n\n            <div class=\"accordion-item border-0\">\n            <h2 class=\"accordion-header\" id=\"acc-heading-4\">\n                <button class=\"accordion-button  collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#acc-4\" aria-expanded=\"false\" aria-controls=\"panelsStayOpen-collapseThree\" data-cats=\"").concat(__attr("Rainwater systems"), "\">\n                ").concat(__html('RAINWATER SYSTEMS'), "\n                </button>\n            </h2>\n            <div id=\"acc-4\" class=\"accordion-collapse collapse\" aria-labelledby=\"acc-headin4\">\n                <div class=\"accordion-body p-0 pt-4 bg-light row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 g-lg-3\" data-cats=\"Rainwater systems\">\n\n                \n                </div>\n            </div>\n            </div>\n\n            <div class=\"accordion-item border-0 d-none\">\n            <h2 class=\"accordion-header\" id=\"acc-heading-5\">\n                <button class=\"accordion-button  collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#acc-5\" aria-expanded=\"false\" aria-controls=\"panelsStayOpen-collapseThree\" data-cats=\"").concat(__attr("Sheet metal"), "\">\n                ").concat(__html('SHEET METAL'), "\n                </button>\n            </h2>\n            <div id=\"acc-5\" class=\"accordion-collapse collapse\" aria-labelledby=\"acc-heading-5\">\n                <div class=\"accordion-body p-0 pt-4 bg-light row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 g-lg-3\" data-cats=\"Sheet metal\">\n\n        \n                </div>\n            </div>\n            </div>\n\n            <div class=\"accordion-item border-0 d-none\">\n            <h2 class=\"accordion-header\" id=\"acc-heading-5\">\n                <button class=\"accordion-button collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#acc-5\" aria-expanded=\"false\" aria-controls=\"panelsStayOpen-collapseThree\">\n                ").concat(__html('INSTRUMENTS'), "\n                </button>\n            </h2>\n            <div id=\"acc-5\" class=\"accordion-collapse collapse\" aria-labelledby=\"acc-heading-5\">\n                <div class=\"accordion-body p-0 pt-4 bg-light\">\n                <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body p-0 pt-4 bg-light</code>, though the transition does limit overflow.\n                </div>\n            </div>\n            </div>\n        </div>\n    ");
  };

  function Util() {}

  Util.hasClass = function (el, className) {
    if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  };

  Util.addClass = function (el, className) {
    var classList = className.split(' ');
    if (el.classList) el.classList.add(classList[0]);else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
    if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
  };

  Util.removeClass = function (el, className) {
    var classList = className.split(' ');
    if (el.classList) el.classList.remove(classList[0]);else if (Util.hasClass(el, classList[0])) {
      var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
    if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
  };

  Util.toggleClass = function (el, className, bool) {
    if (bool) Util.addClass(el, className);else Util.removeClass(el, className);
  };

  Util.setAttributes = function (el, attrs) {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  };

  Util.getChildrenByClassName = function (el, className) {
    el.children;
        var childrenByClass = [];

    for (var i = 0; i < el.children.length; i++) {
      if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
    }

    return childrenByClass;
  };

  Util.setHeight = function (start, to, element, duration, cb) {
    var change = to - start,
        currentTime = null;

    var animateHeight = function animateHeight(timestamp) {
      if (!currentTime) currentTime = timestamp;
      var progress = timestamp - currentTime;
      var val = parseInt(progress / duration * change + start);
      element.setAttribute("style", "height:" + val + "px;");

      if (progress < duration) {
        window.requestAnimationFrame(animateHeight);
      } else {
        cb();
      }
    };

    element.setAttribute("style", "height:" + start + "px;");
    window.requestAnimationFrame(animateHeight);
  };

  Util.scrollTo = function (_final, duration, cb) {
    var start = window.scrollY || document.documentElement.scrollTop,
        currentTime = null;

    var animateScroll = function animateScroll(timestamp) {
      if (!currentTime) currentTime = timestamp;
      var progress = timestamp - currentTime;
      if (progress > duration) progress = duration;
      var val = Math.easeInOutQuad(progress, start, _final - start, duration);
      window.scrollTo(0, val);

      if (progress < duration) {
        window.requestAnimationFrame(animateScroll);
      } else {
        cb && cb();
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

  Util.moveFocus = function (element) {
    if (!element) element = document.getElementsByTagName("body")[0];
    element.focus();

    if (document.activeElement !== element) {
      element.setAttribute('tabindex', '-1');
      element.focus();
    }
  };

  Util.getIndexInArray = function (array, el) {
    return Array.prototype.indexOf.call(array, el);
  };

  Util.cssSupports = function (property, value) {
    if ('CSS' in window) {
      return CSS.supports(property, value);
    } else {
      var jsProperty = property.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
      return jsProperty in document.body.style;
    }
  };

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      if (!document.documentElement.contains(el)) return null;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);

      return null;
    };
  }

  if (typeof window.CustomEvent !== "function") {
    var CustomEvent = function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  var Cart = function () {
    function Cart(_this) {
      _classCallCheck(this, Cart);

      this._this = _this;
      var cartStatic = localStorage.getItem('sk-design-cart');
      if (!cartStatic) cartStatic = '{}';
      this.cart = JSON.parse(cartStatic);
      if (!this.cart) this.cart = {};
      if (!this.cart.items) this.cart.items = [];
      if (!this.cart.price) this.cart.price = {};
      if (!this.cart.idd) this.cart.idd = randomString(8) + Math.floor(Date.now());
      this.renderCartHTML();
      this.cart.html = document.getElementsByClassName('js-cd-cart');

      if (this.cart.html.length > 0) {
        this.cart.cartAddBtns = document.getElementsByClassName('js-cd-add-to-cart');
        this.cart.cartBody = this.cart.html[0].getElementsByClassName('cd-cart__body')[0], this.cart.cartList = this.cart.cartBody.getElementsByTagName('ul')[0], this.cart.cartListItems = this.cart.cartList.getElementsByClassName('cd-cart__product'), this.cart.cartTotal = this.cart.html[0].getElementsByClassName('cart-checkout')[0].getElementsByTagName('span')[0], this.cart.cartCount = this.cart.html[0].getElementsByClassName('cd-cart__count')[0], this.cart.cartCountItems = this.cart.cartCount.getElementsByTagName('li'), this.cart.cartUndo = this.cart.html[0].getElementsByClassName('cd-cart__undo')[0], this.cart.productId = 0, this.cart.cartTimeoutId = false, this.cart.animatingQuantity = false;
        this.initListeners();
      }

      this.refreshCartHTML();
      this.cartButtonVissible();
      this.saveCart();
    }

    _createClass(Cart, [{
      key: "initListeners",
      value: function initListeners() {
        var _this2 = this;

        var _this = this;

        for (var i = 0; i < this.cart.cartAddBtns.length; i++) {
          (function (i) {
            _this.cart.cartAddBtns[i].addEventListener('click', _this.addToCart);
          })(i);
        }

        this.cart.html[0].getElementsByClassName('cd-cart__trigger')[0].addEventListener('click', function (e) {
          e.preventDefault();

          _this.toggleCart();
        });
        onClick(".cart-checkout", function (e) {
          e.preventDefault();

          if (_this2.cart.price.total == 0) {
            alert(__html("Cart is empty"));
            return;
          }

          _this.toggleCart();

          var modal = document.querySelector(".modal-item");
          var modalCont = new bootstrap.Modal(modal);
          modalCont.show();
          document.querySelector(".modal-item .modal-title").innerHTML = __html("Checkout");
          document.querySelector(".modal .btn-primary").innerHTML = __html("Confirm checkout");
          document.querySelector(".modal .btn-primary").classList.add('btn-danger');
          document.querySelector(".modal .btn-primary").classList.remove('d-none');
          var time = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString();
          gtag('event', 'Product', {
            'event_category': 'pre_checkout',
            'page': 'feed',
            'source': 'cart',
            'time': time,
            'idd': localStorage.idd
          });
          var html = "\n            <div class=\"form-cont\">\n\n                <div class=\"btn-group mb-5\" role=\"group\" aria-label=\"Basic radio toggle button group\">\n                    <input type=\"radio\" class=\"btn-check\" name=\"entity-type\" id=\"btn-individual\" autocomplete=\"off\" >\n                    <label class=\"btn btn-outline-primary\" for=\"btn-individual\">".concat(__html("Individual"), "</label>\n                    <input type=\"radio\" class=\"btn-check\" name=\"entity-type\" id=\"btn-company\" autocomplete=\"off\" checked>\n                    <label class=\"btn btn-outline-primary\" for=\"btn-company\">").concat(__html("Company"), "</label>\n                </div>\n\n                <div class=\"form-checkout\">\n\n                    <div class=\"row\">\n                        <div class=\"col-lg-6 reg_num_cont\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                                <label class=\"col-sm-3 col-form-label\">").concat(__html("Reg. Nr."), "</label>\n                                <div class=\"col-sm-9\">\n                                    <input type=\"text\" class=\"form-control text reg_num\" placeholder=\"40008877333\" value=\"").concat(localStorage.getItem("checkout_reg_num") ? localStorage.getItem("checkout_reg_num") : "", "\">\n                                    <div class=\"invalid-feedback reg_num_notice\"></div>\n                                    <p class=\"form-text\">").concat(__html("Company registration number, without LV."), "</p>\n                                </div> \n                            </div>\n                        </div>\n\n                        <div class=\"col-lg-6 full_name_cont d-none\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                                <label class=\"col-sm-3 col-form-label\">").concat(__html("Full Name"), "</label>\n                                <div class=\"col-sm-9\">\n                                    <div class=\"row\">\n                                        <div class=\"col-sm-6\">\n                                            <input type=\"text\" class=\"form-control text f_name\" placeholder=\"Alex\" value=\"").concat(localStorage.getItem("checkout_f_name") ? localStorage.getItem("checkout_f_name") : "", "\">\n                                            <div class=\"invalid-feedback f_name_notice\"></div>\n                                            <p class=\"form-text\">").concat(__html("Your name"), "</p>\n                                        </div>\n                                        <div class=\"col-sm-6\">\n                                            <input type=\"text\" class=\"form-control text l_name\" placeholder=\"Zili\u0146\u0161\" value=\"").concat(localStorage.getItem("checkout_l_name") ? localStorage.getItem("checkout_l_name") : "", "\">\n                                            <div class=\"invalid-feedback l_name_notice\"></div>\n                                            <p class=\"form-text\">").concat(__html("Your surname"), "</p>\n                                        </div>\n                                    </div>\n                                </div> \n                            </div>\n                        </div>\n\n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                                <label class=\"col-sm-3 col-form-label\">").concat(__html("IBAN"), "</label>\n                                <div class=\"col-sm-9\">\n                                    <input type=\"text\" class=\"form-control iban\" placeholder=\"LV14HABA012345678910\" value=\"").concat(localStorage.getItem("checkout_iban") ? localStorage.getItem("checkout_iban") : "", "\">\n                                    <div class=\"invalid-feedback iban_notice\"></div>\n                                    <p class=\"form-text\">").concat(__html("Your bank account, ex.: LV14HABA012345678910"), "</p>\n                                </div> \n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class=\"row\">\n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                                <label class=\"col-sm-3 col-form-label\">").concat(__html("Email"), "</label>\n                                <div class=\"col-sm-9\">\n                                    <input type=\"email\" class=\"form-control email\" placeholder=\"email@example.com\" value=\"").concat(localStorage.getItem("checkout_email") ? localStorage.getItem("checkout_email") : "", "\">\n                                    <div class=\"invalid-feedback email_notice\"></div>\n                                    <p class=\"form-text\">").concat(__html("Your email address."), "</p>\n                                </div> \n                            </div>\n                        </div>\n            \n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                                <label class=\"col-sm-3 col-form-label\">").concat(__html("Phone"), "</label>\n                                <div class=\"col-sm-9\">\n                                    <input type=\"text\" class=\"form-control phone\" placeholder=\"+37126443313\" value=\"").concat(localStorage.getItem("checkout_phone") ? localStorage.getItem("checkout_phone") : "", "\">\n                                    <div class=\"invalid-feedback phone_notice\"></div>\n                                    <p class=\"form-text\">").concat(__html("Phone number."), "</p>\n                                </div> \n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class=\"row\">\n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                                <label class=\"col-sm-3 col-form-label\">").concat(__html("Notes"), "</label>\n                                <div class=\"col-sm-9\">\n                                    <textarea id=\"coupon_list\" class=\"form-control inp notes\" name=\"coupon_list\" rows=\"2\" data-type=\"text\" style=\"font-size:13px;font-family: monospace;\"></textarea>\n                                    <p class=\"form-text\">Notes to order.</p>\n                                </div> \n                            </div>\n                        </div>\n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                                <label class=\"col-sm-3 col-form-label\">").concat(__html("Pick up"), "</label>\n                                <div class=\"col-sm-9\">\n                                    <iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2174.979245108271!2d24.033549415978662!3d56.96628800521531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eec554018684c3%3A0x67f5c808aea5ea81!2sSk%C4%81rda%20Nams%2C%20SIA!5e0!3m2!1sen!2slv!4v1662126718651!5m2!1sen!2slv\" width=\"100%\" height=\"225\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>\n                                    <p class=\"form-text\">").concat(__html("Order available for self-pickup at Mellužu iela 13-6, LV-1067, Rīga. Delivery options are currently not provided."), "</p>\n                                </div> \n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"row mb-3\">\n                        <div class=\"col-lg-6\">\n                        \n                        </div>\n                        <div class=\"col-lg-6\">\n                            <h3 class=\"mb-3\">").concat(__html("Totals"), "</h3>\n                            <div class=\"form-group row mb-2 mt-1 total_cont\">\n                                <label class=\"col-7 col-form-label\">").concat(__html("Total"), "</label>\n                                <div class=\"col-5 col-form-label text-end\">\n                                    \n                                </div> \n                            </div>\n                            <div class=\"form-group row mb-2 mt-1 vat_cont d-none\">\n                                <label class=\"col-7 col-form-label\">").concat(__html("VAT 21%"), "</label>\n                                <div class=\"col-5 col-form-label text-end\">\n                                    \n                                </div> \n                            </div>\n                            <div class=\"form-group row mb-2 mt-1 vat_cont_0 d-none\">\n                                <label class=\"col-7 col-form-label\">").concat(__html("VAT (reverse payment of taxes article 143.4)"), "</label>\n                                <div class=\"col-5 col-form-label text-end\">\n                                    0.00 \u20AC\n                                </div> \n                                <div class=\"col-12 form-text\">").concat(__html('*A detailed breakdown is available in the final invoice.'), "</div>\n                            </div>\n                            <div class=\"form-group row mb-2 mt-1 d-none\">\n                                <label class=\"col-7 col-form-label\">").concat(__html("Discount 10%"), "</label>\n                                <div class=\"col-5 col-form-label text-end\">\n                                    5.00 \u20AC\n                                </div> \n                            </div>\n                            <hr>\n                            <div class=\"form-group row mb-2 mt-1 fw-bolder grand_total_cont\">\n                                <label class=\"col-7 col-form-label fs-5\">").concat(__html("Grand total"), "</label>\n                                <div class=\"col-5 col-form-label text-end fs-5\">\n                                    \n                                </div> \n                            </div>\n                        </div>                \n                    </div>\n\n                    <div class=\"row\">\n                        <div class=\"col-lg-6\">\n                        \n                        </div>\n                        <div class=\"col-lg-6\">\n                            <div class=\"form-group row mb-3 mt-1\">\n                   \n                                <div class=\"col-sm-12\">\n                                    <div class=\"form-check\">\n                                        <input id=\"terms\" class=\"form-check-input inp\" name=\"terms\" type=\"checkbox\" value=\"1\" data-type=\"checkbox\">\n                                        <label class=\"form-check-label\" for=\"terms\">\n                                        ").concat(__html("Terms of service"), "\n                                        </label>\n                                    </div>\n                                    <p class=\"form-text\">").concat(__html("I acknowledge that Skarda Nams SIA uses cookies in order to provide best user experience. You also agree to Skarda Nams SIA Terms of Service, Privacy Policy."), "</p>\n                                </div>\n                                \n                                <div class=\"col-sm-12\">\n                                    <div class=\"form-check\">\n                                        <input id=\"personal_data\" class=\"form-check-input inp\" name=\"personal_data\" type=\"checkbox\" value=\"1\" data-type=\"checkbox\">\n                                        <label class=\"form-check-label\" for=\"personal_data\">\n                                        ").concat(__html("Personal data processing"), "\n                                        </label>\n                                    </div>\n                                    <p class=\"form-text\">").concat(__html("I acknowledge that Skarda Nams SIA stores my personal data for order processing and accounting purposes. More information on https://www.skardanams.lv/privatuma-politika/."), "</p>\n                                </div> \n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class=\"row d-none\">\n                        <div class=\"col-lg-12\">\n\n                            <label class=\"col-sm-3 col-form-label\">").concat(__html("Notes"), "</label>\n                            <div class=\"col-sm-9 text-muted\">\n                                <input id=\"terms\" class=\"form-check-input inp terms\" name=\"terms\" type=\"checkbox\" value=\"1\" data-type=\"checkbox\">\n                                I acknowledge that Kenzap uses cookies in order to provide best user experience. You also agree to Kenzap Terms of Service, Privacy Policy.\n                            </div>\n                        </div>\n                    </div>\n \n                </div>\n\n            </div>");
          document.querySelector(".modal-body").innerHTML = html;
          if (window.location.hash != "#checkout") history.pushState({
            pageID: 'design'
          }, 'Design', window.location.pathname + window.location.search + "#checkout");
          setTimeout(function () {
            window.addEventListener("hashchange", function (e) {
              if (document.querySelector('body').classList.contains('modal-open')) {
                console.log("closing");
                e.preventDefault();
                if (modalCont) modalCont.hide();
                return false;
              }
            });
          }, 500);
          onClick("#btn-individual", function (e) {
            document.querySelector(".reg_num_cont").classList.add("d-none");
            document.querySelector(".full_name_cont").classList.remove("d-none");

            _this2.refreshCartCountAndTotals();
          });
          onClick("#btn-company", function (e) {
            document.querySelector(".reg_num_cont").classList.remove("d-none");
            document.querySelector(".full_name_cont").classList.add("d-none");

            _this2.refreshCartCountAndTotals();
          });
          onlyNumbers(".reg_num", [8]);

          _this2._this.listeners.modalSuccessBtnFunc = function (e) {
            e.preventDefault();
            var obj = {};
            var allow = true;
            modal.querySelector(".f_name").setCustomValidity("");
            modal.querySelector(".f_name_notice").innerHTML = "";
            modal.querySelector(".l_name").setCustomValidity("");
            modal.querySelector(".l_name_notice").innerHTML = "";
            modal.querySelector(".reg_num").setCustomValidity("");
            modal.querySelector(".reg_num_notice").innerHTML = "";
            modal.querySelector(".email").setCustomValidity("");
            modal.querySelector(".email_notice").innerHTML = "";
            modal.querySelector(".iban").setCustomValidity("");
            modal.querySelector(".iban_notice").innerHTML = "";
            modal.querySelector(".phone").setCustomValidity("");
            modal.querySelector(".phone_notice").innerHTML = "";
            modal.querySelector("#terms").setCustomValidity("");
            modal.querySelector("#personal_data").setCustomValidity("");

            if (modal.querySelector('#btn-individual').checked) {
              if (modal.querySelector('.f_name').value.length < 2) {
                allow = false;
                modal.querySelector(".f_name").setCustomValidity(__html("Name too short"));
              }

              modal.querySelector(".f_name").parentElement.classList.add('was-validated');

              if (modal.querySelector('.l_name').value.length < 2) {
                allow = false;
                modal.querySelector(".l_name").setCustomValidity(__html("Surname too short"));
              }

              modal.querySelector(".l_name").parentElement.classList.add('was-validated');
            } else {
              if (modal.querySelector('.reg_num').value.trim().length < 11) {
                allow = false;
                modal.querySelector(".reg_num").setCustomValidity("error");
                modal.querySelector(".reg_num_notice").innerHTML = __html("Registration number too short");
              }

              if (modal.querySelector('.reg_num').value.trim().length > 12) {
                allow = false;
                modal.querySelector(".reg_num").setCustomValidity("error");
                modal.querySelector(".reg_num_notice").innerHTML = __html("Registration number too long");
              }

              modal.querySelector(".reg_num").parentElement.classList.add('was-validated');
            }

            if (modal.querySelector(".email").value.trim().length < 4 || modal.querySelector(".email").value.trim().length > 50) {
              allow = false;
              modal.querySelector(".email").setCustomValidity("error");
              modal.querySelector(".email_notice").innerHTML = __html("Wrong email address format");
            }

            if (modal.querySelector(".iban").value.trim().length < 15 || modal.querySelector(".iban").value.trim().length > 33) {
              allow = false;
              modal.querySelector(".iban").setCustomValidity("error");
              modal.querySelector(".iban_notice").innerHTML = __html("Wrong IBAN format");
            }

            if (modal.querySelector(".phone").value.trim().length < 4) {
              allow = false;
              modal.querySelector(".phone").setCustomValidity("error");
              modal.querySelector(".phone_notice").innerHTML = __html("Wrong phone format");
            }

            modal.querySelector(".email").parentElement.classList.add('was-validated');
            modal.querySelector(".iban").parentElement.classList.add('was-validated');
            modal.querySelector(".phone").parentElement.classList.add('was-validated');

            if (!modal.querySelector("#terms").checked) {
              modal.querySelector("#terms").setCustomValidity("error");
              alert(__html('Please agree to Terms of service to continue'));
              return;
            }

            modal.querySelector("#terms").parentElement.classList.add('was-validated');

            if (!modal.querySelector("#personal_data").checked) {
              modal.querySelector("#personal_data").setCustomValidity("error");
              alert(__html('Please agree to Data processing to continue'));
              return;
            }

            modal.querySelector("#personal_data").parentElement.classList.add('was-validated');
            if (modal.querySelector(".btn-primary").dataset.loading === 'true') return;
            modal.querySelector(".btn-primary").dataset.loading = true;
            modal.querySelector(".btn-primary").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __html('Loading..');
            obj.id = 0;
            obj.idd = localStorage.idd;
            obj.sid = spaceID();
            obj.kid = 0;
            obj.status = "new";
            obj.price = _this2.cart.price;

            if (modal.querySelector('#btn-individual').checked) {
              obj.from = modal.querySelector('.f_name').value.trim() + " " + modal.querySelector('.l_name').value.trim();
              obj.name = obj.from;
              obj.fname = modal.querySelector('.f_name').value.trim();
              obj.lname = modal.querySelector('.l_name').value.trim();
              obj.entity = "individual";
              obj.price.tax_calc = true;
              obj.price.tax_percent = 21;
              obj.price.tax_total = _this2.cart.price.total * 0.21;
              obj.price.total = _this2.cart.price.total;
              obj.price.grand_total = _this2.cart.price.total + obj.price.tax_total;
            } else {
              obj.from = modal.querySelector('.reg_num').value.trim();
              obj.name = "";
              obj.fname = "";
              obj.lname = "";
              obj.entity = "company";
              obj.price.tax_calc = false;
              obj.price.tax_percent = 0;
              obj.price.tax_total = 0;
              obj.price.total = _this2.cart.price.total;
              obj.price.grand_total = _this2.cart.price.grand_total;
            }

            obj.email = modal.querySelector('.email').value.trim();
            obj.phone = modal.querySelector('.phone').value.trim();
            obj.notes = modal.querySelector('.notes').value;
            obj.iban = modal.querySelector('.iban').value.trim();
            obj.items = _this2.cart.items;
            obj.total_all = obj.price.grand_total;
            if (obj.notes != "sk test") obj.notify = {
              "admin": {
                "subject": __("📢 New order received"),
                "msg": __("Hey admin, <br><br>New order %1$https://skarda.design/?order={{order__id}}%2$#{{order_id}}%3$ received. Check your Ecommerce dashboard for more details.", "<a href='", "' >", "</a>")
              }
            };

            if (!allow) {
              modal.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
              alert(__html("Please make sure to enter all fields correctly"));
              modal.querySelector(".btn-primary").dataset.loading = false;
              modal.querySelector(".btn-primary").innerHTML = __html('Confirm checkout');
              return;
            }

            localStorage.setItem("checkout_email", modal.querySelector('.email').value);
            localStorage.setItem("checkout_phone", modal.querySelector('.phone').value);
            localStorage.setItem("checkout_iban", modal.querySelector('.iban').value);
            localStorage.setItem("checkout_f_name", modal.querySelector('.f_name').value);
            localStorage.setItem("checkout_l_name", modal.querySelector('.l_name').value);
            localStorage.setItem("checkout_reg_num", modal.querySelector('.reg_num').value);

            _this2.saveOrder(obj);
          };

          _this2.refreshCartCountAndTotals();
        });
        this.cart.html[0].addEventListener('change', function (e) {
          if (e.target.tagName.toLowerCase() == 'select') _this.quickUpdateCart();
        });
        this.cart.cartUndo.addEventListener('click', function (e) {
          if (e.target.tagName.toLowerCase() == 'a') {
            e.preventDefault();
            if (cartTimeoutId) clearInterval(cartTimeoutId);
            var deletedProduct = this.cart.cartList.getElementsByClassName('cd-cart__product--deleted')[0];
            Util.addClass(deletedProduct, 'cd-cart__product--undo');
            deletedProduct.addEventListener('animationend', function cb() {
              deletedProduct.removeEventListener('animationend', cb);
              Util.removeClass(deletedProduct, 'cd-cart__product--deleted cd-cart__product--undo');
              deletedProduct.removeAttribute('style');
              quickUpdateCart();
            });
            Util.removeClass(this.cart.cartUndo, 'cd-cart__undo--visible');
          }
        });
        return true;
      }
    }, {
      key: "saveOrder",
      value: function saveOrder(order) {
        var _this = this;

        var dateObj = new Date();
        order['created_ymd'] = dateObj.getUTCFullYear() + '' + mt(dateObj.getUTCMonth() + 1) + '' + mt(dateObj.getUTCDate());
        order['created_ym'] = dateObj.getUTCFullYear() + '' + mt(dateObj.getUTCMonth() + 1);
        order['created_y'] = dateObj.getUTCFullYear() + '';
        var time = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString();
        gtag('event', 'Product', {
          'event_category': 'checkout',
          'page': 'feed',
          'source': 'modal',
          'time': time,
          'idd': order.idd,
          'entity': order.entity,
          'total': order.total,
          'total_all': order.total_all
        });
        fetch('https://api-v1.kenzap.cloud/ecommerce/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + API_KEY,
            'Kenzap-Sid': spaceID()
          },
          body: JSON.stringify({
            query: {
              order: {
                type: 'create-order',
                key: 'ecommerce-order',
                sid: spaceID(),
                data: order
              }
            }
          })
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            var orders = localStorage.getItem('sk-design-orders');
            orders = orders ? JSON.parse(orders) : [];
            orders.push(response.order.id);
            localStorage.setItem('sk-design-orders', JSON.stringify(orders));

            _this.clearCart();

            var url = new URL(window.location.href);
            window.location.href = url.origin + url.pathname + "?order=" + response.order.id + "&recent=yes";
          } else {
            alert('Error: ' + JSON.stringify(response));
          }
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      }
    }, {
      key: "cartButtonVissible",
      value: function cartButtonVissible() {
        if (this.cart.items.length) {
          document.querySelector('.cd-cart').classList.remove('cd-cart--empty');
        } else {
          document.querySelector('.cd-cart').classList.add('cd-cart--empty');
        }
      }
    }, {
      key: "toggleCart",
      value: function toggleCart(bool) {
        var _this = this;

        var cartIsOpen = typeof bool === 'undefined' ? Util.hasClass(_this.cart.html[0], 'cart-open') : bool;

        if (cartIsOpen) {
          Util.removeClass(_this.cart.html[0], 'cart-open');
          if (_this.cart.cartTimeoutId) clearInterval(_this.cart.cartTimeoutId);
          Util.removeClass(_this.cart.cartUndo, 'cd-cart__undo--visible');
          setTimeout(function () {
            _this.cart.cartBody.scrollTop = 0;
            if (Number(_this.cart.cartCountItems[0].innerText) == 0) Util.addClass(_this.cart.html[0], 'cd-cart--empty');
          }, 500);
        } else {
          Util.addClass(_this.cart.html[0], 'cart-open');
        }

        return true;
      }
    }, {
      key: "getCart",
      value: function getCart() {
        return this.cart;
      }
    }, {
      key: "addToCart",
      value: function addToCart(obj) {
        var ii = -1;
        this.cart.items.forEach(function (item, i) {
          if (obj.cid == item.cid) ii = i;
        });

        if (!obj.variations) {
          obj.variations = [];
        }

        if (!obj.note) {
          obj.note = "";
        }

        console.log(obj);

        if (ii > -1) {
          this.cart.items[ii] = obj;
        } else {
          this.cart.items.push(obj);
        }

        this.cartButtonVissible();
        this.saveCart();
        this.refreshCartHTML();
        gtag('event', 'Product', {
          'event_category': 'add_to_cart',
          'page': 'feed',
          'source': 'modal',
          'event_label': obj._id,
          'title': obj.title,
          'coating': obj.coating,
          'color': obj.color,
          'qty': obj.qty,
          'input_fields': JSON.stringify(obj.input_fields_values, null, 2)
        });
        return true;
      }
    }, {
      key: "cartRowStruct",
      value: function cartRowStruct(obj, i) {
        var select_qty = "<input class=\"po form-control form-control-sm px-2\" disabled type=\"number\" value=\"".concat(obj.qty, "\" min=\"1\" max=\"1000\" title=\"").concat(__html("Rectify"), "\"></input>");
        var field_list = '<table class="form-text">';
        obj.input_fields.forEach(function (field, i) {
          field_list += "<tr><td><b>".concat(field.label, "</b>&nbsp;</td><td>").concat(obj.input_fields_values['input' + field.label] + (field.type == "polyline" ? "mm" : "°"), "</td></tr>");
        });
        field_list += "</table>";
        return "<li class=\"cd-cart__product\"><div class=\"cd-cart__image\"><a data-id=\"".concat(obj._id, "\" data-cid=\"").concat(obj.cid, "\" data-i=\"").concat(i, "\" data-preview=\"cart\" href=\"#\" title=\"").concat(__html("Rectify"), "\"><img src=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(obj._id, "-1-500x500.jpeg\" alt=\"placeholder\"></a></div><div class=\"cart-details\"><h3 class=\"truncate\" ><a data-id=\"").concat(obj._id, "\" data-cid=\"").concat(obj.cid, "\" data-i=\"").concat(i, "\" data-preview=\"cart\" href=\"#\" title=\"").concat(__html("Rectify"), "\">").concat(obj.title, " <span class=\"subtitle\">").concat(obj.coating, " ").concat(obj.color, "</span></a><div class=\"form-text\">").concat(field_list, "</div></h3><span class=\"cart-price\">").concat(priceFormat(this._this, obj.total), "</span><div class=\"cd-cart__actions\"><div class=\"cart-qty\"><span class=\"po cart-select pe-2\" data-id=\"").concat(obj._id, "\" data-cid=\"").concat(obj.cid, "\" data-i=\"").concat(i, "\" data-preview=\"cart\"> ").concat(select_qty, " <svg class=\"icon d-none\" viewBox=\"0 0 12 12\"><polyline fill=\"none\" stroke=\"currentColor\" points=\"2,4 6,8 10,4 \"/></svg></span> <a href=\"#0\" data-cid=\"").concat(obj.cid, "\" class=\"cart-delete-item mt-1\">").concat(__html('Delete'), "</a> </div></div></div></li>");
      }
    }, {
      key: "refreshCartCountAndTotals",
      value: function refreshCartCountAndTotals() {
        var _this3 = this;

        var actual = this.cart.items.length;
        var next = actual + 1;
        this.cart.cartCountItems[0].innerText = actual;
        this.cart.cartCountItems[1].innerText = next;
        this.cart.animatingQuantity = false;
        this.cart.price = {
          entity: 'company',
          grand_total: 0,
          total: 0,
          discount_percent: 0,
          discount_total: 0,
          fee_total: 0,
          tax_company_total: 0,
          tax_individual_total: 0,
          tax_total: 0,
          tax_percent: 0
        };
        if (document.querySelector('#btn-individual')) if (document.querySelector('#btn-individual').checked) {
          this.cart.price.entity = 'individual';
          this.cart.price.tax_percent = 21;
        }
        var reversed_tax = false;
        this.cart.items.forEach(function (obj) {
          var total = obj.price * obj.qty;
          _this3.cart.price.total += obj.price * obj.qty;
          if (obj.tax_id.length == 4) reversed_tax = true;
          _this3.cart.price.tax_company_total += obj.tax_id.length == 4 ? 0 : total * 0.21;
          _this3.cart.price.tax_individual_total += total * 0.21;
        });
        this.cart.price.tax_total = this.cart.price.total * (this.cart.price.tax_percent / 100);
        this.cart.price.grand_total = this.cart.price.total + this.cart.price.tax_total;
        if (document.querySelector('.total_cont')) document.querySelector('.total_cont div').innerHTML = priceFormat(this._this, this.cart.price.total);

        if (this.cart.price.entity == "company") {
          if (document.querySelector('.vat_cont')) document.querySelector('.vat_cont div').innerHTML = priceFormat(this._this, this.cart.price.tax_company_total);
          if (document.querySelector('.grand_total_cont')) document.querySelector('.grand_total_cont div').innerHTML = priceFormat(this._this, this.cart.price.total + this.cart.price.tax_company_total);
          if (document.querySelector('.vat_cont')) if (this.cart.price.tax_company_total > 0) document.querySelector('.vat_cont').classList.remove('d-none');
          if (document.querySelector('.vat_cont_0')) if (reversed_tax) document.querySelector('.vat_cont_0').classList.remove('d-none');
        } else {
          if (document.querySelector('.vat_cont')) document.querySelector('.vat_cont div').innerHTML = priceFormat(this._this, this.cart.price.tax_individual_total);
          if (document.querySelector('.grand_total_cont')) document.querySelector('.grand_total_cont div').innerHTML = priceFormat(this._this, this.cart.price.total + this.cart.price.tax_individual_total);
          if (document.querySelector('.vat_cont')) document.querySelector('.vat_cont').classList.remove('d-none');
          if (document.querySelector('.vat_cont_0')) document.querySelector('.vat_cont_0').classList.add('d-none');
        }

        document.querySelector('.cart-checkout em span').innerHTML = priceFormat(this._this, this.cart.price.grand_total);
      }
    }, {
      key: "refreshCartHTML",
      value: function refreshCartHTML() {
        var _this4 = this;

        var _this = this;

        this.cart.cartList.innerHTML = "";
        this.cart.items.forEach(function (obj, i) {
          _this4.cart.cartList.insertAdjacentHTML('beforeend', _this4.cartRowStruct(obj, i));
        });
        onClick(".cart-delete-item", function (e) {
          if (!confirm(__html('Remove from cart?'))) return;
          var cid = e.currentTarget.dataset.cid;
          _this.cart.items = _this.cart.items.filter(function (item) {
            return cid != item.cid;
          });

          _this.saveCart();

          _this.refreshCartHTML();
        });
        onClick('[data-preview="cart"]', function (e) {
          e.preventDefault();

          _this.toggleCart(true);

          _this._this.listeners.renderModal(e);
        });
        this.refreshCartCountAndTotals();
      }
    }, {
      key: "saveCart",
      value: function saveCart() {
        localStorage.setItem('sk-design-cart', JSON.stringify(this.cart));
      }
    }, {
      key: "renderCart",
      value: function renderCart() {
        localStorage.setItem('sk-design-cart', JSON.stringify(this.cart));
      }
    }, {
      key: "clearCart",
      value: function clearCart() {
        localStorage.removeItem('sk-design-cart');
      }
    }, {
      key: "renderCartHTML",
      value: function renderCartHTML() {
        if (!document.querySelector('.cd-cart')) {
          document.querySelector('#cart').innerHTML = "\n        \n        <div class=\"cd-cart cd-cart--empty js-cd-cart\">\n            <a href=\"#0\" class=\"cd-cart__trigger\">\n                <ul class=\"cd-cart__count\">\n                    <li>0</li>\n                    <li>0</li>\n                </ul>\n            </a>\n        \n            <div class=\"cd-cart__content\">\n                <div class=\"cd-cart__layout\">\n                    <header class=\"cd-cart__header\">\n                    <h4 class=\"mt-3\">".concat(__html("Cart"), "</h4>\n                    <span class=\"cd-cart__undo\">Item removed. <a href=\"#0\">Undo</a></span>\n                    </header>\n                    \n                    <div class=\"cd-cart__body pe-3\">\n                        <ul>\n                            \n                        </ul>\n                    </div>\n            \n                    <footer class=\"cd-cart__footer\">\n                    <a href=\"#0\" class=\"cart-checkout\">\n                        <em>").concat(__html("Checkout"), " - <span></span>\n                        <svg class=\"icon icon--sm d-none\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\"><line stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"/><polyline stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" points=\"15,6 21,12 15,18 \"/></g>\n                        </svg>\n                        </em>\n                    </a>\n                    </footer>\n                </div>\n            </div>\n        </div>\n        ");
        }
      }
    }]);

    return Cart;
  }();

  var productModal = {
    _this: null,
    render: function render(_this) {
      productModal._this = _this;
      var urlParams = new URLSearchParams(window.location.search);
      document.querySelector(".modal-item .modal-title").innerHTML = (_this.state.item.N ? _this.state.item.N + ". " : "") + _this.state.item.title;
      var parts = [],
          parts_options = '',
          coating_options = '',
          parent_list = [];
      var ic = localStorage.getItem('input-coating') ? localStorage.getItem('input-coating') : parent_list[0];

      if (_this.state.item_preview == "cart") {
        _this.state.item.input_fields.forEach(function (field, i) {
          field["default"] = _this.state.item.input_fields_values['input' + field.label];
        });

        ic = _this.state.item.coating;
      }

      if (_this.state.item_preview == "order") {
        ic = _this.state.item.coating;
      }

      if (urlParams.get('iframe')) {
        var input_fields_values;
        if (urlParams.get('coating')) ic = urlParams.get('coating');
        if (ic == "MattPE") ic = "Matt Polyester";
        if (ic == "Pural Matt") ic = "Matt Pural";
        if (ic == "ZN") ic = "Zinc";
        if (ic == "-") ic = "Painted";
        if (urlParams.get('input_fields_values')) input_fields_values = JSON.parse(unescape(urlParams.get('input_fields_values')));
        if (input_fields_values) _this.state.item.input_fields.forEach(function (field, i) {
          field["default"] = input_fields_values['input' + field.label] ? input_fields_values['input' + field.label] : field["default"];
        });
        if (urlParams.get('qty')) _this.state.item.qty = urlParams.get('qty');
        if (urlParams.get('note')) _this.state.item.note = urlParams.get('note');
      }

      if (!ic) ic = "Polyester";

      switch (_this.state.item.calc_price) {
        case 'variable':
          _this.state.item.var_price.forEach(function (price, i) {
            if (!parent_list.includes(price.parent)) parent_list.push(price.parent);
          });

          parent_list.forEach(function (parent, i) {
            coating_options += "<option ".concat(ic == parent ? "selected" : "", " value=\"").concat(parent, "\">").concat(__html(parent), "</option>");
          });
          break;

        case 'formula':
        default:
          var _iterator = _createForOfIteratorHelper(_this.state.sk_settings.price),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var price = _step.value;

              if (price["public"]) {
                if (!parent_list.includes(price.parent)) parent_list.push(price.parent);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          parent_list.forEach(function (parent, i) {
            coating_options += "<option ".concat(ic == parent ? "selected" : "", " value=\"").concat(parent, "\">").concat(__html(parent), "</option>");
          });
          break;
      }

      if (_this.state.item.parts) {
        parts = _this.state.item.parts;
      }

      if (_this.state.item_parent) if (_this.state.item_parent.parts) {
        parts = _this.state.item_parent.parts;
      }

      if (!_this.state.item.calc_price) {
        _this.state.item.calc_price = 'default';
      }

      parts.forEach(function (part) {
        var item_part = _this.state.items.filter(function (item) {
          return part.id == item._id;
        });

        if (item_part[0]) parts_options += "<option ".concat(_this.state.item._id == part.id ? "selected" : "", " data-parent=\"").concat(_this.state.item_parent ? _this.state.item_parent._id : _this.state.item._id, "\" value=\"").concat(part.id, "\">").concat(item_part[0].title, "</option>");
      });

      if (_this.state.bc[1]) {
        _this.state.bc[1] = {
          id: _this.state.item._id,
          title: _this.state.item.title
        };
      } else {
        _this.state.bc.push({
          id: _this.state.item._id,
          title: _this.state.item.title
        });
      }

      var html = "\n        <div class=\"form-cont\">\n            <nav style=\"--bs-breadcrumb-divider: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&quot;);\" aria-label=\"breadcrumb\">\n                <ol class=\"breadcrumb\"></ol>\n            </nav>\n            <div class=\"form-group mt-3\">\n                <div class=\"alert alert-warning alert-dismissible ".concat(getCookie('size-warning') != '1' && _this.state.item.calc_price == 'formula' ? '' : 'd-none', "\" role=\"alert\">").concat(__html('Enter product sizes in millimeters'), "<button type=\"button\" class=\"btn-close size-warning\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button></div>\n                <label for=\"mprice\" class=\"form-label d-none\">").concat(__html('Price'), "</label>\n                <div class=\"input-group mb-3\">\n        \n                    <div class=\"sketch-3d-controls d-flex\">\n\n                        <div class=\"form-check form-switch sketch-3d-switch color-danger d-none\">\n                            <input class=\"form-check-input\" type=\"checkbox\" id=\"sketch3d\" >\n                            <label class=\"form-check-label text-muted\" for=\"sketch3d\">3D</label>\n                        </div>\n\n                        <div class=\"").concat(_this.state.item.modelling == "1" ? "" : "d-none", "\" style=\"z-index:10; position:absolute;\">\n                            <button class=\"btn btn-sm btn-outline-secondary mb-1 text-muted set-sketch-view\" data-type=\"sketch\" >\n                            ").concat(__html('Sketch'), "\n                            </button>\n\n                            <button class=\"btn btn-sm btn-light mb-1 text-muted set-sketch-view\" data-type=\"Iso\" >\n                            ").concat(__html('3D'), "\n                            </button>\n\n                            <button class=\"btn btn-sm btn-light mb-1 text-muted set-sketch-view\" data-type=\"Top\" >\n                            ").concat(__html('Top'), "        \n                            </button>\n\n                            <button class=\"btn btn-sm btn-light mb-1 text-muted set-sketch-view\" data-type=\"Bottom\" >\n                            ").concat(__html('Bottom'), "        \n                            </button>\n\n                            <button class=\"btn btn-sm btn-light mb-1 text-muted set-sketch-view\" data-type=\"Left\" >\n                            ").concat(__html('Left'), "        \n                            </button>\n\n                            <button class=\"btn btn-sm btn-light mb-1 text-muted set-sketch-view\" data-type=\"Right\" >\n                            ").concat(__html('Right'), "        \n                            </button>\n                        </div>\n                    </div>\n                    <div class=\"sketch-3d d-none\">\n                        <div data-index=\"sketch0\" style=\"position: relative;\"></div>\n                    </div>\n                    <div class=\"sketch float-start\" data-mode=\"editing\" style=\"max-width:100%;\">\n                        <div data-index=\"sketch0\" style=\"position: relative;overflow:scroll;\">\n \n                            <img class=\"images-sketch0 lazys\" width=\"550\" height=\"550\" data-index=\"sketch0\" src=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(_this.state.item._id, "-1-500x500.jpeg?").concat(_this.state.item.updated, "\" data-srcset=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(_this.state.item._id, "-1-500x500.jpeg?").concat(_this.state.item.updated, "\">\n                            <svg id=\"svg\" xmlns=\"http://www.w3.org/2000/svg\">\n                                ");
      var htmlLabels = '',
          htmlLines = '';

      _this.state.item.input_fields.forEach(function (field, i) {
        var points = field.points.split(' '),
            x,
            y;
        var scale = 1.1;
        var pointsScaled = "";
        points.forEach(function (p) {
          pointsScaled += isNaN(p) ? p : p * scale + " ";
        });

        switch (field.type) {
          case 'polyline':
            field.ext = "";
            x = (parseFloat(points[0]) + parseFloat(points[2])) / 2;
            y = (parseFloat(points[1]) + parseFloat(points[3])) / 2;
            htmlLines += "\n                                        <g data-id=\"".concat(field.id, "\">\n                                            <polyline data-id=\"").concat(field.id, "\" points=\"").concat(pointsScaled, "\" style=\"\"></polyline>\n                                            <rect data-id=\"start").concat(field.id, "\" x=\"").concat(parseFloat(points[0]) * scale - 4, "\" y=\"").concat(parseFloat(points[1]) * scale - 4, "\" width=\"8\" height=\"8\" rx=\"8\" \"></rect>\n                                            <rect data-id=\"end").concat(field.id, "\" x=\"").concat(parseFloat(points[2]) * scale - 4, "\" y=\"").concat(parseFloat(points[3]) * scale - 4, "\" width=\"8\" height=\"8\" rx=\"8\" ></rect>\n                                        </g>\n                                        ");
            break;

          case 'arc':
            x = field.params.x;
            y = field.params.y;
            field.ext = '°';
            var deg = field.params.startAngle + (field.params.endAngle - field.params.startAngle) / 2;
            x = field.params.x + field.params.radius / 2 + field.params.radius * 2 * Math.cos(degToRad(deg)) + 5;
            y = field.params.y + field.params.radius / 2 + field.params.radius * 2 * Math.sin(degToRad(deg)) - 5;
            htmlLines += "\n                                        <g data-id=\"".concat(field.id, "\">\n                                            <path data-id=\"").concat(field.id, "\" d=\"").concat(pointsScaled, "\" stroke-linecap=\"round\" style=\"\"></path>\n                                        </g>\n                                        ");
            break;
        }

        htmlLabels += "\n                                <div class=\"svg-input m-2 ".concat(field.type, "\" style=\"left:").concat(x * scale, "px;top:").concat(y * scale, "px;\" data-id=\"").concat(field.id, "\" >\n                                    <label for=\"input").concat(field.label, "\">").concat(field.label + field.ext, "</label>\n                                    <input type=\"text\" data-bs-toggle=\"tooltip\" data-bs-placement=\"bottom\" data-bs-container=\"body\" ").concat(i == 0 && getCookie("first-time") != "1" ? 'data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="bottom" data-bs-content="' + __attr("Hit enter to continue") + '"' : '', " class=\"form-control input-label form-control-sm ").concat(field.label_pos ? field.label_pos : "", "\" autocomplete=\"off\" data-lable=").concat(field.label, " id=\"input").concat(field.label, "\" placeholder=\"").concat(field["default"], "\" value=\"").concat(field["default"], "\" data-valuemin=\"").concat(field.min, "\" data-valuemax=\"").concat(field.max, "\" maxlength=\"5\" tabindex=\"").concat(i + 1, "\" >\n                                </div>\n                                ");
      });

      html += htmlLines;
      html += '</svg>';
      html += htmlLabels;
      html += "\n                        </div>\n                    </div>\n                    <div class=\"ps-lg-4 ps-0\">\n                        \n                        <div>\n                            <div class=\"form-group mt-1\">\n                                <div class=\"input-parts-cnt d-none\">\n                                    <h4>".concat(__html('Part'), "</h4>\n                                    <div class=\"input-group\">\n                                        <select class=\"form-select input-parts form-select-lg mb-3\">\n                                            <option value=\"").concat(_this.state.item_parent ? _this.state.item_parent._id : _this.state.item._id, "\" data-back=\"true\" >").concat(__html('Choose part'), "</option>\n                                            ").concat(parts_options, "\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class=\"input-coating-cnt\">\n                                    <h4>").concat(__html('Coating'), "</h4>\n                                    <div class=\"input-group\">\n                                        <select class=\"form-select input-coating form-select-lg mb-3\">\n                                            ").concat(coating_options, "\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class=\"input-color-cnt\">\n                                    <h4 class=\"input-group\">").concat(__html('Color'), "</h4>\n                                    <div class=\"input-group\">\n                                        <select class=\"form-select input-color form-select-lg mb-3\" >\n\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class=\"input-quantity-cnt\">\n                                    <h4>").concat(__html('Quantity'), "</h4>\n                                    <div class=\"input-group\">\n                                        <input type=\"text\" class=\"qty form-control input-qty form-select-lg mb-3\" value=\"").concat(_this.state.item.qty, "\" >\n                                    </div>\n                                </div>\n                                <div class=\"input-notes\">\n                                    <h4>").concat(__html('Notes'), "</h4>\n                                    <div class=\"input-group\">\n                                        <textarea type=\"text\" class=\"notes form-control input-note form-select-lg mb-3\" rows=\"1\" >").concat(_this.state.item.note ? _this.state.item.note : "", "</textarea>\n                                    </div>\n                                </div>\n                                <div class=\"input-price-cnt\">\n                                    <h4>").concat(__html('Price'), "</h4>\n                                    <div> \n                                        <input type=\"text\" class=\"price form-control input-price form-select-lg mb-3\" value=\"1\" data-total=\"0\" data-price=\"0\" disabled>\n                                        <p class=\"form-text\">").concat(__html('* VAT is not included in the price above.'), "</p>\n                                        <p class=\"form-text price-desc ").concat(getCookie("admin") ? "" : "d-none", "\"> </p\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    \n                    </div>\n                </div>\n            </div>\n        </div>");
      document.querySelector(".modal-body").innerHTML = html;

      if (screen.width > 700) {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
          return new bootstrap.Popover(popoverTriggerEl);
        });

        if (document.querySelector(".svg-input [tabindex='1']")) {
          document.querySelector(".svg-input [tabindex='1']").focus();
          document.querySelector(".svg-input [tabindex='1']").select();
        }
      }

      onClick('.set-sketch-view', function (e) {
        var type = e.currentTarget.dataset.type;

        var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll(".set-sketch-view")),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var btn = _step2.value;
            btn.classList.remove("btn-outline-secondary");
            btn.classList.add("btn-light");
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        e.currentTarget.classList.remove("btn-light");
        e.currentTarget.classList.add("btn-outline-secondary");

        if (type == "sketch") {
          document.querySelector(".sketch").classList.remove("d-none");
          document.querySelector(".sketch-3d").classList.add("d-none");
          return;
        }

        document.querySelector(".sketch").classList.add("d-none");
        document.querySelector(".sketch-3d").classList.remove("d-none");

        if (document.querySelector(".sketch-3d > div").innerHTML.length > 10) {
          document.getElementById(type).setAttribute('set_bind', 'true');
          return;
        }

        fetch('/assets/x3d/' + _this.state.item._id + '.xhtml', {
          method: 'get',
          headers: {}
        }).then(function (response) {
          return response.text();
        }).then(function (response) {
          _this.state.x3d_response = response;
          productModal.render3dSketch(_this);
          document.getElementById(type).setAttribute('set_bind', 'true');
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      });
      onClick('.sketch-3d-switch > input', function (e) {
        if (!e.currentTarget.checked) {
          document.querySelector(".sketch").classList.remove("d-none");
          document.querySelector(".sketch-3d").classList.add("d-none");
          return;
        } else {
          document.querySelector(".sketch").classList.add("d-none");
          document.querySelector(".sketch-3d").classList.remove("d-none");
        }

        if (document.querySelector(".sketch-3d > div").innerHTML.length > 10) {
          return;
        }

        fetch('/assets/x3d/' + _this.state.item._id + '.xhtml', {
          method: 'get',
          headers: {}
        }).then(function (response) {
          return response.text();
        }).then(function (response) {
          _this.state.x3d_response = response;
          productModal.render3dSketch(_this);
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      });
      onClick('.size-warning', function (e) {
        setCookie("size-warning", "1");
      });
      onChange('.input-coating', function (e) {
        localStorage.setItem('input-coating', e.currentTarget.value);

        _this.loadColors(e.currentTarget.value);
      });
      onChange('.input-color', function (e) {
        localStorage.setItem('input-color', e.currentTarget.value);
      });
      onKeyUp('.input-label', function (e) {
        if (!productModal._this.tooltips) productModal._this.tooltips = [];

        productModal._this.tooltips.forEach(function (tooltip, i) {
          tooltip.dispose();

          productModal._this.tooltips.splice(i, 1);
        });

        setTimeout(function (el) {
          if (!document.querySelector('body').classList.contains('modal-open')) {
            return;
          }

          var tooltip = null,
              value = el.value;
          if (value == "") value = 0;

          if (parseFloat(value) < parseFloat(el.dataset.valuemin)) {
            tooltip = new bootstrap.Tooltip(el, {
              title: __html("Value should be greater than %1$", el.dataset.valuemin),
              offset: [0, 8]
            });
            tooltip.show();

            productModal._this.tooltips.push(tooltip);
          }

          if (parseFloat(value) > parseFloat(el.dataset.valuemax)) {
            tooltip = new bootstrap.Tooltip(el, {
              title: __html("Value should be smaller than %1$", el.dataset.valuemax),
              offset: [0, 8]
            });
            tooltip.show();

            productModal._this.tooltips.push(tooltip);
          }
        }, 1500, e.currentTarget);

        if (e.which == 13) {
          var tabindex = parseInt(e.currentTarget.getAttribute("tabindex"));
          tabindex += 1;

          if (document.querySelector(".input-label[tabindex='" + tabindex + "']")) {
            document.querySelector(".input-label[tabindex='" + tabindex + "']").focus();
            document.querySelector(".input-label[tabindex='" + tabindex + "']").select();
          } else {
            if (!e.currentTarget.classList.contains("qty")) {
              document.querySelector(".qty").focus();
              document.querySelector(".qty").select();
            }
          }
        }
      });
      onChange('.input-parts', function (e) {
        var el = document.querySelector(".input-parts");

        if (el.options[el.selectedIndex].dataset.back) {
          productModal._this.state.bc = [];
        }

        var item = productModal._this.state.items.filter(function (item) {
          return item._id == el.options[el.selectedIndex].value;
        });

        var item_parent = productModal._this.state.items.filter(function (item) {
          return item._id == el.options[el.selectedIndex].dataset.parent;
        });

        productModal._this.state.item = item[0];
        productModal._this.state.item_parent = item_parent[0];
        productModal._this.state.item.qty = 1;
        productModal.render(productModal._this);
      });

      if (parts_options) {
        document.querySelector(".input-parts-cnt").classList.remove('d-none');
      }

      switch (_this.state.item.calc_price) {
        case 'complex':
          document.querySelector(".input-coating-cnt").classList.add("d-none");
          document.querySelector(".input-color-cnt").classList.add("d-none");
          document.querySelector(".input-quantity-cnt").classList.add("d-none");
          document.querySelector(".input-price-cnt").classList.add("d-none");
          document.querySelector(".input-notes").classList.add("d-none");
          document.querySelector(".modal .btn-primary").classList.add("d-none");
          break;

        default:
          document.querySelector(".modal .btn-primary").classList.remove("d-none");
          break;
      }

      _this.listeners.modalSuccessBtnFunc = function (e) {
        e.preventDefault();
        var obj = {};
        obj['_id'] = _this.state.item._id;
        obj['title'] = _this.state.item.title;
        obj['coating'] = _this.state.modal.querySelector(".input-coating").value;
        obj['color'] = _this.state.modal.querySelector(".input-color").value;
        obj['qty'] = _this.state.modal.querySelector(".input-qty").value;
        obj['price'] = _this.state.modal.querySelector(".input-price").dataset.price;
        obj['total'] = _this.state.modal.querySelector(".input-price").dataset.total;
        obj['area'] = _this.state.modal.querySelector(".input-price").dataset.area;
        obj['note'] = _this.state.modal.querySelector(".input-note").value;
        obj['tax_id'] = _this.state.item.tax_id;
        obj['calc_price'] = _this.state.item.calc_price;
        obj['var_price'] = _this.state.item.var_price ? _this.state.item.var_price : [];
        obj['formula'] = _this.state.item.formula;
        obj['formula_price'] = _this.state.item.formula_price;
        obj['formula_width'] = _this.state.modal.querySelector(".input-price").dataset.width;
        obj['formula_length'] = _this.state.modal.querySelector(".input-price").dataset.length;
        obj['input_fields'] = _this.state.item.input_fields;
        obj['input_fields_values'] = {};

        if (obj['qty'] == "") {
          alert(__("Please enter quantity"));
          return;
        }

        var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll(".input-label")),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var lable = _step3.value;

            if (lable.value == "") {
              alert(__("Please enter %1$ field", lable.dataset.lable));
              return;
            }

            obj['input_fields_values'][lable.id] = lable.value;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        if (isNaN(obj['total']) || obj['total'] == 0) {
          alert(__("Make sure all fields are entered properly"));
          return;
        }

        if (_this.state.item_preview == "cart") {
          obj['cid'] = _this.state.item_cid;
        }

        if (_this.state.item_preview == "feed") {
          obj['cid'] = randomString(12);
        }

        var urlParams = new URLSearchParams(window.location.search);
        var iframe = urlParams.get('iframe') ? urlParams.get('iframe') : "";

        if (iframe) {
          var msg = {
            cmd: 'confirm',
            inputs: {},
            note: obj['note'],
            inputs_label: {},
            input_fields: obj['input_fields'],
            input_fields_values: obj['input_fields_values'],
            formula_width: obj['formula_width'],
            formula_length: obj['formula_length'],
            viewpoint: null,
            id: urlParams.get('id'),
            _id: obj['_id'],
            qty: obj['qty'],
            price: obj['price'],
            total: obj['total'],
            color: obj['color'],
            coating: obj['coating']
          };
          parent.postMessage(JSON.stringify(msg), "*");

          _this.state.modal.cont.hide();
        } else {
          _this.state.cart.addToCart(obj);
        }

        _this.state.modal.cont.hide();

        toast(__('Added to cart'));
      };

      onKeyUp(".modal-item .svg-input input", _this.listeners.refreshSketchPrice);
      onKeyUp(".modal-item .qty", _this.listeners.refreshSketchPrice);
      onlyNumbers(".modal-item .svg-input input", [8]);
      onlyNumbers(".modal-item .qty", [8]);

      _this.listeners.refreshSketchPrice();

      _this.listeners.focusListener();

      _this.loadColors(ic);

      productModal.bc();
      lazyLoad();
      setCookie("first-time", "1");
      if (window.location.hash != "#editing") history.pushState({
        pageID: 'design'
      }, 'Design', window.location.pathname + window.location.search + "#editing");
      setTimeout(function () {
        window.addEventListener("hashchange", function (e) {
          if (document.querySelector('body').classList.contains('modal-open')) {
            e.preventDefault();
            productModal.closeModal();
            return false;
          }
        });
      }, 500);
    },
    closeModal: function closeModal() {
      productModal._this.state.modal.cont.hide();
    },
    render3dSketch: function render3dSketch(_this) {
      var parser = new DOMParser();
      var x3d = parser.parseFromString(_this.state.x3d_response, "text/xml");
      var x3dRoot = x3d.getRootNode();
      var material = document.createElement("Material");
      material.setAttribute('shininess', '0.9');
      material.setAttribute('specularColor', '1 1 1');
      x3dRoot.querySelector("Appearance").appendChild(material);
      x3dRoot.querySelector("X3D").style.width = (screen.width < 581 ? screen.width - 32 : 550) + 'px';
      x3dRoot.querySelector("X3D").style.height = '550px';
      x3dRoot.querySelector("X3D").setAttribute('width', (screen.width < 581 ? screen.width - 32 : 550) + 'px');
      x3dRoot.querySelector("X3D").setAttribute('height', '550px');
      var textureTransform = document.createElement("TextureTransform");
      textureTransform.setAttribute('translation', '0.000000 0.000000');
      textureTransform.setAttribute('scale', '1 1');
      x3dRoot.querySelector("Appearance").appendChild(textureTransform);
      var coating = document.querySelector(".input-coating").value.toLowerCase().replace(" ", "-");
      var color = document.querySelector(".input-color").value.toLowerCase().replace(" ", "-");
      coating = "polyester";
      color = "rr20";
      var imageTexture = document.createElement("ImageTexture");
      imageTexture.setAttribute('repeatT', 'false');
      imageTexture.setAttribute('url', ' "/assets/textures/' + coating + '-' + color + '.png" "https://www.web3d.org/x3d/content/examples/ConformanceNist/vts.jpg"');
      x3dRoot.querySelector("Appearance").appendChild(imageTexture);
      document.querySelector(".sketch-3d > div").innerHTML = x3dRoot.querySelector("X3D").outerHTML;
      x3dom.reload();
    },
    bc: function bc() {
      var _this = productModal._this;
      var html = '';

      _this.state.bc.forEach(function (el, i) {
        if (_this.state.bc.length == i + 1) {
          html += "<li class=\"breadcrumb-item\" data-id=\"".concat(el.id, "\">").concat(el.title, "</li>");
        } else {
          html += "<li class=\"breadcrumb-item \"><a class=\"bc-click\" data-id=\"".concat(el.id, "\" href=\"#\">").concat(el.title, "</a></li>");
        }
      });

      document.querySelector(".breadcrumb").innerHTML = html;
      onClick(".bc-click", function (e) {
        e.preventDefault();
        productModal._this.state.bc = [];

        var item = productModal._this.state.items.filter(function (item) {
          return item._id == e.currentTarget.dataset.id;
        });

        productModal._this.state.item = item[0];
        _this.state.item.qty = 1;
        productModal.render(productModal._this);
      });
    }
  };

  var Order = _createClass(function Order(_this, _id) {
    var _this2 = this;

    _classCallCheck(this, Order);

    _defineProperty(this, "getOrder", function (id) {
      var locale = localStorage.locale ? localStorage.locale : "lv";
      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer KYSh2L3rH7egsE7CBOr1OyYUwqwC2wi8k5jcSiYQCFnUHN3aKjRpXxzD6PzRakp0',
          'Kenzap-Sid': spaceID()
        },
        body: JSON.stringify({
          query: {
            order: {
              type: 'find',
              key: 'ecommerce-order',
              id: id,
              fields: ['_id', 'id', 'items', 'from', 'entity', 'sdesc', 'price', 'total_all', 'email', 'phone', 'notes', 'status', 'updated']
            },
            settings: {
              type: 'get',
              key: 'ecommerce-settings',
              fields: ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display']
            },
            sk_settings: {
              type: 'get',
              key: 'sk-settings',
              fields: ['price']
            },
            locale: {
              type: 'locale',
              locales: [{
                key: 'sk-design',
                source: 'extension',
                locale: locale
              }, {
                key: 'ecommerce',
                source: 'extension',
                locale: locale
              }, {
                key: 'ecommerce',
                source: 'content',
                locale: locale
              }]
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (response.success) {
          _this2._this.state.order = response.order;
          _this2._this.state.settings = response.settings;
          _this2._this.state.sk_settings = response.sk_settings;

          __init(response.locale);

          if (_this2._this.state.order) if (_this2._this.state.order.length == 0) {
            var html = "";
            html += "\n                    <div class=\" text-center\" >\n                        <div class=\"card-header\">   \n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" fill=\"currentColor\" class=\"bi bi-exclamation-circle text-danger\" viewBox=\"0 0 16 16\">\n                                <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\n                                <path d=\"M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z\"/>\n                            </svg>\n                        </div>\n                        <div class=\"card-body\">\n                            <h5 class=\"card-title\">".concat(__html("No order found"), "</h5>\n                            <p class=\"card-text\">").concat(__html("Order does not exist or was removed."), "</p>\n                            <a href=\"https://wa.me/37126443313\" target=\"_blank\" class=\"btn btn-danger\" >\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-whatsapp mb-1 me-1\" viewBox=\"0 0 16 16\">\n                                    <path d=\"M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z\"/>\n                                </svg> ").concat(__html("Ask question"), "\n                            </a>\n                        </div>\n                        <div class=\"card-footer text-muted d-none\">").concat(__html("Order details"), "</div>\n                    </div>\n                    ");
            document.querySelector('#contents').innerHTML = html;
            return;
          }

          _this2.renderOrder();
        } else {
          parseApiError(response);
        }

        _this2._this.initHeader(response);

        _this2._this.initFooter();

        _this2._this.initListeners();

        _this2.initListeners();
      })["catch"](function (error) {
        parseApiError(error);
      });
    });

    _defineProperty(this, "renderOrder", function () {
      var urlParams = new URLSearchParams(window.location.search);
      var recent = urlParams.get('recent') ? urlParams.get('recent') : "";
      var total = 0,
          total_with_tax = 0;
      var html = "";

      if (recent == "yes") {
        html += "\n\n            <nav style=\"--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);\" aria-label=\"breadcrumb\">\n                <ol class=\"breadcrumb\">\n                    <li class=\"breadcrumb-item\"><a href=\"/?orders=recent\">".concat(__html('My Orders'), "</a></li>\n                    <li class=\"breadcrumb-item active\" aria-current=\"page\">#").concat(_this2._this.state.order.id, "</li>\n                </ol>\n            </nav>\n\n            <div class=\" text-center\">\n                <div class=\"card-header\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" fill=\"currentColor\" class=\"bi bi-check-circle text-danger my-1\" viewBox=\"0 0 16 16\">\n                        <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\n                        <path d=\"M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z\"/>\n                    </svg>\n                </div>\n                <div class=\"card-body my-2\">\n                    <h5 class=\"card-title\">#").concat(_this2._this.state.order.id, " ").concat(__html("Order received"), "</h5>\n                    <p class=\"card-text\">").concat(__html("Your order is being processed. The manager will contact you soon."), "</p>\n                    <p class=\"form-text\"> ").concat(__html("*working hours: 9.00 - 17.00, Monday - Friday."), "</p>\n                    <a href=\"https://wa.me/37126443313\" target=\"_blank\" class=\"btn btn-danger \">\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-whatsapp mb-1 me-1\" viewBox=\"0 0 16 16\">\n                            <path d=\"M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z\"/>\n                        </svg> ").concat(__html("Ask question"), "\n                    </a>\n                </div>\n                <div class=\"card-footer text-muted\">").concat(__html("Order details"), "</div>\n            </div>\n\n            ");
      }

      html += _this2.renderClient();
      html += "\n        <div class=\"table-responsive\">\n            <table class=\"table\" style=\"min-width:840px;\">\n                <thead>\n                    <tr>\n                        <th scope=\"col\">#</th>\n                        <th scope=\"col\">".concat(__html("Product"), "</th>\n                        <th scope=\"col\">").concat(__html("Price"), "</th>\n                        <th scope=\"col\">").concat(__html("Qty"), "</th>\n                        <th scope=\"col\"><div class=\"").concat(_this2._this.state.order.entity == "individual" ? "text-end" : "text-start", "\">").concat(__html("Total"), "</div></th>\n                        <th scope=\"col\" class=\"").concat(_this2._this.state.order.entity == "individual" ? "d-none" : "", "\">").concat(__html("Tax"), " / ").concat(__html("Code"), "</th>\n                        <th scope=\"col\" class=\"").concat(_this2._this.state.order.entity == "individual" ? "d-none" : "", "\"><div class=\"text-end\">").concat(__html("Total with tax"), "</div></th>\n                    </tr>\n                </thead>\n                <tbody>\n        ");

      _this2._this.state.order.items.forEach(function (item, i) {
        item.updated = 1;
        if (!item.tax_id) item.tax_id = "";
        total += makeNumber(item.total);
        total_with_tax += makeNumber(item.total * (item.tax_id.length == 4 ? 1 : 1.21));
        html += "\n                <tr class=\"".concat(i == _this2._this.state.order.items.length - 1 ? "border-secondary" : "", "\">\n                    <th scope=\"row\">").concat(i + 1, "</th>\n                    <td>\n                        <a href=\"#\" class=\"preview-order-item link-dark\" data-i=\"").concat(attr(i), "\" data-id=\"").concat(attr(item._id), "\" data-preview=\"order\">          \n                            <div class=\"timgc d-inline-block me-2\" style=\"width:25px;\">\n                                <span><img src=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(item._id, "-1-100x100.jpeg?").concat(item.updated, "\" data-srcset=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(item._id, "-1-100x100.jpeg?").concat(item.updated, "\" class=\"img-fluid rounded\" alt=\"Product placeholder\" srcset=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(item._id, "-1-100x100.jpeg?").concat(item.updated, "\"></span>\n                            </div>").concat(item.title, " ").concat(item.coating, " ").concat(item.color, "\n                        </a>\n                        <div class=\"form-text\">").concat(item.note, "</div>\n                    </td>\n                    <td>").concat(priceFormat(_this2._this, item.price), "</td>\n                    <td>").concat(item.qty, "</td>\n                    <td class=\"").concat(_this2._this.state.order.entity == "individual" ? "text-end" : "text-start", "\">").concat(priceFormat(_this2._this, item.total), "</td>\n                    <td class=\"").concat(_this2._this.state.order.entity == "individual" ? "d-none" : "d-none", "\">").concat(item.tax_id, "</td>\n                    <td class=\"").concat(_this2._this.state.order.entity == "individual" ? "d-none" : "", "\">").concat(item.tax_id.length == 4 ? "ANM / " + item.tax_id : "21%", "</td>\n                    <td class=\"text-end ").concat(_this2._this.state.order.entity == "individual" ? "d-none" : "", "\">").concat(priceFormat(_this2._this, item.total * (item.tax_id.length == 4 ? 1 : 1.21)), "</td>\n                </tr>\n            ");
      });

      console.log(_this2._this.state.order.price);

      if (_this2._this.state.order.entity == "individual") {
        html += "\n            <tr>\n                <td class=\"text-end fs-5\" colspan=\"5\">".concat(__html("Total"), " ").concat(priceFormat(_this2._this, _this2._this.state.order.price.total), "</td>\n            </tr>\n            ");
        html += "\n            <tr>\n                <td class=\"text-end fs-5\" colspan=\"5\">".concat(__html("VAT 21%"), " ").concat(priceFormat(_this2._this, _this2._this.state.order.price.total * 0.21), "</td>\n            </tr>\n            ");
        html += "\n                <tr>\n                    <td class=\"text-end fs-3\" colspan=\"5\">".concat(__html("Grand total"), " ").concat(priceFormat(_this2._this, _this2._this.state.order.price.total + _this2._this.state.order.price.total * 0.21), "</td>\n                </tr>\n                ");
      }

      if (_this2._this.state.order.entity == "company") {
        html += "\n            <tr class=\"border-top\">\n                <td class=\"text-start fs-5\" colspan=\"1\"></td>\n                <td class=\"text-start fs-5\" colspan=\"1\"></td>\n                <td class=\"text-start fs-5\" colspan=\"1\"></td>\n                <td class=\"text-start fs-5\" colspan=\"1\"></td>\n                <td class=\"text-start\" colspan=\"1\">".concat(priceFormat(_this2._this, total), "</td>\n                <td class=\"text-end\" colspan=\"2\">").concat(priceFormat(_this2._this, total_with_tax), "</td>\n            </tr>\n            <td class=\"text-end fs-5\" colspan=\"7\">").concat(__html("Grand total"), " ").concat(priceFormat(_this2._this, total_with_tax), "</td>\n\n            ");
      }

      html += "\n                </tbody>\n            </table>      \n        </div>  \n        ";
      document.querySelector('#contents').innerHTML = html;
      onClick(".preview-order-item", function (e) {});
    });

    _defineProperty(this, "renderClient", function () {
      var html = "\n\n        <div class=\"my-3\">\n            <h5 class=\"card-title\">".concat(__html("From"), "</h5>\n            <div class=\"card-text\">").concat(_this2._this.state.order.from, "</div>\n            <div class=\"card-text\">").concat(_this2._this.state.order.entity, "</div>\n            <div class=\"card-text\">").concat(_this2._this.state.order.email, "</div>\n            <div class=\"card-text\">").concat(_this2._this.state.order.phone, "</div>\n            <div class=\"card-text\">").concat(_this2._this.state.order.notes, "</div>\n        </div>\n\n        ");
      return html;
    });

    _defineProperty(this, "initListeners", function () {
      _this2._this;
      onClick('.preview-order-item', _this2.itemPreview);
      return true;
    });

    _defineProperty(this, "itemPreview", function (e) {
      e.preventDefault();
      var i = e.currentTarget.dataset.i;
      e.currentTarget.dataset.id;
      document.querySelector(".modal .btn-secondary").innerHTML = __html('Close');
      _this2._this.state.item = _this2._this.state.order.items[i];
      _this2._this.state.item.N = parseInt(i) + 1;
      _this2._this.state.item.title = _this2._this.state.item.title;

      _this2._this.state.item.input_fields.forEach(function (field) {
        field["default"] = parseFloat(_this2._this.state.item.input_fields_values['input' + field.label]);
      });

      console.log(_this2._this.state.item);
      _this2._this.state.bc = [];
      _this2._this.state.modal = document.querySelector(".modal-item");
      _this2._this.state.modal.cont = new bootstrap.Modal(_this2._this.state.modal);

      _this2._this.state.modal.cont.show();

      _this2._this.state.item_parent = null;
      _this2._this.state.item_preview = e.currentTarget.dataset.preview;
      productModal.render(_this2._this);
      document.querySelector(".modal .btn-primary").classList.add('d-none');
    });

    this._this = _this;
    this.id = _id;
    this.getOrder(_id);
  });

  var OrderList = _createClass(function OrderList(_this, type) {
    var _this2 = this;

    _classCallCheck(this, OrderList);

    _defineProperty(this, "getOrderList", function (type) {
      var locale = localStorage.locale ? localStorage.locale : "lv";
      var order_list = localStorage.getItem('sk-design-orders') ? JSON.parse(localStorage.getItem('sk-design-orders')) : [];
      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer KYSh2L3rH7egsE7CBOr1OyYUwqwC2wi8k5jcSiYQCFnUHN3aKjRpXxzD6PzRakp0',
          'Kenzap-Sid': spaceID()
        },
        body: JSON.stringify({
          query: {
            orders: {
              type: 'find',
              key: 'ecommerce-order',
              id: order_list,
              limit: 10,
              fields: ['_id', 'id', 'items', 'from', 'entity', 'sdesc', 'price', 'total_all', 'email', 'phone', 'notes', 'status', 'updated']
            },
            settings: {
              type: 'get',
              key: 'ecommerce-settings',
              fields: ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display']
            },
            sk_settings: {
              type: 'get',
              key: 'sk-settings',
              fields: ['price']
            },
            locale: {
              type: 'locale',
              locales: [{
                key: 'sk-design',
                source: 'extension',
                locale: locale
              }, {
                key: 'ecommerce',
                source: 'extension',
                locale: locale
              }, {
                key: 'ecommerce',
                source: 'content',
                locale: locale
              }]
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (response.success) {
          _this2._this.state.meta = response.meta;
          _this2._this.state.orders = response.orders.reverse();
          _this2._this.state.settings = response.settings;
          _this2._this.state.sk_settings = response.sk_settings;

          __init(response.locale);

          if (_this2._this.state.orders) if (_this2._this.state.orders.length == 0) {
            var html = "";
            html += "\n                    <div class=\" text-center\" >\n                        <div class=\"card-header\">   \n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" fill=\"currentColor\" class=\"bi bi-check-circle text-danger my-1\" viewBox=\"0 0 16 16\">\n                                <path d=\"M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z\"/>\n                                <path d=\"M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z\"/>\n                            </svg>\n                        </div>\n                        <div class=\"card-body\">\n                            <h5 class=\"card-title\">".concat(__html("My Orders"), "</h5>\n                            <p class=\"card-text\">").concat(__html("No orders to display yet."), "</p>\n                            <a href=\"/\" class=\"btn btn-outline-danger btn-lg\" >\n                                ").concat(__html("view products"), "\n                            </a>\n                        </div>\n                        <div class=\"card-footer text-muted d-none\">").concat(__html("Recent orders"), "</div>\n                    </div>\n                    <div class=\"table-responsive\">\n                        <table class=\"table\" style=\"min-width:700px;\">\n                            <thead>\n                                <tr>\n                                    <th scope=\"col\">").concat(__html("ID"), "</th>\n                                    <th scope=\"col\">").concat(__html("Products"), "</th>\n                                    <th scope=\"col\">").concat(__html("Ordered"), "</th>\n                                    <th scope=\"col text-end\"></th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td class=\"text-center pb-5\" colspan=\"5\">").concat(__html("No orders to display yet."), "</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                    ");
            document.querySelector('#contents').innerHTML = html;
          } else {
            _this2.renderOrders();
          }
        } else {
          parseApiError(response);
        }

        _this2._this.initHeader(response);

        _this2._this.initFooter();

        _this2._this.initListeners();

        _this2.initListeners();
      })["catch"](function (error) {
        parseApiError(error);
      });
    });

    _defineProperty(this, "renderOrders", function () {
      var urlParams = new URLSearchParams(window.location.search);
      var orders = urlParams.get('orders') ? urlParams.get('orders') : "";
      var html = "";

      if (orders == "recent") {
        html += "\n\n            <div class=\" text-center\">\n                <div class=\"card-header\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" fill=\"currentColor\" class=\"bi bi-check-circle text-danger my-1\" viewBox=\"0 0 16 16\">\n                        <path d=\"M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z\"/>\n                        <path d=\"M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z\"/>\n                    </svg>\n                </div>\n                <div class=\"card-body my-2\">\n                    <h5 class=\"card-title\">".concat(__html("My Orders"), "</h5>\n                    <p class=\"card-text\">").concat(__html("List of recently placed orders."), "</p>\n                    <a href=\"https://wa.me/37126443313\" target=\"_blank\" class=\"btn btn-danger \">\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-whatsapp mb-1 me-1\" viewBox=\"0 0 16 16\">\n                            <path d=\"M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z\"/>\n                        </svg> ").concat(__html("Ask question"), "\n                    </a>\n                </div>\n                <div class=\"card-footer text-muted\">").concat(__html("Recent orders"), "</div>\n            </div>\n\n            ");
      }

      html += "\n        <div class=\"table-responsive\">\n            <table class=\"table\" style=\"min-width:700px;\">\n                <thead>\n                    <tr>\n                        <th scope=\"col\">".concat(__html("ID"), "</th>\n                        <th scope=\"col\">").concat(__html("Products"), "</th>\n                        <th scope=\"col\">").concat(__html("Ordered"), "</th>\n                        <th scope=\"col text-end\"></th>\n                    </tr>\n                </thead>\n                <tbody>\n        ");

      _this2._this.state.orders.forEach(function (order, i) {
        var items = "";
        order.items.forEach(function (item, ii) {
          items += "\n                    ".concat(item.title, " ").concat(item.coating, " ").concat(item.color, "</br>\n                ");
        });
        html += "\n                <tr>\n                    <th scope=\"row\"><a href=\"?order=".concat(order._id, "\">#").concat(order.id, "</a></th>\n                    <td style=\"font-size: 0.82rem;\">\n                    ").concat(items, "\n                    </td>\n                    <td>").concat(timeConverterAgo(__, _this2._this.state.meta.time, order.updated), "</td>\n                    <td class=\"text-end\"><a href=\"?order=").concat(order._id, "\" class=\"pt-2\"><button type=\"button\" class=\"btn btn-outline-danger btn-sm\">").concat(__html("view order"), "</button></a></td>\n                </tr>\n            ");
        html += "\n        <tr>\n            <td class=\"text-end fs-4 pb-5\" colspan=\"5\">".concat(__html("Total"), " ").concat(priceFormat(_this2._this, order.total_all), "</td>\n        </tr>\n        ");
      });

      html += "\n                </tbody>\n            </table>      \n        </div>  \n        ";
      document.querySelector('#contents').innerHTML = html;
      onClick(".preview-order-item", function (e) {});
    });

    _defineProperty(this, "initListeners", function () {
      _this2._this;
      onClick('.preview-order-item', _this2.itemPreview);
      return true;
    });

    _defineProperty(this, "itemPreview", function (e) {
      e.preventDefault();
      var i = e.currentTarget.dataset.i;
      e.currentTarget.dataset.id;
      document.querySelector(".modal .btn-secondary").innerHTML = __html('Close');
      _this2._this.state.item = _this2._this.state.order.items[i];
      _this2._this.state.item.N = parseInt(i) + 1;
      _this2._this.state.item.title = _this2._this.state.item.title;

      _this2._this.state.item.input_fields.forEach(function (field) {
        field["default"] = parseFloat(_this2._this.state.item.input_fields_values['input' + field.label]);
      });

      console.log(_this2._this.state.item);
      _this2._this.state.bc = [];
      _this2._this.state.modal = document.querySelector(".modal-item");
      _this2._this.state.modal.cont = new bootstrap.Modal(_this2._this.state.modal);

      _this2._this.state.modal.cont.show();

      _this2._this.state.item_parent = null;
      _this2._this.state.item_preview = e.currentTarget.dataset.preview;
      productModal.render(_this2._this);
      document.querySelector(".modal .btn-primary").classList.add('d-none');
    });

    this._this = _this;
    this.type = type;
    this.getOrderList(type);
  });

  var _colors;
  var _this = {
    state: {
      locale: null,
      s: "",
      items: [],
      firstLoad: true,
      focusOutBlock: false,
      ajaxQueue: 0,
      cart: null,
      order: null,
      item: null,
      bc: [],
      modal: {
        cont: null
      },
      colors: (_colors = {
        'RR11': {
          hex_bg: '#14360f',
          hex_text: '#ffffff'
        },
        'RR20': {
          hex_bg: '#f5f9fc',
          hex_text: '#000000'
        },
        'RR21': {
          hex_bg: '#c0c0c0',
          hex_text: '#000000'
        },
        'RR22': {
          hex_bg: '#878a89',
          hex_text: '#000000'
        },
        'RR23': {
          hex_bg: '#37383d',
          hex_text: '#ffffff'
        },
        'RR29': {
          hex_bg: '#681a11',
          hex_text: '#ffffff'
        },
        'RR30': {
          hex_bg: '#cebb7f',
          hex_text: '#000000'
        },
        'RR32': {
          hex_bg: '#2f2218',
          hex_text: '#ffffff'
        },
        'RR33': {
          hex_bg: '#000000',
          hex_text: '#ffffff'
        },
        'RR887': {
          hex_bg: '#32211f',
          hex_text: '#ffffff'
        },
        'RR750': {
          hex_bg: '#7e2f0d',
          hex_text: '#ffffff'
        }
      }, _defineProperty(_colors, "RR887", {
        hex_bg: '#37130d',
        hex_text: '#ffffff'
      }), _defineProperty(_colors, 'RR946', {
        hex_bg: '#afafaf',
        hex_text: '#000000'
      }), _defineProperty(_colors, '2H3', {
        hex_bg: '#28292b',
        hex_text: '#ffffff'
      }), _colors)
    },
    init: function init() {
      if (!localStorage.idd) localStorage.idd = randomString(8) + Math.floor(Date.now());
      var urlParams = new URLSearchParams(window.location.search);
      var order_id = urlParams.get('order') ? urlParams.get('order') : "";

      if (order_id.length > 12) {
        _this.state.order = new Order(_this, order_id);
        return;
      }

      var orders = urlParams.get('orders') ? urlParams.get('orders') : "";

      if (orders.length > 1) {
        _this.state.order_list = new OrderList(_this, orders);
        return;
      }

      _this.state.locale = urlParams.get('lang') ? urlParams.get('lang') : localStorage.locale ? localStorage.locale : "lv";
      urlParams.set('lang', '');
      _this.state.s = urlParams.get('s') ? urlParams.get('s') : "";
      if (!localStorage.state_last) localStorage.state_last = 0;

      if (urlParams.get('cache') != "clear" && Math.floor(Date.now() / 1000) - localStorage.state_last < 3600 * 12 && localStorage.key("state")) {
        _this.state = JSON.parse(localStorage.state);
        _this.state.cached = true;
      }

      _this.state.s = urlParams.get('s') ? urlParams.get('s') : "";

      if (_this.state.cached) {
        _this.getDataParse(_this);

        return;
      }

      if (!_this.state.cached) {
        _this.getData();

        return;
      }
    },
    getData: function getData() {
      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer KYSh2L3rH7egsE7CBOr1OyYUwqwC2wi8k5jcSiYQCFnUHN3aKjRpXxzD6PzRakp0',
          'Kenzap-Sid': spaceID()
        },
        body: JSON.stringify({
          query: {
            items: {
              type: 'find',
              key: 'ecommerce-product',
              limit: 1000,
              fields: ['_id', 'id', 'title', 'cats', 'modelling', 'tax_id', 'img', 'sdesc', 'status', 'input_fields', 'formula', 'formula_price', 'formula_width', 'formula_length', 'calc_price', 'var_price', 'parts', 'updated'],
              term: [{
                type: 'string',
                field: 'status',
                value: '1',
                relation: '='
              }],
              sortby: [{
                field: 'title',
                order: 'ASC'
              }]
            },
            settings: {
              type: 'get',
              key: 'ecommerce-settings',
              fields: ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display']
            },
            sk_settings: {
              type: 'get',
              key: 'sk-settings',
              fields: ['price']
            },
            locale: {
              type: 'locale',
              locales: [{
                key: 'sk-design',
                source: 'extension',
                locale: _this.state.locale
              }, {
                key: 'sk-design',
                source: 'content',
                locale: _this.state.locale
              }, {
                key: 'ecommerce',
                source: 'extension',
                locale: _this.state.locale
              }, {
                key: 'ecommerce',
                source: 'content',
                locale: _this.state.locale
              }]
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (response.success) {
          _this.state.response = response;
          _this.state.items = response.items;
          _this.state.settings = response.settings;
          _this.state.sk_settings = response.sk_settings;
          localStorage.state = JSON.stringify(_this.state);
          localStorage.state_last = Math.floor(Date.now() / 1000);

          _this.getDataParse(_this);
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        parseApiError(error);
      });
    },
    getDataParse: function getDataParse(_this) {
      hideLoader();

      __init(_this.state.response.locale);

      _this.initHeader(_this.state.response);

      _this.loadHomeStructure();

      _this.renderPage(_this.state.response);

      _this.state.cart = new Cart(_this);

      _this.initFooter();

      _this.initListeners();

      _this.state.firstLoad = false;
    },
    renderPage: function renderPage(response) {

      _this.state.items.forEach(function (item, i) {
        _this.state.items[i].title_or = _this.state.items[i].title, _this.state.items[i].cats_or = _this.state.items[i].cats, _this.state.items[i].cats.forEach(function (cat, c) {
          _this.state.items[i].cats[c] = __(cat);
        });
        _this.state.items[i].title = __(_this.state.items[i].title);
      });

      _this.state.items.sort(sortAlphaNum);

      if (_this.state.s.length > 0) setTimeout(function () {
        document.querySelector('#search').value = _this.state.s;

        _this.search();
      }, 100);
    },
    initHeader: function initHeader(response) {
      setTimeout(function () {
        document.querySelector(".menu-cont ul").innerHTML = "\n                <li>\n                    <a href=\"/\">".concat(__html("Products"), "</a>\n                </li>\n                <li>\n                    <a href=\"/?orders=recent\">").concat(__html("My Orders"), "</a>\n                </li>\n                <li>\n                    <a target=\"_blank\" href=\"https://www.skardanams.com/privacy-policy/\">").concat(__html("Privacy"), "</a>\n                </li>\n                <li>\n                    <a target=\"_blank\" href=\"https://www.skardanams.com/documentation/\">").concat(__html("Documentation"), "</a>\n                </li>\n                <li>\n                    <a target=\"_blank\" href=\"https://www.skardanams.lv/kontakti/\">").concat(__html("Contact us"), "</a>\n                </li>\n            ");
        document.querySelector(".menu-cont").classList.remove("d-none");
      }, 520);
      document.addEventListener("scroll", _this.listeners.scrollEvents);
    },
    initListeners: function initListeners() {
      if (!_this.state.firstLoad) return;
      onClick('.slideset a', _this.listeners.openTag);
      onClick('.clear-search', _this.listeners.clearSearch);
      onClick('.accordion-button', _this.listeners.openCat);
      onKeyUp('#search', _this.search);
      onClick('#search', function (e) {
        gtag('event', 'Search', {
          'event_category': 'search',
          'page': 'feed',
          'source': 'input'
        });
      });
      var link = document.querySelector('.accordion-button.first');
      if (link) simulateClick(link);
      onClick('.modal .btn-primary', _this.listeners.modalSuccessBtn);
      onClick('.bi-globe', function (e) {
        gtag('event', 'Language', {
          'event_category': 'picker',
          'page': 'feed',
          'source': 'button'
        });
      });
      onClick('.sw-ln', _this.listeners.changeLanguage);
      document.addEventListener("scroll", lazyLoad);
      window.addEventListener("resize", lazyLoad);
      window.addEventListener("orientationchange", lazyLoad);
      var burger = document.querySelector('.burger');
      var menu_close = document.querySelector('.menu-close');
      var nav = document.querySelector('nav');
      burger.addEventListener('click', function (e) {
        burger.dataset.state === 'closed' ? burger.dataset.state = "open" : burger.dataset.state = "closed";
        nav.dataset.state === "closed" ? nav.dataset.state = "open" : nav.dataset.state = "closed";
      });
      menu_close.addEventListener('click', function (e) {
        burger.dataset.state = "closed";
        nav.dataset.state = "closed";
      });
      var urlParams = new URLSearchParams(window.location.search);

      var _id = urlParams.get('_id') ? urlParams.get('_id') : "";

      if (_id) {
        document.querySelector('#pseudo').dataset.id = _id;
        document.querySelector('#pseudo').dataset.preview = "feed";
        document.querySelector('#pseudo').dataset.i = 0;
        if (document.querySelector('#pseudo')) simulateClick(document.querySelector('#pseudo'));
      }

      window.addEventListener('popstate', function (event) {
        setTimeout(function () {
          var urlParams = new URLSearchParams(window.location.search);
          var s = urlParams.get('s') ? urlParams.get('s') : "";
          document.querySelector('#search').value = s;

          _this.search();
        }, 100);
      }, false);
    },
    listeners: {
      renderModal: function renderModal(e) {
        var i = e.currentTarget.dataset.i;
        var id = e.currentTarget.dataset.id;
        var cid = e.currentTarget.dataset.cid;
        _this.state.item_preview = e.currentTarget.dataset.preview;
        _this.state.item_cid = cid;
        var time = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString();
        document.querySelector(".modal .btn-secondary").innerHTML = __html('Close');
        document.querySelector(".modal .btn-primary").classList.remove('d-none');

        if (_this.state.item_preview == 'cart') {
          document.querySelector(".modal .btn-primary").classList.remove('btn-danger');
          document.querySelector(".modal .btn-primary").innerHTML = __html('Update cart');
          _this.state.item = _this.state.cart.getCart().items[i];
          gtag('event', 'Product', {
            'event_category': 'preview',
            'page': 'feed',
            'source': 'cart',
            'event_label': _this.state.item._id,
            'time': time,
            'idd': localStorage.idd,
            'title': _this.state.item.title
          });
        }

        if (_this.state.item_preview == 'feed') {
          document.querySelector(".modal .btn-primary").classList.add('btn-danger');
          document.querySelector(".modal .btn-primary").innerHTML = __html('Add to cart');
          _this.state.item = _this.state.items.filter(function (item) {
            return item._id == id;
          })[0];
          _this.state.item.qty = 1;
          gtag('event', 'Product', {
            'event_category': 'preview',
            'page': 'feed',
            'source': 'feed',
            'event_label': _this.state.item._id,
            'time': time,
            'idd': localStorage.idd,
            'title': _this.state.item.title
          });
        }

        _this.state.bc = [];
        _this.state.modal = document.querySelector(".modal-item");
        _this.state.modal.cont = new bootstrap.Modal(_this.state.modal);

        _this.state.modal.cont.show();

        _this.state.item_parent = null;
        productModal.render(_this);
      },
      clearSearch: function clearSearch(e) {
        document.querySelector("#search").value = "";

        _this.search();
      },
      refreshSketchPrice: function refreshSketchPrice() {
        var coatingPrice = makeNumber(document.querySelector(".input-price").dataset.pricem2);

        var price = _this.getPrice(_this, coatingPrice);

        document.querySelector(".price").value = priceFormat(_this, price.total);
        document.querySelector(".price").dataset.price = makeNumber(price.price);
        document.querySelector(".price").dataset.total = makeNumber(price.total);
        document.querySelector(".price").dataset.width = makeNumber(price.formula_width);
        document.querySelector(".price").dataset.length = makeNumber(price.formula_length);
        document.querySelector(".input-price").dataset.area = "";

        switch (_this.state.item.calc_price) {
          case 'variable':
            document.querySelector(".price-desc").innerHTML = '<div class="ms-3 p-0">' + __html("Variable price") + ' ' + priceFormat(_this, price.total) + '</div>';
            break;

          case 'formula':
          default:
            var area = eval(price.formula);
            document.querySelector(".price-desc").innerHTML = '\
                    <ul class="ms-3 p-0">\
                        <li>' + document.querySelector(".qty").value + ' x ' + area / 1000000 + ' &#13217; x ' + coatingPrice + ' = ' + priceFormat(_this, parseFloat(document.querySelector(".qty").value) * (eval(price.formula) / 1000000) * coatingPrice) + '</li>\
                        <li>' + document.querySelector(".qty").value + ' x ' + priceFormat(_this, eval(price.formula_price)) + ' = ' + priceFormat(_this, parseFloat(document.querySelector(".qty").value) * eval(price.formula_price)) + '</li>\
                    </ul>';
            document.querySelector(".input-price").dataset.area = area;
            break;
        }
      },
      focusListener: function focusListener(e) {
        var _iterator = _createForOfIteratorHelper(document.querySelectorAll(".svg-input input")),
            _step;

        try {
          var _loop = function _loop() {
            var el = _step.value;
            el.addEventListener("focus", function (e) {
              var id = e.currentTarget.parentElement.dataset.id;
              setTimeout(function (el, id) {
                var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll(".svg-input")),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var svginp = _step2.value;
                    svginp.classList.add('deemphasize');
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                ;

                var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll("#svg g")),
                    _step3;

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var svgg = _step3.value;
                    svgg.classList.add('deemphasize');
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }

                ;
                document.querySelector('#svg g[data-id="' + id + '"]').classList.remove('deemphasize');
                document.querySelector('.svg-input[data-id="' + id + '"]').classList.remove('deemphasize');
                _this.state.focusOutBlock = true;
                setTimeout(function () {
                  _this.state.focusOutBlock = false;
                }, 100);
              }, 1, el, id);
            });
            el.addEventListener("focusout", function (e) {
              setTimeout(function (el) {
                if (_this.state.focusOutBlock) return;

                var _iterator4 = _createForOfIteratorHelper(document.querySelectorAll(".svg-input")),
                    _step4;

                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var svginp = _step4.value;
                    svginp.classList.remove('deemphasize');
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }

                ;

                var _iterator5 = _createForOfIteratorHelper(document.querySelectorAll("#svg g")),
                    _step5;

                try {
                  for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    var svgg = _step5.value;
                    svgg.classList.remove('deemphasize');
                  }
                } catch (err) {
                  _iterator5.e(err);
                } finally {
                  _iterator5.f();
                }

                ;
              }, 5, el);
            });
          };

          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      },
      openTag: function openTag(e) {
        e.preventDefault();
        document.querySelector('#search').value = e.currentTarget.innerHTML;

        _this.clearActiveTags();

        e.currentTarget.classList.add('active');

        _this.search();
      },
      openCat: function openCat(e) {
        var cats = e.currentTarget.dataset.cats.split('|');
        var html = '';

        _this.state.items.forEach(function (item, i) {
          var allow = false;
          cats.forEach(function (cat) {
            if (item.cats.includes(cat)) allow = true;
          });

          if (allow) {
            html += _this.structBlock(i, item);
          }
        });

        e.currentTarget.parentElement.parentElement.querySelector(".accordion-body").innerHTML = html;
        onClick('.item', _this.listeners.renderModal);
        lazyLoad();
      },
      scrollEvents: function scrollEvents(e) {
        if (document.documentElement.scrollTop > 0) {
          document.querySelector(".logo-only-header").classList.add('scrolled');
        } else {
          document.querySelector(".logo-only-header").classList.remove('scrolled');
        }
      },
      changeLanguage: function changeLanguage(e) {
        e.preventDefault();
        _this.state.locale = e.currentTarget.dataset.ln;
        localStorage.state_last = 0;
        var queryParams = new URLSearchParams(window.location.search);
        queryParams.set("lang", _this.state.locale);
        queryParams["delete"]("s");
        localStorage.locale = _this.state.locale;
        history.replaceState(null, null, "?" + queryParams.toString());
        location.reload();
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    getPrice: function getPrice(_this, coatingPrice) {
      var obj = {};

      switch (_this.state.item.calc_price) {
        case 'variable':
          obj.price = makeNumber(coatingPrice);
          obj.total = obj.price * parseFloat(document.querySelector(".qty").value);
          obj.formula_width = _this.state.item.formula_width ? _this.state.item.formula_width : '0';
          obj.formula_length = _this.state.item.formula_length ? _this.state.item.formula_length : '0';
          break;

        case 'formula':
        default:
          obj.formula = _this.state.item.formula;
          obj.formula_price = _this.state.item.formula_price ? _this.state.item.formula_price : '0';
          obj.formula_width = _this.state.item.formula_width ? _this.state.item.formula_width : '0';
          obj.formula_length = _this.state.item.formula_length ? _this.state.item.formula_length : '0';
          obj.formula = obj.formula.replaceAll("COATING", coatingPrice);
          obj.formula_price = obj.formula_price.replaceAll("COATING", coatingPrice);

          var _iterator6 = _createForOfIteratorHelper(_this.state.sk_settings.price),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var price = _step6.value;

              if (price.id.length > 0) {
                obj.formula = obj.formula.replaceAll(price.id, parseFloat(price.price));
                obj.formula_price = obj.formula_price.replaceAll(price.id, parseFloat(price.price));
              }
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          var _iterator7 = _createForOfIteratorHelper(document.querySelectorAll(".svg-input input")),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var el = _step7.value;
              var label = el.id.replace('input', '');
              var value = parseFloat(el.value);
              obj.formula = obj.formula.replaceAll(label, value);
              obj.formula_price = obj.formula_price.replaceAll(label, value);
              obj.formula_width = obj.formula_width.replaceAll(label, value);
              obj.formula_length = obj.formula_length.replaceAll(label, value);
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }

          obj.price = makeNumber(eval(obj.formula) / 1000000 * coatingPrice) + makeNumber(eval(obj.formula_price));
          obj.total = obj.price * parseFloat(document.querySelector(".qty").value);
          obj.formula_width = eval(obj.formula_width);
          obj.formula_length = eval(obj.formula_length);
          break;
      }

      return obj;
    },
    getMinPrice: function getMinPrice(item) {
      var obj = {
        COATING: 1
      };

      switch (item.calc_price) {
        case 'complex':
          obj.price = 0;
          obj.total = 0;
          obj.type = 'complex';
          return '<div class="badge rounded-pill bg-danger fw-bold mt-3" style="font-size: 1rem;">' + __html('Calculate') + '</div>';

        case 'variable':
          var min_price = parseFloat(item.var_price[0].price);
          item.var_price.filter(function (price) {
            if (parseFloat(price.price) < min_price) min_price = parseFloat(price.price);
          });
          obj.price = makeNumber(min_price);
          obj.total = obj.price;
          obj.type = 'variable';
          return '<div class="badge rounded-pill bg-danger fw-bold mt-3" style="font-size: 1.1rem;"><span style="font-size:0.8rem">no</span> ' + priceFormat(_this, obj.total) + '</div>';

        case 'formula':
        default:
          obj.formula = item.formula;
          obj.formula_price = item.formula_price;

          var _iterator8 = _createForOfIteratorHelper(_this.state.sk_settings.price),
              _step8;

          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var price = _step8.value;

              if (price.id == "ZN") {
                obj.COATING = parseFloat(price.price);
              }

              if (price.id.length > 0) {
                obj.formula = obj.formula.replaceAll(price.id, parseFloat(price.price));
                obj.formula_price = obj.formula_price.replaceAll(price.id, parseFloat(price.price));
              }
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }

          obj.formula = obj.formula.replaceAll("COATING", obj.COATING);
          obj.formula_price = obj.formula_price.replaceAll("COATING", obj.COATING);
          item.input_fields.forEach(function (field, i) {
            obj.formula = obj.formula.replaceAll(field.label, field["default"]);
            obj.formula_price = obj.formula_price.replaceAll(field.label, field["default"]);
          });
          obj.price = makeNumber(eval(obj.formula) / 1000000 * obj.COATING) + makeNumber(eval(obj.formula_price));
          obj.total = obj.price * 1;
          obj.type = 'formula';
          return '<div class="badge rounded-pill bg-danger fw-bold mt-3" style="font-size: 1.1rem;"><span style="font-size:0.8rem">no</span> ' + priceFormat(_this, obj.total) + '</div>';
      }
    },
    loadColors: function loadColors(parent) {
      var urlParams = new URLSearchParams(window.location.search);
      var color_options = '',
          ic = localStorage.getItem('input-color') ? localStorage.getItem('input-color') : "";
      if (_this.state.item_preview == "order") ic = _this.state.item.color;
      if (_this.state.item_preview == "cart") ic = _this.state.item.color;
      if (urlParams.get('iframe') && urlParams.get('color')) ic = urlParams.get('color').replace("-", "");

      switch (_this.state.item.calc_price) {
        case 'variable':
          var _iterator9 = _createForOfIteratorHelper(_this.state.item.var_price),
              _step9;

          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var price = _step9.value;

              if (price["public"] && price.parent == parent && price.title != "*") {
                color_options += "<option ".concat(price.title == ic ? "selected" : "", " data-price=\"").concat(price.price, "\" value=\"").concat(price.title, "\">").concat(__html(price.title), "</option>");
              }
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }

          break;

        case 'formula':
        default:
          var _iterator10 = _createForOfIteratorHelper(_this.state.sk_settings.price),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var _price = _step10.value;

              if (_price["public"] && _price.parent == parent && _price.title != "*") {
                color_options += "<option ".concat(_price.title == ic ? "selected" : "", " data-price=\"").concat(_price.price, "\" value=\"").concat(_price.title, "\">").concat(__html(_price.title), "</option>");
              }
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }

          break;
      }

      if (color_options != '' && _this.state.item.calc_price != "complex") {
        document.querySelector(".input-color-cnt").classList.remove('d-none');
      }

      if (color_options == '') {
        document.querySelector(".input-color-cnt").classList.add('d-none');
      }

      document.querySelector(".input-color").innerHTML = color_options;
      onChange('.input-color', function (e) {
        _this.loadPrice();
      });

      _this.loadPrice();
    },
    loadPrice: function loadPrice() {
      var el = document.querySelector(".input-color");

      switch (_this.state.item.calc_price) {
        case 'variable':
          if (el.options[el.selectedIndex]) {
            document.querySelector(".input-price").dataset.pricem2 = el.options[el.selectedIndex].dataset.price;
            document.querySelector(".input-color").style.background = _this.state.colors[el.options[el.selectedIndex].value].hex_bg;
            document.querySelector(".input-color").style.color = _this.state.colors[el.options[el.selectedIndex].value].hex_text;
          } else {
            var el_coating = document.querySelector(".input-coating");
            var coating = el_coating.options[el_coating.selectedIndex];
            document.querySelector(".input-price").dataset.pricem2 = _this.state.item.var_price.filter(function (el) {
              return el.parent == coating.value;
            })[0].price;
          }

          break;

        case 'formula':
        default:
          if (el.options[el.selectedIndex]) {
            document.querySelector(".input-price").dataset.pricem2 = el.options[el.selectedIndex].dataset.price;
            document.querySelector(".input-color").style.background = _this.state.colors[el.options[el.selectedIndex].value].hex_bg;
            document.querySelector(".input-color").style.color = _this.state.colors[el.options[el.selectedIndex].value].hex_text;
          } else {
            var _el_coating = document.querySelector(".input-coating");

            var _coating = _el_coating.options[_el_coating.selectedIndex];
            document.querySelector(".input-price").dataset.pricem2 = _this.state.sk_settings.price.filter(function (el) {
              return el.parent == _coating.value;
            })[0].price;
          }

          break;
      }

      _this.listeners.refreshSketchPrice();
    },
    search: function search(e) {
      document.querySelector('.search-results').classList.add('d-none');
      document.querySelector('.accordion').classList.remove('d-none');
      document.querySelector('.search-title').classList.add('d-none');
      document.querySelector('.clear-search').classList.remove('d-none');
      var search = document.querySelector('#search').value;

      if (search.length == 0) {
        document.querySelector('.clear-search').classList.add('d-none');

        _this.clearActiveTags();

        return;
      }

      var html = "";

      _this.state.items.forEach(function (item, i) {
        var allow = false;
        if (" " + item.cats.join(" ").toLowerCase().indexOf(search.toLowerCase()) != -1) allow = true;
        if (" " + item.title.toLowerCase().indexOf(search.toLowerCase()) != -1) allow = true;

        if (allow) {
          html += _this.structBlock(i, item);
        }
      });

      document.querySelector('.search-results').innerHTML = html;
      lazyLoad();

      if (html.length > 0) {
        document.querySelector('.search-results').classList.remove('d-none');
        document.querySelector('.accordion').classList.add('d-none');
        document.querySelector('.search-title').innerHTML = __html("Search results for %1$", '"' + search + '"');
        document.querySelector('.search-title').classList.remove('d-none');
        onClick('.item', _this.listeners.renderModal);
      } else {
        document.querySelector('.search-title').innerHTML = __html("No products found for %1$", '"' + search + '"');
        document.querySelector('.search-title').classList.remove('d-none');
        document.querySelector('.search-results').classList.add('d-none');
        document.querySelector('.accordion').classList.add('d-none');
      }
    },
    structBlock: function structBlock(i, item) {
      return "\n\n        <div class=\"col item po \" data-i=\"".concat(attr(i), "\" data-id=\"").concat(attr(item._id), "\" data-preview=\"feed\">\n            <img data-src=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(item._id, "-1-500x500.jpeg?").concat(item.updated, "\" data-srcset=\"").concat(CDN, "S").concat(spaceID(), "/sketch-").concat(item._id, "-1-500x500.jpeg?").concat(item.updated, "\" src=\"/assets/img/placeholder.png\" class=\"card-img-top rounded-3 lazy\" alt=\"").concat(attr(item.title), "\">\n            <div class=\"card-body\">\n                <h5 class=\"card-title\">\n                    <div>").concat(__html(item.title), " </div>\n                    ").concat(_this.getMinPrice(item), "\n                </h5>\n                <p class=\"card-text\">").concat(__html(item.sdesc), "</p>\n            </div>\n            <div class=\"card-footer d-none\">\n                <small class=\"text-muted\">Last updated 3 mins ago</small>\n            </div>\n        </div>\n\n        ");
    },
    clearActiveTags: function clearActiveTags() {
      var _iterator11 = _createForOfIteratorHelper(document.querySelectorAll(".slideset .slide a")),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var el = _step11.value;
          el.classList.remove('active');
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
    },
    loadHomeStructure: function loadHomeStructure() {
      if (!_this.state.firstLoad) return;
      document.querySelector('#contents').innerHTML = HTMLContent();
    },
    initFooter: function initFooter$1() {
      initFooter(__('Manufactured ❤️ in Latvia. %1$Documentation%2$ %3$Privacy%4$ %5$Support%6$', '<a class="text-muted mx-1" href="https://www.skardanams.com/documentation/" target="_blank">', '</a>', '<a class="text-muted mx-1" href="https://www.skardanams.com/privacy-policy/" target="_blank">', '</a>', '<a class="text-muted mx-1" href="https://www.skardanams.lv/kontakti/" target="_blank">', '</a>'), '');
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
