<template id="supplyStream">
<v-ons-page>
    <!-- <v-ons-toolbar>
      <div class="center">Title</div>
    </v-ons-toolbar>

    <p style="text-align: center">
      <v-ons-button @click="$ons.notification.alert('Hello World!')">
        Click me!
      </v-ons-button>
    </p> -->
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Request Stream</v-ons-back-button>
      </div>
      <div class="center">Supply Stream</div>
    </v-ons-toolbar>
    <div class="container">

        <!-- <div class="header clearfix">
            <nav>
                <ul class="nav navbar-pills pull-right">
                    <li><a href="http://antmedia.io">Contact</a></li>
                </ul>
            </nav>
            <h3 class="text-muted">WebRTC Publish</h3>
        </div> -->

        <div class="jumbotron">

            <p>
                <video id="localVideo" autoplay muted controls playsinline></video>
            </p>

            <!-- <p> -->
            <!-- <input type="text" class="form-control" :value="this.streamNameBox.value" id="streamName" placeholder="Type stream name" /> -->
            <input type="text" class="form-control" v-model="streamNameBox" id="streamName" placeholder="Type stream name" />
            <!-- <div class="form-check"> -->
                <!-- <input class="form-check-input" disabled onchange="enableDesktopCapture(event.target.checked)" type="checkbox" value="" id="screen_share_checkbox" /> -->
                <!-- <label class="form-check-label" for="screen_share_checkbox" style="font-weight:normal">
                    Screen Share
                </label> <br /> -->
                <!-- <a id="install_chrome_extension_link" href="https://chrome.google.com/webstore/detail/jaefaokkgpkkjijgddghhcncipkebpnb">Install Chrome Extension</a> -->
            <!-- </div> -->
            <!-- </p> -->
            <p>

                <button @click="startPublishing" class="btn btn-info" :disabled="start_publish_button.disabled" id="start_publish_button">Start Publishing</button>
                <button @click="stopPublishing" class="btn btn-info" :disabled="stop_publish_button.disabled" id="stop_publish_button">Stop Publishing</button>

            </p>

            <span class="label label-success" id="broadcastingInfo" style="font-size:14px;display:none">Publishing</span>

        </div>
        <!-- <footer class="footer">
            <p><a href="http://antmedia.io">Ant Media Server Enterprise Edition</a></p>
        </footer> -->

    </div>
</v-ons-page>
</template>

<style>
video {
    width: 100%;
    max-width: 640px;
}

/* Space out content a bit */
body {
    padding-top: 20px;
    padding-bottom: 20px;
}

/* Everything but the jumbotron gets side spacing for mobile first views */
.header,
.marketing,
.footer {
    padding-right: 15px;
    padding-left: 15px;
}

/* Custom page header */
.header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
}

/* Make the masthead heading the same height as the navigation */
.header h3 {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 40px;
}

/* Custom page footer */
.footer {
    padding-top: 19px;
    color: #777;
    border-top: 1px solid #e5e5e5;
}

/* Customize container */
@media (min-width : 768px) {
    .container {
        max-width: 730px;
    }
}

.container-narrow>hr {
    margin: 30px 0;
}

/* Main marketing message and sign up button */
.jumbotron {
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
}

/* Responsive: Portrait tablets and up */
@media screen and (min-width: 768px) {

    /* Remove the padding we set earlier */
    .header,
    .marketing,
    .footer {
        padding-right: 0;
        padding-left: 0;
    }

    /* Space out the masthead */
    .header {
        margin-bottom: 30px;
    }

    /* Remove the bottom border on the jumbotron for visual effect */
    .jumbotron {
        border-bottom: 0;
    }
}
</style>


<script>
//import RequestStream from '@/components/RequestStream.vue'


import 'webrtc-adapter';
import $ from 'jquery'


// import '@/js/fetch.js'
// import '@/js/fetch.stream.js'
// import '@/js/promise.min.js'
import { WebRTCAdaptor } from '@/js/webrtc_adaptor.js'



//console.log(WebRTCAdaptor)

