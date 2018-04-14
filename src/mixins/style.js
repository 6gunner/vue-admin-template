export default {
  data () {
    return {
      mainHeight: 500
    }
  },
  mounted () {
    this.computeStyle()
  },
  methods: {
    computeStyle () {
      let height = document.querySelector('.el-main').clientHeight
      this.mainHeight = height
    }
  }
}
