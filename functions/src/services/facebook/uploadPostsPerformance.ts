/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {format} from "date-fns";
import FacebookApi from "../../api/facebookApi";
import {UploaderFacebook} from "../../utils/uploader";

export const uploadPostsPerformance = functions
    .runWith({
      timeoutSeconds: 540,
      failurePolicy: true,
      memory: "512MB",
    })
    .pubsub.schedule("30 23 * * *")
    .timeZone("Asia/Jakarta")
    .onRun(async (context) => {
    // .https.onRequest(async (req, res) => {

      const fileName = "post_performance";
      const uploader = new UploaderFacebook();

      try {
        const api = new FacebookApi();
        const pages = await api.getPages();

        interface postInfo {
            page_id: string,
            page_name: string,
            page_token: string,
            post_id: string
            created_time: string,
            message: string,
            post_url: string
        }
        const pagePostList: postInfo[] = [];
        for (const item of pages) {
          const pageId = item.id;
          const pageName = item.name;
          const pageToken = item.access_token;
          const posts = await api.getPosts(pageId, pageToken);
          const result = {
            created_time: "",
            message: "",
            post_url: "",
            page_name: pageName,
            post_id: "",
            page_id: pageId,
            page_token: pageToken,
          };
          for (const item of posts) {
            result.post_id = item.id;
            result.created_time = item.created_time;
            result.post_url = `https://www.facebook.com/${item.id}`;
            if (item.message) {
              result.message = item.message;
            }
            if (result.message !== "") {
              pagePostList.push(result);
            }
          }
        }

        // Find post that not have permission
        const errorPostId = await Promise.all(pagePostList.map(async (item) => {
          if (item !== null) {
            let err;
            const postId = item.post_id;
            const pageToken = item.page_token;
            try {
              await api.getPostReactions(postId, pageToken);
            } catch (error) {
              err = postId;
            }
            return err;
          } else {
            return undefined;
          }
        }));
        const errorPostIdFilter = errorPostId.filter((item) => {
          return item !== undefined;
        });
        console.log("Permission restricted post id: ", errorPostIdFilter);

        // Filter post that not have permisson
        const pagePostListWithTokenFilered = pagePostList.filter((item) => {
          return errorPostId.indexOf(item.post_id) === -1;
        });
        const postPerformance = await Promise.all(
            pagePostListWithTokenFilered.map(async (item) => {
              const pageToken = item.page_token;
              const post_id = item.post_id;
              const page_name = item.page_name;
              const post_url = item.post_url;
              const message = item.message;
              const created_time = format(new Date(`${item.created_time}`), "yyyy-MM-dd");
              const post_reactions = await api.getPostReactions(post_id, pageToken);
              const post_likes = await api.getPostLikes(post_id, pageToken);
              const post_reach = await api.getPostReach(post_id, pageToken);
              const post_clicks = await api.getPostClicks(post_id, pageToken);
              const post_shares = await api.getPostShares(post_id, pageToken);
              const post_engagements = post_clicks + post_reactions + post_shares;
              return {
                created_time,
                message,
                post_url,
                page_name,
                post_id,
                post_reactions,
                post_likes,
                post_shares,
                post_reach,
                post_clicks,
                post_engagements,
              };
            }));

        await uploader.uploadCSV(postPerformance, fileName);
      } catch (error) {
        await uploader.handleError(fileName);
        console.log(error);
      }
    });
/* eslint-disable camelcase */
/* eslint-disable max-len */
