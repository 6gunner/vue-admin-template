<template>
  <li>
    <template v-if="showInput" v-for="(ruleStr, i) in ruleStrs">
      <span v-if="i === 0">当</span>
      <span>{{ruleStr}}</span>
      <el-input type="text" v-model="rules[i]" v-if="i < ruleStr.length -1" style="width: 100px;"></el-input>
    </template>
    <template v-else>
      <span>{{riskRuleName}}</span>
    </template>
    <easy-select v-model="actionValue"
                 dict="risk_rule_action"
                 :show-all="false"
                 @change="actionChange"
                 value-type="Number"
                 style="width: 100px; margin-left: 10px"
    >
    </easy-select>
  </li>
</template>
<script>
import { Input } from 'element-ui'
import EasySelect from '@/components/EasySelect'
export default {
  components: {
    'el-input': Input,
    EasySelect
  },
  data () {
    return {
      actionValue: this.action,
      rules: []
    }
  },
  props: {
    riskRuleName: {
      type: String,
      default: ''
    },
    action: [Number, String]
  },
  computed: {
    ruleStrs () {
      return this.riskRuleName.split('[n]')
    },
    showInput () {
      return this.riskRuleName.indexOf('[n]') > -1
    }
  },
  methods: {
    getValue () {
      return this.rules.join(';')
    },
    actionChange (val) {
      this.$emit('actionChange', val)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input {
    width: 100px;
  }
</style>
