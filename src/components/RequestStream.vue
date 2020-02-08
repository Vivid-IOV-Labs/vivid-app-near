<template>
<v-ons-page>
    <v-ons-toolbar>
        <div class="center">Request Stream</div>
    </v-ons-toolbar>
    <input type="text" class="form-control" v-model="streamNameBox" id="streamName" placeholder="Type stream name" />
    <div id="video_info">Stream will start playing automatically<br />when it is live</div>
    <video id="remoteVideo" autoplay controls playsinline style="display:none;"></video>
    <img id="play_button" src="images/play.png" @click="playVideo" style="position:absolute;top:30px;left:30px;display:none;" />
    <p style="text-align: center">
        <v-ons-button @click="push">Supply Stream</v-ons-button>
    </p>
</v-ons-page>
</template>

<style>
@import '../css/player.css';

video {
    width: 100%;
    max-width: 640px;
    max-height: 400px;
}
</style>

<script>
import SupplyStream from '@/components/SupplyStream.vue'
import 'webrtc-adapter';
//import $ from 'jquery'
import {
    WebRTCAdaptor
} from '@/js/webrtc_adaptor.js'

export default {
    name: 'requestStream',
    data() {
        return {
            webRTCAdaptor: null,
            streamId: 'streamId',
            pc_config: null,
            sdpConstraints: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            },
            mediaConstraints: {
                video: false,
                audio: false

            },
            streamNameBox:'stream1'
        }
    },
        methods: {
                push() {
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
                    this.webRTCAdaptor.play(this.streamNameBox);
                },
                stopPlaying() {
                    this.webRTCAdaptor.stop();
                }
            },
            mounted() {
                //var streamId = "streamId";

                //var pc_config = null;
                // var sdpConstraints = {
                //     OfferToReceiveAudio: true,
                //     OfferToReceiveVideo: true
                // };
                // var mediaConstraints = {
                //     video: false,
                //     audio: false
                // };

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
