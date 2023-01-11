// js dependencies
import { headers, showLoader, hideLoader, parseApiError, getCookie, onClick, onChange, onKeyUp, simulateClick, spaceID, toast, link, __, __html } from '@kenzap/k-cloud';
import { getProductId, escape, unescape, onlyNumbers, priceFormat, degToRad } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_product_edit_sk_design.js"
import { Polyline, Arc } from "../_/_2d.js"

const CDN = 'https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/';

// where everything happens
const _this = {

    init: () => {
        
        _this.getData(); 
    },
    state: {
        ajaxQueue: 0,
        settings: {}, // where all requested settings are cached
        sk_settings: {}, // where all requested settings are cached
        firstLoad: true,
        product: { input_fields: [] },
        sketch: { mode: 'preview', type: '', mousedown: false, last: { id: null }, angle: false }
    },
    getData: () => {

        let id = getProductId();
        let sid = spaceID();

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
                    product: {
                        type:       'find',
                        key:        'ecommerce-product',
                        id:         id,   
                        fields:     ['_id', 'id', 'test', 'modelling', 'tax_id', 'input_fields', 'formula', 'formula_price', 'formula_width', 'formula_length', 'calc_price', 'var_price', 'parts', 'updated']
                    },
                    settings: {
                        type:       'get',
                        key:        'ecommerce-settings',
                        fields:     ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display'],
                    },
                    sk_settings: {
                        type:       'get',
                        key:        'sk-settings',
                        fields:     ['var_parent', 'price'],
                    },
                    locale: {
                        type:       'locale',
                        source:      ['extension'],
                        key:         'sk-design',
                    }
                }
            }) 
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if (!response.success){ parseApiError(response); return; }

            if (response.success){

                _this.state.settings = response.settings;
                _this.state.sk_settings = response.sk_settings;
                _this.state.product = response.product;

                // check product response
                if (response.product.length == 0) { return; }

                // get core html content 
                document.querySelector('#contents').insertAdjacentHTML('beforeend', HTMLContent()); // innerHTML = HTMLContent(__);

                // load images if any
                _this.loadDrawing(response.product);

                // bind frontend data
                _this.renderPage(response.product);

                // init page listeners
                _this.initListeners();
            }
        })
        .catch(error => { parseApiError(error); });
    },
    renderPage: (product) => {

        let d = document;

        _this.state.sketch.mode = 'drawing';

        // console.log(product);

        // return;

        // input fields
        if(product.input_fields){
            
            simulateClick(document.querySelector('#editing')); 

            product.input_fields.forEach(obj => {

                let html = _this.structInputRow(obj);

                if(!document.querySelector('#field'+obj.id)) document.querySelector('.input-fields').insertAdjacentHTML('beforeend', html);
                
                if(!document.querySelector('#svg g[data-id="' + obj.id+ '"]')){

                    switch(obj.type){

                        case 'polyline':

                            let points_arr = obj.points.split(' ');
                            _this.state.sketch.polyline = new Polyline({ points: [{x: points_arr[0], y: points_arr[1] }], mode: 'drawing', id: obj.id });
                            _this.state.sketch.polyline.setCoords({ points: [{x: points_arr[2], y: points_arr[3] }], mode: 'drawing' });
                            _this.state.sketch.polyline.setEndCoords({ points: [{x: points_arr[2], y: points_arr[3] }], mode: 'drawing' });
                        break;
                        case 'arc':

                            // console.log(obj);

                            obj.params = typeof(obj.params) == 'string' ? {} : obj.params;

                            // obj.params = JSON.parse(unescape(obj.params)); 
                          
                            _this.state.sketch.arc = new Arc({ params: { x: obj.params.x, y: obj.params.y, radius: obj.params.radius, startAngle: obj.params.startAngle, endAngle: obj.params.endAngle }, mode: 'drawing', id: obj.id });
                        break;
                    }
                }
            });

            _this.refreshFields();
        }

        _this.listeners.inputFieldListeners();

        _this.state.sketch.polyline = null;

        // calculate prce
        d.querySelector("#calc_price").value = product.calc_price ? product.calc_price : 'default';

        // formula
        d.querySelector("#formula").value = product.formula;
        d.querySelector("#formula_price").value = product.formula_price;
        d.querySelector("#formula_width").value = product.formula_width;
        d.querySelector("#formula_length").value = product.formula_length;

        // variable prices
        d.querySelector("#price").value = JSON.stringify(product.var_price ? product.var_price : []);

        // modelling mode
        d.querySelector("#modelling").checked = product.modelling == 1 ? true : false;
        d.querySelector("#tax_id").value = product.tax_id;

        // price container visibility
        _this.listeners.priceContVisibility();

        // validate formula
        document.querySelector("#formula").addEventListener('keyup', (e) => {

            let formula = e.currentTarget.value;
            let labels = "COATING ";

            // selected coating price
            formula = formula.replaceAll("COATING", 1);

            for(let div of document.querySelectorAll('.input-fields > div')){

                labels += div.querySelector('.field-label').value + " ";
                formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
            }
            labels = labels.trim();

            let result = 0;

            try{
                document.querySelector(".formula-hint").innerHTML = '';
                result = eval(formula);
                document.querySelector("#formula").setCustomValidity("");
            }catch(e){
                document.querySelector("#formula").setCustomValidity( __("Invalid formula") );
                document.querySelector(".formula-hint").innerHTML = __("Invalid formula. Use one of the following letters only: " + labels);
            }

            document.querySelector("#formula").parentElement.classList.add('was-validated');
            
            if(result>0) document.querySelector(".formula-hint").innerHTML = __("Result: <b>" + result / 1000000 + " ㎡</b> based on the input fields default values", result);
        });

        // validate formula price
        document.querySelector("#formula_price").addEventListener('keyup', (e) => {

            let formula = e.currentTarget.value;
            let labels = "COATING ";

            // selected coating price
            formula = formula.replaceAll("COATING", 1);

            for(let price of _this.state.sk_settings.price){

                if(price.id.length == 0) continue;

                labels += price.id + " ";
                formula = formula.replaceAll(price.id, parseFloat(price.price));
            }

            for(let div of document.querySelectorAll('.input-fields > div')){

                labels += div.querySelector('.field-label').value + " ";
                formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
            }
        
            // console.log(formula);

            labels = labels.trim();

            let result = 0;

            try{
                document.querySelector(".formula_price-hint").innerHTML = '';
                result = eval(formula);
                document.querySelector("#formula_price").setCustomValidity("");
            }catch(e){
                document.querySelector("#formula_price").setCustomValidity( __("Invalid price formula") );
                document.querySelector(".formula_price-hint").innerHTML = __("Invalid price formula. Use one of the following letters only: " + labels);
            }

            document.querySelector("#formula_price").parentElement.classList.add('was-validated');
            
            if(result>0) document.querySelector(".formula_price-hint").innerHTML = __("Result: <b>" + priceFormat(_this, result) + "</b> based on the input fields default values", result);
        });

        // validate formula width
        document.querySelector("#formula_width").addEventListener('keyup', (e) => {

            let formula = e.currentTarget.value;
            let labels = " ";
            
            for(let div of document.querySelectorAll('.input-fields > div')){

                labels += div.querySelector('.field-label').value + " ";
                formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
            }

            labels = labels.trim();

            let result = 0;

            try{
                document.querySelector(".formula_width-hint").innerHTML = '';
                result = eval(formula);
                document.querySelector("#formula_width").setCustomValidity("");
            }catch(e){

                console.log(e);
                document.querySelector("#formula_width").setCustomValidity( __("Invalid width formula") );
                document.querySelector(".formula_width-hint").innerHTML = __("Invalid width formula. Use one of the following letters only: " + labels);
            }

            document.querySelector("#formula_width").parentElement.classList.add('was-validated');
        });

        // validate formula length
        document.querySelector("#formula_length").addEventListener('keyup', (e) => {

            let formula = e.currentTarget.value;
            let labels = " ";
            
            for(let div of document.querySelectorAll('.input-fields > div')){

                labels += div.querySelector('.field-label').value + " ";
                formula = formula.replaceAll(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
            }

            labels = labels.trim();

            let result = 0;

            try{
                document.querySelector(".formula_length-hint").innerHTML = '';
                result = eval(formula);
                document.querySelector("#formula_length").setCustomValidity("");
            }catch(e){

                console.log(e);
                document.querySelector("#formula_length").setCustomValidity( __("Invalid length formula") );
                document.querySelector(".formula_length-hint").innerHTML = __("Invalid length formula. Use one of the following letters only: " + labels);
            }

            document.querySelector("#formula_length").parentElement.classList.add('was-validated');
        });

        // parts   
        if(!product.parts) product.parts = [];
        if(!Array.isArray(product.parts)) product.parts = [];

        product.parts.forEach(part => {

            document.querySelector("#parts").value += part.id + '\n';
        });
    },
    initListeners: () => {

        if(!_this.state.firstLoad) return;

        // product save button
        onClick('.btn-save', _this.listeners.saveProduct);
        
        // modal success button
        onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);

        // price type change
        onChange('#calc_price', _this.listeners.priceChange);

        _this.state.firstLoad = false;
    },
    listeners: {

        priceChange: (e) => {

            e.preventDefault();

            _this.listeners.priceContVisibility();

        },

        priceContVisibility: () => {

            document.querySelector('.formula_cont').classList.add("d-none");
            document.querySelector('.formula_price_cont').classList.add("d-none");
            document.querySelector('.parts_cont').classList.add("d-none");
            document.querySelector('.variable_prices_cont').classList.add("d-none");

            let calc_price = document.querySelector('#calc_price').value;

            if(calc_price=="variable"){

                document.querySelector('.variable_prices_cont').classList.remove("d-none");
            }

            if(calc_price=="formula"){

                document.querySelector('.formula_cont').classList.remove("d-none");
                document.querySelector('.formula_price_cont').classList.remove("d-none");
            }

            if(calc_price=="complex"){

                document.querySelector('.parts_cont').classList.remove("d-none");
            }
        },

        viewVariations: (e) => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-dialog").classList.add('modal-lg');
            modal.querySelector(".modal-title").innerHTML = __html("Variations");
            modal.querySelector(".btn-primary").classList.add("d-none");
            modal.querySelector(".btn-secondary").innerHTML = __html('Close');

            // console.log(_this.state.sk_settings);
 
            let modalHTml = `

                <div class="row">
                    <div class="col-sm-12">
                        <div class="table-responsive">
                            <table class="price-table order-form mb-3">
                                <theader>
                                    <tr><th><div class="me-1 me-sm-3">${ __html('Site') }</div></th><th class="qty"><div class="me-1 me-sm-3">${ __html('Code') }</div></th><th><div class="me-1 me-sm-3">${ __html('Parent') }</div></th><th><div class="me-1 me-sm-3">${ __html('Title') }</div></th><th class="tp"><div class="me-1 me-sm-3">${ __html('Price') }</div></th><th class="tp"><div class="me-1 me-sm-3">${ __html('Unit') }</div></th><th></th></tr>
                                    <tr class="new-item-row">
                                        <td>
            
                                        </td>
                                        <td class="tp">
                                            <div class="me-1 me-sm-3 mt-2">
                                                <input type="text" value="" autocomplete="off" class="form-control price-id" style="max-width:100px;">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="me-1 me-sm-3 mt-2">
                                                <input type="text" value="" autocomplete="off" class="form-control price-parent" style="max-width:120px;">
                                                <select class="form-select price-parent- inp d-none" name="price_parent- " data-type="select">
            
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                        <div class="me-1 me-sm-3 mt-2">
                                            <input type="text" value="" autocomplete="off" placeholder=" " class="form-control price-title" data-id="" data-index="" list="item-suggestions">
                                        </div>
                                        </td>
                                        <td class="price">
                                            <div class="me-1 me-sm-3 mt-2">
                                                <input type="text" value="" autocomplete="off" class="form-control text-right price-price" style="max-width:80px;">
                                            </div>
                                        </td>
                                        <td class="price">
                                            <div class="me-1 me-sm-3 mt-2">
                                            <select class="form-select price-unit inp" name="price_unit" data-type="select">
                                                <option value="unit" selected>${ __html('Unit') }</option>
                                                <option value="length">${ __html('Length') }</option>
                                                <option value="m2">${ __html('㎡') }</option>
                                                <option value="hour">${ __html('Hour') }</option>
                                            </select>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center pt-2"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="24" height="24" class="bi bi-plus-circle text-success align-middle add-price po"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path></svg>
                                        </td>
                                    </tr>
                                </theader>
                                <tbody>`;

                  modalHTml += `</tbody>
                            </table>
                        </div>
                    </div>
                </div>`;

            // add generated HTML code to the modal body 
            modal.querySelector(".modal-body").innerHTML = modalHTml;

            // price variations
            // setup coatings and prices
            let price = JSON.parse(document.querySelector('#price').value), var_parent = [];
            let parent_options = '<option value="">'+__('None')+'</option>';
            if(price.length == 0) price = _this.state.sk_settings.price;
            if(_this.state.sk_settings.var_parent) var_parent = _this.state.sk_settings.var_parent;

            console.log(price);

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
                            document.querySelector('.price-table > tbody [data-parent="'+price.parent+'"]').insertAdjacentHTML("afterend", _this.structCoatingRow(price, i)); // :last-child
                        }else{
                            document.querySelector('.price-table > tbody').insertAdjacentHTML("beforeend", _this.structCoatingRow(price, i));
                        }
                    }
                });
                                    
            }else{
                price = [];
                document.querySelector('#price').value = '[]';
            }

            var_parent.split('\n').forEach(el => {

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

            // add price listener
            onClick('.add-price', _this.listeners.addPrice);

            // success buttton
            // _this.listeners.modalSuccessBtnFunc = (e) => {

            //     e.preventDefault();
            // } 
            
            modalCont.show();

        },

        editBlock: (e) => {

            e.preventDefault();

            let amb = document.querySelector('.add-mix-block');
            amb.dataset.action = 'edit';
            amb.dataset.index = e.currentTarget.dataset.index;
            setTimeout(() => simulateClick(amb), 10);

            console.log('editBlock');
        },

        inputFieldListeners: (e) => {
            
            onClick('.remove-input-field', _this.listeners.removeInputFields);
            onlyNumbers('.field-default', [8, 46]);
            onlyNumbers('.field-min', [8, 46]);
            onlyNumbers('.field-max', [8, 46]);
        },

        removeBlock: (e) => {

            e.preventDefault();

            let c = confirm(__('Remove entire block?'));
            if(c){ 
                e.currentTarget.parentNode.parentNode.remove();
                // e.currentTarget.parentElement.parentElement.remove();
             }

            console.log('removeBlock');
        },

        removeInputFields: (e) => {

            let c = confirm( __('Remove row?') );

            if(!c) return;

            let id = e.currentTarget.dataset.id;
            
            console.log('remove' + id);

            if(document.querySelector('#svg g[data-id="' + id + '"]')) document.querySelector('#svg g[data-id="' + id + '"]').remove();
            if(document.querySelector('.input-fields #field' + id)) document.querySelector('.input-fields #field' + id).remove();
            if(document.querySelector('.svg-input[data-id="' + id + '"]')) document.querySelector('.svg-input[data-id="' + id + '"]').remove();
        },

        // sync select field label update with sketch labels 
        inputFieldChange: (e) => {

            console.log(e.currentTarget.value);

            let id = e.currentTarget.parentElement.parentElement.id.replace('field', '');

            document.querySelector('.svg-input[data-id="' + id + '"] > label').innerHTML = e.currentTarget.value;
        },

        saveProduct: (e) => {
            
            e.preventDefault();

            // running updates cuncurrently causes data loss
            setTimeout(() => {

                let data = {};

                data['input_fields'] = [];

                // iterate through input fields
                for(let div of document.querySelectorAll('.input-fields > div')){

                    let obj = {};

                    obj['id'] = div.id.replace('field','');
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

                data['var_price'] = JSON.parse(document.querySelector('#price').value);
                data['calc_price'] = document.querySelector('#calc_price').value;
                data['formula'] = document.querySelector('#formula').value.trim();
                data['formula_price'] = document.querySelector('#formula_price').value.trim();
                data['formula_width'] = document.querySelector('#formula_width').value.trim();
                data['formula_length'] = document.querySelector('#formula_length').value.trim();
                data['modelling'] = document.querySelector('#modelling').checked ? 1 : 0;
                data['tax_id'] = document.querySelector('#tax_id').value;
                data['parts'] = [];
                
                // console.log(document.querySelector("#parts"));

                document.querySelector("#parts").value.trim().split('\n').forEach(el => {

                    data['parts'].push({id: el});
                }); 
                //  = product.parts.join('\n');

                console.log(data); 
            
                let id = getProductId();
                let sid = spaceID();

                // showLoader();

                // send data
                fetch('https://api-v1.kenzap.cloud/', {
                    method: 'post',
                    headers: headers,
                    body: JSON.stringify({
                        query: {
                            product: {
                                type:       'update',
                                key:        'ecommerce-product',
                                id:         id,         
                                sid:        sid,
                                data:       data
                            }
                        }
                    }) 
                })
                .then(response => response.json())
                .then(response => {

                    if (response.success){

                        // console.log('sk saved');

                        // upload desc images
                        _this.uploadImages();
                        
                    }else{

                        parseApiError(response);
                    }
                })
                .catch(error => { parseApiError(error); });

            }, 1000);
        },

        openImage: (e) => {

            e.preventDefault();

            simulateClick(document.querySelector(".aif-"+e.currentTarget.dataset.index));
        },

        previewImage: (e) => {

            e.preventDefault();

            let input = e.currentTarget;

            if (input.files && input.files[0]) {

                // check image type
                if(input.files[0].type != 'image/jpeg' && input.files[0].type != 'image/jpg' && input.files[0].type != 'image/png'){

                    toast( __("Please provide image in JPEG format") );
                    return;
                }
          
                // check image size
                if(input.files[0].size > 5000000){

                    toast( __("Please provide image less than 5 MB in size!") );
                    return;
                }

                let index = input.dataset.index;
                let reader = new FileReader();
                reader.onload = function(e) {
                  
                    document.querySelector('.images-'+index).setAttribute('src', e.currentTarget.result);
                }
                reader.readAsDataURL(input.files[0]);

                e.currentTarget.parentElement.querySelector('.remove').classList.remove("hd");
            }
        },

        removeImage: (e) => {

            let index = e.currentTarget.parentElement.dataset.index;
            document.querySelector('.aif-' + index).value = '';
            document.querySelector('.images-'+index).setAttribute('src', 'https://account.kenzap.com/images/placeholder.jpg');
            e.currentTarget.classList.add("hd");
        },

        sketchMode: (e) => {

            _this.state.sketch.mode = e.currentTarget.id;

            // console.log('sketchMode'+e.currentTarget.id);

            if(e.currentTarget.id == 'preview'){ document.querySelector("#svg").style.zIndex = '-2'; }else{ document.querySelector("#svg").style.zIndex = '2'; }
            
            document.querySelector(".sketch-cont").dataset.mode = e.currentTarget.id;     
        },

        modalSuccessBtn: (e) => {
            
            console.log('calling modalSuccessBtnFunc');
            _this.listeners.modalSuccessBtnFunc(e);
        },

        stockManagement: (e) => {

            for(let el of document.querySelectorAll('.stock-cont')){
                e.currentTarget.checked ? el.classList.remove('d-none') : el.classList.add('d-none');
                e.currentTarget.value = e.currentTarget.checked ? "1" : "0";
            }
        },

        addPrice: (e) => {

            let obj = {}

            obj.id = document.querySelector('.price-id').value; // document.querySelector('.price-id').value = '';
            obj.title = document.querySelector('.price-title').value; document.querySelector('.price-title').value = '';
            obj.parent = document.querySelector('.price-parent').value; // document.querySelector('.price-parent').value = '';
            obj.price = document.querySelector('.price-price').value; // document.querySelector('.price-price').value = '';
            obj.unit = document.querySelector('.price-unit').value; // document.querySelector('.price-unit').value = '';
            obj.public = true;

            if(obj.title.length < 1 || obj.price.length < 1) return false;

            // console.log(obj);

            let prices = document.querySelector('#price').value;

            // console.log(prices);

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
            // onChange('.price-price', _this.listeners.updatePrice);

            // price public
            onClick('.price-public', _this.listeners.publicPrice);
        },

        removePrice: (e) => {

            e.preventDefault();

            let c = confirm( __('Remove this record?') );

            if(!c) return;

            let hash = e.currentTarget.parentElement.parentElement.dataset.hash;

            let prices = JSON.parse(document.querySelector('#price').value);

            prices = prices.filter((obj) => { return escape(obj.id+obj.title+obj.parent) != hash });

            document.querySelector('#price').value = JSON.stringify(prices);

            e.currentTarget.parentElement.parentElement.remove();

        },

        updatePrice: (e) => {

            e.preventDefault();

            // let i = e.currentTarget.dataset.i;

            let hash = (e.currentTarget.parentElement.parentElement.parentElement.dataset.hash);

            if(!hash) return;

            let prices = JSON.parse(document.querySelector('#price').value);

            prices.forEach((obj, i) => { if(escape(obj.id+obj.title+obj.parent) == hash){ prices[i].price = e.currentTarget.value; } });

            // prices[i].price = e.currentTarget.value;

            console.log(e.currentTarget.value);

            // console.log(prices);

            document.querySelector('#price').value = JSON.stringify(prices);

            // console.log(e.currentTarget.value);
        },

        publicPrice: (e) => {

            // let i = e.currentTarget.dataset.i;
            let hash = (e.currentTarget.parentElement.parentElement.dataset.hash);

            let prices = JSON.parse(document.querySelector('#price').value);

            prices.forEach((obj, i) => { if(escape(obj.id+obj.title+obj.parent) == hash){ prices[i].public = e.currentTarget.checked ? true : false; } });

            // console.log(i);

            // prices[i].public = e.currentTarget.checked ? true : false;

            // prices[i].public = e.currentTarget.value;

            document.querySelector('#price').value = JSON.stringify(prices);

        },

        modalSuccessBtnFunc: null
    },
    // get next available label number
    getNextLabel: (type) => {

        let alphabet_lines = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        let alphabet_angles = ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ"];
        let alphabet;

        // prevent same label being used twice
        for(let label of document.querySelectorAll('.input-fields > div .field-label[data-type="polyline"]')){ alphabet_lines = alphabet_lines.filter(function(el) { return el !== label.value }) }
        for(let label of document.querySelectorAll('.input-fields > div .field-label[data-type="arc"]')){ alphabet_angles = alphabet_angles.filter(function(el) { return el !== label.value }) }
        
        return alphabet = type == "polyline" ? alphabet_lines : alphabet_angles;
    },
    structInputRow: (obj) => {

        // available labels
        let alphabet = _this.getNextLabel(obj.type);

        // labels select
        let options = ''; alphabet.forEach((el) => { options += '<option value="' + el + '" '+(obj.label==el ? 'selected':'')+'>' + el + '</option>'; });

        return`
                <div id="field${ obj.id }" class="d-flex flex-row bd-highlight mb-0" data-type="${ obj.type }" data-points="${ obj.points }" data-params="${ escape(JSON.stringify(obj.params ? obj.params : {})) }">
                    <div class="me-3" >
                        <select class="form-select form-select-sm field-label" style="width:64px" data-type="${ obj.type }" aria-label="Default select example">
                            ${ options }
                        </select>
                        <p class="form-text">${ __('label') }</p>
                    </div>
                    <div class="me-3" >
                        <select class="form-select form-select-sm field-label-pos" style="width:150px" data-type="${ obj.type }" aria-label="Default select example">
                            <option value="botom_right" ${ (obj.label_pos=='botom_right' || !obj.label_pos ? 'selected':'') }>${ __html('Bottom right') }</option>
                            <option value="bottom_left" ${ (obj.label_pos=='bottom_left' ? 'selected':'') }>${ __html('Bottom left') }</option>
                            <option value="top_right" ${ (obj.label_pos=='top_right' ? 'selected':'') }>${ __html('Top right') }</option>
                            <option value="top_left" ${ (obj.label_pos=='top_left' ? 'selected':'') }>${ __html('Top left') }</option>
                            <option value="left" ${ (obj.label_pos=='left' ? 'selected':'') }>${ __html('Left') }</option>
                            <option value="right" ${ (obj.label_pos=='right' ? 'selected':'') }>${ __html('Right') }</option>
                        </select>
                        <p class="form-text">${ __('label position') }</p>
                    </div>
                    <div class="me-3">
                        <input type="text" class="form-control form-control-sm field-default" placeholder="${ __('0') }" value="${ obj.default }"></input>
                        <p class="form-text">${ __('default value') }</p>
                    </div>
                    <div class="me-3">
                        <input type="text" class="form-control form-control-sm field-min" placeholder="${ __('0') }" value="${ obj.min }"></input>
                        <p class="form-text">${ __('min value') }</p>
                    </div>
                    <div class="me-3">
                        <input type="text" class="form-control form-control-sm field-max" placeholder="${ __('1000') }" value="${ obj.max }"></input>
                        <p class="form-text">${ __('max value') }</p>
                    </div>
                    <a href="javascript:void(0);" onclick="javascript:;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" class="remove-input-field bi bi-x-circle mt-1" data-id="${ obj.id }" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                        </svg>
                    </a>
                </div>
            `;
    },
    loadDrawing: (product) => {

        // console.log(product);

        let d = document;
        let id = getProductId();
        let sid = spaceID();
        let t = '';
        for(let i=0;i<1;i++){
     
          let img = 'https://account.kenzap.com/images/placeholder.jpg';
          t+=`
          <div class="p-img-cont sketch-cont float-start" data-mode="preview" style="max-width:100%;">
            <div data-index="sketch${i}" class="pe-3" style="position: relative;">
              <img class="p-img images-sketch${i}" data-index="sketch${i}" src="${img}" style="max-width:500px;max-height:500px;"/>
              <svg id="svg" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;display: block; position: absolute; top: 0; left: 0; z-index: -2;">
                
              </svg>
              <span class="remove po hd" title="${ __('Remove') }">×</span>
              <div class="labels">

              </div>
            </div>
            <input type="file" name="img[]" data-type="search" data-index="sketch${i}" class="sketchfile aif-sketch${i} d-none">
          </div>`;
        }
        
        d.querySelector(".drawing").innerHTML = t;
    
        // new image listener
        onClick('.drawing img', _this.listeners.openImage);

        // new remove listener
        onClick('.drawing .remove', _this.listeners.removeImage);

        // image preview listener
        onChange('.drawing .sketchfile', _this.listeners.previewImage);

        // sketch mode 
        onClick('[name="sketchmode"]', _this.listeners.sketchMode);

        // view variations
        onClick(".btn-view-variations", _this.listeners.viewVariations);

        // line draw listener start
        d.querySelector("#svg").addEventListener('mousedown', function (e) {

            e.preventDefault();

            _this.state.sketch.mousedown = true;
            // console.log("andgle" + _this.state.sketch.requestAngle);
 
            if(_this.state.sketch.mode == 'drawing' && _this.state.sketch.requestAngle){ _this.state.sketch.arc = new Arc({ params: { x: e.offsetX, y: e.offsetY, radius: 25, startAngle: 60, endAngle: 170 }, mode: 'drawing'}); _this.state.sketch.type = "arc"; return; }

            if(_this.state.sketch.mode == 'drawing'){ _this.state.sketch.polyline = new Polyline({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'drawing' }); _this.state.sketch.type = "polyline"; }
            
            if(_this.state.sketch.mode == 'editing' && _this.state.sketch.type == "polyline"){ _this.state.sketch.polyline = new Polyline({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'editing', id: _this.state.sketch.last.id, rect: _this.state.sketch.rect }); _this.state.sketch.type = "polyline"; }
            
            if(_this.state.sketch.mode == 'editing' && _this.state.sketch.type == "arc"){ _this.state.sketch.arc = new Arc({ params: { x: e.offsetX, y: e.offsetY, radius: 25, startAngle: 60, endAngle: 170 }, mode: 'editing', id: _this.state.sketch.last.id, rect: _this.state.sketch.rect }); _this.state.sketch.type = "arc"; }

            // console.log(_this.state.sketch.last.id + "mousedown" + _this.state.sketch.last.id);
            // console.log(e);
        });

        // line draw listener move
        d.querySelector("#svg").addEventListener('mousemove', function (e) {

            e.preventDefault();

            if(_this.state.sketch.polyline && _this.state.sketch.mode == 'drawing' && _this.state.sketch.type == "polyline") _this.state.sketch.polyline.setCoords({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'drawing' });

            if(_this.state.sketch.polyline && _this.state.sketch.mode == 'editing' && _this.state.sketch.type == "polyline") _this.state.sketch.polyline.setCoords({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'editing' });

            if(_this.state.sketch.arc && _this.state.sketch.mode == 'editing' && _this.state.sketch.type == "arc"){ _this.state.sketch.arc = new Arc({ params: { x: e.offsetX, y: e.offsetY, radius: 25, startAngle: 60, endAngle: 170 }, mode: 'editing', id: _this.state.sketch.last.id, rect: _this.state.sketch.rect }); _this.state.sketch.type = "arc"; }

        });

        // line draw listener end
        d.querySelector("#svg").addEventListener('mouseup', function (e) {

            e.preventDefault();

            _this.state.sketch.mousedown = false;

            if(_this.state.sketch.polyline && _this.state.sketch.mode == 'drawing'){

                _this.state.sketch.polyline.setEndCoords({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'drawing' });
            }

            if((_this.state.sketch.polyline || _this.state.sketch.arc) && (_this.state.sketch.mode == 'drawing' || _this.state.sketch.mode == 'editing')){
                _this.refreshFields();
            }
            
            _this.state.sketch.polyline = null;
            _this.state.sketch.arc = null;

            // circle mouse in out listener
            if(document.querySelector('#svg rect')) for( let el of document.querySelectorAll('#svg rect') ){

                el.onmouseover = (e) => {

                    if(_this.state.sketch.mousedown) return;

                    _this.state.sketch.rect = e.currentTarget.dataset.rect;
                    _this.state.sketch.last.id = e.currentTarget.dataset.id.replace('start','').replace('end','');
                    _this.state.sketch.type = e.currentTarget.dataset.type;
                };

                el.onmouseleave = (e) => {

                    if(_this.state.sketch.mousedown) return;

                    _this.state.sketch.rect = null;
                };
            }

            // line mouse in out listener
            if(document.querySelector('#svg polyline')) for( let el of document.querySelectorAll('#svg polyline') ){

                el.onmouseover = (e) => {

                    if(_this.state.sketch.mousedown) return;

                    _this.state.sketch.last.id = e.currentTarget.dataset.id;
                };
            }

            // path arc mouse in out listener
            if(document.querySelector('#svg path')) for( let el of document.querySelectorAll('#svg path') ){

                el.onmouseover = (e) => {

                    if(_this.state.sketch.mousedown) return;

                    // console.log("over " + e.currentTarget.dataset.id);
                    _this.state.sketch.last.id = e.currentTarget.dataset.id;
                };
            }
        });

        document.querySelector('#svg').onmouseover = (e) => {

            _this.state.sketch.hover = true;
        };

        document.querySelector('#svg').onmouseleave = (e) => {

            _this.state.sketch.hover = false;
        };

        // remove listener
        let keypress = (e) => {

            // console.log('key' + e.which);

            // request angle drawing
            if(e.which == 65 && _this.state.sketch.mode == 'drawing'){  _this.state.sketch.requestAngle = true; console.log('REQUESTING'); setTimeout(() => { _this.state.sketch.requestAngle = false }, 2000); }
            
            // cancel drawing on del or ESC buttons
            if((e.which == 8 || e.which == 27) && _this.state.sketch.mode == 'drawing' && _this.state.sketch.polyline){ console.log('removing'); document.querySelector('#svg g[data-id="' + _this.state.sketch.polyline.getID() + '"]').remove(); }
            
            if(e.which != 8 || _this.state.sketch.mode != 'editing' || !_this.state.sketch.hover) return;

            // delete lines
            if(document.querySelector('#svg g[data-id="' + _this.state.sketch.last.id + '"]')) document.querySelector('#svg g[data-id="' + _this.state.sketch.last.id + '"]').remove();
            if(document.querySelector('.input-fields #field' + _this.state.sketch.last.id)) document.querySelector('.input-fields #field' + _this.state.sketch.last.id).remove();
            if(document.querySelector('.svg-input[data-id="' + _this.state.sketch.last.id + '"]')) document.querySelector('.svg-input[data-id="' + _this.state.sketch.last.id + '"]').remove();
        }
        document.removeEventListener('keydown', keypress, true);
        document.addEventListener('keydown', keypress, true);
        
        // iterate all images
        for(let fi=0; fi<1; fi++){
    
            // async load image to verify if it exists on CDN 
            let image_url = CDN+'/S'+sid+'/sketch-'+id+'-'+(parseInt(fi)+1)+'-500x500.jpeg?'+product.updated;
            setTimeout(function(img, sel, _fi){
        
                let allow = true;
                if(typeof(product.img)!=="undefined"){ if(!product.img[_fi]) allow = false; }
                if(allow){

                    let i = new Image();
                    i.onload = function(){
                        
                        d.querySelector(sel+_fi).setAttribute('src', img);
                        d.querySelector(sel+_fi).parentElement.querySelector('.remove').classList.remove('hd');
                    };
                    i.src=img;
                }
            }, 300, image_url, ".images-sketch", fi );
        }
    },
    // sync html lines with HTML fields
    refreshFields: () => {

        // console.log('refreshFields');

        let htmlLabels = "";

        let refreshAgain = false;

        // get all lines
        if(document.querySelector('#svg g')) for(let el of document.querySelectorAll('#svg g')){

            let id = el.dataset.id, obj = {}, x, y;
            let label = document.querySelector('#field'+id+' .field-label') ? document.querySelector('#field'+id+' .field-label').value : _this.getNextLabel(el.dataset.type)[0];

            // if(label == '...') refreshAgain = true;

            switch(el.dataset.type){

                case 'polyline':
                    obj = { id:id, label:label, default:0, min:0, max:0, type:el.dataset.type, params:{}, points:el.querySelector('polyline').getAttribute('points') };
         
                    let points = obj.points.split(' ');
                    x = (parseFloat(points[0]) + parseFloat(points[2])) / 2;
                    y = (parseFloat(points[1]) + parseFloat(points[3])) / 2;
                    
                    htmlLabels += `
                    <div class="svg-input m-2 lable-line" style="left:${ x }px;top:${ y }px;" data-id="${ obj.id }">
                        <label for="input${ obj.label }">${ obj.label }</label>
                    </div>
                    `;
                    
                    break;
                case 'arc':
                    obj = { id:id, label:label, default:0, min:0, max:0, type:el.dataset.type, params:JSON.parse(unescape(el.dataset.params)), points:el.querySelector('path').getAttribute('d') };

                    let newDeg = obj.params.startAngle + ((obj.params.endAngle - obj.params.startAngle) / 2); // newDeg = newDeg < 0 ? newDeg * (-1) : 360-newDeg; 

                    // console.log(obj.params.startAngle + " " + obj.params.endAngle);
                    // console.log(newDeg);

                    x = obj.params.x + obj.params.radius / 2 + (((obj.params.radius*2) * Math.cos(degToRad(newDeg)))) + 5;
                    y = obj.params.y + obj.params.radius / 2 + (((obj.params.radius*2) * Math.sin(degToRad(newDeg)))) - 5;

                    // x = obj.params.x + 40;
                    // y = obj.params.y + 40;

                    htmlLabels += `
                    <div class="svg-input m-2 lable-angle" style="left:${ x }px;top:${ y }px;" data-id="${ obj.id }">
                        <label for="input${ obj.label }">${ obj.label }°</label>
                    </div>
                    `;

                    break;
            }

            // struct field
            let html = _this.structInputRow(obj);

            if(!document.querySelector('#field'+id)){ 
                
                // new field block
                document.querySelector('.input-fields').insertAdjacentHTML('beforeend', html); 
            }else{

                // update existing fields with new points only
                document.querySelector('#field'+id).setAttribute('data-points', obj.points);
                document.querySelector('#field'+id).setAttribute('data-params', escape(JSON.stringify(obj.params)));
            }

            _this.listeners.inputFieldListeners();
        }

        document.querySelector('.labels').innerHTML = htmlLabels;

        onChange('.field-label', _this.listeners.inputFieldChange);
    },
    structCoatingRow: (obj, i) => {

        return `
        <tr class="new-item-row ${ obj.parent ? "pr-parent" : "" }" data-parent="${ obj.parent ? obj.parent : "" }" data-title="${ obj.title }" data-hash="${ escape(obj.id+obj.title+obj.parent) }">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" class="remove-price bi bi-x-circle po" data-i="${ i }" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                </svg>
            </td>
        </tr>`;

    },
    // general method for image upload
    uploadImages: () => {

        if( document.querySelector(".imgupnote") ) document.querySelector(".imgupnote").remove();

        let fi = 0;
        for( let fileEl of document.querySelectorAll(".sketchfile") ){

            fi += 1;

            let id = getProductId();
            let sid = spaceID();

            // console.log(file);
            let file = fileEl.files[0];
            if(typeof(file) === "undefined") continue;

            // TODO add global sizes setting 
            let fd = new FormData();
            // let sizes = document.querySelector("body").dataset.sizes;
            let sizes = '1000|500x500|250x250|100x100';

            fd.append('id', id);
            fd.append('sid', sid);
            fd.append('pid', id);
            fd.append('key', 'image');
            fd.append('sizes', sizes);
            fd.append('file', file);
            fd.append('slug', 'sketch-'+id+'-'+fi);
            fd.append('token', getCookie('kenzap_token'));

            // clear input file so that its not updated again
            file.value = '';

            _this.state.ajaxQueue+=1;

            fetch("https://api-v1.kenzap.cloud/upload/",{
                body: fd,
                method: "post"
            })
            .then(response => response.json())
            .then(response => {

                _this.state.ajaxQueue -= 1;
                if(response.success && _this.state.ajaxQueue == 0){

                    toast( __("Sketch updated") );

                    // hide UI loader
                    hideLoader();
                }
            });
        }
        
        // image upload notice
        if(_this.state.ajaxQueue == 0){

            toast( __("Product updated") );

            hideLoader();
        }
    },
}

_this.init();