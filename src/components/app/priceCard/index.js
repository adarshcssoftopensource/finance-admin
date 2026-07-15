import React from 'react'
import { Link } from 'react-router-dom'
import style from './style.module.scss'
/* eslint-disable */
const Index = ({ plan }) => {
  return (
    <div className="col-12 col-md-4">
      <div className={`card ${plan.isRecomended ? 'bg-primary text-white' : ''}`}>
        <div className="card-body position-relative">
          {plan.trialDays > 0 && <div className={`${style.flag}`}>{plan.trialDays} days trial</div>}
          <div className="py-5 px-3 text-center flex-grow-1">
            <i className="fe fe-inbox font-size-80 mb-3 d-block" />
            <div
              className={`${plan.isRecomended ? '' : 'text-dark'} font-weight-bold font-size-36`}
            >
              {plan.title}
            </div>
            <div
              className={`${
                plan.isRecomended ? '' : 'text-dark'
              } font-weight-bold font-size-48 mb-3`}
            >
              ${plan.price}{' '}
              <span
                className={`${
                  plan.isRecomended ? 'text-white' : ' text-gray-6'
                } align-text-top font-size-28`}
              >
                /{plan.recurring === 'yearly' ? 'yr' : 'mo'}
              </span>
            </div>
            <ul className="list-unstyled font-size-18 mb-5 text-left">
              {plan.features.map(feature => (
                <li key={feature.title}>{feature.title}</li>
              ))}
            </ul>
            <Link
              to={`/plans/${plan._id}/edit`}
              className={`btn ${plan.isRecomended ? 'btn-white' : 'btn-primary'} width-100`}
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