export default {
    name:'supplyStream',
    data() {
        return {
            start_publish_button: {disabled:true},
            stop_publish_button: {disabled:true},
            screen_share_checkbox: '',
            install_extension_link: '',
            //streamNameBox: {value:'stream1'},
            streamNameBox:'stream1',
            streamId: '',
            name: '',
            pc_config: '',
            sdpConstraints: '',
            mediaConstraints: '',
            webRTCAdaptor: ''

        }
    },
    methods: {
        // getUrlParameter(sParam) {
        //     var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        //         sURLVariables = sPageURL.split('&'),
        //         sParameterName,
        //         i;

        //     for (i = 0; i < sURLVariables.length; i++) {
        //         sParameterName = sURLVariables[i].split('=');

        //         if (sParameterName[0] === sParam) {
        //             return sParameterName[1] === undefined ? true : sParameterName[1];
        //         }
        //     }
        // },
        startPublishing() {
            //this.streamId = this.streamNameBox.value;
            this.streamId = this.streamNameBox
            this.webRTCAdaptor.publish(this.streamId);
        },
        stopPublishing() {
            this.webRTCAdaptor.stop(this.streamId);
        },
        enableDesktopCapture(_enable) {
            if (_enable == true) {
                this.webRTCAdaptor.switchDesktopCapture(this.streamId);
            } else {
                this.webRTCAdaptor.switchVideoCapture(this.streamId);
            }
        },
        startAnimation() {

            $("#broadcastingInfo").fadeIn(800, () => {
                $("#broadcastingInfo").fadeOut(800, () => {
                    var state = this.webRTCAdaptor.signallingState(this.streamId);
                    if (state != null && state != "closed") {
                        var iceState = this.webRTCAdaptor.iceConnectionState(this.streamId);
                        if (iceState != null && iceState != "failed" && iceState != "disconnected") {
                            this.startAnimation();
                        }
                    }
                });
            });

        }

    },
    mounted() {

        // let adapterlatest = document.createElement('script')
        // adapterlatest.setAttribute('src', 'https://webrtc.github.io/adapter/adapter-latest.js')
        // document.head.appendChild(adapterlatest)

        //console.log(this.streamNameBox)
        //this.start_publish_button = document.getElementById("start_publish_button");
        //this.stop_publish_button = document.getElementById("stop_publish_button");

        //this.screen_share_checkbox = document.getElementById("screen_share_checkbox");
        //this.install_extension_link = document.getElementById("install_chrome_extension_link");

        //this.streamNameBox.value = document.getElementById("streamName").value;

        //this.streamId;

        //this.name = this.getUrlParameter("name");

        // if (this.name !== "undefined") {
        //     //this.streamNameBox.value = this.name;
        //     this.streamNameBox = this.name;
        // }

        this.pc_config = null;

        this.sdpConstraints = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false

        };

        this.mediaConstraints = {
            video: true,
            audio: true
        };

        this.webRTCAdaptor = new WebRTCAdaptor({
            websocket_url: "wss://test.antmedia.io:5443/WebRTCAppEE/websocket",
            mediaConstraints: this.mediaConstraints,
            peerconnection_config: this.pc_config,
            sdp_constraints: this.sdpConstraints,
            localVideoId: "localVideo",
            debug: true,
            callback: (info, description) => {
                if (info == "initialized") {
                    console.log("initialized");
                    this.start_publish_button.disabled = false;
                    this.stop_publish_button.disabled = true;
                } else if (info == "publish_started") {
                    //stream is being published
                    console.log("publish started");
                    this.start_publish_button.disabled = true;
                    this.stop_publish_button.disabled = false;
                    this.startAnimation();
                } else if (info == "publish_finished") {
                    //stream is being finished
                    console.log("publish finished");
                    this.start_publish_button.disabled = false;
                    this.stop_publish_button.disabled = true;
                } else if (info == "screen_share_extension_available") {
                    //this.screen_share_checkbox.disabled = false;
                    //console.log("screen share extension available");
                    //this.install_extension_link.style.display = "none";
                } else if (info == "screen_share_stopped") {
                    console.log("screen share stopped");
                } else if (info == "closed") {
                    //console.log("Connection closed");
                    if (typeof description != "undefined") {
                        console.log("Connecton closed: " + JSON.stringify(description));
                    }
                } else if (info == "pong") {
                    //ping/pong message are sent to and received from server to make the connection alive all the time
                    //It's especially useful when load balancer or firewalls close the websocket connection due to inactivity
                }
            },
            callbackError: (error, message) => {
                //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

                console.log("error callback: " + JSON.stringify(error));
                var errorMessage = JSON.stringify(error);
                if (typeof message != "undefined") {
                    errorMessage = message;
                }
                //var errorMessage = JSON.stringify(error);
                if (error.indexOf("NotFoundError") != -1) {
                    errorMessage = "Camera or Mic are not found or not allowed in your device.";
                } else if (error.indexOf("NotReadableError") != -1 || error.indexOf("TrackStartError") != -1) {
                    errorMessage = "Camera or Mic is being used by some other process that does not not allow these devices to be read.";
                } else if (error.indexOf("OverconstrainedError") != -1 || error.indexOf("ConstraintNotSatisfiedError") != -1) {
                    errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints."
                } else if (error.indexOf("NotAllowedError") != -1 || error.indexOf("PermissionDeniedError") != -1) {
                    errorMessage = "You are not allowed to access camera and mic.";
                } else if (error.indexOf("TypeError") != -1) {
                    errorMessage = "Video/Audio is required.";
                } else if (error.indexOf("UnsecureContext") != -1) {
                    errorMessage = "Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https";
                } else if (error.indexOf("WebSocketNotSupported") != -1) {
                    errorMessage = "Fatal Error: WebSocket not supported in this browser";
                }

                alert(errorMessage);
            }
        });
    }
}
</script>
