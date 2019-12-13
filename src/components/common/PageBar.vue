<template>
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal">
    </el-pagination>
</template>

<script>
  export default {
    name: "PageBar",
    props: {
      /*  page: {
          pageTotal: {
            type: Number,
            require: true
          },
          pageNum: {
            type: Number,
            require: true
          },
          pageSize: {
            type: Number,
            require: true
          }
        }*/
      pageTotal: {
        type: Number,
        require: true
      },
      pageNum: {
        type: Number,
        require: true
      },
      pageSize: {
        type: Number,
        require: true
      }
    },
    methods: {
      handleSizeChange(newSize) {
        this.$emit('handleSizeChange', newSize)
      },
      handleCurrentChange(newNum) {
        this.$emit('handleCurrentChange', newNum)
      }
    }
  }
</script>

<style scoped>
.el-pagination{
  margin-top: 15px;
}
</style>