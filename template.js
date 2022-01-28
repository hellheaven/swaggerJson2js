module.exports = {
    vueTemplate: (compoenntName, summary) => {
        return `<template>
	<vue-form v-model = "formData" :ui-schema = "uiSchema" :schema = "formJson" @on-submit="submit"></vue-form>
</template>
<script>
import schema from './${compoenntName}.json'
export default {
	name: '${compoenntName}',
    summary: '${summary}',
    data(){
        return{
            id:null,
            formData:{},
            uiSchema:{},
            formJson:schema
        }
    },
    mounted() {
        if(this.$route.query.id){
            this.id = this.$route.query.id;
            this.getData();
        }
    },
    methods: {
        async getData(){
            //get data to formData
        },
        async submit(){
            let res=await this.$apis.${compoenntName}(this.formData)
        }
    },
};
</script>
<style lang="scss" scoped>

</style>`
    }
}