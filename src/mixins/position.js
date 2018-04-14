export default {
  methods: {
    positionNumFormatter (row, column, cellValue) {
      return row.curr_qty - row.strike_capt_qty + row.strike_releas_qty
    },
    avaliableNumFormatter (row, column, cellValue) {
      return row.curr_qty - row.frozen_qty - row.trade_capt_qty - row.strike_capt_qty + row.strike_releas_qty
    }
  }
}
