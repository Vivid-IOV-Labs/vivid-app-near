<template>
<v-ons-page>
    <v-ons-toolbar>
        <div class="left">
            <v-ons-back-button></v-ons-back-button>
        </div>
        <div class="center">View Stream</div>
    </v-ons-toolbar>
    <div class="container">
        <div class="jumbotron">

            <div id="video_info">Stream will start playing automatically<br />when it is live</div>
            <video id="remoteVideo" autoplay controls playsinline style="display:none;"></video>
            <img id="play_button" src="images/play.png" @click="playVideo" style="position:absolute;top:30px;left:30px;display:none;" />
            <input type="text" class="form-control" v-model="streamId" id="streamName" placeholder="Type stream name" />

        </div>

    </div>
    <section id="nav_buttons" style="text-align: center;">
        <div style="display:block">
            <v-ons-button style="margin-top: 1em; width: 8em" @click="pushToSupplyStreamPage()">Supply Stream</v-ons-button>
        </div>
    </section>

</v-ons-page>
</template>

<style>
@import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
@import '../css/player.css';

video {
    width: 100%;
    max-width: 640px;
    max-height: 400px;
}
</style>

<script>
import 'webrtc-adapter';
//import $ from 'jquery'
import {
    WebRTCAdaptor
} from '@/js/webrtc_adaptor.js'

import SupplyStream from '@/components/SupplyStream.vue'

import $ from 'jquery'

export default {
    name: 'viewStream',
    data() {
        return {
            webRTCAdaptor: null,
            streamId1: 'streamId',
            streamId: 'stream2',
            pc_config: null,
            sdpConstraints: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            },
            mediaConstraints: {
                video: false,
                audio: false

            },
            streamNameBox: 'stream1'
        }
    },
    methods: {
        pushToSupplyStreamPage() {
            this.$emit('push-page', SupplyStream);
        },
        playVideo() {
            document.getElementById("remoteVideo").style.display = "block";
            document.getElementById("remoteVideo").play().then(function () {
                //autoplay started
                document.getElementById("play_button").style.display = "none";
            }).catch(function () {
                //
                document.getElementById("play_button").style.display = "block";
                console.log("User interaction needed to start playing");
            });
        },
        startPlaying() {
            this.webRTCAdaptor.play(this.streamId);
        },
        stopPlaying() {
            this.webRTCAdaptor.stop();
        }
    },
    mounted() {
        
        $(document).on('postpop', '#navigator', function () {
            console.log('postpop')

            // if (page.matches('#page3')) {
            //     // refresh code 
            // }
        });

        this.webRTCAdaptor = new WebRTCAdaptor({
            websocket_url: "wss://test.antmedia.io:5443/WebRTCAppEE/websocket",
            mediaConstraints: this.mediaConstraints,
            peerconnection_config: this.pc_config,
            sdp_constraints: this.sdpConstraints,
            remoteVideoId: "remoteVideo",
            isPlayMode: true,
            debug: true,
            callback: (info, description) => {
                if (info == "initialized") {
                    console.log("initialized");
                    this.webRTCAdaptor.getStreamInfo(this.streamId);
                } else if (info == "streamInformation") {
                    console.log("stream information");
                    this.webRTCAdaptor.play(this.streamId);
                } else if (info == "play_started") {
                    //joined the stream
                    console.log("play started");
                    document.getElementById("video_info").style.display = "none";
                    this.playVideo();
                } else if (info == "play_finished") {
                    //leaved the stream
                    console.log("play finished");
                    //check that publish may start again
                    setTimeout(function () {
                        this.webRTCAdaptor.getStreamInfo(this.streamId);
                    }, 3000);
                } else if (info == "closed") {
                    //console.log("Connection closed");
                    if (typeof description != "undefined") {
                        console.log("Connecton closed: " + JSON.stringify(description));
                    }
                }
            },
            callbackError: function (error) {
                //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
                console.log("error callback: " + JSON.stringify(error));

                if (error == "no_stream_exist") {
                    setTimeout(function () {
                        this.webRTCAdaptor.getStreamInfo(this.streamId);
                    }, 3000);
                }
                //alert(JSON.stringify(error));
            }
        });

    }
}
</script>
