// https://codyhouse.co/demo/add-to-cart-interaction/index.html
import { onClick, __, __html, __attr } from '@kenzap/k-cloud';
import { Util } from "../_/_cart_util.js"
import { spaceID, priceFormat, onlyNumbers, mt, API_KEY } from "../_/_helpers.js"

export class Cart{
    
    constructor(_this) {
 
        this._this = _this;

        let cartStatic = localStorage.getItem('sk-design-cart');
        if(!cartStatic) cartStatic = '{}';

        this.cart = JSON.parse(cartStatic);
        if(!this.cart) this.cart = {};
        if(!this.cart.items) this.cart.items = [];
        if(!this.cart.price) this.cart.price = {};
        if(!this.cart.idd) this.cart.idd = this.randomString(8)+Math.floor(Date.now());

        this.renderCartHTML();

        this.cart.html = document.getElementsByClassName('js-cd-cart');
        if(this.cart.html.length > 0) {
                
            this.cart.cartAddBtns = document.getElementsByClassName('js-cd-add-to-cart');
            this.cart.cartBody = this.cart.html[0].getElementsByClassName('cd-cart__body')[0],
            this.cart.cartList = this.cart.cartBody.getElementsByTagName('ul')[0],
            this.cart.cartListItems = this.cart.cartList.getElementsByClassName('cd-cart__product'),
            this.cart.cartTotal = this.cart.html[0].getElementsByClassName('cart-checkout')[0].getElementsByTagName('span')[0],
            this.cart.cartCount = this.cart.html[0].getElementsByClassName('cd-cart__count')[0],
            this.cart.cartCountItems = this.cart.cartCount.getElementsByTagName('li'),
            this.cart.cartUndo = this.cart.html[0].getElementsByClassName('cd-cart__undo')[0],
            this.cart.productId = 0, //this is a placeholder -> use your real product ids instead
            this.cart.cartTimeoutId = false,
            this.cart.animatingQuantity = false;
            this.initListeners();
        }

        this.refreshCartHTML();

        this.cartButtonVissible();

        this.saveCart();
    }

