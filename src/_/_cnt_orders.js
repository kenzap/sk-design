export const HTMLContent = (__) => {

    return `
      <div class="container ec-orders">
        <div class="d-md-flex justify-content-between bd-highlight mb-3">
            <nav class="bc" aria-label="breadcrumb"></nav>
            <button class="btn btn-primary add-order btn-add mt-3 mb-1 mt-md-0 mb-md-0" type="button">${ __('New order') }</button>
        </div>
        <div class="d-md-flex justify-content-between bd-highlight mb-3">
          <div>
            <div class="col-md-12 page-title">
              <div class="st-opts st-table dropdown">
                  <a class="btn btn-outline-secondary dropdown-toggle" href="#" role="button" id="order-status" data-id="status" data-value="" data-bs-toggle="dropdown" aria-expanded="false">
                    ${ __('All') }
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="order-status">
                    <li><a class="dppi dropdown-item" data-key="" href="#" >${ __('All') }</a></li>
                    <li><a class="dppi dropdown-item" data-key="new" href="#" >${ __('New') }</a></li>
                    <li><a class="dppi dropdown-item" data-key="paid" href="#" >${ __('Paid') }</a></li>
                    <li><a class="dppi dropdown-item" data-key="processing" href="#" >${ __('Processing') }</a></li>
                    <li><a class="dppi dropdown-item" data-key="completed" href="#" >${ __('Completed') }</a></li>
                    <li><a class="dppi dropdown-item" data-key="canceled" href="#" >${ __('Canceled') }</a></li>
                    <li><a class="dppi dropdown-item" data-key="failed" href="#" >${ __('Failed') }</a></li>
                    <li><a class="dppi dropdown-item" data-key="refunded" href="#" >${ __('Refunded') }</a></li>
                  </ul>
              </div>
              <div class="st-opts" >
                <div class="input-group-sm mb-0 justify-content-start mb-sm-0" >
                  <input id="usearch" type="text" class="inp form-control search-input" autocomplete="off" placeholder="${ __('Search order') }">
                </div>
                <!-- <a id="viewSum" href="#" style="margin-left:16px;">view summary</a> -->
              </div>
            </div>
          </div>
          <div class="qr-print-cnt d-none align-self-center my-3 my-md-0">
            <div class="d-inline-block">
              <input id="qr-number" type="text" class="inp form-control form-control-sm qr-number p-0 px-2 me-2 ms-0" autocomplete="off" style="max-width:100px;" placeholder="${ __('QR number') }">
            </div>
            <div class="d-inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-qr-code-scan print-qr po" viewBox="0 0 16 16">
                <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z"/>
                <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z"/>
                <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z"/>
                <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z"/>
                <path d="M12 9h2V8h-2v1Z"/>
              </svg>
            </div>
          </div> 
        </div>

        <div class="row">
          <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
            <div class="card border-white shadow-sm border-0">
              <div class="card-body p-0">
 
                <div class="table-responsive">
                  <table class="table table-hover table-borderless align-middle table-striped table-p-list mb-0">
                    <thead>
                      <tr>
                        <th><span class="ps-1">${ __('From') }</span></th>
                        <th class="d-none d-sm-table-cell">${ __('Status') }</th>
                        <th>${ __('Subtotal') }</th>
                        <th class="d-none d-sm-table-cell">${ __('Time') }</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody class="list">

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal order-modal" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog ">
          <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close align-self-start-remove" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-confirm"></button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>
              </div>
          </div>
        </div>
      </div>

    `;
}