import { escape, unescape } from "../_/_helpers.js"

export class Polyline{
    
    constructor(data) {
 
        this.data = data;

        this.id = data.id ? data.id : this.genID(6);

        this.mode = data.mode ? data.mode : 'drawing';

        this.rect = data.rect ? data.rect : '';

        this.selected = null;

        this.style = { 
            stroke_width: '3px', 
            stroke: '#00F',
            fill: 'rgba(255, 255, 255, 0)'
        }

        // console.log(this.id);

        // if(this.id.includes('start')){
        //     this.id = this.id.replace('start', '');    
        //     this.rect = 'start';  
        // }else if(this.id.includes('end')){
        //     this.id = this.id.replace('end', '');
        //     this.rect = 'end'; 
        // }else{
        //     this.draw(data.points);
        // }

        this.draw(data.points);
    }

    /**
     * Redraw this area with own or custom coordinates
     * 
     * @param coords {Object} [coords=undefined]
     * @returns {Area} - this area
     */
    draw = (points) => {
        
        if(this.mode != 'drawing') return;

        let polyLine = `<g data-id="${ this.id }" data-type="polyline"><polyline data-id="${ this.id }" points="${ this.polyPoints(points) }" style="stroke-width:${ this.style.stroke_width };stroke:${ this.style.stroke };fill:${ this.style.fill };"></polyline></g>`;
        document.querySelector("#svg").insertAdjacentHTML('beforeend', polyLine); 

        this.drawCircle('start', points);

        // // remove listener
        // let keypress = (e) => {

        //     document.querySelector('#svg g[data-id="' + this.selected + '"]').remove();

        //     console.log(e.which);
        // }

        // // listener
        // document.querySelector('#svg g[data-id="' + this.id + '"]').addEventListener('click', (e) => {

        //     this.selected = e.currentTarget.dataset.id;

        //     document.removeEventListener('keydown', keypress, true);
        //     document.addEventListener('keydown', keypress, true);

        //     console.log('g:'+this.selected);
        // });

        // <rect class="helper pointer" height="6" width="6" x="73" y="179"></rect><rect class="helper pointer" height="6" width="6" x="144" y="285"></rect><rect class="helper pointer" height="6" width="6" x="199" y="248"></rect><rect class="helper pointer" height="6" width="6" x="129" y="141"></rect>

        // this.setSVGCoords(coords ? coords : this._coords);
        return this;
    };

    /**
     * Set attributes for svg-elements of area by new parameters
     * 
     * @param coords {Object} - Object with coords of this area, with field 'points'
     */
    setCoords = (data) => {

        if(!document.querySelector('#svg polyline[data-id="'+this.id +'"]')) return;

        let poly_points = document.querySelector('#svg polyline[data-id="'+this.id +'"]').getAttribute('points');

        let poly_points_arr = poly_points.split(' ');

        if(data.mode == 'drawing') {

            if(poly_points_arr.length>3){ poly_points_arr = poly_points_arr.splice(0, 2); }

            if(document.querySelector('#svg polyline[data-id="'+this.id +'"]')) document.querySelector('#svg polyline[data-id="'+this.id +'"]').setAttribute('points', (poly_points_arr.join(" ") + " " + this.polyPoints(data.points)).trim());
        }

        if(data.mode == 'editing') {

            switch(this.rect){

                case 'start':
                    poly_points_arr[0] = data.points[0].x;
                    poly_points_arr[1] = data.points[0].y;
                break;
                case 'end':
                    poly_points_arr[2] = data.points[0].x;
                    poly_points_arr[3] = data.points[0].y;
                break;
            }

            if(document.querySelector('#svg polyline[data-id="' + this.id + '"]')) document.querySelector('#svg polyline[data-id="' + this.id + '"]').setAttribute('points', poly_points_arr.join(" "));
            if(document.querySelector('#svg rect[data-id="' + this.rect + this.id + '"]')){

                document.querySelector('#svg rect[data-id="' + this.rect + this.id + '"]').setAttribute('x', data.points[0].x - 4);
                document.querySelector('#svg rect[data-id="' + this.rect + this.id + '"]').setAttribute('y', data.points[0].y - 4);
            }

            // console.log(this.rect + ' editing ' + this.id);
        }
    }

