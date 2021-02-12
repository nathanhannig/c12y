import numeral from 'numeral'

const formatDollars = (value) => {
  if (value >= 0.01 || value <= -0.01 || value === 0) {
    return numeral(value).format('$0,0.00')
  }

  return numeral(value).format('$0.0000000000')
}

const formatDollarsWholeNumber = (value) => numeral(value).format('$0,0')

const formatPercent = (value) => numeral(value / 100).format('0,0.00%')

const formatWholeNumber = (value) => numeral(value).format('0,0')

export default {
  formatDollars,
  formatDollarsWholeNumber,
  formatWholeNumber,
  formatPercent,
}
