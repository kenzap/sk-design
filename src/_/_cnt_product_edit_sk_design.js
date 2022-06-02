// html product list loader
export const HTMLContent = (__) => {

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

                                <h4 id="elan" class="card-title mb-4">${ __('Sketch') }</h4>

                                <div id="placeholders">

                                    <div class="mb-3">
                                        <label class="banner-descshort-l form-label d-none" for="desc">${ __('Drawing') }</label>
                                        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" class="btn-check" name="sketchmode" id="preview" autocomplete="off" checked>
                                            <label class="btn btn-outline-primary" for="preview">${ __('Preview') }</label>

                                            <input type="radio" class="btn-check" name="sketchmode" id="drawing" autocomplete="off">
                                            <label class="btn btn-outline-primary" for="drawing">${ __('Drawing') }</label>

                                            <input type="radio" class="btn-check" name="sketchmode" id="editing" autocomplete="off">
                                            <label class="btn btn-outline-primary" for="editing">${ __('Editing') }</label>
                                        </div>
                                        <div class="drawing"></div>
                                        <div class="clearfix"></div>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="banner-title-l form-label" for="p-test">${ __('Input fields') }</label>
                                        <div class="input-fields">

                                        </div>
                                        
                                        <p class="form-text"> </p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="form-label" for="calc_price">${ __('Calculate price') }</label>
                                        <select id="calc_price" class="form-control inp" >
                                            <option value="default">${ __('Flat price') }</option>
                                            <option value="sketch">${ __('By sketch') }</option>
                                            <option value="formula">${ __('By formula') }</option>
                                        </select>
                                        <p class="form-text"> </p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="form-label" for="formula">${ __('Formula') }</label>
                                        <input id="formula" type="text" class="form-control inp" placeholder="${ __('(A + B) * L') }">
                                        <p class="form-text formula-hint"> </p>
                                    </div>

                                    <div class="mb-3 mw">
                                        <label class="form-label" for="p-test">${ __('Test field') }</label>
                                        <input type="text" class="form-control inp" id="p-test" placeholder="${ __('Test field..') }">
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