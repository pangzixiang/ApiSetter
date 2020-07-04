<template>
    <div>
        <a-table :columns="columns" :data-source="data" :pagination=false>
            <a slot="apiName" slot-scope="text">{{ text }}</a>
            <span slot="customTitle"><a-icon type="smile-o" /> api name</span>
            <span slot="reqParams" slot-scope="reqParams">
            <a-tag
                    v-for="reqParam in reqParams"
                    :key="reqParam"
                    :color="reqParams.indexOf(reqParam)%2===1 ? 'geekblue' : 'red'"
            >
                {{ reqParam }}
            </a-tag>
        </span>
            <a-tag
                    slot="apiMethod"
                    slot-scope="text"
                    color="green"
            >
                {{ text }}
            </a-tag>
        </a-table>
    </div>
</template>
<script>
    const columns = [
        {
            dataIndex: 'apiName',
            key: 'apiName',
            slots: { title: 'customTitle' },
            scopedSlots: { customRender: 'apiName' },
        },
        {
            title: 'request params',
            dataIndex: 'reqParams',
            key: 'reqParams',
            scopedSlots: {customRender: 'reqParams'}
        },
        {
            title: 'response data',
            dataIndex: 'resData',
            key: 'resData',
        },
        {
            title: 'api method',
            key: 'apiMethod',
            dataIndex: 'apiMethod',
            scopedSlots: { customRender: 'apiMethod' },
        },
    ];

    // const data = [
    //     {
    //         key: '1',
    //         apiName: '/a',
    //         reqParams: "{'a':1}",
    //         resData: "{'b':1}",
    //         apiMethod: 'GET',
    //     },
    // ];

    export default {
        props:{
            apisData:Array,
        },
        data() {
            return {
                data:this.apisData,
                columns,
            };
        },
        methods:{

        },
        mounted() {

        }
    };
</script>

