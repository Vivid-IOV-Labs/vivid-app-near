<template>
  <v-ons-page id="viewStreamPage">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">
        <span class="onsPageTitleStyle">View Stream</span>
      </div>
    </v-ons-toolbar>
    <!-- <div id="view-video-control-panel">
      <v-ons-button id="report-button" @click="report()">Report</v-ons-button>
      <span id="payment-ticker" class="badge badge-pill badge-info">{{"$ " + formattedTotalAmount}}</span>
    </div>-->
    <v-ons-list>
      <v-ons-list-item id="optionsPanel_section_viewStream">
        <div id="pay-info-section">
          <span v-show="isWebMonetization" id="payingLabel" class="badge badge-warning">
            Paying
            <strong>
              <i>{{PayToUserName}}</i>
            </strong>
          </span>
          <span
            id="payment-ticker"
            class="badge badge-pill badge-info"
          >{{"$ " + formattedTotalAmount}}</span>
        </div>
        <div class="expandable-content">
          <div id="options_panel"></div>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <div id="view-video-panel">
      <div v-show="inBuiltRequest" class="container">
        <div class="jumbotron">
          <video id="inBuiltVideoExample" src="../assets/video/santa5.mp4" autoplay playsinline></video>
          <!-- <img
            id="play_button"
            src="images/play.png"
            @click="playVideo"
            style="position:absolute;top:30px;left:30px;display:none;"
          />-->
        </div>
      </div>
      <div v-show="!inBuiltRequest" class="container">
        <div class="jumbotron">
          <div id="video_info">
            Stream will start playing automatically
            <br />when it is live
          </div>
          <video id="remoteVideo" autoplay controls></video>
          <!-- <img id="play_button" src="images/play.png" @click="playVideo" /> -->
          <input
            type="text"
            class="form-control"
            v-model="streamId"
            id="streamName"
            placeholder="Type stream name"
          />
        </div>
      </div>
    </div>
    <section id="view_stream_nav_buttons_section">
      <div id="view_stream_nav_buttons_panel">
        <!-- <v-ons-button
          style="margin-top: 1em; width: 10em;background-color:#1d1d1b; color:#16dbdb;font-weight: 550;"
          @click="pushToSupplyStreamPage()"
        >Supply Stream</v-ons-button>-->
        <!-- <v-ons-button
          id="pauseStreamButton"
          :disabled="streamingPaused"
          @click="pauseViewingStream()"
        >
          <ons-icon size="0.75em" icon="fa-pause"></ons-icon>
        </v-ons-button> -->
        <!-- <v-ons-button
          id="playStreamButton"
          :disabled="!streamingPaused"
          @click="playViewingStream()"
        >
          <ons-icon size="0.75em" icon="fa-play"></ons-icon>
        </v-ons-button> -->
        <v-ons-button
          id="endStreamButton"
          @click="endViewingStream()"
        >
         End Stream
        </v-ons-button>
      </div>
    </section>
  </v-ons-page>
</template>

<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../css/player.css";
@import "../css/viewStream.css";
</style>

<script>
import "webrtc-adapter";
//import $ from 'jquery'
import { WebRTCAdaptor } from "@/js/webrtc_adaptor.js";

import SupplyStream from "@/components/SupplyStream.vue";

import $ from "jquery";

import BigNumber from "bignumber.js";

export default {
  name: "viewStream",
  data() {
    return {
      webRTCAdaptor: null,
      streamId1: "streamId",
      streamId: "stream2",
      pc_config: null,
      sdpConstraints: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      },
      mediaConstraints: {
        video: false,
        audio: false
      },
      streamNameBox: "stream1",
      inBuiltRequest: true,
      viewControlPanelView: false,
      PayToUserName: "@ma06rii1",
      streamingPaused: false,
      metaTag:null
    };
  },
  computed: {
    isWebMonetization: function() {
      return this.$vueWebMonetizationStart &&
        this.$vueWebMonetizationStart.state === "started"
        ? true
        : false;
    },
    formattedTotalAmount: function() {
      //console.log(this.$vueWebMonetizationProgress.totalAmount);
      return new BigNumber(
        this.$vueWebMonetizationProgress.totalAmount,
        10
      ).toFormat();
    }
  },
  methods: {
    pauseViewingStream() {
      document.getElementById("inBuiltVideoExample").pause();
      this.streamingPaused = true;
      this.removeWebMonetisationMetaTag()
    },
    playViewingStream() {
      document.getElementById("inBuiltVideoExample").play();
      this.streamingPaused = false;
      this.addWebMonetisationMetaTag()
    },
    startPayingAnimation() {
      $("#payingLabel").fadeIn(800, () => {
        $("#payingLabel").fadeOut(800, () => {
          var start = this.$vueWebMonetizationStart;
          if (start != null && start != false) {
            var state = this.$vueWebMonetizationStart.state;
            if (state != null && state != "pending") {
              this.startPayingAnimation();
            }
          }
        });
      });
    },
    report() {},
    pushToSupplyStreamPage() {
      this.$emit("push-page", SupplyStream);
    },
    playVideo() {
      document.getElementById("remoteVideo").style.display = "block";
      document
        .getElementById("remoteVideo")
        .play()
        .then(function() {
          //autoplay started
          document.getElementById("play_button").style.display = "none";
        })
        .catch(function() {
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
    },
    removeWebMonetisationMetaTag(){
      document.querySelector('meta[name="monetization"]').remove()

    },
    addWebMonetisationMetaTag(){
      this.metaTag = document.createElement('meta')
      this.metaTag.name = "monetization"
      this.metaTag.content = "$twitter.xrptipbot.com/ma06rii1"

      document.head.appendChild(this.metaTag)
    },
    endViewingStream(){
      this.removeWebMonetisationMetaTag()
       this.$emit("back-page");

    }
  },
  mounted() {
    this.playViewingStream()

    // this.startPayingAnimation();
    $(document).on("postpop", "#navigator", function() {
      console.log("postpop");

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
          setTimeout(function() {
            this.webRTCAdaptor.getStreamInfo(this.streamId);
          }, 3000);
        } else if (info == "closed") {
          //console.log("Connection closed");
          if (typeof description != "undefined") {
            console.log("Connecton closed: " + JSON.stringify(description));
          }
        }
      },
      callbackError: function(error) {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        console.log("error callback: " + JSON.stringify(error));

        if (error == "no_stream_exist") {
          setTimeout(function() {
            //this.webRTCAdaptor.getStreamInfo(this.streamId);
          }, 3000);
        }
        //alert(JSON.stringify(error));
      }
    });
  },
  created(){
    this.addWebMonetisationMetaTag()
  },
  beforeDestroy(){
     this.removeWebMonetisationMetaTag()

  }
};
</script>
