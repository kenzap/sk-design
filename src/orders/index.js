// js dependencies
import { headers, showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, onKeyUp, spaceID, toast, link, onChange } from '@kenzap/k-cloud';
import { timeConverterAgo, priceFormat, getPageNumber, makeNumber, unescape, mt, printReceipt } from "../_/_helpers.js"
import { preview } from "../_/_order_preview.js"
import { print } from "../_/_order_print.js"
import { HTMLContent } from "../_/_cnt_orders.js"

// where everything happens
const _this = {
  
    state: {
        firstLoad: true,
        firstTouch: true,
        modalCont: null,
        modalOpen: false,
        playSoundNow: false,
        newOrderCount: 0,
        orderIDs: [],
        printLink: null, // storing receipt print pending order 
        orders: [], // where all requested orders are cached
        settings: {}, // where all requested settings are cached
        orderSingle: [], // where single order is stored during preview
        playTitleTimer: null,
        refreshTimer: null,
        statuses: [],
        audio: new Audio('https://kenzap.com/static/swiftly.mp3'),
        limit: 50, // number of records to load per table
        slistLimit: 10, // product suggestion fetch search limit
        productsSuggestions: []
    },
    init: () => {
         
        // load data
        _this.getData();

        // turn on data polling for new orders
        _this.state.refreshTimer = setInterval(() => { _this.getDataNew(); }, 10000);
    },
    getDataNew: () => {

        // do API query
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: headers,
            body: JSON.stringify({
                query: {
                    orders: {
                        type:       'find',
                        key:        'ecommerce-order',
                        fields:     '*',
                        term:       [
                            {
                                type: "string",
                                field: "status",
                                relation: "=",
                                value: "new",
                            },
                            {
                                type: "string",
                                field: "status",
                                relation: "=",
                                value: "paid",
                            }
                        ],
                        limit:      1,
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            if(response.success){

                if(response.orders.length){ console.log(response.orders); _this.getData(); }

            }else{

                // parseApiError(response);
            }
        })
        .catch(error => { // parseApiError(error); 
        });

    },
    getData: () => {

        // show loader during first load
        if (_this.state.firstLoad) showLoader();

        // check if any print pending receipts
        if (_this.state.printLink){ window.location.href = _this.state.printLink; _this.state.printLink = null; }

        // search content
        let s = document.querySelector('.search-input') ? document.querySelector('.search-input').value : '';

        // search term 
        let term = document.querySelector('#order-status') ? document.querySelector('#order-status').dataset.value: '';
        
        // do API query
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: headers,
            body: JSON.stringify({
                query: {
                    user: {
                        type:       'authenticate',
                        fields:     ['avatar'],
                        token:      getCookie('kenzap_token')
                    },
                    locale: {
                        type:       'locale',
                        source:      ['extension'],
                        key:         'ecommerce',
                    },
                    orders: {
                        type:       'find',
                        key:        'ecommerce-order',
                        fields:     '*',
                        term:       term != '' ? 'status=\'' + term +'\'' : '',
                        limit:      _this.state.limit,
                        search:     {                                                           // if s is empty search query is ignored
                            field: 'from',
                            s: s
                        },
                        sortby:     {
                            field: 'created',
                            order: 'DESC'
                        }
                    },
                    settings: {
                        type:       'get',
                        key:        'ecommerce-settings',
                        fields:     ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display', 'receipt_template'],
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if(response.success){
                
                // init header
                initHeader(response);

                // get core html content 
                _this.loadPageStructure();  

                // render table
                _this.renderPage(response);

                // bind content listeners
                _this.initListeners();
            
                // initiate footer
                _this.initFooter();

                // first load
                _this.state.firstLoad = false;

            }else{

                parseApiError(response);
            }
        })
        .catch(error => { parseApiError(error); });
    },
    authUser: (response) => {

        if(response.user){
            
            if(response.user.success == true){

                
            }
        }
    },
    loadPageStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    renderPage: (response) => {

        if(_this.state.firstLoad){

            // initiate breadcrumbs
            initBreadcrumbs(
                [
                    { link: link('https://dashboard.kenzap.cloud'), text: __('Dashboard') },
                    { link: link('/'), text: __('E-commerce') },
                    { text: __('Orders') }
                ]
            );

            // initialize statuses
            _this.state.statuses = {
                'new': { 
                    text: __('New'),
                    class: 'btn-warning text-dark fw-light'
                },
                'paid': { 
                    text: __('Paid'),
                    class: 'btn-primary fw-light'
                },
                'processing': { 
                    text: __('Processing'),
                    class: 'btn-primary fw-light'
                },
                'completed': { 
                    text: __('Completed'),
                    class: 'btn-success fw-light'
                },
                'canceled': { 
                    text: __('Canceled'),
                    class: 'btn-secondary fw-light'
                },
                'failed': { 
                    text: __('Failed'),
                    class: 'btn-danger fw-light'
                },
                'refunded': { 
                    text: __('Refunded'),
                    class: 'btn-danger fw-light'
                }
            };
        }

        // cache orders globally
        _this.state.orders = response.orders;
        
        // cache settings globally
        _this.state.settings = response.settings;

        // no orders in the list
        if (response.orders.length == 0) {

            document.querySelector(".table tbody").innerHTML = `<tr><td colspan="5">${ __("No orders to display.") }</td></tr>`;
            return;
        }

        // generate website table
        let orderIDsTemp = [];
        _this.state.newOrderCount = [];

        let list = '', count_new = 0;
        for (let i in response.orders){

            let img = 'https://cdn.kenzap.com/loading.png';
            orderIDsTemp.push(response.orders[i]._id);

            if(typeof(response.orders[i].status) === 'undefined') response.orders[i].status = 'new';

            if(response.orders[i].status == 'new') count_new ++;
            // if(typeof(response.products[i].img) === 'undefined') response.products[i].img = [];
            // // if(typeof(response.products[i].img) !== 'undefined' && response.products[i].img[0] == 'true') img = 'https://preview.kenzap.cloud/S1000452/_site/images/product-'+response.products[i].id+'-1-100x100.jpeg?1630925420';
            // if(response.products[i].img[0]) img = CDN + '/S'+sid+'/product-'+response.products[i]._id+'-1-100x100.jpeg?'+response.products[i].updated;
                
            let applink = {"print":"[C]<u><font size=\"big\">ORDER{{order_id_short}}</font></u>\n[C]Fu Zhen Seafood\n[C]<u type=double>{{date_time}}</u>\n[C]\n[C]================================\" \n[L]\n[L]<b>BEAUTIFUL SHIRT</b>[R]9.99€\n[L]  + Size : S\n[L]\n[L]<b>AWESOME HAT</b>[R]24.99€\n[L]  + Size : 57/58\n[L]\n[C]--------------------------------\n[R]TOTAL PRICE :[R]34.98€\n[R]TAX :[R]4.23€"};
            let classN = ((_this.state.orderIDs.includes(response.orders[i]._id) || _this.state.firstLoad)?'':'new');
            list += `
            <tr class="${ classN }">
              <td class="details">
                <div class="ps-1 view-order" data-id="${ response.orders[i]._id }" data-index="${ i }">
                  <b class="">${ (response.orders[i].id) }</b> ${ response.orders[i].from }
                  <div class=" elipsized fst-italic">${ response.orders[i].note ? response.orders[i].note : "" }</div>
                  <div class=" d-sm-none"> <span class="me-2">${ _this.getStatus(response.orders[i].status) }</span> <span class="text-muted">${ timeConverterAgo(__, response.meta.time, response.orders[i].created) }</span> </div>
                </div>
              </td>
              <td class="d-none d-sm-table-cell">
                <span class="fs-12">${ _this.getStatus(response.orders[i].status) }</span>
              </td>
              <td>
                <span style="font-size:18px;">${ priceFormat(_this, response.orders[i].total) }</span>
              </td>
              <td class="d-none d-sm-table-cell">
                <span style="font-size:18px;">${ timeConverterAgo(__, response.meta.time, response.orders[i].created) }</span>
              </td>
              <td class="last">
                <a href="#" data-id="${ response.orders[i]._id }" data-index="${ i }" class="view-order text-success d-none me-4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                </svg></a>
                <a href="kenzapprint://kenzapprint.app?data=${ encodeURIComponent(JSON.stringify(applink)) }" data-id="${ response.orders[i]._id }" data-index="${ i }" class="print-order-dis d-none text-success me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-printer me-2" viewBox="0 0 16 16">
                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
                </svg></a>
                <a href="#" data-id="${ response.orders[i]._id }" data-index="${ i }" class="remove-order text-danger me-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg></a>
              </td>
            </tr>`;
        }
        
        _this.state.playSoundNow = count_new > 0 ? true : false;

        // if(_this.state.playSoundNow) _this.playSound();
        // if(_this.state.newOrderCount>0) _this.playTitle('('+_this.state.newOrderCount+') new orders.');

        // _this.state.firstLoad = false;
        _this.state.orderIDs = orderIDsTemp;

        // provide result to the page
        document.querySelector(".table tbody").innerHTML = list;
    },
    // parse visual page status
    getStatus: (status) => {
    
        return `<div class="badge ${ _this.state.statuses[status].class }">${ _this.state.statuses[status].text }</div>`;
    },
    // play notification sound. Ex.: when new order received
    playSound: () => {
 
        
        // var audiosWeWantToUnlock = [];
        // audiosWeWantToUnlock.push(new Audio('https://kenzap.com/static/swiftly.mp3'))
       
        //where earlier you did:var audiosWeWantToUnlock = []audiosWeWantToUnlock.push(new Audio('mySoundEffect.wav'))audiosWeWantToUnlock.push(new Audio('myOtherSoundEffect.wav'))

        console.log('playSound');

        // const audio = new Audio("https://kenzap.com/static/swiftly.mp3");
        _this.state.audio.play();

    },
    playTitle: (msg) => {

        // if(_this.state.playTitleTimer) clearInterval(_this.state.playTitleTimer);
        // _this.state.playTitleTimer = setInterval(() => { if(_this.state.playSoundNow) _this.playSound(); }, 6500);

        // if(_this.state.playTitleTimer) clearInterval(_this.state.playTitleTimer);
        // if(_this.state.playTitleTimer2) clearInterval(_this.state.playTitleTimer2);
    
        // _this.state.playTitleTimer = setInterval(() => { document.title = "Orders - Kenzap Cloud"; }, 1000);
        // _this.state.playTitleTimer2 = setInterval(() => {  document.title = msg; }, 2050);    
    },
    initListeners: () => {

        // view order
        preview.viewOrder(_this);
        
        // remove order
        onClick('.remove-order', _this.listeners.removeOrder);

        // print order
        print.viewOrder(_this);
        // onClick('.print-order', _this.listeners.printOrder);

        // table status change listener
        onClick('.st-table li a', _this.listeners.changeStatus);

        // break here if initListeners is called more than once
        if(!_this.state.firstLoad) return;

        // add new order listener
        preview.newOrder(_this);

        // modal success button
        onClick('.modal .btn-primary', _this.listeners.modalSuccessBtn);
        
        // search orders
        onKeyUp('.search-input', _this.listeners.searchOrders);
        // add product modal
        // onClick('.btn-save', _this.saveSettings);
        
        document.body.addEventListener('touchstart', function() {

            if(_this.state.firstTouch){

                _this.state.audio.play();
                _this.state.audio.pause();
                _this.state.audio.currentTime = 0
                _this.state.firstTouch = false;
            }else{

                // _this.playTitle();
                if(_this.state.playTitleTimer) clearInterval(_this.state.playTitleTimer);
                _this.state.playTitleTimer = setInterval(() => { if(_this.state.playSoundNow) _this.playSound(); }, 6500);
            }

        }, false);

        // android back pressed
        window.addEventListener("hashchange", function(e) {

            // close modal if still openned
            // if(window.location.href.indexOf("#editing")==-1) { e.preventDefault(); if(_this.modalCont){ _this.modalCont.hide(); } return false; }
            if(_this.modalCont){ e.preventDefault(); _this.modalOpen = false; _this.modalCont.hide(); return false; }
		});
    },
    listeners: {

        newOrder: (e) => {


        },
        changeStatus: (e) => {

            e.preventDefault();

            // console.log(e.currentTarget.dataset.key);

            let os = document.querySelector('#order-status');
            if(e.currentTarget.dataset.key == ""){
                os.innerHTML = __('All')
                os.dataset.value = '';
            }else{
                os.innerHTML = _this.state.statuses[e.currentTarget.dataset.key].text;
                os.dataset.value = e.currentTarget.dataset.key;
            }

            let list = [];

            // clear previous classes
            Object.keys(_this.state.statuses).forEach((key) => {
                list = _this.state.statuses[key].class.split(' ');
                list.forEach((key) => { 
                    os.classList.remove(key);
                });    
            });

            // add new classes
            if(e.currentTarget.dataset.key==''){
                
                os.classList.add('btn-primary');
            }else{
                list = _this.state.statuses[e.currentTarget.dataset.key].class.split(' ');
                list.forEach((key) => { 
                    os.classList.add(key);
                });
            }

            // reload table
            _this.getData();
        },
        removeOrder: (e) => {

            e.preventDefault();

            let c = confirm( __('Completely remove this order?') );

            if(!c) return;
  
            // send data
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: headers,
                body: JSON.stringify({
                    query: {
                        product: {
                            type:       'delete',
                            key:        'ecommerce-order',   
                            id:         e.currentTarget.dataset.id,  
                            sid:        spaceID(),
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    // _this.modalCont.hide();

                    _this.getData();

                }else{

                
                    parseApiError(response);
                }
            })
            .catch(error => {
                parseApiError(error);
            });
        },
        // printOrder: (e) => {


        // },
        searchOrders: (e) => {

            e.preventDefault();

            // _this.playSound();

            _this.getData();

            // console.log('search products ' +e.currentTarget.value);
        },
        
        modalSuccessBtn: (e) => {
            
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    
    updateOrder: (i, id) => {

        let modal = document.querySelector(".modal");
        if(modal.querySelector(".btn-confirm").dataset.loading === 'true') return;

        modal.querySelector(".btn-confirm").dataset.loading = true;
        modal.querySelector(".btn-confirm").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');

        let data = {};

        // iterate through all fields
        for(let s of document.querySelectorAll('.order-form')){

            switch(s.dataset.type){
          
                // case 'html': data[s.dataset.id] = s.innerHTML; break;
                case 'key': 
                    data[s.dataset.id] = s.dataset.value; 
                    break;
                case 'key-number': 
                    data[s.dataset.id] = makeNumber(s.dataset.value); 
                    break;
                case 'items':   

                    // data['items'] = {};
                    data['items'] = [];
                    for(let item of document.querySelectorAll('.order-item-row-active')){

                        let vars = JSON.parse(unescape(item.dataset.vars));
                        // data['items'][item.dataset.id] =
                        data['items'].push(
                            {
                                "id": item.dataset.id,
                                "qty": parseInt(item.querySelector('.item-qty').dataset.value),
                                "note": item.querySelector('.item-note').innerHTML,
                                "type": "new",
                                "index": "0",
                                "price": parseFloat(item.querySelector('.item-total').dataset.price),
                                "sdesc": item.querySelector('.item-title').dataset.sdesc,
                                "title": item.querySelector('.item-title').dataset.value,
                                // "priceF": parseFloat(item.querySelector('.item-total').dataset.value),
                                "total": parseFloat(item.querySelector('.item-total').dataset.value),
                                "variations": id == 'new' ? [] : vars ? vars : [],
                            }
                        );
                    }
                    
                break
                case 'text':   
                    data[s.dataset.id] = s.innerHTML;
                    break;
                case 'email':  
                case 'emails':  
                case 'select':
                case 'textarea': 
                    data[s.id] = s.value; 
                    break;
                case 'radio': 
                    data[s.id] = s.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('input:checked').value; 
                    break;
            }
        }


        // we use this data to generate analytical reports
        let dateObj = new Date();
        data['created_ymd'] = dateObj.getUTCFullYear() + '' + mt(dateObj.getUTCMonth() + 1) + '' + mt(dateObj.getUTCDate());
        data['created_ym'] = dateObj.getUTCFullYear() + '' + mt(dateObj.getUTCMonth() + 1);
        data['created_y'] = dateObj.getUTCFullYear() + '';

        // console.log(data);

        // create new order
        if(id == 'new'){

            // additional required fields
            data['name'] = data['from'];
            data['customer'] = {
                "first_name": data['from'],
                "last_name": "",
                "kid": 0,
            };
            
            // get last order ID number
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: headers,
                body: JSON.stringify({
                    query: {
                        settings: {
                            type:       'get',
                            key:        'ecommerce-settings',
                            fields:     ['last_order_id'],
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    data['id'] = makeNumber(response.settings.last_order_id) + 1;

                    // console.log("number: " + data['id']);

                    // create new order
                    fetch('https://api-v1.kenzap.cloud/', {
                        method: 'post',
                        headers: headers,
                        body: JSON.stringify({
                            query: {
                                order: {
                                    type:       'create',
                                    key:        'ecommerce-order',        
                                    sid:        spaceID(),
                                    data:       data
                                }
                            }
                        })
                    })
                    .then(response => response.json())
                    .then(response => {

                        if (response.success){

                            _this.modalCont.hide();

                            toast( __('Order created') );

                            if(_this.state.printLink) _this.state.printLink = printReceipt(_this, data);

                            _this.getData();

                        }else{ parseApiError(response); }
                    })
                    .catch(error => { parseApiError(error); });

                    // save next assigned number
                    fetch('https://api-v1.kenzap.cloud/', {
                        method: 'post',
                        headers: headers,
                        body: JSON.stringify({
                            query: {
                                settings: {
                                    type:       'set',
                                    key:        'ecommerce-settings',        
                                    sid:        spaceID(),
                                    data:       {
                                        last_order_id: data['id']
                                    }
                                }
                            }
                        })
                    })
                    .then(response => response.json())
                    .then(response => { if (!response.success){ parseApiError(response); } })
                    .catch(error => {  parseApiError(error); });   
                
                }else{ parseApiError(response); }
            })
            .catch(error => { parseApiError(error); });

        // update existing order
        }else{

            // send data
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: headers,
                body: JSON.stringify({
                    query: {
                        order: {
                            type:       'update',
                            key:        'ecommerce-order',        
                            sid:        spaceID(),
                            id:         id,
                            data:       data
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    _this.modalCont.hide();

                    toast( __('Order updated') );

                    if(_this.state.printLink) _this.state.printLink = printReceipt(_this, data);
                    
                    _this.getData();

                }else{

                    parseApiError(response);
                }
            })
            .catch(error => {
                parseApiError(error);
            });
        }
    },
    initFooter: () => {
        
        initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/ecommerce" target="_blank">', '</a>'), '');
        // initFooter(__('Copyright © %1$ %2$ Kenzap%3$. All rights reserved.', new Date().getFullYear(), '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();