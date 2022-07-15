import { __, __html } from '@kenzap/k-cloud';

// html product list loader
export const HTMLContent = () => {

return `
  <div class="container p-sk-edit mt-4">
    <div class="row">
        <div class="col-lg-9 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
            <div class="sections" id="sections" role="tablist" style="width:100%;">

                <div class="row">
                    <div class="col-12 grid-margin stretch-card">
                        <div class="card border-white shadow-sm p-sm-3">
                            <div class="card-body">

                                <div class="landing_status"></div>
                                <input type="hidden" class="form-control" id="landing-slug" value="">

                                <h4 id="sketch-h" class="card-title mb-4">${ __html('Sketch') }</h4>

                                <div id="placeholders">

                                    <div class="mb-3">
                                        <label class="banner-descshort-l form-label d-none" for="desc">${ __html('Drawing') }</label>
                                        <div class="btn-group mb-3" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" class="btn-check" name="sketchmode" id="preview" autocomplete="off" checked>
                                            <label class="btn btn-outline-primary" for="preview">${ __html('Upload') }</label>

                                            <input type="radio" class="btn-check" name="sketchmode" id="drawing" autocomplete="off">
                                            <label class="btn btn-outline-primary" for="drawing">${ __html('Drawing') }</label>

                                            <input type="radio" class="btn-check" name="sketchmode" id="editing" autocomplete="off">
                                            <label class="btn btn-outline-primary" for="editing">${ __html('Editing') }</label>
                                        </div>
                                        <div class="drawing"></div>
                                        <div class="clearfix"></div>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="banner-title-l form-label" for="p-test">${ __html('Input fields') }</label>
                                        <div class="input-fields">

                                        </div>
                                        
                                        <p class="form-text"> </p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="form-label" for="calc_price">${ __html('Calculate price') }</label>
                                        <select id="calc_price" class="form-select inp" >
                                            <option value="default">${ __html('Default price') }</option>
                                            <option value="sketch">${ __html('By sketch') }</option>
                                            <option value="formula">${ __html('By formula') }</option>
                                            <option value="complex">${ __html('Complex product') }</option>
                                        </select>
                                        <p class="form-text"> </p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="form-label" for="formula">${ __html('Formula footage') }</label>
                                        <input id="formula" type="text" class="form-control inp" placeholder="${ __html('(A + B) * L') }">
                                        <p class="form-text formula-hint">${ __html('Square formula to calculate price.') }</p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="form-label" for="formula_price">${ __html('Formula price') }</label>
                                        <input id="formula_price" type="text" class="form-control inp" placeholder="${ __html('B>1000?1.80:0.90') }">
                                        <p class="form-text formula_price-hint">${ __html('Price formula to add as an extra to the price.') }</p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="form-label" for="p-test">${ __html('Test field') }</label>
                                        <input type="text" class="form-control inp" id="p-test" placeholder="${ __html('Test field..') }">
                                        <p class="form-text"> </p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <div class="list-wrapper">
                                            <ul class="d-flex flex-column-reverse"> </ul>
                                        </div>
                                        <p class="form-text"> </p>
                                    </div>

                                </div>

                                <div class="desc-repeater-cont">

                                </div>

                                <h4 id="parts-h" class="card-title mb-4">${ __html('Parts') }</h4>
                                <textarea id="parts" class="form-control mw" name="parts" rows="6" data-type="text" style="font-size:13px;font-family: monospace;"></textarea>
                                <p class="form-text formula_price-hint">${ __html('Provide one product ID per line.') }</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
  </div>

  `;
}