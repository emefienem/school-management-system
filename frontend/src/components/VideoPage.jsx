// import React from "react";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useParams } from "react-router";
// const app = import.meta.env.VITE_APP_ID;
// const secret = import.meta.env.VITE_SERVER_SECRET;

// const VideoPage = () => {
//   {
//     console.log(app, secret);
//   }
//   const { id } = useParams();
//   const roomID = id;
//   //  const roomID = getUrlParams().get('roomID') || randomID(5);
//   let myMeeting = async (element) => {
//     // generate Kit Token
//     const appID = app;
//     const serverSecret = secret;
//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       appID,
//       serverSecret,
//       roomID,
//       Date.now().toString(),
//       "Classroom"
//       // 60000
//     );

//     // Create instance object from Kit Token.
//     const zp = ZegoUIKitPrebuilt.create(kitToken);
//     // start the call
//     zp.joinRoom({
//       container: element,
//       sharedLinks: [
//         {
//           name: "Personal link",
//           url:
//             window.location.protocol +
//             "//" +
//             window.location.host +
//             window.location.pathname +
//             "?roomID=" +
//             roomID,
//         },
//       ],
//       scenario: {
//         mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
//       },
//     });
//   };
//   return <div ref={myMeeting}></div>;
// };

// export default VideoPage;

import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router";

const app = import.meta.env.VITE_APP_ID;
const secret = import.meta.env.VITE_SERVER_SECRET;

const VideoPage = () => {
  const { id } = useParams();
  const roomID = id;
  const meetingRef = useRef(null);

  useEffect(() => {
    const initMeeting = async () => {
      try {
        const appID = parseInt(app, 10);
        const serverSecret = secret;

        console.log("App ID:", appID, "Server Secret:", serverSecret);

        if (!appID || !serverSecret || !roomID) {
          console.error("Missing required parameters");
          return;
        }

        // Generate Kit Token
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          Date.now().toString(),
          "Classroom"
        );

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        console.log("ZP Object:", zp);

        if (meetingRef.current && zp) {
          // Start the call
          zp.joinRoom({
            container: meetingRef.current,
            sharedLinks: [
              {
                name: "Personal link",
                url:
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?roomID=" +
                  roomID,
              },
            ],
            scenario: {
              mode: ZegoUIKitPrebuilt.GroupCall, // GroupCall mode
            },
          });
        }
      } catch (error) {
        console.error("Error initializing meeting:", error);
      }
    };

    initMeeting();
  }, [roomID]);

  return (
    <div ref={meetingRef} style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default VideoPage;
