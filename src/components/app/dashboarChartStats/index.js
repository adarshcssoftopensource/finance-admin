import React from 'react'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'

const options = {
  chartPadding: {
    right: 50,
    left: 10,
    top: 5,
    bottom: 5,
  },
  fullWidth: true,
  showPoint: true,
  lineSmooth: true,
  axisY: {
    showGrid: false,
    showLabel: false,
    offset: 0,
  },
  axisX: {
    showGrid: true,
    showLabel: true,
    offset: 20,
  },
  showArea: false,
  plugins: [
    ChartistTooltip({
      anchorToPoint: false,
      appendToBody: true,
      seriesName: false,
    }),
  ],
}

const Chart4 = ({ data }) => {
  return (
    <div>
      <div className="font-weight-bold text-dark font-size-24">{data.total}</div>
      <div>Total</div>
      <ChartistGraph
        className="height-200 ct-hidden-points"
        data={{
          labels: ['Yesterday', 'ThisWeek', 'LastWeek', 'ThisMonth', 'LastMonth'],
          series: [
            {
              className: 'ct-series-a',
              data: [data.yesterday, data.thisWeek, data.lastWeek, data.thisMonth, data.lastMonth],
            },
          ],
        }}
        options={options}
        type="Line"
      />
    </div>
  )
}

export default Chart4
