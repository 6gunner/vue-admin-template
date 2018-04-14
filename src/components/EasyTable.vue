<template>
  <div class="easy-table-container">
    <div class="table-tools" v-if="tools">
      <slot></slot>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      ref="table"
      highlight-current-row
      :data="pageTableData"
      :height="tableHeight"
      :max-height="tableHeight"
      @current-change="currentChangeHandler"
      @select="selectHandler" @select-all="selectAllHandler"
      stripe
      style="padding: 0 10px">
      <el-table-column fixed="left" width="1"></el-table-column>
      <el-table-column v-if="selection" type="selection" width="50" :selectable="selectable">
      </el-table-column>
      <el-table-column
        v-if="showIndex"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column v-for="(column, index) in columns"
         :sortable="column.sortable || false"
        :key="column.name"
        :prop="column.name"
        :label="column.title"
        :fixed="column.fixed"
        :width="column.width"
        :align="column.align || align"
        :header-align="column.headerAlign || headerAlign"
        :filters="computeFilters(column.filters)">
        <template slot-scope="scope">
          <template v-if="column.type==='operate'" >
            <el-button v-for="button in column.buttons"
                       :key="button.name"
                       v-show="button.show(scope.row)"
                       @click="button.click(scope.$index, scope.row)"
                       type="text"
            >{{button.name}}
            </el-button>
          </template>
          <span v-else>{{format(index, scope.row, scope.column)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="data.length > 10"
      background
      layout="total, prev, pager, next"
      :total="data.length"
      @current-change="currentPageChangeHandler"
      :current-page.sync="currentPage"
      :page-size="pageSize"
    >
    </el-pagination>
  </div>
</template>
<script>
  import { Button, Table, TableColumn, Pagination } from 'element-ui'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination
    },
    data () {
      return {
        loading: false,
        currentPage: 1,
        pageSize: 10,
        allSelections: []
      }
    },
    props: {
      showIndex: Boolean,
      selection: Boolean,
      tableHeight: {
        type: [Number, String],
        default: 400
      },
      columns: Array,
      data: Array,
      tools: {
        type: Boolean,
        default: true
      },
      align: {
        type: String,
        default: 'center'
      },
      headerAlign: {
        type: String,
        default: 'center'
      }
    },
    computed: {
      ...mapGetters('dict', ['getDictByName', 'translateDict']),
      pageTableData () {
        let results = []
        let i = (this.currentPage - 1) * this.pageSize
        let l = this.currentPage * this.pageSize > this.data.length ? this.data.length : this.currentPage * this.pageSize
        for (i ; i < l; i++){
          results.push(this.data[i])
        }
        return results
      }
    },
    methods: {
      computeFilters (filter) {
        if (filter) {
          if (filter.type === 'dict') {
            let dicts = this.getDictByName(filter.value)
            let filters = []
            for (let key in dicts) {
              filters.push({
                text: dicts[key],
                value: key
              })
            }
            return filters
          }
        }
        return null
      },
      clearSelection () {
        this.$refs.table.clearSelection()
      },
      currentPageChangeHandler (currentPage) {
        this.currentPage = currentPage
      },
      format (index, row, column) {
        if (this.columns[index].formatter) {
          return this.columns[index].formatter.call(this, row, column, row[column.property])
        } else {
          return row[column.property]
        }
      },
      currentChangeHandler (currentRow) {
        this.$emit('current-change', currentRow)
      },
      showLoading () {
        this.loading = true
      },
      closeLoading () {
        this.loading = false
      },
      getAllSelections () {
        return this.allSelections
      },
      selectHandler (selection, row) {
        this.allSelections = selection
      },
      selectAllHandler (selection) {
        this.allSelections = selection
      },
      doLayout () {
        this.$refs.table.doLayout()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .easy-table-container {
    width: 100%;
  }
  p {
    margin: 10px;
    font-size:24px;
    font-weight: bold;
  }
  .el-pagination {
    margin: 20px;
    margin-bottom: 0px;
  }
  .table-tools {
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    position: relative;
    .btn-right {
      position: absolute;
      right: 5%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

 /deep/ .el-table {
    td ,th {
      padding: 5px;
    }
   .el-table__body-wrapper{
     /*滚动条整体部分*/
     &::-webkit-scrollbar {
       width: 0px;
       height: 10px;
       background-color: transparent;
     }
     /*滚动条里面的小方块*/
     &::-webkit-scrollbar-thumb {
       -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
       background-color: rgba(145, 148, 164, 0.15);
       border-radius: 10px;
     }
     /*滚动条里面的轨道*/
     &::-webkit-scrollbar-track {
       border-radius: 10px;
       -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
       background-color: #FFFFFF;
     }
   }
  }

 /deep/ .el-table__row.current-row, .el-table__row--striped.current-row {
    & > td {
      background-color: #c5cfda !important;
    }
  }
</style>
