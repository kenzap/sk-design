// js dependencies
import { headers, showLoader, hideLoader, parseApiError, getCookie, onClick, onChange, simulateClick, spaceID, toast, link } from '@kenzap/k-cloud';
import { getProductId, makeNumber, numsOnly, priceFormat, onlyNumbers } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_product_edit_sk_design.js"
import { Polyline } from "../_/_2d.js"

// where everything happens
const _this = {

    init: () => {
        
        _this.getData(); 
    },
    state: {
        ajaxQueue: 0,
        settings: {}, // where all requested settings are cached
        firstLoad: true,
        sketch: { mode: 'preview', polyline_last: { id: null } }
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
                        fields:     ['_id', 'id', 'test', 'input_fields', 'formula', 'calc_price', 'updated']
                    },
                    settings: {
                        type:       'get',
                        key:        'sk-design',
                        fields:     ['currency', 'currency_symb', 'currency_symb_loc', 'tax_calc', 'tax_auto_rate', 'tax_rate', 'tax_display'],
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

                // check product response
                if (response.product.length == 0) { return; }

                // get core html content 
                document.querySelector('#contents').insertAdjacentHTML('beforeend', HTMLContent(__)); // innerHTML = HTMLContent(__);

                // // let st = parseInt(data.list[i].status);
                // let img = 'https://cdn.kenzap.com/loading.png';

                // // if(typeof(response.product[i].img) !== 'undefined' && response.product[i].img[0] == 'true') img = 'https://preview.kenzap.cloud/S1000452/_site/images/product-'+response.product[i].id+'-1-100x100.jpeg?1630925420';
                
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

        // input fields
        product.input_fields.forEach(obj => {

            let html = _this.structInputRow(obj);

            if(!document.querySelector('#field'+obj.id)) document.querySelector('.input-fields').insertAdjacentHTML('beforeend', html);
            
            if(!document.querySelector('#svg g[data-id="' + obj.id+ '"]')){

                let points_arr = obj.points.split(' ');

                _this.state.sketch.polyline = new Polyline({ points: [{x: points_arr[0], y: points_arr[1] }], mode: 'drawing', id: obj.id });
                _this.state.sketch.polyline.setCoords({ points: [{x: points_arr[2], y: points_arr[3] }], mode: 'drawing' });
                _this.state.sketch.polyline.setEndCoords({ points: [{x: points_arr[2], y: points_arr[3] }], mode: 'drawing' });
            }
        })

        _this.listeners.inputFieldListeners();

        _this.state.sketch.polyline = null;

        _this.state.sketch.mode = 'drawing';

        // calculate prce
        d.querySelector("#calc_price").value = product.calc_price;

        // formula
        d.querySelector("#formula").value = product.formula;

        // validate formula
        document.querySelector("#formula").addEventListener('keyup', (e) => {

            let formula = e.currentTarget.value;
            let labels = "";
            for(let div of document.querySelectorAll('.input-fields > div')){

                labels += div.querySelector('.field-label').value + " ";
                formula = formula.replace(div.querySelector('.field-label').value, parseFloat(div.querySelector('.field-default').value));
            }
            labels = labels.trim();

            let result = 0;

            try{
                document.querySelector(".formula-hint").innerHTML = '';
                result = eval(formula);
                document.querySelector("#formula").setCustomValidity("");
            }catch(e){
                document.querySelector("#formula").setCustomValidity( __("Invalid formula") );
                document.querySelector(".formula-hint").innerHTML = __("Invalid formula. Use one of the following letters only: "+labels);
            }

            document.querySelector("#formula").parentElement.classList.add('was-validated');
            
            if(result>0) document.querySelector(".formula-hint").innerHTML = __("Result: <b>%1$</b> based on the input fields default values", result);
        
            // console.log(result);
            

            // if((!chars.includes(e.which) && isNaN(String.fromCharCode(e.which))) || e.which == 32 || (document.querySelector(sel).value.includes(String.fromCharCode(e.which)) && chars.includes(e.which))){
    
            //     // stop character from entering input
            //     e.preventDefault(); 
            //     return false;
            // }
        });



        // // general section
        // d.querySelector("#p-title").value = product.title;
        // d.querySelector("#p-sdesc").value = product.sdesc;
        // d.querySelector("#p-ldesc").value = product.ldesc;

        // // price section
        // d.querySelector("#p-price").value = product.price; onlyNumbers('#p-price', [8, 46]);
        // // d.querySelector("#p-priced").value = product.priced;
        // d.querySelector("#p-price-symb").innerHTML = _this.state.settings['currency_symb'] ? _this.state.settings['currency_symb'] : "";

        // // discounts 
        // document.querySelector(".discount-blocks").dataset.data = encodeURIComponent(JSON.stringify(product.discounts ? product.discounts : []));
        // _this.renderDiscounts();

        // // price variation section
        // // console.log(product.variations);
        // for(let m in product.variations){ 

        //     let vr = product.variations[m];
        //     let data = []; data['title'] = vr['title']; data['type'] = vr['type']; data['required'] = vr['required']; data['index'] = m;
  
        //     d.querySelector(".variation-blocks").innerHTML += _this.structMixBlock(data);

        //     for(let n in vr['data']){
  
        //       let vrd = vr['data'][n];
        //       let data = []; 
        //       data['title'] = vrd['title'];
        //       data['price'] = vrd['price'];
        //       data['type'] = vr['type'];
  
        //       // console.log(data['title']);
        //       d.querySelector(".var-block[data-index='"+m+"'] .offer-pricef").innerHTML += _this.structMixRow(data);
        //     }
        // }

        // // inventory
        // if(!product['stock']) product['stock'] = {management: false, sku: "", qty: 0, low_threshold: 0};

        // for(let el of document.querySelectorAll('.stock-cont')){ product['stock']['management'] == true ? el.classList.remove('d-none') : el.classList.add('d-none'); }
        // document.querySelector('#stock_sku').value = product['stock']['sku'] ? product['stock']['sku'] : "";
        // document.querySelector('#stock_management').checked = product['stock']['management']; //  == "1" ? true: false;
        // document.querySelector('#stock_quantity').value = product['stock']['qty'] ? makeNumber(product['stock']['qty']) : 0;
        // document.querySelector('#stock_low_threshold').value = product['stock']['low_threshold'] ? makeNumber(product['stock']['low_threshold']) : 0;

        // // init status box
        // document.querySelector('#p-status'+product.status).checked = true;

        // // init categories
        // let pcats = document.querySelector('#p-cats');
        // if (product.cats) pcats.setAttribute('data-simple-tags', product.cats);
        // const tags = new simpleTags(__, pcats);
        
    },
    initListeners: () => {

        // console.log('initListeners ');

        if(!_this.state.firstLoad) return;

        // product save button
        onClick('.btn-save', _this.listeners.saveProduct);
        
        // modal success button
        onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);

        // // add discount
        // onClick('.add-discount', _this.listeners.addDiscountBlock);

        // // add variation block
        // onClick('.add-mix-block', _this.listeners.addMixBlock);
        
        // // edit variation block
        // onClick('.edit-block', _this.listeners.editBlock);

        // // remove variation block
        // onClick('.remove-block', _this.listeners.removeBlock);

        // // add variation option
        // onClick('.add-mix', _this.listeners.addMixOption);

        // // remove variation option
        // onClick('.remove-option', _this.listeners.removeOption);

        // // stock management enable disable
        // onClick('.stock-management', _this.listeners.stockManagement);

        _this.state.firstLoad = false;
    },
    listeners: {

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

            if(document.querySelector('#svg g[data-id="' + id+ '"]')) document.querySelector('#svg g[data-id="' + id + '"]').remove();
            if(document.querySelector('.input-fields #field' + id)) document.querySelector('.input-fields #field' + id).remove();
        },

        saveProduct: (e) => {
            
            e.preventDefault();

            let data = {};

            data['input_fields'] = [];

            // iterate through input fields
            for(let div of document.querySelectorAll('.input-fields > div')){

                let obj = {};

                obj['id'] = div.id.replace('field','');
                obj['points'] = div.dataset.points;
                obj['label'] = div.querySelector('.field-label').value;
                obj['default'] = parseFloat(div.querySelector('.field-default').value);
                obj['min'] = parseFloat(div.querySelector('.field-min').value);
                obj['max'] = parseFloat(div.querySelector('.field-max').value);

                data['input_fields'].push(obj);
            }

            data['calc_price'] = document.querySelector('#calc_price').value;
            data['formula'] = document.querySelector('#formula').value;


            // // map categories
            // data["cats"] = [];
            // for( let cat of document.querySelectorAll('#p-cats ul li') ){

            //     data["cats"].push(cat.innerHTML.replace('<a>×</a>','').trim());
            // }
             
            // // link uploaded images
            // data["img"] = [];
            // for( let img of document.querySelectorAll('.p-img') ){

            //     let tf = !img.getAttribute('src').includes("placeholder") ? true : false;
            //     data["img"].push(tf);
            // }

            // // discount list
            // data["discounts"] = JSON.parse(decodeURIComponent(document.querySelector('.discount-blocks').dataset.data));

            // // inventory
            // data["stock"] = {};
            // data['stock']['sku'] = document.querySelector('#stock_sku').value;
            // data['stock']['management'] = document.querySelector('#stock_management').checked;
            // data['stock']['qty'] = document.querySelector('#stock_quantity').value; 
            // data['stock']['low_threshold'] = document.querySelector('#stock_low_threshold').value;
            
            // // status
            // data["status"] = document.querySelector('input[name="p-status"]:checked').value;
   
            // // map mix and match
            // data["variations"] = [];
            // let block_index = 0;
            // for( let block of document.querySelectorAll('.variation-blocks .var-block') ){

            //     let option_index = 0;
            //     for( let option of block.querySelectorAll('.offer-pricef li') ){

            //         if(typeof(data["variations"][block_index]) === 'undefined')
            //         data["variations"][block_index] = 
            //         { 
            //             'title': block.getAttribute('data-title'),
            //             'type': block.getAttribute('data-type'),
            //             'required': block.getAttribute('data-required'),
            //             'data': []
            //         };
                    
            //         data["variations"][block_index]['data'][option_index] = 
            //         {
            //             'title': option.getAttribute('data-title'),
            //             'price': option.getAttribute('data-price'),
            //             'cond': option.getAttribute('data-cond')
            //         };
            //         option_index++;
            //     }
            //     block_index++;
            // }

            console.log(data);
        
            let id = getProductId();
            let sid = spaceID();

            showLoader();

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

                    // upload desc images
                    _this.uploadImages();
                    
                }else{

                    parseApiError(response);
                }
            })
            .catch(error => { parseApiError(error); });
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

            console.log('sketchMode'+e.currentTarget.id);

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

        modalSuccessBtnFunc: null
    },
    structInputRow: (obj) => {

        // available labels
        let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        // prevent same label being used twice
        for(let label of document.querySelectorAll('.input-fields > div .field-label')){ alphabet = alphabet.filter(function(el) { return el !== label.value }) }

        // labels select
        let options = ''; alphabet.forEach((el) => { options += '<option value="' + el + '" '+(obj.label==el ? 'selected':'')+'>' + el + '</option>'; });

        return`
                <div id="field${ obj.id }" class="d-flex flex-row bd-highlight mb-0" data-points="${ obj.points }">
                    <div class="me-3" >
                        <select class="form-select field-label" style="width:64px" aria-label="Default select example">
                            ${ options }
                        </select>
                        <p class="form-text">${ __('label') }</p>
                    </div>
                    <div class="me-3">
                        <input type="text" class="form-control field-default" placeholder="${ __('0') }" value="${ obj.default }"></input>
                        <p class="form-text">${ __('default value') }</p>
                    </div>
                    <div class="me-3">
                        <input type="text" class="form-control field-min" placeholder="${ __('0') }" value="${ obj.min }"></input>
                        <p class="form-text">${ __('min value') }</p>
                    </div>
                    <div class="me-3">
                        <input type="text" class="form-control field-max" placeholder="${ __('1000') }" value="${ obj.max }"></input>
                        <p class="form-text">${ __('max value') }</p>
                    </div>
                    <a href="javascript:void(0);" onclick="javascript:;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0079" class="remove-input-field bi bi-x-circle mt-2" data-id="${ obj.id }" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                        </svg>
                    </a>
                </div>
            `;
    },
    loadDrawing: (product) => {

        let d = document;
        let id = getProductId();
        let sid = spaceID();
        let t = '';
        for(let i=0;i<1;i++){
     
          let img = 'https://account.kenzap.com/images/placeholder.jpg';
          t+=`
          <div class="p-img-cont sketch-cont float-start" data-mode="preview" style="max-width:100%;">
            <p data-index="sketch${i}" style="position: relative;">
              <img class="p-img images-sketch${i}" data-index="sketch${i}" src="${img}" />
              <svg id="svg" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;display: block; position: absolute; top: 0; left: 0; z-index: -2;"></svg>
              <span class="remove hd" title="${ __('Remove') }">×</span>
            </p>
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

        // line draw listener start
        d.querySelector("#svg").addEventListener('mousedown', function (e) {

            e.preventDefault();

            if(_this.state.sketch.mode == 'drawing'){ _this.state.sketch.polyline = new Polyline({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'drawing' }); }
            
            if(_this.state.sketch.mode == 'editing'){ _this.state.sketch.polyline = new Polyline({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'editing', id: _this.state.sketch.rect }); }

            // console.log(_this.state.sketch.polyline_last.id + "mousedown" + _this.state.sketch.polyline_last.id);
            // console.log(e);
        });

        // line draw listener move
        d.querySelector("#svg").addEventListener('mousemove', function (e) {

            e.preventDefault();

            if(_this.state.sketch.polyline && _this.state.sketch.mode == 'drawing') _this.state.sketch.polyline.setCoords({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'drawing' });

            if(_this.state.sketch.polyline && _this.state.sketch.mode == 'editing') _this.state.sketch.polyline.setCoords({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'editing' });
        });

        // line draw listener end
        d.querySelector("#svg").addEventListener('mouseup', function (e) {

            e.preventDefault();

            if(_this.state.sketch.polyline && _this.state.sketch.mode == 'drawing'){

                _this.state.sketch.polyline.setEndCoords({ points: [{x: e.offsetX, y: e.offsetY }], mode: 'drawing' });
            }

            if(_this.state.sketch.polyline && (_this.state.sketch.mode == 'drawing' || _this.state.sketch.mode == 'editing')){
                _this.refreshFields();
            }
            
            _this.state.sketch.polyline = null;

            // circle mouse in out listener
            if(document.querySelector('#svg rect')) for( let el of document.querySelectorAll('#svg rect') ){

                el.onmouseover = (e) => {

                    _this.state.sketch.rect = e.currentTarget.dataset.id;
                    _this.state.sketch.polyline_last.id = e.currentTarget.dataset.id.replace('start','').replace('end','');
                };

                el.onmouseleave = (e) => {

                    _this.state.sketch.rect = null;
                };
            }

            // line mouse in out listener
            if(document.querySelector('#svg polyline')) for( let el of document.querySelectorAll('#svg polyline') ){

                el.onmouseover = (e) => {

                    _this.state.sketch.polyline_last.id = e.currentTarget.dataset.id;
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

            if(e.which != 8 || _this.state.sketch.mode != 'editing' || !_this.state.sketch.hover) return;

            if(document.querySelector('#svg g[data-id="' + _this.state.sketch.polyline_last.id + '"]')) document.querySelector('#svg g[data-id="' + _this.state.sketch.polyline_last.id + '"]').remove();
            if(document.querySelector('.input-fields #field' + _this.state.sketch.polyline_last.id)) document.querySelector('.input-fields #field' + _this.state.sketch.polyline_last.id).remove();
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

        // get all lines
        if(document.querySelector('#svg g')) for(let el of document.querySelectorAll('#svg g') ){

            let id = el.dataset.id;

            let obj = { id:id, label:'', default:0, min:0, max:0, points: el.querySelector('polyline').getAttribute('points') };

            // struct field
            let html = _this.structInputRow(obj);

            if(!document.querySelector('#field'+id)){ 
                
                // new field block
                document.querySelector('.input-fields').insertAdjacentHTML('beforeend', html); 
            }else{

                // update existing fields with new points only
                document.querySelector('#field'+id).setAttribute('data-points', obj.points);
            }

            _this.listeners.inputFieldListeners();
        }
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