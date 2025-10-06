/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {format, subDays} from "date-fns";
import FacebookApi from "../../api/facebookApi";
import {UploaderFacebook} from "../../utils/uploader";

export const uploadPageOverview = functions
    .runWith({
      timeoutSeconds: 540,
      failurePolicy: true,
      memory: "512MB",
    })
    .pubsub.schedule("30 23 * * *")
    .timeZone("Asia/Jakarta")
    .onRun(async (context) => {
    // .https.onRequest(async (req, res) => {
      const end = format(new Date(), "yyyy-MM-dd");
      const start = format(subDays(new Date(), 1), "yyyy-MM-dd");
      const timeRangeDaily = `since=${start}&until=${end}`;

      const fileName = "page_performance";
      const uploader = new UploaderFacebook();

      try {
        const api = new FacebookApi();
        const pages = await api.getPages();

        const pagesMetric = [];
        for (const item of pages) {
          const pageToken = item.access_token;
          const pageId = item.id;
          const pageName = item.name;
          const data = await api.getPageOverview(timeRangeDaily, pageId, pageToken);

          const nameToKeyMapping: { [name: string]: string } = {
            "page_fans": "page_likes",
            "page_views_total": "page_views",
            "page_posts_impressions_unique": "page_posts_reach",
            "page_post_engagements": "page_post_engagements",
          };

          const result: {
                [key: string]: number | string;
              } = {
                "page_name": pageName,
                "page_likes": 0,
                "date": "",
                "page_views": 0,
                "page_posts_reach": 0,
                "page_post_engagements": 0,
              };

          for (const item of data) {
            const key = nameToKeyMapping[item.name];
            if (key) {
              const value = item.values[0]?.value || 0;
              result[key] = value;
              result.date = format(subDays(new Date(`${item.values[0]?.end_time || ""}`), 1), "yyyy-MM-dd");
            }
          }

          pagesMetric.push(result);
        }
        await uploader.uploadCSV(pagesMetric, fileName);
      } catch (error) {
        await uploader.handleError(fileName);
        console.log(error);
      }
    });
/* eslint-disable camelcase */
/* eslint-disable max-len */
