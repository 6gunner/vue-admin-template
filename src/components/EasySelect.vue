<template>
  <el-select ref="selector" v-model="selectValue" :placeholder="placeholder" clearable filterable size="small"
             :multiple="multiple"
             :disabled="disabled"
             :collapse-tags="collapseTags"
             @change="_changeHandler"
             @clear="_clearHandler">
    <el-option-group label="" v-if="showAll">
      <el-option label="全部" :value="defaultOption">
      </el-option>
    </el-option-group>
    <el-option-group label="">
      <el-option v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-option-group>
  </el-select>
</template>
<script>
  import _ from 'underscore'
  import { Select, Option, OptionGroup } from 'element-ui'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        selectValue: this.value
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    components: {
      'el-option': Option,
      'el-select': Select,
      'el-option-group': OptionGroup
    },
    computed: {
      ...mapGetters('dict', ['getDictByName']),
      defaultOption () {
        if (this.valueType === 'String') {
          if (this.multiple) {
            return '-1'
          } else {
            return ' '
          }
        } else {
          if (this.multiple) {
            return -1
          } else {
            return 0
          }
        }
      },
      options () {
        let options = []
        if (this.dict) {
          _.each(this.getDictByName(this.dict), (value, key) => {
            options.push({
              label: value,
              value: this.valueType ==='String' ? key : Number(key)
            })
          })
        } else if (this.data) {
          options = this.data
        }
        return options
      }
    },
    props: {
      collapseTags: {
        type: Boolean,
        default: true
      },
      data: Array,
      dict: String,
      disabled: Boolean,
      multiple: Boolean,
      placeholder: String,
      showAll: {
        type: Boolean,
        default: true
      },
      value: {String, Number},
      valueType: {
        type: String,
        defalut: 'String',
        validator: function (value) {
          return value === 'String' || value === 'Number'
        }
      }
    },
    watch: {
      'value'(val, oldValue) {
        this.selectValue = val
      }
    },
    methods: {
      clear() {
        this.selectValue = null
        this.$emit('change', null)
      },
      _clearHandler () {
        this.selectValue = null
        this.$emit('change', null)
        this.$emit('clear')
      },
      _changeHandler (value) {
        if (this.multiple) {
          if (this.valueType === 'String') {
            if (value.indexOf('-1') > -1) {
              this.selectValue = ['-1']
            } else if (value.indexOf(-1) > -1) {
              this.selectValue = [-1]
            }
          }
        } else {
          this.selectValue = value
        }
        this.$emit('change', this.selectValue)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }
</style>
