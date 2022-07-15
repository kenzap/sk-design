// js dependencies
import { headers, showLoader, hideLoader, initHeader, onClick, onChange, onKeyUp, simulateClick, initFooter, initBreadcrumbs, parseApiError, getCookie, getSiteId, link, toast, __, __init, __html, __attr, html, attr, setCookie } from '@kenzap/k-cloud';
import { onlyNumbers, makeNumber, degToRad, priceFormat, stringToHash, lazyLoad, spaceID, API_KEY } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_www.js"
import { Cart } from "../_/_cart.js"
import { productModal } from "../_/_modal_product.js"

// where everything happens
const _this = {

    state: {
        locale: null,
        items: [],
        firstLoad: true,
        focusOutBlock: false,
        ajaxQueue: 0,
        cart: null,
        item: null,
        bc: [],
        modal: { cont: null },
        colors: {'RR11': { hex_bg: '#14360f', hex_text: '#ffffff' }, 'RR20': { hex_bg: '#f5f9fc', hex_text: '#000000' }, 'RR21': { hex_bg: '#c0c0c0', hex_text: '#000000' }, 'RR22': { hex_bg: '#878a89', hex_text: '#000000' }, 'RR23': { hex_bg: '#37383d', hex_text: '#ffffff' }, 'RR29': { hex_bg: '#681a11', hex_text: '#ffffff' }, 'RR30': { hex_bg: '#cebb7f', hex_text: '#000000' }, 'RR32': { hex_bg: '#2f2218', hex_text: '#ffffff' }, 'RR33': { hex_bg: '#000000', hex_text: '#ffffff' }, 'RR887': { hex_bg: '#32211f', hex_text: '#ffffff' }, 'RR750': { hex_bg: '#7e2f0d', hex_text: '#ffffff' }, 'RR887': { hex_bg: '#37130d', hex_text: '#ffffff' }, 'RR946': { hex_bg: '#afafaf', hex_text: '#000000' }, '2H3': { hex_bg: '#28292b', hex_text: '#ffffff' }}
    },
    init: () => {

        // nvigation menu
        document.querySelector(".menu-cont ul").innerHTML = `
            <li>
                <a href="/">${ __html("Home") }</a>
            </li>
            <li>
                <a target="_blank" href="https://www.skardanams.com/privacy-policy/">${ __html("Privacy") }</a>
            </li>
            <li>
                <a href="https://www.skardanams.com/documentation/">${ __html("Documentation") }</a>
            </li>
            <li>
                <a href="https://www.skardanams.lv/kontakti/">${ __html("Contact us") }</a>
            </li>
        `;
            
        // scrollEvents
        document.addEventListener("scroll", _this.listeners.scrollEvents);
        
        // random user id
        if(!localStorage.idd) localStorage.idd = randomString(8)+Math.floor(Date.now());

        // parse URL
        let urlParams = new URLSearchParams(window.location.search);
        let order_id = urlParams.get('order') ? urlParams.get('order') : "";

        if(order_id.length > 12){ _this.getOrder(order_id); return; }

        // home page
        _this.getData(); 
    },
    getOrder: (id) => {
      
        // check locale
        let locale = getCookie('locale') ? getCookie('locale') : "lv";

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
                    order: {
                        type:       'find',
                        key:        'ecommerce-order',
                        id:         id,   
                        limit:      1000,
                        fields:     ['_id', 'id', 'items', 'from', 'entity', 'sdesc', 'price', 'total_all', 'email', 'phone', 'notes', 'status', 'updated'],
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
                                locale: locale,   
                            }, 
                            {
                                key: 'ecommerce',
                                source: 'extension',
                                locale: locale,
                            },
                            {
                                key: 'ecommerce',
                                source: 'content',
                                locale: locale,
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

                console.log(response);

                _this.state.order = response.order;
                _this.state.settings = response.settings;
                _this.state.sk_settings = response.sk_settings;

                if(_this.state.order) if(_this.state.order.length == 0){ 
                    
                    // alert( __("Order does not exist or was removed") ); 
                    let html = "";
                    
                    html += `
                    <div class=" text-center">
                        <div class="card-header">   
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-exclamation-circle text-danger" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                            </svg>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${ __html("No order found") }</h5>
                            <p class="card-text">${ __html("Order does not exist or was removed.") }</p>
                            <a href="https://wa.me/37126443313" target="_blank" class="btn btn-danger ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp mb-1 me-1" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                </svg> ${ __html("Ask question") }
                            </a>
                        </div>
                        <div class="card-footer text-muted d-none">${ __html("Order details") }</div>
                    </div>
                    `;

                    document.querySelector('#contents').innerHTML = html;

                    return; 
                }

                _this.renderOrder();

                // cache data
                // _this.state.items = response.items;
                // _this.state.settings = response.settings;
                // _this.state.sk_settings = response.sk_settings;

                // // preload translations
                // __init(response.locale);

                // // console.log(_this.state.sk_settings);

                // // init header
                // // initHeader(response);

                // // get core html content 
                // _this.loadHomeStructure();  

                // // render page
                // _this.renderPage(response);

                // // render cart
                // _this.state.cart = new Cart(_this);

                // // init footer
                // _this.initFooter();

                // // init listeners
                // _this.initListeners();

                // // first load
                // _this.state.firstLoad = false;

            }else{

                parseApiError(response);
            }
        })
        .catch(error => { parseApiError(error); });
    }, 
    renderOrder: () => {

        // parse URL
        let urlParams = new URLSearchParams(window.location.search);
        let recent = urlParams.get('recent') ? urlParams.get('recent') : "";
        let html = "";
        if(recent == "yes"){

            html += `

            <div class=" text-center">
                <div class="card-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-check-circle text-danger my-1" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                </div>
                <div class="card-body my-2">
                    <h5 class="card-title">#${ _this.state.order.id } ${ __html("Order received") }</h5>
                    <p class="card-text">${ __html("Your order is being processed. The manager will contact you soon.") }</p>
                    <a href="https://wa.me/37126443313" target="_blank" class="btn btn-danger ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp mb-1 me-1" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg> ${ __html("Ask question") }
                    </a>
                </div>
                <div class="card-footer text-muted">${ __html("Order details") }</div>
            </div>

            `;
        }

        html += `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">${ __html("Product") }</th>
                        <th scope="col">${ __html("Price") }</th>
                        <th scope="col">${ __html("Qty") }</th>
                        <th scope="col text-end">${ __html("Total") }</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // iterate order items
        _this.state.order.items.forEach((item, i) => {

            item.updated = 1;

            html += `
                <tr>
                    <th scope="row">${ i+1 }</th>
                    <td>
                        <div class="timgc d-inline-block me-2" style="width:25px;">
                            <a href="/product-edit/?id=c25d7e0fe4547c24ca7414c8eccaf187b7810731&amp;sid=1002170"><img src="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ item._id }-1-100x100.jpeg?${ item.updated }" data-srcset="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ item._id }-1-100x100.jpeg?${ item.updated }" class="img-fluid rounded" alt="Product placeholder" srcset="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ item._id }-1-100x100.jpeg?${ item.updated }"></a>
                        </div>
                        
                        ${ item.title } ${ item.coating } ${ item.color }</td>
                    <td>${ priceFormat(_this, item.price) }</td>
                    <td>${ item.qty }</td>
                    <td class="text-end">${ priceFormat(_this, item.total) }</td>
                </tr>
            `;
        });

        // totals
        html += `
            <tr>
                <td class="text-end fs-3" colspan="5">${ __html("Total") } ${ priceFormat(_this, _this.state.order.price.total) }</td>
            </tr>
            `;

        html += `
                </tbody>
            </table>      
        </div>  
        `;

        document.querySelector('#contents').innerHTML = html;
    },
    getData: () => {
      
        // check locale
        let locale = getCookie('locale') ? getCookie('locale') : "lv";

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
                        fields:     ['_id', 'id', 'title', 'cats', 'img', 'sdesc', 'input_fields', 'formula', 'formula_price', 'calc_price', 'parts', 'updated'],
                        sortby:     {
                            field: 'title',
                            order: 'ASC'
                        }
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
                                locale: locale,   
                            }, 
                            {
                                key: 'ecommerce',
                                source: 'extension',
                                locale: locale,
                            },
                            {
                                key: 'ecommerce',
                                source: 'content',
                                locale: locale,
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
                _this.state.items = response.items;
                _this.state.settings = response.settings;
                _this.state.sk_settings = response.sk_settings;

                // preload translations
                __init(response.locale);

                // console.log(_this.state.sk_settings);

                // init header
                // initHeader(response);

                // get core html content 
                _this.loadHomeStructure();  

                // render page
                _this.renderPage(response);

                // render cart
                _this.state.cart = new Cart(_this);

                // init footer
                _this.initFooter();

                // init listeners
                _this.initListeners();

                // first load
                _this.state.firstLoad = false;

            }else{

                parseApiError(response);
            }
        })
        .catch(error => { parseApiError(error); });
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

    },
    // initHeader: (response) => {

    //     onClick('.nav-back', (e) => {

    //         e.preventDefault();
    //         console.log('.nav-back');
    //         let link = document.querySelector('.bc ol li:nth-last-child(2)').querySelector('a');
    //         simulateClick(link);
    //     });
    // },
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

        // open first tab
        //setTimeout(()=>{

            let link = document.querySelector('.accordion-button.first');
            simulateClick(link);
            
        //}, 500);

        // modal success button
        onClick('.modal .btn-primary', _this.listeners.modalSuccessBtn);

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
    },
    listeners: {

        renderModal: (e) => {

            let i = e.currentTarget.dataset.i;
            let id = e.currentTarget.dataset.id;
            let cid = e.currentTarget.dataset.cid;

            console.log(id);

            // cart sketch
            if(cid){

                document.querySelector(".modal .btn-primary").classList.remove('btn-danger');
                document.querySelector(".modal .btn-primary").innerHTML = __html('Update cart');

                // _this.state.item = _this.state.items[i];

                // console.log(i + " ");

                // console.log(_this.state.cart.cart);
                
                _this.state.item = _this.state.cart.getCart().items[i];
                
            // new sketch
            }else{

                document.querySelector(".modal .btn-primary").classList.add('btn-danger');
                document.querySelector(".modal .btn-primary").innerHTML = __html('Add to cart');

                _this.state.item = _this.state.items.filter(item => { return item._id == id; })[0];
                _this.state.item.qty = 1;

                // console.log(_this.state.item);
                // let cid = e.currentTarget.dataset.cid;
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
            document.querySelector(".price-desc").innerHTML = '\
            <ul class="ms-3 p-0">\
                <li>' + document.querySelector(".qty").value + ' x ' + (eval(price.formula) / 1000000) + ' &#13217; x ' + (coatingPrice) + ' = ' + priceFormat(_this, (parseFloat(document.querySelector(".qty").value) * (eval(price.formula) / 1000000) * coatingPrice)) + '</li>\
                <li>' + document.querySelector(".qty").value + ' x ' + priceFormat(_this, eval(price.formula_price)) + ' = ' + priceFormat(_this, parseFloat(document.querySelector(".qty").value) * eval(price.formula_price)) + '</li>\
            </ul>';
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

            let lang = e.currentTarget.dataset.ln;

            console.log(lang);

            location.reload();

            setCookie("locale", lang);
        },

        modalSuccessBtn: (e) => {
            
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    getPrice: (_this, coatingPrice) => {

        let obj = {};

        obj.formula = _this.state.item.formula;
        obj.formula_price = _this.state.item.formula_price ? _this.state.item.formula_price : '0';

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
        }

        // evaluate final calculations
        obj.price = makeNumber((eval(obj.formula) / 1000000 * coatingPrice)) + makeNumber(eval(obj.formula_price));
        obj.total = obj.price * parseFloat(document.querySelector(".qty").value);

        return obj;
    },
    getMinPrice: (item) => {

        let obj = { COATING: 1 };
        
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

        return priceFormat(_this, obj.total);
    },
    loadColors: (parent) => {

        // console.log(parent);

        let color_options = '', ic = localStorage.getItem('input-color') ? localStorage.getItem('input-color') : "";

        for(let price of _this.state.sk_settings.price){

            if(price.public && price.parent == parent && price.title != "*"){

                color_options += `<option ${ price.title == ic ? "selected":"" } data-price="${ price.price }">${ price.title }</option>`; 
            }
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

        // price from color
        if(el.options[el.selectedIndex]){
            
            document.querySelector(".input-price").dataset.pricem2 = el.options[el.selectedIndex].dataset.price;
            document.querySelector(".input-color").style.background = _this.state.colors[el.options[el.selectedIndex].value].hex_bg;
            document.querySelector(".input-color").style.color = _this.state.colors[el.options[el.selectedIndex].value].hex_text;

        // price from coating only
        }else{

            let el_coating = document.querySelector(".input-coating");
            let coating = el_coating.options[el_coating.selectedIndex];

            // console.log(coating.value);
            // console.log(_this.state.sk_settings.price);
            document.querySelector(".input-price").dataset.pricem2 = _this.state.sk_settings.price.filter(el => { return el.parent == coating.value })[0].price;
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

        // search is empty
        if(search.length == 0){

            // document.querySelector('.accordion').classList.remove('d-none');
            document.querySelector('.clear-search').classList.add('d-none');
            _this.clearActiveTags();

            return;
        }

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
            document.querySelector('.search-title').innerHTML = 'Search results for "'+search+'"';
            document.querySelector('.search-title').classList.remove('d-none');

            onClick('.item', _this.listeners.renderModal);
        }else{

            document.querySelector('.search-title').innerHTML = 'No products found for "'+search+'"';
            document.querySelector('.search-title').classList.remove('d-none');
            document.querySelector('.search-results').classList.add('d-none');
            document.querySelector('.accordion').classList.add('d-none');
        }
    },
    structBlock: (i, item) => {

        return `

        <div class="col item po " data-i="${ attr(i) }" data-id="${ attr(item._id) }">
            <img data-src="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ item._id }-1-500x500.jpeg?${ item.updated }" data-srcset="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ item._id }-1-500x500.jpeg?${ item.updated }" src="/assets/img/placeholder.png" class="card-img-top rounded-3 lazy" alt="${ attr(item.title) }">
            <div class="card-body">
                <h5 class="card-title">
                    <div>${ __html(item.title) } </div>
                    <div class="badge rounded-pill bg-danger fw-bold mt-3" style="font-size: 1.1rem;">
                        <span style="font-size:0.8rem">no</span> ${ _this.getMinPrice(item) }
                    </div>
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
