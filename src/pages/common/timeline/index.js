import React from 'react'
import moment from 'moment'
import styles from './style.module.scss'

const Index = ({ timelines }) => {
  /* eslint-disable */
  return (
    <div className="invoice-steps-card__content mt-3 ml-4 mr-2 pl-5">
      <div className="invoice-timeline-info mt-4">
        {timelines && timelines.length > 0 ? (
          timelines.map(timeline => (
            <div className={`timeline-block ${styles.invoiceTimelineBlock}`} key={timeline._id}>
              <div className={`${styles.marker}`}>
                <div className={`${styles.wavesBlock}`}>
                  <div className={`${styles.waves} ${styles.wave1}`} />
                  <div className={`${styles.waves} ${styles.wave2}`} />
                  <div className={`${styles.waves} ${styles.wave3}`} />
                </div>
              </div>
              <div className={`${styles.timelineContent}`}>
                <div className={`${styles.timelineTitle}`}>{timeline.prettyText}</div>
                <span className={`${styles.timelineDesc}`}>
                  {moment(timeline.eventTime).format('MMM DD, YYYY, hh:mm A')}
                </span>
                {timeline.createdByName && (
                  <div className={`${styles.timelineDesc}`}>By: {timeline.createdByName}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-center">No timeline found.</h4>
        )}
      </div>
    </div>
  )
}

export default Index
