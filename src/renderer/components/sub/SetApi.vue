<template>
    <a-form-model :rules="rules" ref="ruleForm" :model="form" :label-col="labelCol"  :wrapper-col="wrapperCol">
        <a-form-model-item label="Your API Path" prop="apiName" ref="apiName">
            <a-input prefix="/" v-model="form.apiName"
                     @blur="() => {$refs.apiName.onFieldBlur();}"
            />
        </a-form-model-item>
        <a-form-model-item label="API request params">
            <ParamsTable :req-params.sync="reqParams"></ParamsTable>
        </a-form-model-item>
        <a-form-model-item label="Your API method" prop="apiMethod">
            <a-select v-model="form.apiMethod" placeholder="please select your method">
                <a-select-option value="GET">
                    GET
                </a-select-option>
                <a-select-option value="POST">
                    POST
                </a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="API response data" prop="returnData">
            <codemirror v-model="form.returnData" :options="cmOptions"></codemirror>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="apiStart" v-bind:disabled="disableBtn">
                create
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm" v-bind:disabled="!disableBtn">
                add more
            </a-button>
            <a-button type="danger" style="margin-left: 10px;" @click="clearAll" v-bind:disabled="disableClear">
                clear all
            </a-button>
        </a-form-model-item>
    </a-form-model>
</template>

<script>
    import { codemirror } from 'vue-codemirror'
    import ParamsTable from "./ParamsTable";

    // require styles
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/mode/javascript/javascript.js'
    // theme css
    import 'codemirror/theme/base16-dark.css'

    //获取用户数据地址
    // import {app,remote} from 'electron'
    // const fs = require('fs');
    // const APP = process.type === 'renderer' ? remote.app : app
    // const STORE_PATH = APP.getPath('userData')
    // if (process.type !== 'renderer') {
    //     if (!fs.existsSync(STORE_PATH)) { // 如果不存在路径
    //         fs.mkdirSync(STORE_PATH) // 就创建
    //     }
    // }
    // let path = STORE_PATH+'/server.js'

    const express = require('express')
    let server = express()
    let close

    export default {
        components: {
            codemirror,
            ParamsTable
        },
        props:{
            apisData:Array,
        },
        data(){
          return{
              reqParams: [],
              labelCol: { span: 5 },
              wrapperCol: { span: 18 },
              disableBtn:false,
              disableClear:true,
              form:{
                  apiName:'',
                  apiMethod:'',
                  returnData:'{}',
              },
              cmOptions: {
                  tabSize: 4,
                  mode: 'text/javascript',
                  theme: 'base16-dark',
                  lineNumbers: true,
                  line: true,
              },

              rules:{
                  apiName:[
                      {required: true, message: 'Please input api name', trigger: 'blur'}
                  ],
                  apiMethod:[
                      {required: true, message: 'Please select api method', trigger: 'change'}
                  ],
                  returnData:[
                      {required:true}
                  ]

              },

          }
        },

        methods:{
            apiStart(){
                this.$refs.ruleForm.validate(valid => {
                    if (valid){
                        if (this.apisData.length>0){
                            close.close();
                        }
                        const port = 80
                        try{
                            const returnData = JSON.parse(this.form.returnData.replace(/'/g,'"'))
                            let apiName = this.form.apiName;
                            let reqParams = this.reqParams;
                            function compareParams(a,b){
                                if (a.length != Object.keys(b).length)
                                    return false;
                                else {
                                    for (var i = 0;i<a.length;i++){
                                        if (!Object.keys(b).includes(a[i].reqKey))
                                            return false;
                                        else {
                                            if (b[a[i].reqKey] != a[i].reqVal)
                                                return false;
                                        }
                                    }

                                }
                                return true;
                            }
                            if (this.form.apiMethod == 'GET'){
                                server.get('/'+apiName,function (req,res) {
                                    if (reqParams.length == 0){
                                        res.json(returnData)
                                    }else {
                                        if (compareParams(reqParams,req.query))
                                            res.json(returnData)
                                        else
                                            res.send("request params error")
                                    }
                                })
                            }else if (this.form.apiMethod == 'POST'){
                                server.post('/'+apiName,function (req,res) {
                                    console.log(reqParams.length)
                                    if (reqParams.length == 0){
                                        res.json(returnData)
                                    }else {
                                        if (compareParams(reqParams,req.query))
                                            res.json(returnData)
                                        else
                                            res.send("request params error")
                                    }
                                })
                            }
                            close = server.listen(port, () => console.log(`Example app listening on port ${port}!`))
                            this.disableBtn = true
                            this.disableClear = false
                            this.$message.info('success!')
                            let apiData = {}
                            apiData['key'] = this.apisData.length+1
                            apiData['apiName'] = "/"+apiName
                            let reqParamsList = []
                            for (var i = 0;i<reqParams.length;i++){
                                let tempString = reqParams[i]["reqKey"].toString() + "=" + reqParams[i]["reqVal"]
                                reqParamsList = [...reqParamsList,tempString]
                            }
                            apiData['reqParams'] = reqParamsList
                            apiData['resData'] = JSON.stringify(returnData)
                            apiData['apiMethod'] = this.form.apiMethod
                            this.$emit('update:apisData',[...this.apisData,apiData])
                        }catch (e) {
                            if (this.form.returnData!='')
                                this.$message.warning("输入的JSON格式有误")
                        }
                    }
                })
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
                close.close();
                this.disableBtn=false
                this.reqParams = []
            },
            clearAll(){
                server = express()
                this.$refs.ruleForm.resetFields();
                close.close();
                this.disableBtn=false
                this.disableClear = true
                this.reqParams = []
                this.$emit('update:apisData',[])
                this.$message.info('success clear all apis')
            }
        },
        mounted() {
            if (this.apisData.length > 0)
                this.disableClear = false

        },
        watch:{

        }
    }
</script>

<style scoped>

</style>
