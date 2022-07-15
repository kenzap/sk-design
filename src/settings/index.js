// js dependencies
import { headers, showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, onKeyUp, simulateClick, toast, link } from '@kenzap/k-cloud';
import { getCurrencies, onlyNumbers, priceFormat } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_settings.js"

// where everything happens
const _this = {
   
    state:{
        firstLoad: true,
        response: null,
        settings: null,
        limit: 10, // number of records to load per table
    },
    init: () => {
         
        _this.getData();
    },
    getData: () => {

        // show loader during first load
        if (_this.state.firstLoad) showLoader();

        // search content
        let s = document.querySelector('.search-cont input') ? document.querySelector('.search-cont input').value : '';

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
                        key:         'sk',
                    },
                    settings: {
                        type:       'get',
                        key:        'sk-settings',
                        fields:     '*',
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if(response.success){

                _this.state.settings = response.settings;

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

        _this.state.response = response;

        if(_this.state.firstLoad){

            // initiate breadcrumbs
            initBreadcrumbs(
                [
                    { link: link('https://dashboard.kenzap.cloud'), text: __('Dashboard') },
                    { link: link('/'), text: __('SK Design') },
                    { text: __('Settings') }
                ]
            );
        }

        // console.log(_this.state.response.settings.price);

        // setup coatings and prices
        let price = [];
        let parent_options = '<option value="">'+__('None')+'</option>';
        if(_this.state.response.settings.price) price = _this.state.response.settings.price;

        // sort by 
        

        if(Array.isArray(price)){

            // pricing row parent
            price.forEach((price, i) => {

                if(!price.parent){

                    document.querySelector('.price-table > tbody').insertAdjacentHTML("beforeend", _this.structCoatingRow(price, i));
                    // parent_options += '<option value="'+price.id+'">'+price.title+'</option>';
                }
            });
            
            // pricing row
            price.forEach((price, i) => {

                if(price.parent){

                    // console.log('.price-table > tbody [data-parent="'+price.parent+'"]');
                    if(document.querySelector('.price-table > tbody [data-parent="'+price.parent+'"]')) { 
                        document.querySelector('.price-table > tbody [data-parent="'+price.parent+'"]:last-child').insertAdjacentHTML("afterend", _this.structCoatingRow(price, i));
                    }else{
                        document.querySelector('.price-table > tbody').insertAdjacentHTML("beforeend", _this.structCoatingRow(price, i));
                    }
                }
            });

            // console.log(price.parent);
            // document.querySelector('.price-table > tbody pr-'+price.parent).insertAdjacentHTML("afterend", _this.structCoatingRow(price, i));
            // }else{

                                
        }else{
            price = [];
            document.querySelector('#price').value = '[]';
        }
        
        // setup currencies
        let coptions = '<option value="">'+__('Choose currency')+'</option>';
        for (let c of getCurrencies()){

            coptions += `<option value="${ c.code }">${ __(c.name) } (${ __(c.code) })</option>`;
        }
        document.querySelector("#currency").innerHTML = coptions;

        // populate fields
        for (let field in response.settings){

            if(typeof(response.settings[field]) === "undefined") continue;
            if(response.settings[field] == "") continue;
            if(document.querySelector("[name='"+field+"']")) switch(document.querySelector("[name='"+field+"']").dataset.type){
        
                case 'text':   
                case 'email':  
                case 'emails':  
                case 'select':
                case 'textarea': document.querySelector("#"+field).value = response.settings[field]; break;
                case 'checkbox': document.querySelector("#"+field).checked = response.settings[field] == "1" ? true : false; break;
                case 'radio': document.querySelector("[name='"+field+"'][value='"+response.settings[field]+"']").checked = true; break;
            }
        }

        // pricing parent options
        console.log(document.querySelector('#var_parent').value);
        document.querySelector('#var_parent').value.split('\n').forEach(el => {

            parent_options += '<option value="'+el+'">'+el+'</option>';
        });
        document.querySelector('.price-parent').innerHTML = parent_options;

        // add price listener
        onClick('.remove-price', _this.listeners.removePrice);
        
        // only nums for price
        onlyNumbers(".price-price", [8, 46]);

        // update price
        onKeyUp('.price-price', _this.listeners.updatePrice);
        
        // price public
        onClick('.price-public', _this.listeners.publicPrice);

        // cache prices
        document.querySelector('#price').value = JSON.stringify(price);
    },
    initListeners: () => {

        // break here if initListeners is called more than once
        if(!_this.state.firstLoad) return;

        // add product modal
        onClick('.btn-save', _this.saveSettings);
        
        // add price listener
        onClick('.add-price', _this.listeners.addPrice);

        // remove price listener
        // onClick('.remove-price', _this.listeners.removePrice);
    },
    listeners: {

        addPrice: (e) => {

            let obj = {}

            obj.id = document.querySelector('.price-id').value; document.querySelector('.price-id').value = '';
            obj.title = document.querySelector('.price-title').value; document.querySelector('.price-title').value = '';
            obj.parent = document.querySelector('.price-parent').value; document.querySelector('.price-parent').value = '';
            obj.price = document.querySelector('.price-price').value; document.querySelector('.price-price').value = '';
            obj.unit = document.querySelector('.price-unit').value; document.querySelector('.price-unit').value = '';

            if(obj.title.length < 1 || obj.price.length < 1) return false;

            // console.log(obj);

            let prices = document.querySelector('#price').value;

            console.log(prices);

            if(prices){ prices = JSON.parse(prices); }else{ prices = []; }
            if(Array.isArray(prices)){ prices.push(obj); }else{ prices = []; }
            document.querySelector('#price').value = JSON.stringify(prices);

            if(document.querySelector('.price-table > tbody [data-parent="'+obj.parent+'"]:last-child')){ 
                document.querySelector('.price-table > tbody [data-parent="'+obj.parent+'"]:last-child').insertAdjacentHTML("afterend", _this.structCoatingRow(obj, prices.length-1));
            }else{
                document.querySelector('.price-table').insertAdjacentHTML("beforeend", _this.structCoatingRow(obj, prices.length-1));
            }

            // add price listener
            onClick('.remove-price', _this.listeners.removePrice);

            // only nums for price
            onlyNumbers(".price-price", [8, 46]);

            // update price
            onKeyUp('.price-price', _this.listeners.updatePrice);

            // price public
            onClick('.price-public', _this.listeners.publicPrice);
        },

        removePrice: (e) => {

            e.preventDefault();

            let c = confirm( __('Remove this record?') );

            if(!c) return;

            let i = e.currentTarget.dataset.i;

            let prices = JSON.parse(document.querySelector('#price').value);

            prices.splice(i, 1);

            document.querySelector('#price').value = JSON.stringify(prices);

            e.currentTarget.parentElement.parentElement.remove();

        },

        updatePrice: (e) => {

            e.preventDefault();

            let i = e.currentTarget.dataset.i;

            if(!i) return;

            let prices = JSON.parse(document.querySelector('#price').value);

            prices[i].price = e.currentTarget.value;

            document.querySelector('#price').value = JSON.stringify(prices);

            // console.log(e.currentTarget.value);
        },

        publicPrice: (e) => {

            // e.preventDefault();

            let i = e.currentTarget.dataset.i;

            let prices = JSON.parse(document.querySelector('#price').value);

            // console.log(i);

            prices[i].public = e.currentTarget.checked ? true : false;

            // prices[i].public = e.currentTarget.value;

            document.querySelector('#price').value = JSON.stringify(prices);

        },

        removeProduct: (e) => {

            e.preventDefault();

            let c = confirm( __('Completely remove this product?') );

            if(!c) return;
  
            // send data
            fetch('https://api-v1.kenzap.cloud/', {
                method: 'post',
                headers: headers,
                body: JSON.stringify({
                    query: {
                        product: {
                            type:       'delete',
                            key:        'product',   
                            id:         e.currentTarget.dataset.id, 
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    // modalCont.hide();

                    _this.getData();

                }else{

                    parseApiError(response);
                }
                
            })
            .catch(error => { parseApiError(error); });
        },
 
        searchProductsActivate: (e) => {

            e.preventDefault();

            document.querySelector('.table-p-list thead tr th:nth-child(2) span').style.display = 'none';
            document.querySelector('.table-p-list thead tr th:nth-child(2) .search-cont').style.display = 'flex';
            document.querySelector('.table-p-list thead tr th:nth-child(2) .search-cont input').focus();

            // search products
            onKeyUp('.table-p-list thead tr th:nth-child(2) .search-cont input', _this.listeners.searchProducts);
        },
 
        searchProducts: (e) => {

            e.preventDefault();

            _this.getData();

            // console.log('search products ' +e.currentTarget.value);
        },

        modalSuccessBtn: (e) => {
            
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    saveSettings: (e) => {

        e.preventDefault();

        let data = {};

        // iterate through all fields
        for(let s of document.querySelectorAll('.inp')){

            switch(s.dataset.type){
          
                case 'text':   
                case 'email':  
                case 'emails':  
                case 'select':
                case 'textarea': data[s.id] = s.value; break;
                case 'checkbox': data[s.id] = s.checked ? s.value : ""; break;
                case 'radio': data[s.name] = s.parentElement.parentElement.parentElement.parentElement.querySelector('input:checked').value; break;
            }
        }

        // console.log(data['price']);

        // normalize price array
        if(data['price']) data['price'] = JSON.parse(data['price']);

        // do not save last_order_id if it was unchanged. Avoids conflicts.
        if(_this.state.response.settings.last_order_id == data.last_order_id){

            delete data.last_order_id;
        }
        
        // console.log(data);

        // send data
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: headers,
            body: JSON.stringify({
                query: {
                    settings: {
                        type:       'set',
                        key:        'sk-settings',       
                        data:       data
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            if (response.success){

                toast('Changes applied');

                // modalCont.hide();
                // _this.getData();
                // open product editing page
                // window.location.href = `/product-edit/?id=${ response.product.id}`

            }else{

                parseApiError(response);
            }
            
        })
        .catch(error => { parseApiError(error); });
    },
    structCoatingRow: (obj, i) => {

        return `
        <tr class="new-item-row ${ obj.parent ? "pr-parent" : "" }" data-parent="${ obj.parent ? obj.parent : "" }" data-title="${ obj.title }">
            <td style="max-width:25px;">
                <input class="form-check-input price-public" type="checkbox" value="" data-i="${i}" ${ obj.public ? 'checked' : "" } >
            </td>
            <td class="tp">
                <div class="me-1 me-sm-3 my-1 ">
                    ${ obj.id }
                </div>
            </td>
            <td>
                <div class="me-1 me-sm-3 my-1">
                    ${ obj.parent ? obj.parent : "" }
                </div>
            </td>
            <td>
                <div class="me-1 me-sm-3 my-1">
                    ${ obj.title }
                </div>
            </td>
            <td class="price">
                <div class="me-1 me-sm-3 my-1" >
                    <input type="text" autocomplete="off" class="form-control form-control-sm text-right price-price" style="max-width:80px;" data-i="${ i }" value="${ obj.price }">
                    <span class="d-none"> ${ priceFormat(_this, obj.price) } </span>
                </div>
            </td>
            <td class="price">
                <div class="me-1 me-sm-3 my-1">
                    ${ obj.unit }
                </div>
            </td>
            <td class="align-middle text-center pt-2"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" class="remove-price bi bi-x-circle po" data-i="${ i}" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                </svg>
            </td>
        </tr>`;

    },
    initFooter: () => {
        
        initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/sk-design" target="_blank">', '</a>'), '');
        // initFooter(__('Copyright © %1$ %2$ Kenzap%3$. All rights reserved.', new Date().getFullYear(), '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();