    /**
     * Init cart listeners
     * 
     * @returns {Boolean} - true
     */
    initListeners(){

        let _this = this;

        // add products to cart
        for(var i = 0; i < this.cart.cartAddBtns.length; i++) {(function(i){

            _this.cart.cartAddBtns[i].addEventListener('click', _this.addToCart);
        })(i);}

        // open/close cart
        this.cart.html[0].getElementsByClassName('cd-cart__trigger')[0].addEventListener('click', function(e){

            e.preventDefault();
            _this.toggleCart();
        });

        // open checkout modal
        onClick(".cart-checkout", (e) => {

            _this.toggleCart();

            let modal = document.querySelector(".modal-item");
            let modalCont = new bootstrap.Modal(modal);
            modalCont.show();

            document.querySelector(".modal-item .modal-title").innerHTML = __html("Checkout");
            document.querySelector(".modal .btn-primary").innerHTML = __html("Confirm checkout");
            document.querySelector(".modal .btn-primary").classList.add('btn-danger');

            let html = `
            <div class="form-cont">

                <div class="btn-group mb-5" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="entity-type" id="btn-individual" autocomplete="off" >
                    <label class="btn btn-outline-primary" for="btn-individual">${ __html("Individual") }</label>
                    <input type="radio" class="btn-check" name="entity-type" id="btn-company" autocomplete="off" checked>
                    <label class="btn btn-outline-primary" for="btn-company">${ __html("Company") }</label>
                </div>

                <div class="form-checkout">

                    <div class="row">
                        <div class="col-lg-6 reg_num_cont">
                            <div class="form-group row mb-3 mt-1">
                                <label class="col-sm-3 col-form-label">${ __html("Reg. Nr.") }</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control text reg_num" placeholder="40008877333" value="${ localStorage.getItem("checkout_reg_num") ? localStorage.getItem("checkout_reg_num") : "" }">
                                    <div class="invalid-feedback reg_num_notice"></div>
                                    <p class="form-text">${ __html("Company registration number, without LV.") }</p>
                                </div> 
                            </div>
                        </div>

                        <div class="col-lg-6 full_name_cont d-none">
                            <div class="form-group row mb-3 mt-1">
                                <label class="col-sm-3 col-form-label">${ __html("Full Name") }</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control text full_name" placeholder="Alex Ziliņš" value="${ localStorage.getItem("checkout_full_name") ? localStorage.getItem("checkout_full_name") : "" }">
                                    <div class="invalid-feedback full_name_notice"></div>
                                    <p class="form-text">${ __html("Your name and surname") }</p>
                                </div> 
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="form-group row mb-3 mt-1">
                                <label class="col-sm-3 col-form-label">${ __html("IBAN") }</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control iban" placeholder="LV14HABA012345678910" value="${ localStorage.getItem("checkout_iban") ? localStorage.getItem("checkout_iban") : "" }">
                                    <div class="invalid-feedback iban_notice"></div>
                                    <p class="form-text">${ __html("Your bank account, ex.: LV14HABA012345678910") }</p>
                                </div> 
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="form-group row mb-3 mt-1">
                                <label class="col-sm-3 col-form-label">${ __html("Email") }</label>
                                <div class="col-sm-9">
                                    <input type="email" class="form-control email" placeholder="email@example.com" value="${ localStorage.getItem("checkout_email") ? localStorage.getItem("checkout_email") : "" }">
                                    <div class="invalid-feedback email_notice"></div>
                                    <p class="form-text">${ __html("Your email address.") }</p>
                                </div> 
                            </div>
                        </div>
            
                        <div class="col-lg-6">
                            <div class="form-group row mb-3 mt-1">
                                <label class="col-sm-3 col-form-label">${ __html("Phone") }</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control phone" placeholder="+37126443313" value="${ localStorage.getItem("checkout_phone") ? localStorage.getItem("checkout_phone") : "" }">
                                    <div class="invalid-feedback phone_notice"></div>
                                    <p class="form-text">${ __html("Phone number.") }</p>
                                </div> 
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="form-group row mb-3 mt-1">
                                <label class="col-sm-3 col-form-label">${ __html("Notes") }</label>
                                <div class="col-sm-9">
                                    <textarea id="coupon_list" class="form-control inp notes" name="coupon_list" rows="2" data-type="text" style="font-size:13px;font-family: monospace;"></textarea>
                                    <p class="form-text">Notes to order.</p>
                                </div> 
                            </div>
                        </div>
                    </div>
      
                    <div class="row mb-3">
                        <div class="col-lg-6">
                        
                        </div>
                        <div class="col-lg-6">
                            <h3 class="mb-3">${ __html("Totals") }</h3>
                            <div class="form-group row mb-2 mt-1 total_cont">
                                <label class="col-sm-3 col-form-label">${ __html("Total") }</label>
                                <div class="col-sm-9 text-end">
                                    ${ priceFormat(this._this, this.cart.price.total) }
                                </div> 
                            </div>
                            <div class="form-group row mb-2 mt-1 vat_cont d-none">
                                <label class="col-sm-3 col-form-label">${ __html("VAT 21%") }</label>
                                <div class="col-sm-9 text-end">
                                    ${ priceFormat(this._this, this.cart.price.tax) }
                                </div> 
                            </div>
                            <div class="form-group row mb-2 mt-1 d-none">
                                <label class="col-sm-3 col-form-label">${ __html("Discount 10%") }</label>
                                <div class="col-sm-9 text-end">
                                    5.00 €
                                </div> 
                            </div>
                            <hr>
                            <div class="form-group row mb-2 mt-1 fw-bolder grand_total_cont">
                                <label class="col-sm-3 col-form-label fs-5">${ __html("Grand total") }</label>
                                <div class="col-sm-9 text-end fs-5">
                                    ${ priceFormat(this._this, this.cart.price.grand_total) }
                                </div> 
                            </div>
                        </div>                
                    </div>

                    <div class="row">
                        <div class="col-lg-6">
                        
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group row mb-3 mt-1">
                   
                                <div class="col-sm-12">
                                    <div class="form-check">
                                        <input id="terms" class="form-check-input inp" name="terms" type="checkbox" value="1" data-type="checkbox">
                                        <label class="form-check-label" for="terms">
                                        ${ __html("Agree to terms") }
                                        </label>
                                    </div>
                                    <p class="form-text">${ __html("I acknowledge that Skarda Nams SIA uses cookies in order to provide best user experience. You also agree to Skarda Nams SIA Terms of Service, Privacy Policy.") }</p>
                                </div>
                                
                                <div class="col-sm-12">
                                    <div class="form-check">
                                        <input id="personal_data" class="form-check-input inp" name="personal_data" type="checkbox" value="1" data-type="checkbox">
                                        <label class="form-check-label" for="personal_data">
                                        ${ __html("Personal data processing") }
                                        </label>
                                    </div>
                                    <p class="form-text">${ __html("I acknowledge that Skarda Nams SIA stores my personal data for order processing and accounting purposes. More information on https://www.skardanams.lv/privatuma-politika/.") }</p>
                                </div> 
                            </div>
                        </div>
                    </div>
                    
                    <div class="row d-none">
                        <div class="col-lg-12">

                            <label class="col-sm-3 col-form-label">${ __html("Notes") }</label>
                            <div class="col-sm-9 text-muted">
                                <input id="terms" class="form-check-input inp terms" name="terms" type="checkbox" value="1" data-type="checkbox">
                                I acknowledge that Kenzap uses cookies in order to provide best user experience. You also agree to Kenzap Terms of Service, Privacy Policy.
                            </div>
                        </div>
                    </div>
 
                </div>

            </div>`;

            document.querySelector(".modal-body").innerHTML = html;

            // checkout form listeners
            onClick("#btn-individual", (e) => {

                document.querySelector(".reg_num_cont").classList.add("d-none");
                document.querySelector(".full_name_cont").classList.remove("d-none");
                document.querySelector(".vat_cont").classList.remove("d-none");

                this.refreshCartCountAndTotals();
            });

            // checkout form listeners
            onClick("#btn-company", (e) => {

                document.querySelector(".reg_num_cont").classList.remove("d-none");
                document.querySelector(".full_name_cont").classList.add("d-none");
                document.querySelector(".vat_cont").classList.add("d-none");

                this.refreshCartCountAndTotals();
            });

            // onlyNumbers
            onlyNumbers(".reg_num", [8]);

            // confirm checkout listener
            this._this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();

                let obj = {};

                // reset previous input fields warnings
                let allow = true;
                modal.querySelector(".full_name").setCustomValidity(""); modal.querySelector(".full_name_notice").innerHTML = "";
                modal.querySelector(".reg_num").setCustomValidity(""); modal.querySelector(".reg_num_notice").innerHTML = "";
                modal.querySelector(".email").setCustomValidity(""); modal.querySelector(".email_notice").innerHTML = "";
                modal.querySelector(".iban").setCustomValidity(""); modal.querySelector(".iban_notice").innerHTML = "";
                modal.querySelector(".phone").setCustomValidity(""); modal.querySelector(".phone_notice").innerHTML = "";

                // validate checkout fields
                if(modal.querySelector('#btn-individual').checked){

                    if(modal.querySelector('.full_name').value.length < 2){ allow = false; modal.querySelector(".full_name").setCustomValidity( __("Full name too short") ); }
                    modal.querySelector(".full_name").parentElement.classList.add('was-validated');

                }else{
                    
                    if(modal.querySelector('.reg_num').value.trim().length < 11){ allow = false; modal.querySelector(".reg_num").setCustomValidity( "error" ); modal.querySelector(".reg_num_notice").innerHTML = __html("Registration number too short"); }
                    if(modal.querySelector('.reg_num').value.trim().length > 12){ allow = false; modal.querySelector(".reg_num").setCustomValidity( "error" ); modal.querySelector(".reg_num_notice").innerHTML = __html("Registration number too long"); }
                    modal.querySelector(".reg_num").parentElement.classList.add('was-validated');
                }

                // if(document.querySelector(".email").innerHTML.trim().length < 4 ){ allow = false; document.querySelector(".email").setCustomValidity( __("Wrong email address format") ); }
                if(modal.querySelector(".email").value.trim().length < 4 || modal.querySelector(".email").value.trim().length > 50){ allow = false; modal.querySelector(".email").setCustomValidity("error"); modal.querySelector(".email_notice").innerHTML = __html("Wrong email address format"); }
                if(modal.querySelector(".iban").value.trim().length < 15 || modal.querySelector(".iban").value.trim().length > 33){ allow = false; modal.querySelector(".iban").setCustomValidity("error"); modal.querySelector(".iban_notice").innerHTML = __html("Wrong IBAN format"); }
                if(modal.querySelector(".phone").value.trim().length < 4){ allow = false; modal.querySelector(".phone").setCustomValidity( "error" ); modal.querySelector(".phone_notice").innerHTML = __html("Wrong phone format");  }

                // was validated
                modal.querySelector(".email").parentElement.classList.add('was-validated');
                modal.querySelector(".iban").parentElement.classList.add('was-validated');
                modal.querySelector(".phone").parentElement.classList.add('was-validated');  

                // block ui
                if(modal.querySelector(".btn-primary").dataset.loading === 'true') return;

                // show loading button
                modal.querySelector(".btn-primary").dataset.loading = true;
                modal.querySelector(".btn-primary").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');
                
                // structure order object
                obj.id = 0;
                obj.idd = localStorage.idd;
                obj.sid = spaceID();
                obj.kid = 0;
                obj.status = "new";

                if(modal.querySelector('#btn-individual').checked){

                    obj.from = modal.querySelector('.full_name').value.trim();
                    obj.name = modal.querySelector('.full_name').value.trim();
                    obj.entity = "individual";
                }else{

                    obj.from = modal.querySelector('.reg_num').value.trim();
                    obj.name = "";
                    obj.entity = "company"; 
                }

                obj.email = modal.querySelector('.email').value.trim();
                obj.phone = modal.querySelector('.phone').value.trim();
                obj.notes = modal.querySelector('.notes').value;
                obj.iban = modal.querySelector('.iban').value.trim();

                obj.items = this.cart.items;
                obj.price = this.cart.price;
                obj.total = this.cart.price.total;
                obj.total_all = this.cart.price.grand_total;

                // struct notifications
                obj.notify = {
                    "admin": {
                        "subject": __("📢 New order received"),
                        "msg": __("Hey admin, <br><br>New order %1$https://skarda.design/?order={{order__id}}%2$#{{order_id}}%3$ received. Check your Ecommerce dashboard for more details.", '<a href="', '" >', '</a>'),
                    }
                };

                console.log(obj);

                // stop here and warn user
                if(!allow){

                    modal.scrollTo({ top: 0, behavior: 'smooth' });

                    // warning
                    alert( __("Please make sure to enter all fields correctly") );
                    
                    // show loading button
                    modal.querySelector(".btn-primary").dataset.loading = false;
                    modal.querySelector(".btn-primary").innerHTML = __html('Confirm checkout');
                
                    return;
                }

                // cache for future
                localStorage.setItem("checkout_email", modal.querySelector('.email').value);
                localStorage.setItem("checkout_phone", modal.querySelector('.phone').value);
                localStorage.setItem("checkout_iban", modal.querySelector('.iban').value);
                localStorage.setItem("checkout_full_name", modal.querySelector('.full_name').value);
                localStorage.setItem("checkout_reg_num", modal.querySelector('.reg_num').value);

                this.saveOrder(obj);
            };
        });

