import { getCookie, getSiteId, simulateClick, headers } from '@kenzap/k-cloud';

export const CDN = "https://cdn.kenzap.cloud/";
export const API_KEY = "Qz3fOs8Ghi7rpaW8BOlNgUyo7ANWYoKbRoUa8UkYd2I4FlAgUYFqzPM33IxqoFYa";

export const spaceID = () => {

    return "1002170"
}

export const sortAlphaNum = (a, b) => a['title'].localeCompare(b['title'], 'en', { numeric: true })

/**
* Generates a random string
* 
* @param int length_
* @return string
*/
export const randomString = (length_) => {

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

export const stringToHash = str => {

    let hash = 0
    for (let i = 0; i < str.length; ++i)
        hash = Math.imul(31, hash) + str.charCodeAt(i)
  
    hash = 'c'+Math.abs(hash);
    
    // console.log(hash);

    return hash;
}

export const mt = (val) => {

    return (""+val).length < 2 ? "0"+val : val;
}

export const getProductId = () => {
    
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id') ? urlParams.get('id') : "";
    return id;
}

export const getProductIdFromLink = () => {
    
    let url = new URL(window.location.href);
    let id = url.pathname.trim().split('/').slice(-2)[0];
    return id;
}

export const replaceQueryParam = (param, newval, search) => {

    let regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    let query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

export const getPageNumberOld = () => {

    let url = window.location.href.split('/');
    let page = url[url.length-1];
    let pageN = 1;
    if(page.indexOf('page')==0){
      pageN = page.replace('page', '').replace('#', '');
    }
    // console.log(pageN);
    return parseInt(pageN);
}

export const getPageNumber = () => {

    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page') ? urlParams.get('page') : 1;

    return parseInt(page);
}

export const getPagination = (__, meta, cb) => {

    if(typeof(meta) === 'undefined'){ document.querySelector("#listing_info").innerHTML = __('no records to display'); return; }

    let offset = meta.limit+meta.offset;
    if(offset>meta.total_records) offset = meta.total_records;

    document.querySelector("#listing_info").innerHTML = __("Showing %1$ to %2$ of %3$ entries", (1+meta.offset), (offset), meta.total_records);
    //  "Showing "+(1+meta.offset)+" to "+(offset)+" of "+meta.total_records+" entries";

    let pbc = Math.ceil(meta.total_records / meta.limit);
    document.querySelector("#listing_paginate").style.display = (pbc < 2) ? "none" : "block";

    let page = getPageNumber(); 
    let html = '<ul class="pagination d-flex justify-content-end pagination-flat mb-0">';
    html += '<li class="paginate_button page-item previous" id="listing_previous"><a href="#" aria-controls="order-listing" data-type="prev" data-page="0" tabindex="0" class="page-link"><span aria-hidden="true">&laquo;</span></li>';
    let i = 0;
    while(i<pbc){

        i++; 
        if(((i >= page-3) && (i <= page)) || ((i <= page+3) && (i >=page))){

            html += '<li class="paginate_button page-item '+((page==i)?'active':'')+'"><a href="#" aria-controls="order-listing" data-type="page" data-page="'+i+'" tabindex="0" class="page-link">'+(page==i?i:i)+'</a></li>';      
        }
    }  
    html += '<li class="paginate_button page-item next" id="order-listing_next"><a href="#" aria-controls="order-listing" data-type="next" data-page="2" tabindex="0" class="page-link"><span aria-hidden="true">&raquo;</span></a></li>';
    html += '</ul>'

    document.querySelector("#listing_paginate").innerHTML = html;

    let page_link = document.querySelectorAll(".page-link");
    for (const l of page_link) {
        
        l.addEventListener('click', function(e) {

            let p = parseInt(getPageNumber());
            let ps = p;
            switch(l.dataset.type){ 
                case 'prev': p-=1; if(p<1) p = 1; break;
                case 'page': p=l.dataset.page; break;
                case 'next': p+=1; if(p>pbc) p = pbc; break;
            }
            
            // update url
            if (window.history.replaceState) {

                // let url = window.location.href.split('/page');
                // let urlF = (url[0]+'/page'+p).replace('//page', '/page');

                let str = window.location.search;
                str = replaceQueryParam('page', p, str);
                // window.location = window.location.pathname + str

                // prevents browser from storing history with each change:
                window.history.replaceState("kenzap-cloud", document.title, window.location.pathname + str);
            }

            // only refresh if page differs
            if(ps!=p) cb();
            
            e.preventDefault();
            return false;
        });
    }
}

export const formatStatus = (__, st) => {

    st = parseInt(st); 
    switch(st){ 
      case 0: return '<div class="badge bg-warning text-dark fw-light">' + __('Draft') + '</div>';
      case 1: return '<div class="badge bg-primary fw-light">' + __('Published') + '</div>';
      case 3: return '<div class="badge bg-secondary fw-light">' + __('Unpublished') + '</div>';
      default: return '<div class="badge bg-secondary fw-light">' + __('Drafts') + '</div>';
    }
}

/**
    * Render price
    * @public
    */
 export const priceFormat = function(_this, price) {

    price = makeNumber(price);

    price = (Math.round(parseFloat(price) * 100)/100).toFixed(2);
    
    switch(_this.state.settings.currency_symb_loc){
        case 'left': price = _this.state.settings.currency_symb + price; break;
        case 'right': price = price + _this.state.settings.currency_symb; break;
        case 'left_space': price = _this.state.settings.currency_symb + ' ' + price; break;
        case 'right_space': price = price + ' ' + _this.state.settings.currency_symb; break;
    }

    return price;
}

export const makeNumber = function(price) {

    price = price ? price : 0;
    price = parseFloat(price);
    price = Math.round(price * 100) / 100;
    return price;
}

export const formatTime = (__, timestamp) => {
	
    const d = new Date(parseInt(timestamp) * 1000);
    return d.toLocaleDateString();

    let a = new Date(timestamp * 1000);
    let months = [__('Jan'), __('Feb'), __('Mar'), __('Apr'), __('May'), __('Jun'), __('Jul'), __('Aug'), __('Sep'), __('Oct'), __('Nov'), __('Dec')];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = date + ' ' + month + ' ' + year; // + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

// numbers only with allowed exceptions
export const onlyNumbers = (sel, chars) => {

    if(!document.querySelector(sel)) return;

    for(let el of document.querySelectorAll(sel)){
    
        el.addEventListener('keypress', (e) => {

            // console.log(e.which);

            if((!chars.includes(e.which) && isNaN(String.fromCharCode(e.which))) || e.which == 32 || (document.querySelector(sel).value.includes(String.fromCharCode(e.which)) && chars.includes(e.which))){

                // stop character from entering input
                e.preventDefault(); 
                return false;
            }
        });
    }
}

// nums only validation
export const numsOnly = (e, max) => {

    // Only ASCII charactar in that range allowed 
    var ASCIICode = (e.which) ? e.which : e.keyCode 
    if (ASCIICode > 31 && ASCIICode != 46 && (ASCIICode < 48 || ASCIICode > 57)) 
    return false; 

    if(parseFloat(e.target.value)>max) 
    return false; 

    let dec = e.target.value.split('.');
    if(dec.length>1)
    if(dec[1].length>1)
        return false;
    
    return true; 
}

export const onClick = (sel, fn) => {

    // console.log('onClick');
    if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

        e.removeEventListener('click', fn, true);
        e.addEventListener('click', fn, true);
    }
}

// time elapsed since creation 
export const timeConverterAgo = (__, now, time) => {

    now = parseInt(now);
    time = parseInt(time);

    // parse as elapsed time
    let past = now - time;
    if(past < 60) return __('moments ago');
    if(past < 3600) return __('%1$ minutes ago', parseInt(past / 60));
    if(past < 86400) return  __('%1$ hours ago', parseInt(past / 60 / 60));

    // process as normal date
    var a = new Date(time * 1000);
    var months = [ __('Jan'), __('Feb'), __('Mar'), __('Apr'), __('May'), __('Jun'), __('Jul'), __('Aug'), __('Sep'), __('Oct'), __('Nov'), __('Dec') ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year; // + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

export const parseVariations = (_this, product) => {

    let html_vars = '';
    if(typeof(product.variations !== 'undefined'))
    for(let v in product.variations){

        // variation type
        let type = '';	
        if(product.variations[v].type=='checkbox') type = 'check';
        if(product.variations[v].type=='radio')    type = 'radio';

        // struct variation
        html_vars += '\
        <b>' + __(product.variations[v].title) + (product.variations[v].required == '1' ? ' <span class="tag">'+__('required')+'</span>':'')+'</b>\
        <div class="kp-'+type+'" >';

        // variation labels
        for(let d in product.variations[v].data){

            let checked = false;
            // for public qr feed
            // if(typeof(cart.state.product.variations[v]) !== 'undefined' && typeof(cart.state.product.variations[v].list) !== 'undefined' && typeof(cart.state.product.variations[v].list["_"+d]) !== 'undefined'){ checked = true; }
            
            // verify variation price validity
            product.variations[v].data[d]['price'] = makeNumber(product.variations[v].data[d]['price']);

            switch(type){
                case 'check':

                html_vars += '\
                    <label>\
                        <input type="checkbox" data-required="'+product.variations[v].required+'" data-indexv="'+v+'" data-index="'+d+'" data-title="'+product.variations[v].data[d]['title']+'" data-titlev="'+__(product.variations[v].title)+'" data-price="'+product.variations[v].data[d]['price']+'" '+(checked?'checked="checked"':'')+'>\
                        <div class="checkbox">\
                            <svg width="20px" height="20px" viewBox="0 0 20 20">\
                                <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>\
                                <polyline points="4 11 8 15 16 6"></polyline>\
                            </svg>\
                        </div>\
                        <span>'+__(product.variations[v].data[d]['title'])+'</span>\
                        <div class="price">+ '+priceFormat(_this, product.variations[v].data[d]['price'])+'</div>\
                    </label>';
                
                break;
                case 'radio':

                html_vars += '\
                    <label>\
                        <input type="radio" data-required="'+product.variations[v].required+'" data-indexv="'+v+'" name="radio'+v+'" data-index="'+d+'" data-title="'+product.variations[v].data[d]['title']+'" data-titlev="'+__(product.variations[v].title)+'" data-price="'+product.variations[v].data[d]['price']+'" '+(checked?'checked="checked"':'')+' />\
                        <span>'+__(product.variations[v].data[d]['title'])+'</span>\
                        <div class="price">+ '+priceFormat(_this, product.variations[v].data[d]['price'])+'</div>\
                    </label>';
                
                break;
            }
        }

        html_vars += '</div>';
    }

    return html_vars;
}

export const escape = (htmlStr) => {

    return htmlStr.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");        
 
}

export const unescape = (htmlStr) => {

    htmlStr = htmlStr.replace(/&lt;/g , "<");	 
    htmlStr = htmlStr.replace(/&gt;/g , ">");     
    htmlStr = htmlStr.replace(/&quot;/g , "\"");  
    htmlStr = htmlStr.replace(/&#39;/g , "\'");   
    htmlStr = htmlStr.replace(/&amp;/g , "&");
    return htmlStr;
}

export const ecommerceUpdates = (_this, source, cb) => {

    // do API query
    fetch('https://api-v1.kenzap.cloud/ecommerce/', {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
            query: {
                updates: {
                    type:       'updates',
                    source:     source,
                }
            }
        })
    })
    .then(response => response.json())
    .then(response => {

        if(response.success){

            // do callback
            cb(response);
            
            // parse notifications
            renderNotifications(_this, response.messages);
            
        }else{


        }
    })
    .catch(error => { // parseApiError(error); 
    });
}

export const isMobile = () => {

    const nav = navigator.userAgent.toLowerCase();
    return (
        nav.match(/iphone/i) || nav.match(/ipod/i) || nav.match(/ipad/i) || nav.match(/android/i)
    );
}

// play notification sound. Ex.: when new order received
export const playSound = (_this, max) => {
 
    // if(!max) max = _this.state.playSound.max_times;

    _this.state.playSound.n = 0;

    if(_this.state.playSound.timer) clearInterval(_this.state.playSound.timer);

    if(_this.state.playSound.allowed) _this.state.playSound.audio.play();

    console.log("playing " + _this.state.playSound.allowed);

    try{
        if(_this.state.playSound.allowed && isMobile()) window.navigator.vibrate(200);
    }catch{

    }

    if(max==1) return;

    _this.state.playSound.timer = setInterval(() => {

        if(!_this.state.playSound.allowed) return;
         
        _this.state.playSound.audio.play();

        if(_this.state.playSound.n > max){ clearInterval(_this.state.playSound.timer) }

        _this.state.playSound.n += 1;

    }, 5000);

    // console.log('playSound');
}

export const lazyLoad = () => {

    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    if (document.querySelector("body").dataset.lazyLoading != '1'){

        document.querySelector("body").dataset.lazyLoading = '1';
        setTimeout(function() {
            lazyImages.forEach(function(lazyImage) {
                if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {

                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.srcset = lazyImage.dataset.srcset;
                    lazyImage.classList.remove("lazy");
                    lazyImages = lazyImages.filter(function(image) {
                        return image !== lazyImage;
                    });
                }
            });
            document.querySelector("body").dataset.lazyLoading = '0';
        }, 0);
    }
}

export const renderNotifications = (_this, messages) => {

    let html = '';

    let play = false;

    // html
    messages.forEach(msg => {

        if(!_this.state.playSound.nids.includes(msg._id)){ _this.state.playSound.nids.push(msg._id); play = true; }

        if(!document.querySelector('#contents .container [data-id="'+msg._id+'"]')){
        
            html += `

            <div class="alert alert-${ msg.color } alert-dismissible fade show" role="alert" data-id="${ msg._id }">
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-square flex-shrink-0 me-2" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                    </svg>
                    <div>
                    ${ msg.msg }
                    </div>
                </div>
                <button type="button" class="btn-close btn-dismiss-notify" data-bs-dismiss="alert" aria-label="Close" data-id="${ msg._id }"></button>
            </div>`;
        }
    });

    // play sound
    if(play){ console.log('notify play sound'); playSound(_this, 1); _this.getData(); }

    if(document.querySelector('#contents .container')) document.querySelector('#contents .container').insertAdjacentHTML("afterbegin", html);

    // listeners
    onClick('.btn-dismiss-notify', (e) => {

        // do API query
        fetch('https://api-v1.kenzap.cloud/ecommerce/', {
            method: 'post',
            headers: headers,
            body: JSON.stringify({
                query: {
                    updates: {
                        type:       'dismiss',
                        id:         e.currentTarget.dataset.id,
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            if(response.success){



            }else{


            }
        })
        .catch(error => { // parseApiError(error); 
        });
    });

    // order open listener
    if(document.querySelector('.order-details')) for( let el of document.querySelectorAll('.order-details') ){

        if(el.dataset.assigned == "1") return;

        el.dataset.assigned = 1;

        el.addEventListener('click', (e) => {

            let el = document.querySelector(".view-order[data-id='"+e.currentTarget.dataset.id+"']");

            simulateClick(el);

        }, true);
    }
}

export const printReceipt = (_this, order) => {

    // vars
    let o = order, data = {}, date = new Date();

    // 58mm wide thermal printers are best to display 32 chars per line
    let row = (txt, end_ofst) => {

        let output = '', max_char = 32 - end_ofst, max_ofst = 4, ofst_prev = 0, ofst = 0, ci = 0;
        // console.log(max_char);
        for(let i = 0; i < Math.ceil(txt.length / max_char); i++){

            // add new line print from second loop only
            if(i>0) output += '\n[L]';

            // ofst store first available whitespace break in words
            ofst = ci = 0;
            for(let e = max_ofst; e > -1 * max_ofst; e--){

                ci = ((max_char + ofst_prev) * i) + max_char + e; if(txt[ci] == ' ' || ci == txt.length){ ofst += e; break; }
            }

            // add line row
            output += txt.substr((max_char + ofst_prev) * i, max_char + ofst);

            // line ends earlier than expected, skip loop
            if(ci == txt.length) break;

            ofst_prev = ofst;
        }

        return output;
    };

    // debug vs actual print
    data.debug = false;

    // get receipt template
    data.print = _this.state.settings.receipt_template;

    console.log(data.print);

    // order id
    data.print = data.print.replace(/{{order_id}}/g, o.id);

    // current time
    data.print = data.print.replace(/{{date_time}}/g, date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', }));

    // order items
    let items = '';
    for(let i in o.items){

        console.log(__(o.items[i].title));

        let total = priceFormat(_this, o.items[i].total);
        let end_ofst = (o.items[i].qty+"").length + (total+"").length + 3;
        items += `[L]<b>${ o.items[i].qty } X ${ row(__(o.items[i].title), end_ofst) }</b>[R]${ total }\n`;
        for(let v in o.items[i].variations){

            items += `[L] ${ row(__(o.items[i].variations[v].title), 1) }:`;
            for(let l in  o.items[i].variations[v].list) items += ` ${ o.items[i].variations[v].list[l].title },`;

            if(items.endsWith(',')) items = items.substring(0, items.length - 1) + '\n';

            // parse variation list
            // let list = ''; for(let l in item[x].variations[v].list) list += item[x].variations[v].list[l].title + " ";
            // vars += '<div><b>' + item[x].variations[v].title + "</b> <span>" + list + "</span></div> ";
    
            // // meal note
            // if(item[x].variations[v].note !== undefined && item[x].variations[v].note.length > 0) vars += "<div><b>" + __('Note') + "</b> " + item[x].variations[v].note + "</div> ";
        }
    }
    if(items.endsWith('\n')) items = items.substring(0, items.length - 2);
    data.print = data.print.replace(/{{order_items}}/g, items);

    // order note
    let note = !o.note || o.note == '<br>' ? '' : o.note;
    if(note.length>0){
        //  data.print += '[C]================================';
        data.print = data.print.replace(/{{order_note}}/g, '[C]================================\n' + note + '\n[C]================================\n');
    }
    // if(note.length>0) data.print += '[C]================================';

    // order totals
    data.print = data.print.replace(/{{total}}/g, priceFormat(_this, o.price.total));
    data.print = data.print.replace(/{{tax_total}}/g, priceFormat(_this, o.price.tax_total));
    data.print = data.print.replace(/{{discount_total}}/g, priceFormat(_this, o.price.discount_total));
    data.print = data.print.replace(/{{grand_total}}/g, priceFormat(_this, o.price.grand_total));


    let order_totals  = '';
    order_totals += '[L]Subtotal[R]' + priceFormat(_this, o.price.total) + '\n';
    if(o.price.discount_total > 0) order_totals += '[L]'+__('Discount')+'[R]-' + priceFormat(_this, o.price.discount_total) + '\n';
    if(o.price.fee_total > 0) order_totals += '[L]'+_this.state.settings.fee_display+'[R]' + priceFormat(_this, o.price.fee_total) + '\n';
    if(o.price.tax_total > 0) order_totals += '[L]'+_this.state.settings.tax_display+'[R]' + priceFormat(_this, o.price.tax_total) + '\n';
    if(o.price.grand_total > 0) order_totals += '[L]'+__('Grand Total')+'[R]' + priceFormat(_this, o.price.grand_total);

    data.print = data.print.replace(/{{order_totals}}/g, order_totals);

    // qr link
    data.print = data.print.replace(/{{qr_link}}/g, 'http://'+_this.state.qr_settings.slug + '.kenzap.site');
    data.print = data.print.replace(/{{qr_number}}/g, document.querySelector('#qr-number').value);

        
    // let click = document.querySelector(".print-order[data-id='"+e.currentTarget.dataset.id+"']");

    // click.setAttribute('href', 'kenzapprint://kenzapprint.app?data='+encodeURIComponent(JSON.stringify(data)));

    // e.currentTarget.setAttribute('href', 'kenzapprint://kenzapprint.app?data='+JSON.stringify(data));

    // alert(data.print);

    let str = 'kenzapprint://kenzapprint.app?data='+encodeURIComponent(JSON.stringify(data));
    
    if(data.debug) { console.log(data.print); console.log(str); }

    return str;
}

export const printQR = (_this, order) => {

    // vars
    let o = order, data = {}, date = new Date();

    // debug vs actual print
    data.debug = false;

    // get qr template
    data.print = _this.state.settings.qr_template;

    // qr link
    data.print = data.print.replace(/{{qr_link}}/g, 'http://'+_this.state.qr_settings.slug + '.kenzap.site');
    data.print = data.print.replace(/{{qr_number}}/g, document.querySelector('#qr-number').value);

    if(data.debug) { console.log(data.print); console.log(str); }

    let str = 'kenzapprint://kenzapprint.app?data='+encodeURIComponent(JSON.stringify(data));

    return str;
}

/**
 * Converts degrees to radians
 * 
 * @param deg {Integer}
 * @returns {Integer} - radians
 */
export const degToRad = (deg) => {

    return (deg - 90) * Math.PI / 180.0;
}

/*
* Load additional JS or CSS depencies
*
* @param    dep       dependecy. Ex.: hiebee.min.js 
* @param    cb        function to call after script is loaded (optional)       
* @return 	{Boolen} 	result status 
* 
*/
export const loadAddon = (dep, version, cb) => {

    // dependency already loaded, skip
    if(document.getElementById(dep)){ if(typeof cb === 'function') cb.call(); return; }

    // detect dependency type
    let t = dep.split('.').slice(-1)[0];
    // console.log(dep+'loadAddon'+t);
    switch(t){
      case 'js':
        
        let js = document.createElement("script");
        js.setAttribute("src", dep);
        js.id = dep;
        js.onload = js.onreadystatechange = function() {
 
          if(!this.readyState || this.readyState == 'complete')
            if(typeof cb === 'function') cb.call();
        };
        document.body.appendChild(js);
        
      break;
      case 'css':

        var head  = document.getElementsByTagName('head')[0];
        var css  = document.createElement('link');
        css.id   = dep;
        css.rel  = 'stylesheet';
        css.type = 'text/css';
        css.href = dep;
        head.appendChild(css);

      break;
    }
}

/**
 * @name setCookie
 * @description Set cookie by its name to all .kenzap.cloud subdomains
 * @param {string} name - Cookie name.
 * @param {string} value - Cookie value.
 * @param {string} days - Number of days when cookie expires.
 */
 export const setCookie = (name, value, days) => {

    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = ";expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (escape(value) || "") + expires + ";path=/"; 
}

export const getCurrencies = () => {

    // length 164
    return [
        {"name":"Afghan Afghani","code":"AFA","symbol":"؋"},
        {"name":"Albanian Lek","code":"ALL","symbol":"Lek"},
        {"name":"Algerian Dinar","code":"DZD","symbol":"دج"},
        {"name":"Angolan Kwanza","code":"AOA","symbol":"Kz"},
        {"name":"Argentine Peso","code":"ARS","symbol":"$"},
        {"name":"Armenian Dram","code":"AMD","symbol":"֏"},
        {"name":"Aruban Florin","code":"AWG","symbol":"ƒ"},
        {"name":"Australian Dollar","code":"AUD","symbol":"$"},
        {"name":"Azerbaijani Manat","code":"AZN","symbol":"m"},
        {"name":"Bahamian Dollar","code":"BSD","symbol":"B$"},
        {"name":"Bahraini Dinar","code":"BHD","symbol":".د.ب"},
        {"name":"Bangladeshi Taka","code":"BDT","symbol":"৳"},
        {"name":"Barbadian Dollar","code":"BBD","symbol":"Bds$"},
        {"name":"Belarusian Ruble","code":"BYR","symbol":"Br"},
        {"name":"Belgian Franc","code":"BEF","symbol":"fr"},
        {"name":"Belize Dollar","code":"BZD","symbol":"$"},
        {"name":"Bermudan Dollar","code":"BMD","symbol":"$"},
        {"name":"Bhutanese Ngultrum","code":"BTN","symbol":"Nu."},
        {"name":"Bitcoin","code":"BTC","symbol":"฿"},
        {"name":"Bolivian Boliviano","code":"BOB","symbol":"Bs."},
        {"name":"Bosnia-Herzegovina Convertible Mark","code":"BAM","symbol":"KM"},
        {"name":"Botswanan Pula","code":"BWP","symbol":"P"},
        {"name":"Brazilian Real","code":"BRL","symbol":"R$"},
        {"name":"British Pound Sterling","code":"GBP","symbol":"£"},
        {"name":"Brunei Dollar","code":"BND","symbol":"B$"},
        {"name":"Bulgarian Lev","code":"BGN","symbol":"Лв."},
        {"name":"Burundian Franc","code":"BIF","symbol":"FBu"},
        {"name":"Cambodian Riel","code":"KHR","symbol":"KHR"},
        {"name":"Canadian Dollar","code":"CAD","symbol":"$"},
        {"name":"Cape Verdean Escudo","code":"CVE","symbol":"$"},
        {"name":"Cayman Islands Dollar","code":"KYD","symbol":"$"},
        {"name":"CFA Franc BCEAO","code":"XOF","symbol":"CFA"},
        {"name":"CFA Franc BEAC","code":"XAF","symbol":"FCFA"},
        {"name":"CFP Franc","code":"XPF","symbol":"₣"},
        {"name":"Chilean Peso","code":"CLP","symbol":"$"},
        {"name":"Chinese Yuan","code":"CNY","symbol":"¥"},
        {"name":"Colombian Peso","code":"COP","symbol":"$"},
        {"name":"Comorian Franc","code":"KMF","symbol":"CF"},
        {"name":"Congolese Franc","code":"CDF","symbol":"FC"},
        {"name":"Costa Rican Colón","code":"CRC","symbol":"₡"},
        {"name":"Croatian Kuna","code":"HRK","symbol":"kn"},
        {"name":"Cuban Convertible Peso","code":"CUC","symbol":"$, CUC"},
        {"name":"Czech Republic Koruna","code":"CZK","symbol":"Kč"},
        {"name":"Danish Krone","code":"DKK","symbol":"Kr."},
        {"name":"Djiboutian Franc","code":"DJF","symbol":"Fdj"},
        {"name":"Dominican Peso","code":"DOP","symbol":"$"},
        {"name":"East Caribbean Dollar","code":"XCD","symbol":"$"},
        {"name":"Egyptian Pound","code":"EGP","symbol":"ج.م"},
        {"name":"Eritrean Nakfa","code":"ERN","symbol":"Nfk"},
        {"name":"Estonian Kroon","code":"EEK","symbol":"kr"},
        {"name":"Ethiopian Birr","code":"ETB","symbol":"Nkf"},
        {"name":"Euro","code":"EUR","symbol":"€"},
        {"name":"Falkland Islands Pound","code":"FKP","symbol":"£"},
        {"name":"Fijian Dollar","code":"FJD","symbol":"FJ$"},
        {"name":"Gambian Dalasi","code":"GMD","symbol":"D"},
        {"name":"Georgian Lari","code":"GEL","symbol":"ლ"},
        {"name":"German Mark","code":"DEM","symbol":"DM"},
        {"name":"Ghanaian Cedi","code":"GHS","symbol":"GH₵"},
        {"name":"Gibraltar Pound","code":"GIP","symbol":"£"},
        {"name":"Greek Drachma","code":"GRD","symbol":"₯, Δρχ, Δρ"},
        {"name":"Guatemalan Quetzal","code":"GTQ","symbol":"Q"},
        {"name":"Guinean Franc","code":"GNF","symbol":"FG"},
        {"name":"Guyanaese Dollar","code":"GYD","symbol":"$"},
        {"name":"Haitian Gourde","code":"HTG","symbol":"G"},
        {"name":"Honduran Lempira","code":"HNL","symbol":"L"},
        {"name":"Hong Kong Dollar","code":"HKD","symbol":"$"},
        {"name":"Hungarian Forint","code":"HUF","symbol":"Ft"},
        {"name":"Icelandic króna","code":"ISK","symbol":"kr"},
        {"name":"Indian Rupee","code":"INR","symbol":"₹"},
        {"name":"Indonesian Rupiah","code":"IDR","symbol":"Rp"},
        {"name":"Iranian Rial","code":"IRR","symbol":"﷼"},
        {"name":"Iraqi Dinar","code":"IQD","symbol":"د.ع"},
        {"name":"Israeli New Sheqel","code":"ILS","symbol":"₪"},
        {"name":"Italian Lira","code":"ITL","symbol":"L,£"},
        {"name":"Jamaican Dollar","code":"JMD","symbol":"J$"},
        {"name":"Japanese Yen","code":"JPY","symbol":"¥"},
        {"name":"Jordanian Dinar","code":"JOD","symbol":"ا.د"},
        {"name":"Kazakhstani Tenge","code":"KZT","symbol":"лв"},
        {"name":"Kenyan Shilling","code":"KES","symbol":"KSh"},
        {"name":"Kuwaiti Dinar","code":"KWD","symbol":"ك.د"},
        {"name":"Kyrgystani Som","code":"KGS","symbol":"лв"},
        {"name":"Laotian Kip","code":"LAK","symbol":"₭"},
        {"name":"Latvian Lats","code":"LVL","symbol":"Ls"},
        {"name":"Lebanese Pound","code":"LBP","symbol":"£"},
        {"name":"Lesotho Loti","code":"LSL","symbol":"L"},
        {"name":"Liberian Dollar","code":"LRD","symbol":"$"},
        {"name":"Libyan Dinar","code":"LYD","symbol":"د.ل"},
        {"name":"Lithuanian Litas","code":"LTL","symbol":"Lt"},
        {"name":"Macanese Pataca","code":"MOP","symbol":"$"},
        {"name":"Macedonian Denar","code":"MKD","symbol":"ден"},
        {"name":"Malagasy Ariary","code":"MGA","symbol":"Ar"},
        {"name":"Malawian Kwacha","code":"MWK","symbol":"MK"},
        {"name":"Malaysian Ringgit","code":"MYR","symbol":"RM"},
        {"name":"Maldivian Rufiyaa","code":"MVR","symbol":"Rf"},
        {"name":"Mauritanian Ouguiya","code":"MRO","symbol":"MRU"},
        {"name":"Mauritian Rupee","code":"MUR","symbol":"₨"},
        {"name":"Mexican Peso","code":"MXN","symbol":"$"},
        {"name":"Moldovan Leu","code":"MDL","symbol":"L"},
        {"name":"Mongolian Tugrik","code":"MNT","symbol":"₮"},
        {"name":"Moroccan Dirham","code":"MAD","symbol":"MAD"},
        {"name":"Mozambican Metical","code":"MZM","symbol":"MT"},
        {"name":"Myanmar Kyat","code":"MMK","symbol":"K"},
        {"name":"Namibian Dollar","code":"NAD","symbol":"$"},
        {"name":"Nepalese Rupee","code":"NPR","symbol":"₨"},
        {"name":"Netherlands Antillean Guilder","code":"ANG","symbol":"ƒ"},
        {"name":"New Taiwan Dollar","code":"TWD","symbol":"$"},
        {"name":"New Zealand Dollar","code":"NZD","symbol":"$"},
        {"name":"Nicaraguan Córdoba","code":"NIO","symbol":"C$"},
        {"name":"Nigerian Naira","code":"NGN","symbol":"₦"},
        {"name":"North Korean Won","code":"KPW","symbol":"₩"},
        {"name":"Norwegian Krone","code":"NOK","symbol":"kr"},
        {"name":"Omani Rial","code":"OMR","symbol":".ع.ر"},
        {"name":"Pakistani Rupee","code":"PKR","symbol":"₨"},
        {"name":"Panamanian Balboa","code":"PAB","symbol":"B/."},
        {"name":"Papua New Guinean Kina","code":"PGK","symbol":"K"},
        {"name":"Paraguayan Guarani","code":"PYG","symbol":"₲"},
        {"name":"Peruvian Nuevo Sol","code":"PEN","symbol":"S/."},
        {"name":"Philippine Peso","code":"PHP","symbol":"₱"},
        {"name":"Polish Zloty","code":"PLN","symbol":"zł"},
        {"name":"Qatari Rial","code":"QAR","symbol":"ق.ر"},
        {"name":"Romanian Leu","code":"RON","symbol":"lei"},
        {"name":"Russian Ruble","code":"RUB","symbol":"₽"},
        {"name":"Rwandan Franc","code":"RWF","symbol":"FRw"},
        {"name":"Salvadoran Colón","code":"SVC","symbol":"₡"},
        {"name":"Samoan Tala","code":"WST","symbol":"SAT"},
        {"name":"Saudi Riyal","code":"SAR","symbol":"﷼"},
        {"name":"Serbian Dinar","code":"RSD","symbol":"din"},
        {"name":"Seychellois Rupee","code":"SCR","symbol":"SRe"},
        {"name":"Sierra Leonean Leone","code":"SLL","symbol":"Le"},
        {"name":"Singapore Dollar","code":"SGD","symbol":"$"},
        {"name":"Slovak Koruna","code":"SKK","symbol":"Sk"},
        {"name":"Solomon Islands Dollar","code":"SBD","symbol":"Si$"},
        {"name":"Somali Shilling","code":"SOS","symbol":"Sh.so."},
        {"name":"South African Rand","code":"ZAR","symbol":"R"},
        {"name":"South Korean Won","code":"KRW","symbol":"₩"},
        {"name":"Special Drawing Rights","code":"XDR","symbol":"SDR"},
        {"name":"Sri Lankan Rupee","code":"LKR","symbol":"Rs"},
        {"name":"St. Helena Pound","code":"SHP","symbol":"£"},
        {"name":"Sudanese Pound","code":"SDG","symbol":".س.ج"},
        {"name":"Surinamese Dollar","code":"SRD","symbol":"$"},
        {"name":"Swazi Lilangeni","code":"SZL","symbol":"E"},
        {"name":"Swedish Krona","code":"SEK","symbol":"kr"},
        {"name":"Swiss Franc","code":"CHF","symbol":"CHf"},
        {"name":"Syrian Pound","code":"SYP","symbol":"LS"},
        {"name":"São Tomé and Príncipe Dobra","code":"STD","symbol":"Db"},
        {"name":"Tajikistani Somoni","code":"TJS","symbol":"SM"},
        {"name":"Tanzanian Shilling","code":"TZS","symbol":"TSh"},
        {"name":"Thai Baht","code":"THB","symbol":"฿"},
        {"name":"Tongan Pa'anga","code":"TOP","symbol":"$"},
        {"name":"Trinidad & Tobago Dollar","code":"TTD","symbol":"$"},
        {"name":"Tunisian Dinar","code":"TND","symbol":"ت.د"},
        {"name":"Turkish Lira","code":"TRY","symbol":"₺"},
        {"name":"Turkmenistani Manat","code":"TMT","symbol":"T"},
        {"name":"Ugandan Shilling","code":"UGX","symbol":"USh"},
        {"name":"Ukrainian Hryvnia","code":"UAH","symbol":"₴"},
        {"name":"United Arab Emirates Dirham","code":"AED","symbol":"إ.د"},
        {"name":"Uruguayan Peso","code":"UYU","symbol":"$"},
        {"name":"US Dollar","code":"USD","symbol":"$"},
        {"name":"Uzbekistan Som","code":"UZS","symbol":"лв"},
        {"name":"Vanuatu Vatu","code":"VUV","symbol":"VT"},
        {"name":"Venezuelan  Bolívar","code":"VEF","symbol":"Bs"},
        {"name":"Vietnamese Dong","code":"VND","symbol":"₫"},
        {"name":"Yemeni Rial","code":"YER","symbol":"﷼"},
        {"name":"Zambian Kwacha","code":"ZMK","symbol":"ZK"}
    ];
}