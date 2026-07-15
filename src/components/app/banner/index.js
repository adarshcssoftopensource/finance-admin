import React from 'react'
import styled from 'styled-components'

const DisplayBanner = ({ isSticky, data }) => {
  const PYBanner = styled.div`
    &#${data.uuid} {
      &:before {
        background: ${data.accentColor};
      }
      .banner-action:hover {
        background: ${data.accentColor};
        border-color: ${data.accentColor};
      }
      .info-icon {
        color: ${data.accentColor};
      }

      .cencel-link {
        color: ${data.accentColor};
      }
    }
  `

  return (
    <PYBanner className="py-banner" id={data.uuid}>
      <div className="info-icon">
        <svg viewBox="0 0 24 24" id="info-square">
          <g>
            <path
              d="m21.25 0h-18.5c-1.517 0-2.75 1.233-2.75 2.75v18.5c0 1.517 1.233 2.75 2.75 2.75h18.5c1.517 0 2.75-1.233 2.75-2.75v-18.5c0-1.517-1.233-2.75-2.75-2.75zm-9.25 5c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm2.25 14h-4.5c-.552 0-1-.448-1-1s.448-1 1-1h1.25v-6h-.75c-.552 0-1-.448-1-1s.448-1 1-1h1.75c.552 0 1 .448 1 1v7h1.25c.552 0 1 .448 1 1s-.448 1-1 1z"
              fill="currentColor"
              data-original="currentColor"
            >
              {' '}
            </path>
          </g>
        </svg>
      </div>
      <div className="py-banner-content">
        <div className="py-banner-desc" dangerouslySetInnerHTML={{ __html: data.description }} />
      </div>
      <div className="py-banner-actions">
        {data.actionButton && data.actionButton.text !== '' && (
          <button type="button" color="primary" outline size="small" className="banner-action">
            {data.actionButton.text}
          </button>
        )}
        {!isSticky && (
          <button type="button" color="link" className="cencel-button">
            <i className="fa fa-times" style={{ fontWeight: 900 }} />
          </button>
        )}
      </div>
    </PYBanner>
  )
}

export default DisplayBanner
