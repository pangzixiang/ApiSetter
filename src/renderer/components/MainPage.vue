<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
            <div class="logo" />
            <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" @click="handleClick">
                <a-menu-item key="1">
                    <a-icon type="upload" />
                    <span>新建</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <a-icon type="user" />
                    <span>历史记录</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-icon
                        class="trigger"
                        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                        @click="() => (collapsed = !collapsed)"
                />
            </a-layout-header>
            <a-layout-content
                    :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '585px' }"
            >
                <component :is="components[currentKey]" :apisData.sync="apisData"></component>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
    import User from './sub/User'
    import SetApi from "./sub/SetApi";
    export default {
        data() {
            return {
                collapsed: false,
                components:[
                    SetApi,
                    User,
                ],
                currentKey:0,
                apisData:[],
            };
        },
        methods:{
            handleClick(e){
                this.currentKey = e.key-1
            }
        }
    };
</script>
<style>
    #components-layout-demo-custom-trigger .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;
    }

    #components-layout-demo-custom-trigger .trigger:hover {
        color: #1890ff;
    }

    #components-layout-demo-custom-trigger .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
    }
</style>
