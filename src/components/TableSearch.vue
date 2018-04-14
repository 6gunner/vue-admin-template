<template>
  <div class="search-panel">
    <el-form :inline="true" class="search-form-inline">
      <slot></slot>
      <el-button type="primary" @click="submit" class="search-form-btn" size="small">确定</el-button>
    </el-form>
  </div>
</template>
<script>
import { Button, Form } from 'element-ui'
export default {
  data () {
    return {
      data: {}
    }
  },
  props: {
  },
  components: {
    'el-button': Button,
    'el-form': Form
  },
  methods: {
    submit () {
      this.$emit('submit')
    }
  },
  watch: {
  }
}
</script>
<style lang="scss">
  .search-panel {
    background-color: #fff;
    padding: 10px 15px;
    border: 1px solid #ebebeb;
    border-top: none;
    border-radius: 3px;
  }
  .search-form-inline {
    height: 40px;
    line-height: 40px;
    .el-form-item {
      margin-bottom: 0;
      line-height: 40px;
      height: 40px;
      &.el-form-item--small {
        .el-form-item__label,
        .el-form-item__content {
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .el-date-editor{
      .el-range-separator {
        padding: 0;
      }
    }
  }
  .search-form-btn {
    margin-left: 20px;
  }
</style>
