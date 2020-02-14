<template>
<v-ons-page>
   <v-ons-toolbar>
       <div class="left">
            <v-ons-button  style="background-color: Transparent;">
                <ons-icon style="color: grey;" size="10px" icon="fa-bars"></ons-icon>
            </v-ons-button>
        </div>
      <div class="center">
        <v-ons-segment tabbar-id="homeTabbar" :index.sync="segmentIndex" style="width: 8em">
          <button>Wallet</button>
          <button>Request</button>
        </v-ons-segment>
      </div>
      <div class="right">
            <v-ons-button @click="pushToFilterStreamPage"  style="background-color: Transparent;">
                <ons-icon style="color: grey;" size="10px" icon="fa-filter"></ons-icon>
            </v-ons-button>
        </div>
    </v-ons-toolbar>

    <v-ons-tabbar id="homeTabbar"
      :tabs="tabs"
      :index.sync="tabbarIndex"
      @push-page="pushToViewStreamPage"
    ></v-ons-tabbar>


</v-ons-page>
</template>

<style scoped>
@import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

</style>

<script>
import RequestStream from '@/components/RequestStream.vue'
import Wallet from '@/components/Wallet.vue'
import RequestStreamFilters from '@/components/RequestStreamFilters.vue'
import ViewStream from '@/components/ViewStream.vue'

export default {
    name: 'home',
    data() {
        return {
            tabs:[{page:Wallet, key:'Wallet'}, {page:RequestStream, key:'RequestStream' }],
            tabbarIndex:1,
            segmentIndex:1

        }

    },
    methods: {
        log(...args){
            console.log(...args)
        },
        pushToFilterStreamPage() {
            this.$emit('push-page', {
                extends: RequestStreamFilters,
                onsNavigatorOptions: {
                    animation: 'lift',
                    animationOptions: {
                        duration: 0.5
                    }
                }
            });
        },
        pushToViewStreamPage() {
            this.$emit('push-page', ViewStream);
        },
        
    }
}
</script>
