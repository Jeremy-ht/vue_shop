<template>
  <div>
    <!--面包屑导航-->
    <bread-navigation :leftNavPath="leftNavPath"/>

    <!--卡片视图-->
    <el-card>
      <!--添加分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!--商品分类表格-->
      <tree-table :data="cateList" :columns="columns" show-index index-text="#" :show-row-hover="false"
                  :selection-type="false" border :expand-type="false" class="tree-table">
        <!--是否有效-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: #55a532" v-if="scope.row.cat_deleted === false"/>
          <i class="el-icon-error" style="color: red" v-else/>
        </template>

        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>

      </tree-table>

      <!--分页-->
      <page-bar :pageTotal="pageTotal" :pageNum="queryInfo.pagenum" :pageSize="queryInfo.pagesize"
                @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"/>

    </el-card>


    <!--添加分类的对话框-->
    <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="50%" @close="addCateDialogClose">
      <!--添加分类表单-->
      <el-form :model="addCataForm" :rules="addCateFormRules" ref="addCataFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCataForm.cat_name"/>
        </el-form-item>

        <!-- 父级分类 级联选择 -->
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="addCateChange" clearable/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import BreadNavigation from "components/common/BreadNavigation";
  import PageBar from "components/common/PageBar";

  export default {
    name: "Cate",
    data() {
      return {
        //面包屑数据
        leftNavPath: ['商品管理', '商品分类'],
        //查询参数
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5

        },
        //商品列表数据
        cateList: [],
        //总页数
        pageTotal: 0,
        //表格指定列数据
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isOk',
          },
          {
            label: '排序',
            type: 'template',
            template: 'order',
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt',
          }
        ],
        //用来显示或隐藏添加分类对话框
        addCatedialogVisible: false,
        //添加分类表单数据
        addCataForm: {
          //分类名称
          cat_name: '',
          //添加分类的父级id，0则表示父级为0.添加一级分类
          cat_pid: 0,
          //添加分类的等级，0则表示添加一级分类
          cat_level: 0

        },
        //添加分类校验规则
        addCateFormRules: {
          //验证规则
          cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
        },
        //父级分类数据
        parentCateList: [],
        //绑定用户选择的分类值
        selectedKeys: [],
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover',
          checkStrictly: true
        }

      }
    },
    created() {
      this.getGoodsList()
    },
    components: {
      BreadNavigation,
      PageBar
    },
    methods: {
      //获取商品列表数据
      async getGoodsList() {
        const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
        if (res.meta.status !== 200)
          return this.$message.error('获取商品分类数据失败')

        console.log(res.data.result);
        this.cateList = res.data.result
        this.pageTotal = res.data.total

      },
      //监听pagesize改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList()
      },
      //监听newNum改变
      handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum;
        this.getGoodsList()
      },
      //添加分类
      showAddCate() {
        //先获取父级分类数据
        this.getParentCateList()
        this.addCatedialogVisible = true
      },
      //获取父级分类数据列表
      async getParentCateList() {
        const {data: res} = await this.$http.get('categories', {
          params: {type: 2}
        })

        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败')
        }
        this.parentCateList = res.data
        console.log(res.data);
      },
      //级联选择器改变事件
      addCateChange() {
        if (this.selectedKeys.length > 0) {
          this.addCataForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          this.addCataForm.cat_level = this.selectedKeys.length
        } else {
          this.addCataForm.cat_pid = 0
          this.addCataForm.cat_level = 0
        }

      },
      //监听添加分类对话框关闭，重置表单
      addCateDialogClose() {
        this.$refs.addCataFormRef.resetFields()
        this.selectedKeys = []
        this.addCataForm.cat_level = 0
        this.addCataForm.cat_pid = 0
      },
      //点击确认按钮，添加分类
      addCate() {
        this.$refs.addCataFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('categories', this.addCataForm)

          if (res.meta.status !== 201) {
            return this.$message.error({
              message: '添加分类失败',
              duration: 1000
            })
          }

          this.$message.success({
            message: '添加分类成功',
            duration: 1000
          })
          this.getGoodsList()
          this.addCatedialogVisible = false
        })
      }

      //=========================================================
      //  编辑 删除 没有实现
      //=========================================================

    }
  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 0 0 rgba(0, 0, 0, .5); /*除去卡片阴影*/
  }

  .tree-table {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }

</style>