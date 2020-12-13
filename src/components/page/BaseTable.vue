<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      <el-dialog
          title="修改员工"
          :visible.sync="dialogVisible"
          width="50%"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="员工姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item v-if="this.form.isInsert" label="员工密码">
            <el-input  v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="员工年龄">
            <el-input v-model="form.age"></el-input>
          </el-form-item>
          <el-form-item label="员工职位">
            <el-select v-model="form.level" placeholder="请选择职位">
              <el-option label="Salesman" value="Salesman"></el-option>
              <el-option label="Technician" value="Technician"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.level==='Salesman'" label="月销售额">
            <el-input v-model="form.monthlySales"></el-input>
          </el-form-item>
          <el-form-item v-if="form.level==='Technician'" label="工作小时">
            <el-input v-model="form.hours"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
      </el-dialog>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.address" placeholder="职位" class="handle-select mr10">
                    <el-option v-if="user.level==='Manager'" lebel="All" value="All"></el-option>
                    <el-option v-if="user.level==='Manager'" key="1" label="Manager" value="Manager"></el-option>
                    <el-option v-if="user.level==='Manager'||user.level==='Salesman'" key="2" label="Salesman" value="Salesman"></el-option>
                    <el-option v-if="user.level==='Manager'||user.level==='Technician'" key="3" label="Technician" value="Technician"></el-option>
                </el-select>
                <el-input @blur="reduceData" v-model="query.name" placeholder="编号/名字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="insertStaff">添加员工</el-button>
            </div>
          <div v-if="address==='All' || address === 'Manager'">
          <el-table
              :data="managerTableCache"
              style="width: 100%"
              stripe>
            <el-table-column
                prop="id"
                label="编号"
                width="150">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="age"
                label="年龄"
                width="120">
            </el-table-column>
            <el-table-column
                prop="level"
                label="职位"
                width="120">
            </el-table-column>
            <el-table-column
                prop="salary"
                label="工资"
                width="400">
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="query.managerPageIndex"
                :page-size="query.pageSize"
                :total="managePageTotal"
                @current-change="manageHandlePageChange"
            ></el-pagination>
          </div>
          </div>

          <div  v-if="address==='All'||address==='Salesman'">
          <el-table
              :data="salesmanTableCache"
              style="width: 100%"
              stripe>
            <el-table-column
                fixed
                prop="id"
                label="编号"
                width="150">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="age"
                label="年龄"
                width="120">
            </el-table-column>
            <el-table-column
                prop="level"
                label="职位"
                width="120">
            </el-table-column>
            <el-table-column
                prop="salary"
                label="工资"
                width="150">
            </el-table-column>
            <el-table-column
                prop="monthlySales"
                label="月销售额"
                width="150">
            </el-table-column>
            <el-table-column v-if="user.level==='Manager'"

                label="操作"
                width="100">
              <template v-if="user.level==='Manager'" slot-scope="scope">
                <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
                <el-button @click="handleUpdateSalesman(scope.row)" type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="query.salesmanPageIndex"
                :page-size="query.pageSize"
                :total="salesmanPageTotal"
                @current-change="salesmanHandlePageChange"
            ></el-pagination>
          </div>
          </div>

          <div v-if="address==='All'||address==='Technician'">
          <el-table
              :data="technicianTableData"
              style="width: 100%"
              stripe>
            <el-table-column
                fixed
                prop="id"
                label="编号"
                width="150">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="age"
                label="年龄"
                width="120">
            </el-table-column>
            <el-table-column
                prop="level"
                label="职位"
                width="120">
            </el-table-column>
            <el-table-column
                prop="salary"
                label="工资"
                width="150">
            </el-table-column>
            <el-table-column
                prop="hours"
                label="工作小时"
                width="150">
            </el-table-column>
            <el-table-column v-if="user.level==='Manager'"
                label="操作"
                width="100">
              <template v-if="user.level==='Manager'" slot-scope="scope">
                <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
                <el-button @click="handleUpdateTechnician(scope.row)" type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.technicianPageIndex"
                    :page-size="query.pageSize"
                    :total="technicianPageTotal"
                    @current-change="technicianHandlePageChange"
                ></el-pagination>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: 'All',
                name: '',
                managerPageIndex: 1,
                salesmanPageIndex: 1,
                technicianPageIndex: 1,
                pageSize: 6
            },
            dialogVisible: false,
            managerTableCache: [],
            salesmanTableCache: [],
            technicianTableCache: [],
            managerTableData: [],
            salesmanTableData: [],
            technicianTableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            managePageTotal: 0,
            salesmanPageTotal: 0,
            technicianPageTotal: 0,
            form: {
              id: 1,
              name: "123123",
              age: 12,
              monthlySales: 10000,
              hours: 50,
              level: 'Salesman',
              password: 'password',
              oldLevel: 'Manager',
              isInsert: true
            },
            idx: -1,
            id: -1
        };
    },
    created() {
        if(this.user.level==='Manager') {
          this.query.address = 'All'
        } else if(this.user.level === 'Salesman') {
          this.query.address = 'Salesman'
        } else {
          this.query.address = 'Technician'
        }
        this.getData();
    },
    computed: {
      user() {
        let getLocalData = localStorage.getItem('ms_username'); // 读取字符串数据
        let jsonObj = JSON.parse(getLocalData);
        return jsonObj
      },
      address() {
        return this.query.address;
      }
    },
    watch: {
      address: {
        handler(newName, oldName) {
          console.log(newName + oldName);
        }
      }
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
          fetch("http://main.zqjason.top:8080/GetStaffsByGroup/Manager").then(response => response.json())
            .then(data => {
              this.managerTableData = data;
              this.managePageTotal = data.length;
              this.managerTableCache = this.managerTableData.slice(0, 8);
            });
          fetch("http://main.zqjason.top:8080/GetStaffsByGroup/Salesman").then(response => response.json())
              .then(data => {
                this.salesmanTableData = data;
                this.salesmanPageTotal = data.length;
                this.salesmanTableCache = this.salesmanTableData.slice(0, 8);
              });
          fetch("http://main.zqjason.top:8080/GetStaffsByGroup/Technician").then(response => response.json())
              .then(data => {
                this.technicianTableData = data;
                this.technicianPageTotal = data.length;
                this.technicianTableCache = this.technicianTableData.slice(0, 8);
              })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'managerPageIndex', 1);
            this.$set(this.query, 'salesmanPageIndex', 1);
            this.$set(this.query, 'technicianPageIndex', 1);
            let id = this.query.name;
            if(!isNaN(id)) {
              fetch("http://main.zqjason.top:8080/GetStaffById/"+id).then(response => response.json())
                  .then(data => {
                    if (data.length === undefined) {
                      this.managerTableData = [];
                      this.salesmanTableData = [];
                      this.technicianTableData = [];
                      if (data.level === 'Manager') {
                        this.managerTableData = [data];
                      } else if(data.level === 'Salesman') {
                        this.salesmanTableData = [data];
                      } else if(data.level === 'Technician'){
                        this.technicianTableData = [data];
                      }
                      this.refreshData();
                    } else {
                      this.managerTableData = [];
                      this.salesmanTableData = [];
                      this.technicianTableData = [];
                      data.forEach((item, index, array) => {
                        if (item.level === 'Manager') {
                          this.managerTableData.push(item);
                        } else if(item.level === 'Salesman') {
                          this.salesmanTableData.push(item);
                        } else if(item.level === 'Technician'){
                          this.technicianTableData.push(item);
                        }
                      })
                      this.refreshData();
                    }
                  })
            } else {
              fetch("http://main.zqjason.top:8080/GetStaffByName/"+id).then(response => response.json())
                  .then(data => {
                    if (data.length === undefined) {
                      this.managerTableData = [];
                      this.salesmanTableData = [];
                      this.technicianTableData = [];
                      if (data.level === 'Manager') {
                        this.managerTableData = [data];
                      } else if(data.level === 'Salesman') {
                        this.salesmanTableData = [data];
                      } else if(data.level === 'Technician'){
                        this.technicianTableData = [data];
                      }
                      this.refreshData();
                    } else {
                      this.managerTableData = [];
                      this.salesmanTableData = [];
                      this.technicianTableData = [];
                      data.forEach((item, index, array) => {
                        if (item.level === 'Manager') {
                          this.managerTableData.push(item);
                        } else if(item.level === 'Salesman') {
                          this.salesmanTableData.push(item);
                        } else if(item.level === 'Technician'){
                          this.technicianTableData.push(item);
                        }
                      })
                      this.refreshData();
                    }
                  })
            }
        },
        // 分页导航
        manageHandlePageChange(val) {
            this.$set(this.query, 'managerPageIndex', val);
            this.managerTableCache = this.managerTableData.slice((val-1)*8, (val-1)*8+8);
        },
        technicianHandlePageChange(val) {
          this.$set(this.query, 'technicianPageIndex', val);
          this.technicianTableCache = this.technicianTableData.slice((val-1)*8, (val-1)*8+8);
        },
        salesmanHandlePageChange(val) {
          this.$set(this.query, 'salesmanPageIndex', val);
          this.salesmanTableCache = this.salesmanTableData.slice((val-1)*8, (val-1)*8+8);
      },
        reduceData() {
          if (this.query.name === '') {
            this.getData()
          }
        },
        refreshData() {
          this.managePageTotal = this.managerTableData.length;
          this.salesmanPageTotal = this.salesmanTableData.length;
          this.technicianPageTotal = this.technicianTableData.length;
          this.manageHandlePageChange(1);
          this.salesmanHandlePageChange(1);
          this.technicianHandlePageChange(1);
        },
        handleDelete(val) {
          this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
          })
              .then(() => {
                fetch("http://main.zqjason.top:8080/deleteStaffById/"+val.id).then(response => response.text())
                .then(data => {
                  this.$message.success('删除成功');
                  this.getData();
                })
              })
              .catch(() => {});
        },
        handleUpdateSalesman(val) {
          this.dialogVisible = true;
          this.form.id = val.id;
          this.form.name = val.name;
          this.form.age = val.age;
          this.form.monthlySales=val.monthlySales;
          this.form.level = val.level;
          this.form.oldLevel = val.level;
          this.form.password = val.password;
          this.form.isInsert = false;
        },
        handleUpdateTechnician(val) {
          this.dialogVisible = true;
          this.form.id = val.id;
          this.form.name = val.name;
          this.form.age = val.age;
          this.form.hours = val.hours;
          this.form.level = val.level;
          this.form.oldLevel = val.level;
          this.form.password = val.password;
          this.form.isInsert = false;
        },
        submitForm() {
          this.dialogVisible = false;
          if(this.form.isInsert) {
            if (this.form.level === 'Salesman') {
              console.log(123123)
              fetch("http://main.zqjason.top:8080/insertSalesman", {
                method: "POST",
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  'name': this.form.name,
                  'age': this.form.age,
                  'level': this.form.level,
                  'password': this.form.password,
                  'monthlySales': this.form.monthlySales
                })
              }).then(response => response.text()).then(json => {
                this.getData();
              })
            } else if (this.form.level === 'Technician') {
              fetch("http://main.zqjason.top:8080/insertTechnician", {
                method: "POST",
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  'name': this.form.name,
                  'age': this.form.age,
                  'level': this.form.level,
                  'password': this.form.password,
                  'hours': this.form.hours
                })
              }).then(response => response.text()).then(json => {
                this.getData();
              })
          } else {
            if (this.form.oldLevel === 'Salesman') {
              fetch("http://main.zqjason.top:8080/updateSalesman", {
                method: "POST",
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  'id': this.form.id,
                  'name': this.form.name,
                  'age': this.form.age,
                  'level': this.form.level,
                  'password': this.form.password,
                  'monthlySales': this.form.monthlySales
                })
              }).then(response => response.text()).then(json => {
                this.getData();
              })
            } else if (this.form.oldLevel === 'Technician') {
              fetch("http://main.zqjason.top:8080/updateTechnician", {
                method: "POST",
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  'id': this.form.id,
                  'name': this.form.name,
                  'age': this.form.age,
                  'level': this.form.level,
                  'password': this.form.password,
                  'hours': this.form.hours
                })
              }).then(response => response.text()).then(json => {
                this.getData();
              })
            } else {
              console.log("?????");
            }
          }
        }
          },
      insertStaff() {
        this.dialogVisible = true;
        this.form.id = '';
        this.form.name = '';
        this.form.age = '';
        this.form.hours = '';
        this.form.monthlySales = '';
        this.form.level = '';
        this.form.oldLevel = '';
        this.form.password = '';
        this.form.isInsert = true;
      }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
