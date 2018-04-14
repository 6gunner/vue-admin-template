<template>
  <div>
    <p>表单</p>
    <div class="demo-block">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="双向绑定-input">
          <el-input v-model="form.name"></el-input>
          <span>{{form.name}}</span>
        </el-form-item>
        <el-form-item label="双向绑定-select">
          <el-select v-model="form.region" placeholder="请选择活动区域" style="width: 310px">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <span>{{form.region}}</span>
        </el-form-item>
        <el-form-item label="双向绑定-time">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" value-format="yyyyMMdd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" value-format="hh:mm:ss" style="width: 100%;"></el-time-picker>
          </el-col>
          <span v-show="form.date1">{{form.date1}} {{form.date2}}</span>
        </el-form-item>
        <el-form-item label="开关">
          <el-switch v-model="form.delivery"></el-switch>
          <span>{{form.delivery}}</span>
        </el-form-item>
        <el-form-item label="checkbox">
          <el-checkbox-group v-model="form.type" :min="1" :max="3">
            <el-checkbox :label="1" name="type" :checked="true">复选框1</el-checkbox>
            <el-checkbox :label="2" name="type">复选框2</el-checkbox>
            <el-checkbox :label="3" name="type">复选框3</el-checkbox>
            <el-checkbox :label="4" name="type">复选框4</el-checkbox>
          </el-checkbox-group>
          <span>最少选1个，最多选3个: {{form.type}}</span>
        </el-form-item>
        <el-form-item label="radio">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
          <span>{{form.resource}}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Col, Row, Form, FormItem, Input, Select, Option, Button, CheckboxGroup, Checkbox, Radio, RadioGroup, DatePicker, TimePicker, Switch} from 'element-ui'
export default {
  data () {
    return {
      form: {
        type: []
      }
    }
  },
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-checkbox-group': CheckboxGroup,
    'el-checkbox': Checkbox,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-time-picker': TimePicker,
    'el-date-picker': DatePicker,
    'el-switch': Switch
  },
  methods: {
    onSubmit () {
      alert(`用户提交了：${JSON.stringify(this.form)}`)
    }
  }
}
</script>
<style lang="scss" scoped>
  p {
    margin: 10px;
    font-size:24px;
    font-weight: bold;
  }
  .demo-block {
    border: 1px solid #ebebeb;
    border-radius: 3px;
    width: 870px;
    padding: 24px;
    margin: 0 10px;
    .el-form {
      width: 460px;
    }
    .line {
      text-align: center;
    }
  }
</style>
