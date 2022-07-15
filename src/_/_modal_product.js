// https://codyhouse.co/demo/add-to-cart-interaction/index.html
import { onClick, onChange, onKeyUp, toast, __, __attr, __html, getCookie, setCookie } from '@kenzap/k-cloud';
import { Util } from "../_/_cart_util.js"
import { priceFormat, onlyNumbers, degToRad, stringToHash, lazyLoad, spaceID} from "../_/_helpers.js"

export const productModal = {
    
    // cache state locally
    _this: null,

    // render product modal
    render: (_this) => {

        productModal._this = _this;
        
        document.querySelector(".modal-item .modal-title").innerHTML = _this.state.item.title;

        let parts = [], parts_options = '', coating_options = '', color_options = '', parent_list = [];

        // prepare array for coating options
        for(let price of _this.state.sk_settings.price){

            if(price.public){

                if(!parent_list.includes(price.parent)) parent_list.push(price.parent) 
            }
        }

        // coating options
        let ic = localStorage.getItem('input-coating') ? localStorage.getItem('input-coating') : parent_list[0];
        parent_list.forEach((parent, i) => { coating_options += `<option ${ ic == parent ? "selected" : "" } value="${parent}">${parent}</option>`; });
        
        // parts options
        if(_this.state.item.parts){ parts = _this.state.item.parts; }

        // item < parts options
        if(_this.state.item_parent) if(_this.state.item_parent.parts){ parts = _this.state.item_parent.parts; } 

        // price calc model
        if(!_this.state.item.calc_price){ _this.state.item.calc_price = 'default'; }

        // find selected part
        parts.forEach(part => {

            let item_part = _this.state.items.filter(item => { return part.id == item._id });
            if(item_part[0]) parts_options += `<option ${ _this.state.item._id == part.id ? "selected" : "" } data-parent="${ _this.state.item_parent ? _this.state.item_parent._id : _this.state.item._id }" value="${ part.id }">${ item_part[0].title }</option>`;
        });

        // struct breadcrumbs
        if(_this.state.bc[1]){
            _this.state.bc[1] = { id: _this.state.item._id, title: _this.state.item.title };
        }else{
            _this.state.bc.push({ id: _this.state.item._id, title: _this.state.item.title });
        }

        let html = `
        <div class="form-cont">
            <nav style="--bs-breadcrumb-divider: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&quot;);" aria-label="breadcrumb">
                <ol class="breadcrumb"></ol>
            </nav>
            <div class="form-group mt-3">
                <label for="mprice" class="form-label d-none">${ __('Price') }</label>
                <div class="input-group mb-3">
                    <div class="sketch float-start" data-mode="editing" style="max-width:100%;">
                        <div data-index="sketch0" style="position: relative;overflow:scroll;">

                            <img class="images-sketch0 lazys" width="500" height="500" data-index="sketch0" src="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ _this.state.item._id }-1-500x500.jpeg?${ _this.state.item.updated }" data-srcset="https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com/S${ spaceID() }/sketch-${ _this.state.item._id }-1-500x500.jpeg?${ _this.state.item.updated }">
                            <svg id="svg" xmlns="http://www.w3.org/2000/svg">
                                `;
                            
                            let htmlLabels = '', htmlLines = '';
                            _this.state.item.input_fields.forEach((field, i) => {

                                // console.log(field);

                                let points = field.points.split(' '), x, y;
                                let xi = 0, yi = 0;

                                switch(field.type){

                                    case 'polyline':

                                        field.ext = "";
                                        // xi = Math.abs(parseFloat(points[0]) - parseFloat(points[2]));
                                        // yi = Math.abs(parseFloat(points[1]) - parseFloat(points[3]));

                                        x = (parseFloat(points[0]) + parseFloat(points[2])) / 2;
                                        y = (parseFloat(points[1]) + parseFloat(points[3])) / 2;

                                        htmlLines += `
                                        <g data-id="${ field.id }">
                                            <polyline data-id="${ field.id }" points="${ field.points }" style=""></polyline>
                                            <rect data-id="start${ field.id }" x="${ parseFloat(points[0])-4 }" y="${ parseFloat(points[1])-4 }" width="8" height="8" rx="8" "></rect>
                                            <rect data-id="end${ field.id }" x="${ parseFloat(points[2])-4 }" y="${ parseFloat(points[3])-4 }" width="8" height="8" rx="8" ></rect>
                                        </g>
                                        `;

                                    break;
                                    case 'arc':

                                        x = field.params.x;
                                        y = field.params.y;

                                        field.ext = '°';

                                        xi = x;
                                        yi = y;
                                        
                                        let deg = field.params.startAngle + ((field.params.endAngle - field.params.startAngle) / 2);

                                        // console.log("deg" + deg);

                                        x = field.params.x + field.params.radius / 2 + (((field.params.radius*2) * Math.cos(degToRad(deg)))) + 5;;
                                        y = field.params.y + field.params.radius / 2 + (((field.params.radius*2) * Math.sin(degToRad(deg)))) - 5;;

                                        htmlLines += `
                                        <g data-id="${ field.id }">
                                            <path data-id="${ field.id }" d="${ field.points }" stroke-linecap="round" style=""></path>
                                        </g>
                                        `;

                                    break;
                                }
                                
                                htmlLabels += `
                                <div class="svg-input m-2"  style="left:${ x }px;top:${ y }px;" data-id="${ field.id }" >
                                    <label for="input${ field.label }">${ field.label + field.ext }</label>
                                    <input type="text" data-bs-container="body" ${ (i==0 && getCookie("first-time") != "1") ? 'data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="bottom" data-bs-content="'+ __attr("Hit enter to continue") + '"' : '' } class="form-control input-label form-control-sm" autocomplete="off" data-lable=${ field.label } id="input${ field.label }" placeholder="${ field.default }" value="${ field.default }" maxlength="5" tabindex="${ i+1 }" >
                                </div>
                                `;

                            });

                            html += htmlLines;

                            html += '</svg>';

                            html += htmlLabels;

                            html += `
                        </div>
                    </div>
                    <div class="ps-lg-4 ps-0">
                        
                        <div>
                            <div class="form-group mt-3">
                                <div class="input-parts-cnt d-none">
                                    <h4>${ __('Part') }</h4>
                                    <div class="input-group">
                                        <select class="form-select input-parts form-select-lg mb-3">
                                            <option value="${ _this.state.item_parent ? _this.state.item_parent._id : _this.state.item._id }" data-back="true" >${ __html('Choose part') }</option>
                                            ${ parts_options }
                                        </select>
                                    </div>
                                </div>
                                <div class="input-coating-cnt">
                                    <h4>${ __('Coating') }</h4>
                                    <div class="input-group">
                                        <select class="form-select input-coating form-select-lg mb-3">
                                            ${ coating_options }
                                        </select>
                                    </div>
                                </div>
                                <div class="input-color-cnt">
                                    <h4 class="input-group">${ __html('Color') }</h4>
                                    <div class="input-group">
                                        <select class="form-select input-color form-select-lg mb-3" >

                                        </select>
                                    </div>
                                </div>
                                <div class="input-quantity-cnt">
                                    <h4>${ __('Quantity') }</h4>
                                    <div class="input-group">
                                        <input type="text" class="qty form-control input-qty form-select-lg mb-3" value="${ _this.state.item.qty }" >
                                    </div>
                                </div>
                                <div class="input-price-cnt">
                                    <h4>${ __('Price') }</h4>
                                    <div> 
                                        <input type="text" class="price form-control input-price form-select-lg mb-3" value="1" data-total="0" data-price="0" disabled>
                                        <p class="form-text price-desc ${ getCookie("admin") ? "" : "d-none" }"> </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>`;

        document.querySelector(".modal-body").innerHTML = html;
  
        let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        });

        // coating change listener
        onChange('.input-coating', (e) => {

            localStorage.setItem('input-coating', e.currentTarget.value);

            _this.loadColors(e.currentTarget.value);
        });

        // color change listener
        onChange('.input-color', (e) => {

            localStorage.setItem('input-color', e.currentTarget.value);
        });

        // capture enter click event
        onKeyUp('.input-label', (e) => {

            // console.log(e.which);
            if(e.which == 13){

                let tabindex = parseInt(e.currentTarget.getAttribute("tabindex"));

                tabindex+=1;

                // console.log(tabindex);

                if(document.querySelector(".input-label[tabindex='"+tabindex+"']")){

                    document.querySelector(".input-label[tabindex='"+tabindex+"']").focus();
                    document.querySelector(".input-label[tabindex='"+tabindex+"']").select();
                }else{

                    if(!e.currentTarget.classList.contains("qty")){

                        document.querySelector(".qty").focus();
                        document.querySelector(".qty").select();
                    }
                }
            }
        });

        // parts change listener
        onChange('.input-parts', e => {

            const el = document.querySelector(".input-parts");
            // console.log(el.options[el.selectedIndex].value);

            // reset breadcrumbs
            if(el.options[el.selectedIndex].dataset.back) { productModal._this.state.bc = []; }

            let item = productModal._this.state.items.filter(item => { return item._id == el.options[el.selectedIndex].value });
            let item_parent = productModal._this.state.items.filter(item => { return item._id == el.options[el.selectedIndex].dataset.parent });

            productModal._this.state.item = item[0];
            productModal._this.state.item_parent = item_parent[0];

            productModal._this.state.item.qty = 1;

            productModal.render(productModal._this);

            // el.options[el.selectedIndex].value
        });

        // parts select visibility
        if(parts_options){ document.querySelector(".input-parts-cnt").classList.remove('d-none'); }
        // console.log(parts_options);
        // document.querySelector(".input-parts-cnt").classList.remove('d-none');

        // calc price options
        switch(_this.state.item.calc_price){

            // hide price variation input fields
            case 'complex':

                document.querySelector(".input-coating-cnt").classList.add("d-none");
                document.querySelector(".input-color-cnt").classList.add("d-none");
                document.querySelector(".input-quantity-cnt").classList.add("d-none");
                document.querySelector(".input-price-cnt").classList.add("d-none");
                document.querySelector(".modal .btn-primary").classList.add("d-none");
            break;

            default:
                document.querySelector(".modal .btn-primary").classList.remove("d-none");
            break;
        }

        // add to cart listener
        _this.listeners.modalSuccessBtnFunc = (e) => {

            e.preventDefault();

            let obj = {};

            obj['_id'] = _this.state.item._id;
            obj['title'] = _this.state.item.title;
            obj['coating'] = _this.state.modal.querySelector(".input-coating").value;
            obj['color'] = _this.state.modal.querySelector(".input-color").value;
            obj['qty'] = _this.state.modal.querySelector(".input-qty").value;
            obj['price'] = _this.state.modal.querySelector(".input-price").dataset.price;
            obj['total'] = _this.state.modal.querySelector(".input-price").dataset.total;
            obj['formula'] = _this.state.item.formula;
            obj['formula_price'] = _this.state.item.formula_price;
            obj['input_fields'] = _this.state.item.input_fields;
            obj['input_fields_values'] = {};

            // validate quantity
            if(obj['qty'] == ""){

                alert( __("Please enter quantity") );
                return;
            }

            for(let lable of document.querySelectorAll(".input-label")){

                // validate input fields
                if(lable.value == ""){

                    alert( __("Please enter %1$ field", lable.dataset.lable) );
                    return;
                }

                obj['input_fields_values'][lable.id] = lable.value;
            }

            console.log(obj['total']);

            // validate price
            if(isNaN(obj['total']) || obj['total'] == 0){

                alert( __("Make sure all fields are entered properly") );
                return;
            }

            // unique cart id
            obj['cid'] = stringToHash(obj.coating + obj.color + obj.id + JSON.stringify(obj.input_fields_values));

            _this.state.cart.addToCart(obj);

            // console.log(obj);

            _this.state.modal.cont.hide();

            toast( __('Added to cart') );

            // setTimeout(() => _this.initListeners('partial'), 10);
        }

        // only numbers
        onKeyUp(".modal-item .svg-input input", _this.listeners.refreshSketchPrice);
        onKeyUp(".modal-item .qty", _this.listeners.refreshSketchPrice);

        // input key change listener
        onlyNumbers(".modal-item .svg-input input", [8]);
        onlyNumbers(".modal-item .qty", [8]);

        _this.listeners.refreshSketchPrice();

        // capture svg-input focus event
        _this.listeners.focusListener();

        // focus first input field
        if(document.querySelector(".svg-input [tabindex='1']")){
            
            document.querySelector(".svg-input [tabindex='1']").focus();
            document.querySelector(".svg-input [tabindex='1']").select();
        }

        _this.loadColors(ic);

        productModal.bc();

        lazyLoad();

        setCookie("first-time", "1");

        // document.querySelector("[data-toggle=popover]").popover();
    },

    // render breadcrumbs
    bc: () => {

        let _this = productModal._this;

        let html = '';
        _this.state.bc.forEach((el, i) => {

            // last link
            if (_this.state.bc.length == i+1) {

                html += `<li class="breadcrumb-item" data-id="${ el.id }">${ el.title }</li>`;

            // prev links
            }else{

                html += `<li class="breadcrumb-item "><a class="bc-click" data-id="${ el.id }" href="#">${ el.title }</a></li>`;
            }
            // ${ _this.state.bc.length == 0 ? "active" : "" }
        });
        
        document.querySelector(".breadcrumb").innerHTML = html;

        onClick(".bc-click", (e) => {

            e.preventDefault();

            productModal._this.state.bc = [];

            let item = productModal._this.state.items.filter(item => { return item._id == e.currentTarget.dataset.id});

            productModal._this.state.item = item[0];

            _this.state.item.qty = 1;

            productModal.render(productModal._this);
        });

        // <li class="breadcrumb-item"><a href="#">K-style rainwater system</a></li>
        // <li class="breadcrumb-item active" aria-current="page">Downspout strap</li>
    }
}