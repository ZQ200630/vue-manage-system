<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                username: '1000',
                password: 'ZHANGqian200630',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                  var opts = {
                    method:"GET",
                    mode: "cors"
                  }
                  fetch("http://main.zqjason.top:8080/GetStaffById/" + this.param.username.toString(), opts).then(response => response.json())
                      .then(data => {
                        this.$message.success('登录成功');
                        let str_jsonData = JSON.stringify(data);
                        if(data.password === this.param.password) {
                          let count=0;
                          localStorage.setItem('ms_username', str_jsonData);
                          fetch("http://main.zqjason.top:8080/getStaffNumber").then(response => response.text())
                          .then(data => {
                            localStorage.setItem('staffNumber', data.toString());
                            fetch("http://main.zqjason.top:8080/getStaffProportion").then(response => response.json())
                            .then(data => {
                              let proportionJson = JSON.stringify(data);
                              localStorage.setItem("staffProportion", proportionJson);
                              this.$router.push('/');
                            })

                          })

                        } else {
                          this.$message.error("账号或密码错误");
                        }
                      })
                      .catch(e => console.log("Oops, error", e));

                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>