        // update product quantity inside cart
        this.cart.html[0].addEventListener('change', function(e) {
            
            if(e.target.tagName.toLowerCase() == 'select') _this.quickUpdateCart();
        });

        // reinsert product deleted from the cart
        this.cart.cartUndo.addEventListener('click', function(e) {

            if(e.target.tagName.toLowerCase() == 'a') {

                e.preventDefault();
                if(cartTimeoutId) clearInterval(cartTimeoutId);

                // reinsert deleted product
                let deletedProduct = this.cart.cartList.getElementsByClassName('cd-cart__product--deleted')[0];
                Util.addClass(deletedProduct, 'cd-cart__product--undo');
                deletedProduct.addEventListener('animationend', function cb(){

                    deletedProduct.removeEventListener('animationend', cb);
                    Util.removeClass(deletedProduct, 'cd-cart__product--deleted cd-cart__product--undo');
                    deletedProduct.removeAttribute('style');
                    quickUpdateCart();
                });
                Util.removeClass(this.cart.cartUndo, 'cd-cart__undo--visible');
            }
        });
        
        return  true;
    }

    /**
     * Send new order to the database
     * 
     * @returns {Object} - order object
     */
    saveOrder(order){

        let _this = this;

        // adding date
        let dateObj = new Date();
        order['created_ymd'] = dateObj.getUTCFullYear() + '' + mt(dateObj.getUTCMonth() + 1) + '' + mt(dateObj.getUTCDate());
        order['created_ym'] = dateObj.getUTCFullYear() + '' + mt(dateObj.getUTCMonth() + 1);
        order['created_y'] = dateObj.getUTCFullYear() + '';

        // do API query
        fetch('https://api-v1.kenzap.cloud/ecommerce/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + API_KEY,
                // 'Kenzap-Token': config.token,
                'Kenzap-Sid': spaceID()
            },
            body: JSON.stringify({
                query: {
                    order: {
                        type:       'create-order',
                        key:        'ecommerce-order',        
                        sid:        spaceID(),
                        data:       order
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            if(response.success){

                console.log(response);
                
                // _this.clearCart();

                // let url = new URL(window.location.href);

                // // url.origin+pathname+"?order="+id+"&recent=yes"

                // window.location.href = url.origin+url.pathname+"?order="+response.order.id+"&recent=yes";
             
            }else{

                // alert("Error occured. Please try again!");
                alert('Error: '+JSON.stringify(response));

            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }

    /**
     * Toggle cart button visibility
     * 
     * @returns {Object} - cart object
     */
    cartButtonVissible(){

        if(this.cart.items.length){ document.querySelector('.cd-cart').classList.remove('cd-cart--empty'); }else{ document.querySelector('.cd-cart').classList.add('cd-cart--empty'); }

    }

    /**
     * Toggle cart visibility
     * 
     * @returns {Object} - cart object
     */
    toggleCart(bool){

        let _this = this;

        let cartIsOpen = ( typeof bool === 'undefined' ) ? Util.hasClass(_this.cart.html[0], 'cart-open') : bool;
		
        if( cartIsOpen ) {

            Util.removeClass(_this.cart.html[0], 'cart-open');
            //reset undo
            if(_this.cart.cartTimeoutId) clearInterval(_this.cart.cartTimeoutId);
            Util.removeClass(_this.cart.cartUndo, 'cd-cart__undo--visible');
            // removePreviousProduct(); // if a product was deleted, remove it definitively from the cart
            setTimeout(function(){

                _this.cart.cartBody.scrollTop = 0;
                //check if cart empty to hide it
                if( Number(_this.cart.cartCountItems[0].innerText) == 0) Util.addClass(_this.cart.html[0], 'cd-cart--empty');
            }, 500);
        } else {
            Util.addClass(_this.cart.html[0], 'cart-open');
        }

        return true;
    }

    /**
     * Returns cart object
     * 
     * @returns {Object} - cart object
     */
    getCart(){

        return this.cart;
    }

    /**
     * Add product to the cart
     * 
     * @param obj {Object} product item
     * @returns {Boolena} - 
     */
    addToCart(obj){

        // find if already in the cart
        let ii = -1;
        let item = this.cart.items.filter((item, i) => { ii = i; return obj.cid == item.cid });

        // ecommerce defaults
        if(!obj.variations){ obj.variations = []; }
        if(!obj.note){ obj.note = ""; }

        // console.log(item);
        if(ii > -1 && item.length){

            this.cart.items[ii].qty = obj.qty;
            this.cart.items[ii].price = obj.price;
            this.cart.items[ii].total = obj.price * obj.qty;

        }else{

            this.cart.items.push(obj);
        }

        this.cartButtonVissible();

        this.saveCart();

        this.refreshCartHTML();

        return true;
    }

    /**
     * Product item to HTML
     * 
     * @param obj {Object} product item
     * @returns {Boolena} - 
     */
    cartRowStruct(obj, i){

        // let select_qty = '<select class="reset" name="quantity">';
        // for(let i=0;i<=100;i++){
        
        //     select_qty += `<option value="${ i }">${ i }</option>`;
        // }
        // select_qty += '</select>';

        // console.log(obj);

        let select_qty = `<input class="reset form-control form-control-sm px-2" style="" type="number" value="${ obj.qty }" min="1" max="1000"></input>`;

        return `<li class="cd-cart__product"><div class="cd-cart__image"><a href="#0"><img src="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ obj._id }-1-500x500.jpeg" alt="placeholder"></a></div><div class="cart-details"><h3 class="truncate" ><a data-id="${ obj._id }" data-cid="${ obj.cid }" data-i="${ i }" href="#0">${ obj.title }<span class="subtitle">${ obj.coating } ${ obj.color }</span>${ obj.input_fields_values.inputL ? '<span class="subtitle">' + __html("Length %1$ mm", obj.input_fields_values.inputL) + '</span>' : "" }</a></h3><span class="cart-price">${ priceFormat(this._this, obj.total) }</span><div class="cd-cart__actions"><div class="cart-qty"><span class="cart-select pe-2"> ${ select_qty } <svg class="icon d-none" viewBox="0 0 12 12"><polyline fill="none" stroke="currentColor" points="2,4 6,8 10,4 "/></svg></span> <a href="#0" data-cid="${ obj.cid }" class="cart-delete-item mt-1">${ __html('Delete') }</a> </div></div></div></li>`;
    }

    /**
     * Refresh cart counter number
     * 
     */
    refreshCartCountAndTotals(){

        let actual = this.cart.items.length;
        let next = actual + 1;
        
        this.cart.cartCountItems[0].innerText = actual;
        this.cart.cartCountItems[1].innerText = next;
        this.cart.animatingQuantity = false;

        this.cart.price = { grand_total: 0, total: 0, discount_percent: 0, discount_total: 0, fee_total: 0, tax_total: 0, tax_percent: 0 };

        if(document.querySelector('#btn-individual')) if(document.querySelector('#btn-individual').checked){ 
            
            this.cart.price.tax_percent = 21;
        }

        this.cart.items.forEach(obj => {

            this.cart.price.total += (obj.price * obj.qty);
        });

        this.cart.price.tax_total = this.cart.price.total * ((this.cart.price.tax_percent / 100));
        this.cart.price.grand_total = this.cart.price.total + this.cart.price.tax_total;

        // update checkout if present
        if(document.querySelector('.total_cont')) document.querySelector('.total_cont div').innerHTML = priceFormat(this._this, this.cart.price.total)
        if(document.querySelector('.vat_cont')) document.querySelector('.vat_cont div').innerHTML = priceFormat(this._this, this.cart.price.tax_total)
        if(document.querySelector('.grand_total_cont')) document.querySelector('.grand_total_cont div').innerHTML = priceFormat(this._this, this.cart.price.grand_total)
        
        document.querySelector('.cart-checkout em span').innerHTML = priceFormat(this._this, this.cart.price.grand_total);  
    }

    /**
     * Refresh cart html state
     * 
     */
    refreshCartHTML(){

        let _this = this;

        this.cart.cartList.innerHTML = "";
        
        // console.log(this.cart.items);

        this.cart.items.forEach((obj, i)=>{

            // console.log(obj.coating + obj.color + obj.id + JSON.stringify(obj.input_fields));

            this.cart.cartList.insertAdjacentHTML('beforeend', this.cartRowStruct(obj, i));
        });

        // remove listener
        onClick(".cart-delete-item", (e) => {

            if(!confirm( __('Remove from cart?') )) return;

            let cid = e.currentTarget.dataset.cid;

            _this.cart.items = _this.cart.items.filter(item => cid != item.cid);

            _this.saveCart();

            _this.refreshCartHTML();
        });

        // qty listener

        // modal listener
        onClick(".cart-details h3 a", (e) => {

            _this.toggleCart(true);

            _this._this.listeners.renderModal(e);
        });
    
        this.refreshCartCountAndTotals();
    }

    /**
     * Save cart to loal storage
     * 
     */
    saveCart(){

        localStorage.setItem('sk-design-cart', JSON.stringify(this.cart));
    }
    
    /**
     * Render cart if products are present
     * 
     */
    renderCart(){

        localStorage.setItem('sk-design-cart', JSON.stringify(this.cart));
    }

    /**
     * Clear cart
     * 
     */
    clearCart(){

        localStorage.removeItem('sk-design-cart');
    }
    
    /**
     * Render cart HTML
     * 
     */
    renderCartHTML(){

        if(!document.querySelector('.cd-cart')){ 
            
        document.querySelector('#cart').innerHTML = `
        
        <div class="cd-cart cd-cart--empty js-cd-cart">
            <a href="#0" class="cd-cart__trigger">
                <ul class="cd-cart__count">
                    <li>0</li>
                    <li>0</li>
                </ul>
            </a>
        
            <div class="cd-cart__content">
                <div class="cd-cart__layout">
                    <header class="cd-cart__header">
                    <h4 class="mt-3">${ __html("Cart") }</h4>
                    <span class="cd-cart__undo">Item removed. <a href="#0">Undo</a></span>
                    </header>
                    
                    <div class="cd-cart__body pe-3">
                        <ul>
                            
                        </ul>
                    </div>
            
                    <footer class="cd-cart__footer">
                    <a href="#0" class="cart-checkout">
                        <em>${ __html("Checkout") } - <span></span>
                        <svg class="icon icon--sm d-none" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><line stroke-width="2" stroke-linecap="round" stroke-linejoin="round" x1="3" y1="12" x2="21" y2="12"/><polyline stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="15,6 21,12 15,18 "/></g>
                        </svg>
                        </em>
                    </a>
                    </footer>
                </div>
            </div>
        </div>
        `;

        }
    }

    /**
    * Generates a random string
    * 
    * @param int length_
    * @return string
    */
    randomString = function(length_) {

        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');
        if (typeof length_ !== "number") {
            length_ = Math.floor(Math.random() * chars.length_);
        }
        let str = '';
        for (let i = 0; i < length_; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
}