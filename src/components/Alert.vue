<template>
    <div v-if="visible" class="d-flex justify-content-center">    
        <div v-if="type == 'primary'" class="alert alert-primary d-flex align-items-center" role="alert">
            <div>
                {{ message }}
            </div>
        </div>
        <div v-if="type == 'success'" class="alert alert-success d-flex align-items-center" role="alert">
            <div>
                {{ message }}
            </div>
        </div>
        <div v-if="type == 'warning'"  class="alert alert-warning d-flex align-items-center" role="alert">
            <div>
                {{ message }}
            </div>
        </div>
        <div v-if="type == 'danger'"  class="alert alert-danger d-flex align-items-center" role="alert">
            <div>
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AlertComponente',
    props: {
        type: {
            type: String,
            default: 'success',
        },
        message: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            visible: true,
        };
    },
    mounted() {
        setTimeout(() => {
            this.visible = false;
        }, 3000);
    },
}
</script>

<style>
.alert {
    width: 100%;
    height: 50px;
    position: fixed;
    font-size:1.5rem;
    bottom: 12rem;
    justify-content: center;
}
</style>