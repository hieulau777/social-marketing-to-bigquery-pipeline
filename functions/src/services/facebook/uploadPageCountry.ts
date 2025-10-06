/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import FacebookAPI from "../../api/facebookApi";
import {UploaderFacebook} from "../../utils/uploader";

export const uploadPageCountry = functions
    .runWith({
      timeoutSeconds: 540,
      failurePolicy: true,
      memory: "512MB",
    })
    .pubsub.schedule("30 23 * * *")
    .timeZone("Asia/Jakarta")
    .onRun(async (context) => {
    // .https.onRequest(async (req, res) => {
      const fileName = "page_country";
      const uploader = new UploaderFacebook();

      try {
        const api = new FacebookAPI();
        const pages = await api.getPages();

        const pageCountry = [];
        for (const item of pages) {
          pageCountry.push({
            page_id: item.id,
            page_url: `https://www.facebook.com/${item.id}`,
            page_name: item.name,
          });
        }

        await uploader.uploadCSV(pageCountry, fileName);
      } catch (error) {
        await uploader.handleError(fileName);
        console.log("outer error: ", error);
      }
    });
/* eslint-disable camelcase */
/* eslint-disable max-len */
