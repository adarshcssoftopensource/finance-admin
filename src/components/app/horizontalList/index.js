import React from 'react'
import style from './style.module.scss'

const List6 = ({ data }) => {
  return (
    <div>
      <ul className="list-unstyled">
        <li className={style.item}>
          <div className={style.itemPic}>
            <i>I</i>
          </div>
          <div className="mr-2">
            <div>
              <strong className="text-dark">Invoice</strong>
            </div>
            <div className="text-muted">First Visit</div>
            <div className="text-muted">Show Setup</div>
            <div className="text-muted">Payment Modal</div>
            <div className="text-muted">Last Invoice No</div>
            <div className="text-muted">Total</div>
          </div>
          <div className="ml-auto text-right mr-3 mt-4">
            <div className="text-success">{data.invoice.firstVisit ? 'True' : 'False'}</div>
            <div className="text-success">{data.invoice.showSetup ? 'True' : 'False'}</div>
            <div className="text-success">
              {data.invoice.shouldShowPaymentModal ? 'True' : 'False'}
            </div>
            <div>{data.invoice.lastInvoiceNumber}</div>
            <div>{data.invoice.totalInvoice}</div>
          </div>
        </li>
        <li className={style.item}>
          <div className={style.itemPic}>
            <i>C</i>
          </div>
          <div className="mr-2">
            <div>
              <strong className="text-dark">Checkout</strong>
            </div>
            <div className="text-muted">First Visit</div>
            <div className="text-muted">Show Setup</div>
            <div className="text-muted">Total</div>
          </div>
          <div className="ml-auto text-right mr-3 mt-4">
            <div className="text-success">{data.checkout.firstVisit ? 'True' : 'False'}</div>
            <div className="text-success">{data.checkout.showShowSetup ? 'True' : 'False'}</div>
            <div>{data.checkout.totalCheckout}</div>
          </div>
        </li>
        <li className={style.item}>
          <div className={style.itemPic}>
            <i>R</i>
          </div>
          <div className="mr-2">
            <div>
              <strong className="text-dark">Recurring</strong>
            </div>
            <div className="text-muted">First Visit</div>
            <div className="text-muted">Show Setup</div>
          </div>
          <div className="ml-auto text-right mr-3 mt-4">
            <div className="text-success">{data.recurring.firstVisit ? 'True' : 'False'}</div>
            <div className="text-success">{data.recurring.showShowSetup ? 'True' : 'False'}</div>
          </div>
        </li>
        <li className={style.item}>
          <div className={style.itemPic}>
            <i>P</i>
          </div>
          <div className="mr-2">
            <div>
              <strong className="text-dark">Payment</strong>
            </div>
            <div className="text-muted">First Visit</div>
            <div className="text-muted">Show Setup</div>
          </div>
          <div className="ml-auto text-right mr-3 mt-4">
            <div className="text-success">{data.payment.firstVisit ? 'True' : 'False'}</div>
            <div className="text-success">{data.payment.showShowSetup ? 'True' : 'False'}</div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default List6
