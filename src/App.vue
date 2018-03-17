<template>
  <hello></hello>
</template>

<script>

    import Hello from './components/Hello.vue'

    export default {
        data () {
            return {
                msg: 'todo list',
                newItem: '',
                items: [

                ]
            }
        },
        components: {Hello},
        methods: {
            startHacking () {
                this.$notify({
                    title: 'It works!',
                    type: 'success',
                    message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
                    duration: 5000
                })
            }
        }
    }
</script>

<style>
  #app {
    font-family: Helvetica, sans-serif;
    text-align: center;
  }
</style>
