/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {format, getTime, subMilliseconds} from "date-fns";
import LinkedinAPI from "../../api/linkedinApi";
import {UploaderLinkedin} from "../../utils/uploader";

export const uploadPeriodOverview = functions
    .runWith({
      timeoutSeconds: 540,
      failurePolicy: true,
      memory: "512MB",
    })
    .pubsub.schedule("30 08 * * *")
    .timeZone("Asia/Jakarta")
    .onRun(async (context) => {
    // .https.onRequest(async (req, res) => {
      const dayMilliseconds = 86400000;
      const daysAgo = getTime(subMilliseconds(new Date(), dayMilliseconds * 3));
      const yesterday = getTime(subMilliseconds(new Date(), dayMilliseconds));

      const fileName = "period_overview";
      const uploader = new UploaderLinkedin();

      try {
        const api = new LinkedinAPI();

        // // // // ----------------------- #### ----------------------- // VIEWS AND CLICKS

        const dataTotalPageStatistics = await api.getPageStats(daysAgo, yesterday);
        const IviewsAndClicks = [];
        for (const item of dataTotalPageStatistics) {
          const date = format(item.timeRange.start, "yyyy-MM-dd");
          const page_views = item.totalPageStatistics.views.allPageViews.pageViews;
          const unique_visitors = item.totalPageStatistics.views.allPageViews.uniquePageViews;
          const mobileCustomBtnClick = item.totalPageStatistics.clicks.mobileCustomButtonClickCounts[0].clicks;
          const desktopCustomBtnClick = item.totalPageStatistics.clicks.desktopCustomButtonClickCounts[0].clicks;
          const custom_button_clicks = mobileCustomBtnClick + desktopCustomBtnClick;
          IviewsAndClicks.push({
            date,
            page_views,
            unique_visitors,
            custom_button_clicks,
          });
        }

        // // // // ----------------------- #### ----------------------- // NEW FOLLOWERS

        const dataNewFollowers = await api.getNewFollowers(daysAgo, yesterday);
        const InewFollowers = [];
        for (const item of dataNewFollowers) {
          const date = format(item.timeRange.start, "yyyy-MM-dd");
          const new_followers = item.followerGains.organicFollowerGain +
          item.followerGains.paidFollowerGain;
          InewFollowers.push({
            date,
            new_followers,
          });
        }

        // // // // ----------------------- #### ----------------------- // IMPRESSIONS

        const dataImpressionTotal = await api.getImpressionTotal(daysAgo, yesterday);
        const IimpressionTotal = [];
        for (const item of dataImpressionTotal) {
          const date = format(item.timeRange.start, "yyyy-MM-dd");
          const posts_impression = item.totalShareStatistics.impressionCount;
          IimpressionTotal.push({
            date,
            posts_impression,
          });
        }

        // // // // ----------------------- #### ----------------------- // MERGE DATA

      interface DataItem {
        date: string;
        page_views?: number;
        unique_visitors?: number;
        custom_button_clicks?: number;
        new_followers?: number;
        posts_impression?: number;
      }

      const data: DataItem[] = [
        ...IviewsAndClicks,
        ...InewFollowers,
        ...IimpressionTotal,
      ];

      const mergedData: DataItem[] = [];

      const dataMap: { [date: string]: DataItem } = {};

      for (const item of data) {
        const date = item.date;
        if (!dataMap[date]) {
          dataMap[date] = item;
        } else {
          dataMap[date] = {...dataMap[date], ...item};
        }
      }

      for (const date in dataMap) {
        if (dataMap[date]) {
          mergedData.push(dataMap[date]);
        }
      }

      const final = [mergedData[mergedData.length-1]];

      await uploader.uploadCSV(final, fileName);
      } catch (error) {
        console.log(error);
        await uploader.handleError(fileName);
      }
    });
/* eslint-disable camelcase */
/* eslint-disable max-len */
