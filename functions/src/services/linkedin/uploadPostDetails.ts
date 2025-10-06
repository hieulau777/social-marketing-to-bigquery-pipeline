/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {format, subDays, formatISO9075} from "date-fns";
import LinkedinAPI from "../../api/linkedinApi";
import * as Linkedin from "../../models/linkedin/modelApi";
import {UploaderLinkedin} from "../../utils/uploader";

export const uploadPostDetails = functions
    .runWith({
      timeoutSeconds: 540,
      failurePolicy: true,
      memory: "512MB",
    })
    .pubsub.schedule("30 08 * * *")
    .timeZone("Asia/Jakarta")
    .onRun(async (context) => {
    // .https.onRequest(async (req, res) => {
      const filePostsDetail = "posts_detail";
      const fileAveragePostsMetric = "average_posts_metrics";
      const uploader = new UploaderLinkedin();

      try {
        const api = new LinkedinAPI();

        const posts = await api.getPosts();
        let paramPosts = "";
        posts.forEach((item, i) => {
          if (!item.id.includes("urn:li:share")) {
            paramPosts = paramPosts + `&ugcPosts[${i}]=${item.id}`;
          } else if (item.id.includes("urn:li:share")) {
            paramPosts = paramPosts + `&shares[${i}]=${item.id}`;
          }
        });

        const postsImpression = await api.getPostsImpression(paramPosts);
      type Combined = Linkedin.DataPosts & Linkedin.DataPostsImpression;
      const result: Combined[] = [];
      for (const i of posts) {
        result.push({...i, ...postsImpression.find((x) => x.ugcPost === i.id || x.share === i.id)});
      }

      interface PostsMetrics {
        date: string,
        content: string,
        impressions: number,
        engagement: number,
        engagementRate: number
      }

      const postDetailData: PostsMetrics[] = [];
      for (const item of result) {
        if (item.lifecycleState === "PUBLISHED" && item.totalShareStatistics) {
          const engagement = item.totalShareStatistics.likeCount +
            item.totalShareStatistics.commentCount +
            item.totalShareStatistics.shareCount +
            item.totalShareStatistics.clickCount;
          const impressions = item.totalShareStatistics.impressionCount;
          const engagementRate = engagement / impressions * 100;
          postDetailData.push({
            date: formatISO9075(new Date(item.publishedAt)),
            content: item.commentary,
            impressions,
            engagement,
            engagementRate: Number(engagementRate.toFixed(2)),
          });
        }
      }

      await uploader.uploadCSV(postDetailData, filePostsDetail);


      let totalImpression = 0;
      let totalEngagement = 0;
      const postsCount = postDetailData.length;
      for (const item of postDetailData) {
        totalImpression += item.impressions;
        totalEngagement += item.engagement;
      }

      const averagePostsMetrics = [{
        date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
        average_impression: Math.round(totalImpression / postsCount),
        average_engagement: Math.round(totalEngagement / postsCount),
      }];

      await uploader.uploadCSV(averagePostsMetrics, fileAveragePostsMetric);
      } catch (error) {
        await uploader.handleError(filePostsDetail);
        await uploader.handleError(fileAveragePostsMetric);
        console.log(error);
      }
    });
/* eslint-disable camelcase */
/* eslint-disable max-len */