    /**
     * Set attributes for svg-elements of area by new parameters
     * 
     * @param coords {Object} - Object with coords of this area, with field 'points'
     */
    setEndCoords = (points) => {

        if(!document.querySelector('#svg polyline[data-id="'+this.id +'"]')) return;

        // console.log(points);
        this.setCoords(points);
        this.drawCircle('end', points.points);

        // remove same dot lines 
        let poly_points = document.querySelector('#svg polyline[data-id="'+this.id +'"]').getAttribute('points');
        let poly_points_arr = poly_points.split(' ');

        if(poly_points_arr[0]==poly_points_arr[2] && poly_points_arr[1]==poly_points_arr[3]) document.querySelector('#svg g[data-id="'+this.id +'"]').remove();
    }

    /**
     * Moving circle rect object
     * 
     * @param coords {Object} - Object with coords of this area, with field 'points'
     */
    drawCircle = (type, points) => {

        // console.log(points);

        let rect = `<rect data-id="${ type + this.id }" x="${ points[0].x - 4 }" y="${ points[0].y - 4 }" class="po" data-type="polyline" data-rect="${ type }" width="8" height="8" rx="8" style="stroke-width:2px;stroke:${ this.style.stroke };fill:rgba(255,255,255,1);" />`;
        if(document.querySelector('#svg g[data-id="'+this.id +'"]')) document.querySelector('#svg g[data-id="' + this.id + '"]').insertAdjacentHTML('beforeend', rect);
    }

    /**
     * Converts polyline points from object to string. Example:
     * [{x: 12, y: 100},{x: 15, y: 150}]
     * 12 100 15 150
     * @param points {Object} - Object with coords of this area, with field 'points'
     * @returns {String} - string of points
     */
    polyPoints = (points) => {

        return (points.reduce(function (previousValue, currentItem) {
            return previousValue + currentItem.x + ' ' + currentItem.y + ' ';
        }, '')).trim();
    }

    /**
     * Set attributes for svg-elements of area by new parameters
     * 
     * @param coords {Object} - Object with coords of this area, with field 'points'
     * @returns {Polygon} - this area
     */
    setSVGCoords = (coords) => {

        // let polygonPointsAttrValue = coords.points.reduce(function (previousValue, currentItem) {
        //     return previousValue + currentItem.x + ' ' + currentItem.y + ' ';
        // }, '');

        // this._el.setAttribute('points', polygonPointsAttrValue);
        // this.foreach(this._helpers.points, function (helper, i) {
        //     helper.setCoords(coords.points[i].x, coords.points[i].y);
        // });

        return this;
    };

    /**
     * Return current polyline id
     * @returns {String} - string of points
     */
    getID = () => {

        return this.id
    }

    /**
     * Returns copy of original polygon, selected and moved by (10,10) from it
     * 
     * @param len {Integer}
     * @returns {Area} - a copy of original area
     */
    genID = (len) => {

            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
            for (let i = 0; i < len; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
    
            return text;
    };
}


export class Arc {

    constructor(data) {

        this.data = data, 

        this.id = data.id ? data.id : this.genID(6);

        this.mode = data.mode ? data.mode : 'drawing';

        this.rect = data.rect ? data.rect : '';

        this.style = { 
            stroke_width: '3px', 
            stroke: '#ff007d',
            fill: 'rgba(255, 255, 255, 0)'
        }

        this.selected = null;

        // console.log(data.params);

        this.data.points = this.describeArc(data.params.x, data.params.y, data.params.radius, data.params.startAngle, data.params.endAngle);
        
        // console.log("draw arc" + this.points);

        // if(this.id.includes('start')){
        //     this.id = this.id.replace('start', '');    
        //     this.rect = 'start';  
        // }else if(this.id.includes('end')){
        //     this.id = this.id.replace('end', '');
        //     this.rect = 'end'; 
        // }else{
        //     this.draw(this.data);
        // }

        this.draw(this.data);
    }

