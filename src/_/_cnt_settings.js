export const HTMLContent = (__) => {

    return `
    <div class="container p-edit">
        <div class="d-md-flex justify-content-between bd-highlight mb-3">
            <nav class="bc" aria-label="breadcrumb"></nav>
            <button class="btn btn-primary btn-save mt-3 mb-1 mt-md-0 mb-md-0" type="button">${ __('Save changes') }</button>
        </div>
        <div class="row">
            <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
              <div class="card border-white shadow-sm p-sm-3 ">
                <nav class="nav tab-content mb-4" role="tablist">
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-link active" id="nav-notifications-link" data-bs-toggle="tab" data-bs-target="#nav-notifications" type="button" role="tab" aria-controls="nav-notifications" aria-selected="true" href="#">${ __('General') }</a>
                        <a class="nav-link d-none" id="nav-currency-link" data-bs-toggle="tab" data-bs-target="#nav-currency" type="button" role="tab" aria-controls="nav-currency" aria-selected="true" href="#">${ __('Currency &amp; Tax') }</a>
                        <a class="nav-link" id="nav-payout-link" data-bs-toggle="tab" data-bs-target="#nav-payout" type="button" role="tab" aria-controls="nav-payout" aria-selected="true"  href="#">${ __('Payout') }</a>
                        <a class="nav-link" id="nav-tax-link" data-bs-toggle="tab" data-bs-target="#nav-tax" type="button" role="tab" aria-controls="nav-tax" aria-selected="true"  href="#">${ __('Legal') }</a>
                    </div>
                </nav>
                <div class="card-body tab-content" id="nav-tabContent">
                  <div class="tab-pane fade show active" id="nav-notifications" role="tabpanel" aria-labelledby="nav-notifications-link">
                    
                    <h4 id="gen" class="card-title mb-4">${ __('Orders') }</h4>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Order ID') }</label>
                          <div class="col-sm-9">
                            <input id="last_order_id" type="text" class="form-control inp" name="last_order_id" data-type="emails">
                            <p class="form-text">${ __('Define next new order ID number.') }</p>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Auto complete') }</label>
                          <div class="col-sm-9">
                            <select id="auto_complete" class="form-select inp" name="auto_complete" data-type="select">
                                <option value="">${ __('None') }</option>
                                <option value="60">${ __('1 minute') }</option>
                                <option value="300">${ __('5 minutes') }</option>
                                <option value="1200">${ __('20 minutes') }</option>
                                <option value="3600">${ __('1 hour') }</option>
                                <option value="43200">${ __('12 hours') }</option>
                                <option value="86400">${ __('24 hours') }</option>
                            </select>
                            </select>
                            <p class="form-text">${ __('Auto complete orders after certain amount of time.') }</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h4 id="gen" class="card-title mb-4 mt-4">${ __('Notifications') }</h4>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('New order') }</label>
                          <div class="col-sm-9">
                            <select id="notify_new_order" class="form-select inp" name="notify_new_order" data-type="select">
                                <option value="">${ __('None') }</option>
                                <option value="client">${ __('Client') }</option>
                                <option value="admin">${ __('Administrator') }</option>
                                <option value="both">${ __('Client and administrator') }</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Emails') }</label>
                          <div class="col-sm-9">
                            <input id="notify_new_order_emails" type="text" class="form-select inp" name="notify_new_order_emails" data-type="emails">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Cancelled order') }</label>
                          <div class="col-sm-9">
                            <select id="notify_cancel_order" class="form-select inp" name="notify_cancel_order" data-type="select">
                                <option value="">${ __('None') }</option>
                                <option value="client">${ __('Client') }</option>
                                <option value="admin">${ __('Administrator') }</option>
                                <option value="both">${ __('Client and administrator') }</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Emails') }</label>
                          <div class="col-sm-9">
                            <input id="notify_cancel_order_emails" type="text" class="form-select inp" name="notify_cancel_order_emails" data-type="emails">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Processing order') }</label>
                          <div class="col-sm-9">
                            <select id="notify_proc_order" class="form-select inp" name="notify_proc_order" data-type="select">
                                <option value="">${ __('None') }</option>
                                <option value="client">${ __('Client') }</option>
                                <option value="admin">${ __('Administrator') }</option>
                                <option value="both">${ __('Client and administrator') }</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Emails') }</label>
                          <div class="col-sm-9">
                            <input id="notify_proc_order_emails" type="text" class="form-select inp" name="notify_proc_order_emails" data-type="emails">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Refunded order') }</label>
                          <div class="col-sm-9">
                            <select id="notify_refunded_order" class="form-select inp" name="notify_refunded_order" data-type="select">
                                <option value="">${ __('None') }</option>
                                <option value="client">${ __('Client') }</option>
                                <option value="admin">${ __('Administrator') }</option>
                                <option value="both">${ __('Client and administrator') }</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Emails') }</label>
                          <div class="col-sm-9">
                            <input id="notify_refunded_order_emails" type="text" class="form-select inp" name="notify_refunded_order_emails" data-type="emails">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Completed order') }</label>
                          <div class="col-sm-9">
                            <select id="notify_completed_order" class="form-select inp" name="notify_completed_order" data-type="select">
                                <option value="">${ __('None') }</option>
                                <option value="client">${ __('Client') }</option>
                                <option value="admin">${ __('Administrator') }</option>
                                <option value="both">${ __('Client and administrator') }</option>
                            </select>
                            <p class="form-text">${ __('Choose how to trigger notifications.') }</p>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Emails') }</label>
                          <div class="col-sm-9">
                            <input id="notify_completed_order_emails" type="text" class="form-select inp" name="notify_completed_order_emails" data-type="emails">
                            <p class="form-text d-none">${ __('Example: alex@kenzap.com, orders@kenzap.com') }</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Low stock') }</label>
                          <div class="col-sm-9">
                            <select id="notify_low_stock" class="form-select inp" name="notify_low_stock" data-type="select">
                                <option value="">${ __('None') }</option>
                                <option value="dashboard">${ __('Via dashboard') }</option>
                                <option value="email">${ __('Via email') }</option>
                                <option value="all">${ __('Via dashboard and email') }</option>
                            </select>
                            <p class="form-text">${ __('Product low stock notification settings.') }</p>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Emails') }</label>
                          <div class="col-sm-9">
                            <input id="notify_low_stock_emails" type="text" class="form-select inp" name="notify_low_stock_emails" data-type="emails">
                            <p class="form-text">${ __('Example: alex@kenzap.com, orders@kenzap.com') }</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 id="gen" class="card-title mb-4 mt-4">${ __('Currency') }</h4>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Currency') }</label>
                            <div class="col-sm-9">
                              <select id="currency" class="form-select inp" name="currency" data-type="select">
                                
                              
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Currency symbol') }</label>
                            <div class="col-sm-9">
                              <input id="currency_symb" type="text" class="form-select inp" name="currency_symb" value="" data-type="text">
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Position') }</label>
                            <div class="col-sm-9">
                              <select id="currency_symb_loc" class="form-select inp" name="currency_symb_loc" data-type="select">
                                <option value="left">${ __('Left') }</option>
                                <option value="right">${ __('Right') }</option>
                                <option value="left_space">${ __('Left with space') }</option>
                                <option value="right_space">${ __('Right with space') }</option>
                              </select>
                              <p class="form-text">${ __('Currency position symbol.') }</p>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">

                        </div>
                      </div>

                      <h4 id="gen" class="card-title mb-4 mt-4">${ __('Tax') }</h4>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Tax') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="tax_calc" class="form-check-input inp" name="tax_calc" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="tax_calc">
                                  ${ __('Calculate') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Enable tax calculations when processing orders.') }</p>
                            </div> 
                          </div>
                        </div>
            
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Geolocation') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="tax_percent_auto" class="form-check-input inp" name="tax_percent_auto" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="tax_percent_auto">
                                  ${ __('Auto tax rate') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Automatically detect tax rate whenever applicable.') }</p>
                            </div> 
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Percent') }</label>
                            <div class="col-sm-9">
                              <input id="tax_percent" type="text" class="form-control inp" placeholder="21" name="tax_percent" data-type="text">
                              <p class="form-text">${ __('Default tax rate. Example, 9 or 21. Use numeric value.') }</p>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Display') }</label>
                            <div class="col-sm-9">
                              <input id="tax_display" type="text" class="form-control inp" placeholder="VAT" name="tax_display" data-type="text">
                              <p class="form-text">${ __('Tax title. Example, VAT or GST.') }</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 id="gen" class="card-title mb-4 mt-4">${ __('Fees') }</h4>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Service') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="fee_calc" class="form-check-input inp" name="fee_calc" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="fee_calc">
                                  ${ __('Calculate') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Calculate service fee when processing orders.') }</p>
                            </div> 
                          </div>
                        </div>
            
                        <div class="col-lg-6 d-none">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Geolocation') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="tax_auto_rate" class="form-check-input inp" name="tax_auto_rate" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="tax_auto_rate">
                                  ${ __('Auto tax rate') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Automatically detect tax rate whenever applicable.') }</p>
                            </div> 
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Percent') }</label>
                            <div class="col-sm-9">
                              <input id="fee_percent" type="text" class="form-control inp" placeholder="5" name="fee_percent" data-type="text">
                              <p class="form-text">${ __('Default fee rate. Example, 5 or 7. Use numeric value.') }</p>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Display') }</label>
                            <div class="col-sm-9">
                              <input id="fee_display" type="text" class="form-control inp" placeholder="Service fee" name="fee_display" data-type="text">
                              <p class="form-text">${ __('Fee title. Example, Service fee.') }</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 id="gen" class="card-title mb-4 mt-4">${ __('Discounts') }</h4>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Coupons') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="coupons" class="form-check-input inp" name="coupons" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="coupons">
                                  ${ __('Enable coupons') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Allow use of coupons upon checkout.') }</p>
                            </div> 
                          </div>
                        </div>
            
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('List of coupons') }</label>
                            <div class="col-sm-9">
                              <textarea id="coupon_list" class="form-control inp" name="coupon_list" rows="2" data-type="text" style="font-size:13px;font-family: monospace;"></textarea>
                              <p class="form-text">${ __('Provide one coupon and its discount rate per line. Example: BESTDEALS 15.') }</p>
                            </div> 
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Products') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="product_discounts" class="form-check-input inp" name="product_discounts" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="product_discounts">
                                  ${ __('Product discounts') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Enable or disable all discounts defined under individual products page.') }</p>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6 d-none">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('List of hours') }</label>
                            <div class="col-sm-9">
                              <textarea id="happy_hours_list" class="form-control inp" name="happy_hours_list" rows="2" data-type="text" style="font-size:13px;font-family: monospace;"></textarea>
                              <p class="form-text">${ __('Provide one happy hour, its discount per line. Example: Monday 15:00-17:30 10.') }</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 id="gen" class="card-title mb-4 mt-4">${ __('Printing') }</h4>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Action') }</label>
                            <div class="col-sm-9">
                              <select id="print_action" class="form-select inp" name="print_action" data-type="select">
                                <option value="system">${ __('Default printing dialogue') }</option>
                                <option value="app">${ __('Kenzap print app') }</option>
                              </select>
                              <p class="form-text">${ __('Choose action when printing icon is clicked.') }</p>
                            </div> 
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Print') }</label>
                            <div class="col-sm-9">
                              <select id="print_action" class="form-select inp" name="print_action" data-type="select">
                                <option value="system">${ __('Invoice') }</option>
                                <option value="app">${ __('Receipt') }</option>
                              </select>
                              <p class="form-text">${ __('Default printing media.') }</p>
                            </div> 
                          </div>
                        </div>
                      </div>
                      
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('Receipts') }</label>
                            <div class="col-sm-9">
                              <textarea id="receipt_template" class="form-control inp" name="receipt_template" rows="20" data-type="text" style="font-size:13px;font-family: monospace;"></textarea>
                              <p class="form-text">${ __('Default receipt template for printers.') }</p>
                            </div> 
                          </div>
                        </div>
            
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1 ">
                            <label class="col-sm-3 col-form-label">${ __('Auto mode') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="auto_print" class="form-check-input inp-local" name="auto_print" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="auto_print">
                                  ${ __('Auto print') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Auto print new orders from this device. Other devices will not be affected.') }</p>
                            </div> 
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('QR code') }</label>
                            <div class="col-sm-9">
                              <div class="form-check">
                                <input id="qr_print" class="form-check-input inp" name="qr_print" type="checkbox" value="1" data-type="checkbox">
                                <label class="form-check-label" for="qr_print">
                                  ${ __('QR code printing') }
                                </label>
                              </div>
                              <p class="form-text">${ __('Allow "Scan me to order" QR-code printing from orders dashboard.') }</p>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group row mb-3 mt-1">
                            <label class="col-sm-3 col-form-label">${ __('QR printing') }</label>
                            <div class="col-sm-9">
                              <textarea id="qr_template" class="form-control inp" name="qr_template" rows="10" data-type="text" style="font-size:13px;font-family: monospace;"></textarea>
                              <p class="form-text">${ __('Default "Scan me to order" template for printers.') }</p>
                            </div> 
                          </div>
                        </div>
                      </div>

                      <br>
                      <hr>
                      <br>
                      <br>
                    </div>

                    <div class="tab-pane fade" id="nav-currency" role="tabpanel" aria-labelledby="nav-currency-link">
                      <br>
                      <hr>
                      <br>
                      <br>
                    </div>
                    
                    <div class="tab-pane fade" id="nav-tax" role="tabpanel" aria-labelledby="nav-tax-link">
                    <h4 id="tax" class="card-title mb-4">${ __('Your tax information') }</h4>
                    <p class="card-description"> ${ __('Invoice info (this information will be not revealed public)') } </p>

                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Tax ID') }</label>
                          <div class="col-sm-9">
                            <input id="vat" type="text" class="form-control inp" name="vat" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Email') }</label>
                          <div class="col-sm-9">
                            <input id="email" type="email" class="form-control inp" name="email" data-type="email">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Company') }</label>
                          <div class="col-sm-9">
                            <input id="company" type="text" class="form-control inp inp" name="company" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Type') }</label>
                          <div class="col-sm-4">
                            <div class="form-check">
                              <label class="form-check-label">
                                <input type="radio" class="form-check-input inp" name="entity_type" value="individual" data-type="radio" checked="true">
                                ${ __('Individual') }
                                <i class="input-helper"></i></label>
                            </div>
                          </div>
                          <div class="col-sm-5">
                            <div class="form-check">
                              <label class="form-check-label">
                                <input type="radio" class="form-check-input inp" name="entity_type" value="business" data-type="radio">
                                ${ __('Business') }
                                <i class="input-helper"></i></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="card-description">
                        ${ __('Address') }
                    </p>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label"> ${ __('Address 1') }</label>
                          <div class="col-sm-9">
                            <input id="addr1" type="text" class="form-control inp" name="addr1" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('State') }</label>
                          <div class="col-sm-9">
                            <input id="state" type="text" class="form-control inp" name="state" data-type="text">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Address 2') }</label>
                          <div class="col-sm-9">
                            <input id="addr2" type="text" class="form-control inp" name="addr2" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Postcode') }</label>
                          <div class="col-sm-9">
                            <input id="post" type="text" class="form-control inp" name="post" data-type="text">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('City') }</label>
                          <div class="col-sm-9">
                            <input id="city" type="text" class="form-control inp" name="city" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Country') }</label>
                          <div class="col-sm-9">
                            <select id="country" class="form-select inp" name="country" data-type="select">
                              
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br>
                    <hr>
                    <br>
                    <br>
                    </div>
                    <div class="tab-pane fade" id="nav-payout" role="tabpanel" aria-labelledby="nav-payout-link">
                    <h4 id="payout" class="card-title mb-4" title="payouts">${ __('Payout data') }</h4>
                    <p class="card-description">${ __('This information is used to process your earnings as part of Kenzap Affiliate or Kenzap Designing programs.') }</p>

                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __("Bank account holder's name") }</label>
                          <div class="col-sm-9">
                            <input id="y1" type="text" class="form-control inp" name="y1" minlength="2" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('IBAN/Account Nr.') }</label>
                          <div class="col-sm-9">
                            <input id="y2" type="text" class="form-control inp" name="y2" minlength="2" data-type="text">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('SWIFT Code') }</label>
                          <div class="col-sm-9">
                            <input id="y3" type="text" class="form-control inp" name="y3" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Bank name') }</label>
                          <div class="col-sm-9">
                            <input id="y4" type="text" class="form-control inp" name="y4" data-type="text">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Bank branch city') }</label>
                          <div class="col-sm-9">
                            <input id="y5" type="text" class="form-control inp" name="y5" data-type="text">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group row mb-3 mt-1">
                          <label class="col-sm-3 col-form-label">${ __('Bank branch country') }</label>
                          <div class="col-sm-9">
                            <select id="y6" class="form-select inp" name="y6" data-type="select">
                              
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>

                </div>
              </div>
            </div>
        </div>
    </div>
    
    <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center" >   
      <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
        <div class="d-flex">  
          <div class="toast-body"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
    `;
}