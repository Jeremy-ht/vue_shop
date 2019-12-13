<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <span>
        内容
      </span>

      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Dialog",
    data() {
      return {
        dialogVisible: true
      }
    },
    props:{
      dialog:{
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDialogVisible() {
        this.dialogVisible = !this.dialogVisible
      }
    }
  }
</script>

<style scoped>

</style>