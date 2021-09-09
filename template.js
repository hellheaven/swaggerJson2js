module.exports = {
    vueTemplate: (compoenntName,raw) => {
        return `<template>
	<vue-form v-model = "formData" :ui-schema = "uiSchema" :schema = "formJson" ></vue-form>
</template>
<script>
export default {
	name: '${compoenntName}',
    data(){
        return{
            formData:{},
            uiSchema:{},
            formJson:${raw}
        }
    },
    methods: {
        async getData(){
            let res=await this.$apis.${compoenntName}()
        },
        async submit(){
            
        }
    },
};
</script>
<style lang="scss" scoped>

</style>`
    }
}