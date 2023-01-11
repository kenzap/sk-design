// js dependencies
import { headers, showLoader, hideLoader, onClick, onChange, onKeyUp, simulateClick, initFooter, initBreadcrumbs, parseApiError, getCookie, getSiteId, link, toast, __, __init, __html, __attr, html, attr, setCookie } from '@kenzap/k-cloud';
import { CDN, onlyNumbers, makeNumber, degToRad, priceFormat, stringToHash, lazyLoad, spaceID, API_KEY, randomString, sortAlphaNum } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_www.js"
import { Cart } from "../_/_cart.js"
import { Order } from "../_/_order.js"
import { OrderList } from "../_/_order_list.js"
import { productModal } from "../_/_modal_product.js"

// where everything happens
const _this = {

    state: {
        locale: null,
        s: "", // search param
        items: [],
        firstLoad: true,
        focusOutBlock: false,
        ajaxQueue: 0,
        cart: null,
        order: null,
        item: null,
        bc: [],
        modal: { cont: null },
        colors: {'RR11': { hex_bg: '#14360f', hex_text: '#ffffff' }, 'RR20': { hex_bg: '#f5f9fc', hex_text: '#000000' }, 'RR21': { hex_bg: '#c0c0c0', hex_text: '#000000' }, 'RR22': { hex_bg: '#878a89', hex_text: '#000000' }, 'RR23': { hex_bg: '#37383d', hex_text: '#ffffff' }, 'RR29': { hex_bg: '#681a11', hex_text: '#ffffff' }, 'RR30': { hex_bg: '#cebb7f', hex_text: '#000000' }, 'RR32': { hex_bg: '#2f2218', hex_text: '#ffffff' }, 'RR33': { hex_bg: '#000000', hex_text: '#ffffff' }, 'RR887': { hex_bg: '#32211f', hex_text: '#ffffff' }, 'RR750': { hex_bg: '#7e2f0d', hex_text: '#ffffff' }, 'RR887': { hex_bg: '#37130d', hex_text: '#ffffff' }, 'RR946': { hex_bg: '#afafaf', hex_text: '#000000' }, '2H3': { hex_bg: '#28292b', hex_text: '#ffffff' }}
    },
    init: () => {

        // random user id
        if(!localStorage.idd) localStorage.idd = randomString(8)+Math.floor(Date.now());

        // parse URL
        let urlParams = new URLSearchParams(window.location.search);

        // single order page
        let order_id = urlParams.get('order') ? urlParams.get('order') : "";
        if(order_id.length > 12){ _this.state.order = new Order(_this, order_id); return; }

        // all orders page
        let orders = urlParams.get('orders') ? urlParams.get('orders') : "";
        if(orders.length > 1){ _this.state.order_list = new OrderList(_this, orders); return; }

        // get locale language
        _this.state.locale = urlParams.get('lang') ? urlParams.get('lang') : localStorage.locale ? localStorage.locale : "lv"; urlParams.set('lang', '');

        // search param
        _this.state.s = urlParams.get('s') ? urlParams.get('s') : "";

        // last cached state
        if(!localStorage.state_last) localStorage.state_last = 0;

        // restore state
        if(urlParams.get('cache') != "clear" && ((Math.floor(Date.now() / 1000) - localStorage.state_last) < 3600*12 && localStorage.key("state"))){ // && localStorage.key(localStorage.state)

            _this.state = JSON.parse(localStorage.state);
            _this.state.cached = true;
        }

        // search param
        _this.state.s = urlParams.get('s') ? urlParams.get('s') : "";

        // render feed page
        if(_this.state.cached){ _this.getDataParse(_this); return; }
        
        // get data + render feed page
        if(!_this.state.cached){ _this.getData(); return; }
    },
    getData: () => {

        // do API query
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer KYSh2L3rH7egsE7CBOr1OyYUwqwC2wi8k5jcSiYQCFnUHN3aKjRpXxzD6PzRakp0',
                // 'Kenzap-Token': config.token,
                'Kenzap-Sid': spaceID(),
            },
            body: JSON.stringify({
                query: {
                    items: {
                        type:       'find',
                        key:        'ecommerce-product',
                        // id:         id,   
                        limit:      1000,
                        fields:     ['_id', 'id', 'title', 'cats', 'modelling', 'tax_id', 'img', 'sdesc', 'status', 'input_fields', 'formula', 'formula_price', 'formula_width', 'formula_length', 'calc_price', 'var_price', 'parts', 'updated'],
                        term:       [
                            {
                                type:       'string',
                                field:      'status',
                                value:      '1',
                                relation:   '='
                            }
                        ],
                        sortby:     [
                            {
                                field: 'title',
                                order: 'ASC'
                            }
                        ]
                    },
                    settings: {
                        type:       'get',
                        key:        'ecommerce-settings',
                        fields:     ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display'],
                    },
                    sk_settings: {
                        type:       'get',
                        key:        'sk-settings',
                        fields:     ['price'],
                    },
                    locale: {
                        type:       'locale',
                        locales: [
                            {
                                key: 'sk-design',
                                source: 'extension',
                                locale: _this.state.locale,   
                            }, 
                            {
                                key: 'sk-design',
                                source: 'content',
                                locale: _this.state.locale,   
                            }, 
                            {
                                key: 'ecommerce',
                                source: 'extension',
                                locale: _this.state.locale,
                            },
                            {
                                key: 'ecommerce',
                                source: 'content',
                                locale: _this.state.locale,
                            }
                        ]
                    }
                }
            }) 
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if(response.success){

                // cache data
                _this.state.response = response;
                _this.state.items = response.items;
                _this.state.settings = response.settings;
                _this.state.sk_settings = response.sk_settings;

                localStorage.state = JSON.stringify(_this.state);
                localStorage.state_last = Math.floor(Date.now() / 1000);

                _this.getDataParse(_this);

            }else{

                parseApiError(response);
            }
        })
        .catch(error => { parseApiError(error); });
    },
    getDataParse: (_this) => {

        hideLoader();

        // preload translations
        __init(_this.state.response.locale);

        // init header
        _this.initHeader(_this.state.response);

        // get core html content 
        _this.loadHomeStructure();  

        // render page
        _this.renderPage(_this.state.response);

        // render cart
        _this.state.cart = new Cart(_this);

        // init footer
        _this.initFooter();

        // init listeners
        _this.initListeners();

        // first load
        _this.state.firstLoad = false;
    },
    renderPage: (response) => {

        let d = document;

        // iterate locales
        _this.state.items.forEach((item, i) => {

            _this.state.items[i].title_or = _this.state.items[i].title,
            _this.state.items[i].cats_or = _this.state.items[i].cats,

            _this.state.items[i].cats.forEach((cat, c) => {
                _this.state.items[i].cats[c] = __(cat);
            });

            _this.state.items[i].title = __(_this.state.items[i].title)
        });

        // sort title as numbers. Ex.: Parapet type 10, Parapet type 11
        _this.state.items.sort(sortAlphaNum);
        
        // url based search
        // console.log(_this.state.s);
        if(_this.state.s.length>0) setTimeout(() => { document.querySelector('#search').value = (_this.state.s); _this.search(); },100);
    },
    initHeader: (response) => {

        // navigation menu
        setTimeout(() => {

            document.querySelector(".menu-cont ul").innerHTML = `
                <li>
                    <a href="/">${ __html("Products") }</a>
                </li>
                <li>
                    <a href="/?orders=recent">${ __html("My Orders") }</a>
                </li>
                <li>
                    <a target="_blank" href="https://www.skardanams.com/privacy-policy/">${ __html("Privacy") }</a>
                </li>
                <li>
                    <a target="_blank" href="https://www.skardanams.com/documentation/">${ __html("Documentation") }</a>
                </li>
                <li>
                    <a target="_blank" href="https://www.skardanams.lv/kontakti/">${ __html("Contact us") }</a>
                </li>
            `;     
            
            document.querySelector(".menu-cont").classList.remove("d-none");
        },520);

        // scrollEvents
        document.addEventListener("scroll", _this.listeners.scrollEvents);
    },
    initListeners: () => {

        // render modal
        // onClick('.item', _this.listeners.renderModal);

        if(!_this.state.firstLoad) return;
        
        // tag listener
        onClick('.slideset a', _this.listeners.openTag);
        
        // clean search input
        onClick('.clear-search', _this.listeners.clearSearch);
        
        // accordion click
        onClick('.accordion-button', _this.listeners.openCat);
        
        // search listener
        onKeyUp('#search', _this.search);

        // search event
        onClick('#search', (e) => {

            gtag('event', 'Search', {'event_category': 'search', 'page': 'feed', 'source': 'input'});
        });

        // open first tab
        let link = document.querySelector('.accordion-button.first');
        if(link) simulateClick(link);
            
        // modal success button
        onClick('.modal .btn-primary', _this.listeners.modalSuccessBtn);

        // lang picker
        onClick('.bi-globe', (e) => {

            gtag('event', 'Language', {'event_category': 'picker', 'page': 'feed', 'source': 'button'});
        });
        
        // language picker
        onClick('.sw-ln', _this.listeners.changeLanguage);

        // image async loading
        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationchange", lazyLoad);

        // side menu
        const burger = document.querySelector('.burger');
        const menu_close = document.querySelector('.menu-close');
        const nav = document.querySelector('nav');
        
        // toggle menu visibility
        burger.addEventListener('click', e => {
            burger.dataset.state === 'closed' ? burger.dataset.state = "open" : burger.dataset.state = "closed";
            nav.dataset.state === "closed" ? nav.dataset.state = "open" : nav.dataset.state = "closed";
        });

        // close menu
        menu_close.addEventListener('click', e => {

            burger.dataset.state = "closed";
            nav.dataset.state = "closed";
        });

        // open feed row
        let urlParams = new URLSearchParams(window.location.search);
        let _id = urlParams.get('_id') ? urlParams.get('_id') : "";

        if(_id){

            document.querySelector('#pseudo').dataset.id = _id;
            document.querySelector('#pseudo').dataset.preview = "feed";
            document.querySelector('#pseudo').dataset.i = 0;

            if(document.querySelector('#pseudo')) simulateClick(document.querySelector('#pseudo'));
        }

        // hisotry state chnaged
        window.addEventListener('popstate', function(event) {
          
            setTimeout(() => {

                let urlParams = new URLSearchParams(window.location.search);
                let s = urlParams.get('s') ? urlParams.get('s') : "";
    
                document.querySelector('#search').value = s;
    
                _this.search(); 
            
            },100);

        }, false);
    },
    listeners: {

        renderModal: (e) => {

            let i = e.currentTarget.dataset.i;
            let id = e.currentTarget.dataset.id;
            let cid = e.currentTarget.dataset.cid;
            _this.state.item_preview = e.currentTarget.dataset.preview;
            _this.state.item_cid = cid;

            let time = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();
            
            // console.log(id);

            document.querySelector(".modal .btn-secondary").innerHTML = __html('Close');
            document.querySelector(".modal .btn-primary").classList.remove('d-none');

            // cart sketch
            if(_this.state.item_preview == 'cart'){

                document.querySelector(".modal .btn-primary").classList.remove('btn-danger');
                document.querySelector(".modal .btn-primary").innerHTML = __html('Update cart');

                _this.state.item = _this.state.cart.getCart().items[i];
                
                // metrics
                gtag('event', 'Product', {'event_category': 'preview', 'page': 'feed', 'source': 'cart', 'event_label':_this.state.item._id, 'time':time, 'idd':localStorage.idd, 'title':_this.state.item.title});
            }
            
            // new sketch
            if(_this.state.item_preview == 'feed'){

                document.querySelector(".modal .btn-primary").classList.add('btn-danger');
                document.querySelector(".modal .btn-primary").innerHTML = __html('Add to cart');

                _this.state.item = _this.state.items.filter(item => { return item._id == id; })[0];
                _this.state.item.qty = 1;

                // metrics
                gtag('event', 'Product', {'event_category': 'preview', 'page': 'feed', 'source': 'feed', 'event_label':_this.state.item._id, 'time':time, 'idd':localStorage.idd, 'title':_this.state.item.title});
            }

            _this.state.bc = [];

            _this.state.modal = document.querySelector(".modal-item");
            _this.state.modal.cont = new bootstrap.Modal(_this.state.modal);
            _this.state.modal.cont.show();
            _this.state.item_parent = null;

            productModal.render(_this);
        },

        clearSearch: (e) => {

            document.querySelector("#search").value = "";

            _this.search();
        },

        refreshSketchPrice: () => {

            let coatingPrice = makeNumber(document.querySelector(".input-price").dataset.pricem2); // per m2
            let price = _this.getPrice(_this, coatingPrice); 

            document.querySelector(".price").value = priceFormat(_this, price.total);
            document.querySelector(".price").dataset.price = makeNumber(price.price);
            document.querySelector(".price").dataset.total = makeNumber(price.total);
            document.querySelector(".price").dataset.width = makeNumber(price.formula_width);
            document.querySelector(".price").dataset.length = makeNumber(price.formula_length);
            document.querySelector(".input-price").dataset.area = "";

            // calc price options
            switch(_this.state.item.calc_price){

                case 'variable': 
                    document.querySelector(".price-desc").innerHTML = '<div class="ms-3 p-0">'+__html("Variable price")+' ' + priceFormat(_this, price.total) + '</div>';
                break;
                case 'formula':
                default:

                    let area = eval(price.formula);

                    document.querySelector(".price-desc").innerHTML = '\
                    <ul class="ms-3 p-0">\
                        <li>' + document.querySelector(".qty").value + ' x ' + (area / 1000000) + ' &#13217; x ' + (coatingPrice) + ' = ' + priceFormat(_this, (parseFloat(document.querySelector(".qty").value) * (eval(price.formula) / 1000000) * coatingPrice)) + '</li>\
                        <li>' + document.querySelector(".qty").value + ' x ' + priceFormat(_this, eval(price.formula_price)) + ' = ' + priceFormat(_this, parseFloat(document.querySelector(".qty").value) * eval(price.formula_price)) + '</li>\
                    </ul>';

                    document.querySelector(".input-price").dataset.area = area;
                break;
            }
        },

        focusListener: (e) => {

            for(let el of document.querySelectorAll(".svg-input input")){

                el.addEventListener("focus", (e) => {
                
                    let id = e.currentTarget.parentElement.dataset.id;

                    setTimeout((el, id) => {

                        // deemphasize
                        for(let svginp of document.querySelectorAll(".svg-input")){   
                            svginp.classList.add('deemphasize');
                        };

                        for(let svgg of document.querySelectorAll("#svg g")){   
                            svgg.classList.add('deemphasize');
                        };
                        
                        document.querySelector('#svg g[data-id="'+id+'"]').classList.remove('deemphasize');
                        document.querySelector('.svg-input[data-id="'+id+'"]').classList.remove('deemphasize');

                        // console.log('focus in');
                        _this.state.focusOutBlock = true;

                        setTimeout(() => { _this.state.focusOutBlock = false; }, 100);

                    }, 1, el, id);
                });

                el.addEventListener("focusout",  (e) => {
                 
                    // if(_this.state.focusOutBlock) return;

                    setTimeout((el) => {

                        if(_this.state.focusOutBlock) return;

                        for(let svginp of document.querySelectorAll(".svg-input")){   
                            svginp.classList.remove('deemphasize');
                        };

                        for(let svgg of document.querySelectorAll("#svg g")){   
                            svgg.classList.remove('deemphasize');
                        };

                        // console.log('focus out');
                    }, 5, el);
                });
            }
        },

        openTag: (e) => {

            e.preventDefault();

            document.querySelector('#search').value = e.currentTarget.innerHTML;

            _this.clearActiveTags();

            e.currentTarget.classList.add('active');

            _this.search();
        },

        openCat: (e) => {

            let cats = e.currentTarget.dataset.cats.split('|');

            // console.log(cats);

            let html = '';

            _this.state.items.forEach((item, i) => {

                let allow = false;
                cats.forEach(cat => {

                    // console.log(item);
                    
                    if(item.cats.includes(cat)) allow = true;

                });

                if(allow){
                    
                    html += _this.structBlock(i, item);
                }
            });

            e.currentTarget.parentElement.parentElement.querySelector(".accordion-body").innerHTML = html;  

            onClick('.item', _this.listeners.renderModal);

            lazyLoad();
        },

        /**
        * Scroll listener. Add/Remove scrolled class to body
        * @public
        */
        scrollEvents: (e) => {

            // console.log(document.documentElement.scrollTop);
            if(document.documentElement.scrollTop>0){

                document.querySelector(".logo-only-header").classList.add('scrolled');
            }else{

                document.querySelector(".logo-only-header").classList.remove('scrolled');
            }
        },

        changeLanguage: (e) => {

            e.preventDefault();

            _this.state.locale = e.currentTarget.dataset.ln;

            localStorage.state_last = 0;

            // Construct URLSearchParams object instance from current URL querystring.
            var queryParams = new URLSearchParams(window.location.search);
            
            // Set new or modify existing parameter value. 
            //queryParams.set("myParam", "myValue");
            queryParams.set("lang", _this.state.locale);
            queryParams.delete("s");

            localStorage.locale = _this.state.locale;
            
            // Replace current querystring with the new one.
            history.replaceState(null, null, "?"+queryParams.toString());

            // remove lang from url if present
            
            // _this.state.locale

            // console.log(_this.state.locale);

            // _this.getData();

            location.reload();

            // setCookie("locale", lang);
        },

        modalSuccessBtn: (e) => {
            
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    getPrice: (_this, coatingPrice) => {

        // console.log('getPrice');
        let obj = {};

        switch(_this.state.item.calc_price){

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

                // selected coating price
                obj.formula = obj.formula.replaceAll("COATING", coatingPrice);
                obj.formula_price = obj.formula_price.replaceAll("COATING", coatingPrice);
        
                for(let price of _this.state.sk_settings.price){
        
                    if(price.id.length > 0){
        
                        obj.formula = obj.formula.replaceAll(price.id, parseFloat(price.price));
                        obj.formula_price = obj.formula_price.replaceAll(price.id, parseFloat(price.price));
                    }
                }
        
                for(let el of document.querySelectorAll(".svg-input input")){   
        
                    let label = el.id.replace('input', '');
                    let value = parseFloat(el.value);
        
                    obj.formula = obj.formula.replaceAll(label, value);
                    obj.formula_price = obj.formula_price.replaceAll(label, value);
                    obj.formula_width = obj.formula_width.replaceAll(label, value);
                    obj.formula_length = obj.formula_length.replaceAll(label, value);

                    // if(urlParams.get('input_fields_values')) input_fields_values = JSON.parse(unescape(urlParams.get('input_fields_values')));
                    // if(input_fields_values) _this.state.item.input_fields.forEach((field, i)=>{
        
                    //     field.default = input_fields_values['input'+field.label] ? input_fields_values['input'+field.label] : field.default;
                    //     // _this.state.item.formula_width = _this.state.item.formula_width.replaceAll(field.label, field.default);
                    //     // _this.state.item.formula_length = _this.state.item.formula_length.replaceAll(field.label, field.default);
                    // });
        
                    // _this.state.item.formula_width = eval(_this.state.item.formula_width);
                    // _this.state.item.formula_length = eval(_this.state.item.formula_length);
                }
        
                // evaluate final calculations
                obj.price = makeNumber((eval(obj.formula) / 1000000 * coatingPrice)) + makeNumber(eval(obj.formula_price));
                obj.total = obj.price * parseFloat(document.querySelector(".qty").value);
                obj.formula_width = eval(obj.formula_width);
                obj.formula_length = eval(obj.formula_length);

                // console.log(obj);
            break;
        }

        return obj;
    },
    getMinPrice: (item) => {

        let obj = { COATING: 1 };
        // console.log(item);
        // calc price options
        switch(item.calc_price){

            case 'complex': 

                obj.price = 0;
                obj.total = 0;
                obj.type = 'complex';

                return '<div class="badge rounded-pill bg-danger fw-bold mt-3" style="font-size: 1rem;">'+ __html('Calculate') +'</div>'; // <span style="font-size:0.8rem">no</span>
            break;
            case 'variable': 
                            
                let min_price = parseFloat(item.var_price[0].price);
                item.var_price.filter(price => {

                    if(parseFloat(price.price) < min_price) min_price = parseFloat(price.price);
                });

                obj.price = makeNumber(min_price);
                obj.total = obj.price;
                obj.type = 'variable';

                return '<div class="badge rounded-pill bg-danger fw-bold mt-3" style="font-size: 1.1rem;"><span style="font-size:0.8rem">no</span> ' + priceFormat(_this, obj.total) + '</div>';
            break;
            case 'formula':
            default:

                obj.formula = item.formula;
                obj.formula_price = item.formula_price;
        
                for(let price of _this.state.sk_settings.price){

                    // ZN typically has the lowest price range
                    if(price.id == "ZN"){
        
                        obj.COATING = parseFloat(price.price);
                    }
        
                    // find price clasificators
                    if(price.id.length > 0){
        
                        obj.formula = obj.formula.replaceAll(price.id, parseFloat(price.price));
                        obj.formula_price = obj.formula_price.replaceAll(price.id, parseFloat(price.price));
                    }
                }
        
                // selected coating price
                obj.formula = obj.formula.replaceAll("COATING", obj.COATING);
                obj.formula_price = obj.formula_price.replaceAll("COATING", obj.COATING);
            
                // console.log(obj);
        
                // default labels
                item.input_fields.forEach((field, i) => {
        
                    obj.formula = obj.formula.replaceAll(field.label, field.default);
                    obj.formula_price = obj.formula_price.replaceAll(field.label, field.default);
                });
        
                obj.price = makeNumber((eval(obj.formula) / 1000000 * obj.COATING)) + makeNumber(eval(obj.formula_price));
                obj.total = obj.price * 1;
                obj.type = 'formula';

                return '<div class="badge rounded-pill bg-danger fw-bold mt-3" style="font-size: 1.1rem;"><span style="font-size:0.8rem">no</span> ' + priceFormat(_this, obj.total) + '</div>';
            break;
        }

        
    },
    loadColors: (parent) => {

        let urlParams = new URLSearchParams(window.location.search);

        let color_options = '', ic = localStorage.getItem('input-color') ? localStorage.getItem('input-color') : "";

        // override coating option when preview mode = order
        if(_this.state.item_preview == "order") ic = _this.state.item.color;

        // override coating option when preview mode = order
        if(_this.state.item_preview == "cart") ic = _this.state.item.color;

        // override coating when iframe
        if(urlParams.get('iframe') && urlParams.get('color')) ic = urlParams.get('color').replace("-","");

        // calc price options
        switch(_this.state.item.calc_price){

            case 'variable': 

                for(let price of _this.state.item.var_price){

                    if(price.public && price.parent == parent && price.title != "*"){
        
                        color_options += `<option ${ price.title == ic ? "selected":"" } data-price="${ price.price }" value="${ price.title }">${ __html(price.title) }</option>`; 
                    }
                }

            break;
            case 'formula':
            default:

                for(let price of _this.state.sk_settings.price){

                    if(price.public && price.parent == parent && price.title != "*"){
        
                        color_options += `<option ${ price.title == ic ? "selected":"" } data-price="${ price.price }" value="${ price.title }">${ __html(price.title) }</option>`; 
                    }
                }
            break;
        }

        if(color_options != '' && _this.state.item.calc_price != "complex"){ document.querySelector(".input-color-cnt").classList.remove('d-none'); }
        if(color_options == ''){ document.querySelector(".input-color-cnt").classList.add('d-none'); }

        document.querySelector(".input-color").innerHTML = color_options;

        // coating change listener
        onChange('.input-color', e => {

            _this.loadPrice();
        });
        _this.loadPrice();
    },
    loadPrice: () =>{

        let el = document.querySelector(".input-color");

        // calc price options
        switch(_this.state.item.calc_price){

            case 'variable':

                // price from color
                if(el.options[el.selectedIndex]){
    
                    document.querySelector(".input-price").dataset.pricem2 = el.options[el.selectedIndex].dataset.price;
                    document.querySelector(".input-color").style.background = _this.state.colors[el.options[el.selectedIndex].value].hex_bg;
                    document.querySelector(".input-color").style.color = _this.state.colors[el.options[el.selectedIndex].value].hex_text;

                // price from coating only
                }else{

                    let el_coating = document.querySelector(".input-coating");
                    let coating = el_coating.options[el_coating.selectedIndex];

                    document.querySelector(".input-price").dataset.pricem2 = _this.state.item.var_price.filter(el => { return el.parent == coating.value })[0].price;
                }
            break;
            case 'formula':
            default:

                // price from color
                if(el.options[el.selectedIndex]){
                    
                    document.querySelector(".input-price").dataset.pricem2 = el.options[el.selectedIndex].dataset.price;
                    document.querySelector(".input-color").style.background = _this.state.colors[el.options[el.selectedIndex].value].hex_bg;
                    document.querySelector(".input-color").style.color = _this.state.colors[el.options[el.selectedIndex].value].hex_text;

                // price from coating only
                }else{

                    let el_coating = document.querySelector(".input-coating");
                    let coating = el_coating.options[el_coating.selectedIndex];

                    document.querySelector(".input-price").dataset.pricem2 = _this.state.sk_settings.price.filter(el => { return el.parent == coating.value })[0].price;
                }
            break;
        }

        _this.listeners.refreshSketchPrice();
    },
    search: (e) => {

        // set defaults
        document.querySelector('.search-results').classList.add('d-none');
        document.querySelector('.accordion').classList.remove('d-none');
        document.querySelector('.search-title').classList.add('d-none');
        document.querySelector('.clear-search').classList.remove('d-none');

        let search = document.querySelector('#search').value;

        // Construct URLSearchParams object instance from current URL querystring.
        // var queryParams = new URLSearchParams(window.location.search);  

        // search is empty
        if(search.length == 0){

            // update url
            // queryParams.delete("s");
            // history.pushState(null, null, "?"+queryParams.toString());

            // document.querySelector('.accordion').classList.remove('d-none');
            document.querySelector('.clear-search').classList.add('d-none');
            _this.clearActiveTags();

            return;
        }

        // update url
        // queryParams.set("s", search);
        // history.pushState(null, null, "?"+queryParams.toString());

        let html = "";
        // console.log('search: ' + search);

        _this.state.items.forEach((item, i) => {

            let allow = false;

            // console.log(" "+item.cats.join(" ").toLowerCase());

            if(" "+item.cats.join(" ").toLowerCase().indexOf(search.toLowerCase())!=-1) allow = true;
            if(" "+item.title.toLowerCase().indexOf(search.toLowerCase())!=-1) allow = true;

            if(allow){
                
                html += _this.structBlock(i, item);
            }
        });

        document.querySelector('.search-results').innerHTML = html;

        lazyLoad();

        // show search results
        if(html.length>0){
            document.querySelector('.search-results').classList.remove('d-none');
            document.querySelector('.accordion').classList.add('d-none');
            document.querySelector('.search-title').innerHTML = __html("Search results for %1$", '"' + search + '"');
            document.querySelector('.search-title').classList.remove('d-none');

            onClick('.item', _this.listeners.renderModal);
        }else{

            document.querySelector('.search-title').innerHTML = __html("No products found for %1$", '"' + search + '"');
            document.querySelector('.search-title').classList.remove('d-none');
            document.querySelector('.search-results').classList.add('d-none');
            document.querySelector('.accordion').classList.add('d-none');
        }
    },
    structBlock: (i, item) => {

        return `

        <div class="col item po " data-i="${ attr(i) }" data-id="${ attr(item._id) }" data-preview="feed">
            <img data-src="${ CDN }S${ spaceID() }/sketch-${ item._id }-1-500x500.jpeg?${ item.updated }" data-srcset="${ CDN }S${ spaceID() }/sketch-${ item._id }-1-500x500.jpeg?${ item.updated }" src="/assets/img/placeholder.png" class="card-img-top rounded-3 lazy" alt="${ attr(item.title) }">
            <div class="card-body">
                <h5 class="card-title">
                    <div>${ __html(item.title) } </div>
                    ${ _this.getMinPrice(item) }
                </h5>
                <p class="card-text">${ __html(item.sdesc) }</p>
            </div>
            <div class="card-footer d-none">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </div>

        `;
    },
    clearActiveTags: () => {

        for(let el of document.querySelectorAll(".slideset .slide a")){ el.classList.remove('active'); }
    },
    loadHomeStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = HTMLContent();
    },
    initFooter: () => {
        
        initFooter( __('Manufactured ❤️ in Latvia. %1$Documentation%2$ %3$Privacy%4$ %5$Support%6$', '<a class="text-muted mx-1" href="https://www.skardanams.com/documentation/" target="_blank">', '</a>', '<a class="text-muted mx-1" href="https://www.skardanams.com/privacy-policy/" target="_blank">', '</a>', '<a class="text-muted mx-1" href="https://www.skardanams.lv/kontakti/" target="_blank">', '</a>'), '');
        // initFooter(__('Copyright © %1$ %2$ Kenzap%3$. All rights reserved.', new Date().getFullYear(), '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();