    /**
     * Redraw this area with own or custom coordinates
     * 
     * @param coords {Object} [coords=undefined]
     * @returns {Area} - this area
     */
    draw = (data) => {
        
        if(this.mode == 'drawing'){

            let arc = `<g data-id="${ this.id }" data-type="arc" data-params="${ escape(JSON.stringify(data.params)) }" ><path data-id="${ this.id }" fill="transparent" d="${ data.points }" style="stroke-width:${ this.style.stroke_width };stroke:${ this.style.stroke };fill:${ this.style.fill };"></path></g>`;
            document.querySelector("#svg").insertAdjacentHTML('beforeend', arc); 

            this.drawCircle('start', data);
            this.drawCircle('end', data);
        }

        if(this.mode == 'editing'){

            let params = JSON.parse(unescape(document.querySelector('#svg g[data-id="'+this.id +'"]').dataset.params));

            let a = params.x - data.params.x;
            let b = params.y - data.params.y;
 
            // let angle = this.rect == 'start' ? data.params.startAngle : data.params.endAngle;
            let newDeg = (Math.atan2(a, b) * 180/Math.PI); newDeg = newDeg < 0 ? newDeg * (-1) : 360-newDeg; 

            // console.log('Deg start: ' + angle + ' Deg new: ' + newDeg);

            if(this.rect == 'start') params.startAngle = newDeg;
            if(this.rect == 'end') params.endAngle = newDeg;

            this.data.points = this.describeArc(params.x, params.y, params.radius, params.startAngle, params.endAngle);

            // update arc
            document.querySelector('#svg g[data-id="'+this.id+'"] path').setAttribute('d', this.data.points);
            document.querySelector('#svg g[data-id="'+this.id+'"]').dataset.params = escape(JSON.stringify(params));

            // update circles
            document.querySelector('#svg g[data-id="'+this.id+'"] rect[data-rect="'+this.rect+'"').setAttribute('x', params.x + (data.params.radius * Math.cos(this.degToRad(newDeg))) - 4);
            document.querySelector('#svg g[data-id="'+this.id+'"] rect[data-rect="'+this.rect+'"').setAttribute('y', params.y + (data.params.radius * Math.sin(this.degToRad(newDeg))) - 4);
        }

        return this;
    };

    /**
     * Moving circle rect object
     * 
     * @param coords {Object} - Object with coords of this area, with field 'points'
     */
    drawCircle = (type, data) => {

        var angleInRadians = 0;
        
        if(type == 'start') angleInRadians = this.degToRad(data.params.startAngle);
        if(type == 'end') angleInRadians = this.degToRad(data.params.endAngle);
        
        let x = (data.params.x + (data.params.radius * Math.cos(angleInRadians))) - 4;
        let y = (data.params.y + (data.params.radius * Math.sin(angleInRadians))) - 4;

        // console.log('X: ' + x);
        // console.log('Y: ' + y);

        let rect = `<rect data-id="${ type + this.id }" x="${ x }" y="${ y }" data-type="arc" class="po" data-rect="${ type }" width="8" height="8" rx="8" style="stroke-width:2px;stroke:${ this.style.stroke };fill:rgba(255,255,255,1);" />`;
        if(document.querySelector('#svg g[data-id="'+this.id +'"]')) document.querySelector('#svg g[data-id="'+this.id +'"]').insertAdjacentHTML('beforeend', rect);
    }

    polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {

        var angleInRadians = this.degToRad(angleInDegrees);

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    describeArc = (x, y, radius, startAngle, endAngle) => {

        var endAngleOriginal = endAngle;
        if (endAngleOriginal - startAngle === 360) {
            endAngle = 359;
        }

        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        if (endAngleOriginal - startAngle === 360) {
            var d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, arcSweep, 0, end.x, end.y, "z"
            ].join(" ");
        }
        else {
            var d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, arcSweep, 0, end.x, end.y
            ].join(" ");
        }

        return d;
    }

    /**
     * Converts degrees to radians
     * 
     * @param deg {Integer}
     * @returns {Integer} - radians
     */
    degToRad = (deg) => {

        return (deg - 90) * Math.PI / 180.0;
    }

    /**
     * Returns copy of original polygon, selected and moved by (10,10) from it
     * 
     * @param len {Integer}
     * @returns {Area} - a copy of original area
     */
     genID = (len) => {

        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < len; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    getPath = () => {
        
        return this.points;
    }

    getID = () => {

        return this.id;
    }
}