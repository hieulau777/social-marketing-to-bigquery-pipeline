/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {format, subDays} from "date-fns";
import {UploaderLinkedin} from "../../utils/uploader";
import LinkedinApi from "../../api/linkedinApi";

export const uploadFollowersByCountry = functions
    .runWith({
      timeoutSeconds: 540,
      failurePolicy: true,
      memory: "512MB",
    })
    .pubsub.schedule("30 08 * * *")
    .timeZone("Asia/Jakarta")
    .onRun(async (context) => {
    // .https.onRequest(async (req, res) => {
      const uploader = new UploaderLinkedin();
      const fileName = "followers_by_country";
      try {
        const api = new LinkedinApi();

        const followerCountsByCountry = await api.getFollowersCountByCountry();
        const idGeoAndFollowers = [];
        const idGeoList = [];
        for (const item of followerCountsByCountry) {
          const idGeo = item.geo.split(":")[3];
          const followers = item.followerCounts.organicFollowerCount;
          idGeoList.push(idGeo);
          idGeoAndFollowers.push({idGeo, followers});
        }

        const listidGeo = idGeoList.join(",");
        const countryValues = await api.getCountryInfoByGeoId(listidGeo);
        const final = [];
        const date = format(subDays(new Date(), 2), "yyyy-MM-dd");
        for (const item of idGeoAndFollowers) {
          const id = item.idGeo;
          const countryData = countryValues[id];
          const country = countryData.defaultLocalizedName.value;
          final.push({date, country, followers: item.followers});
        }

        await uploader.uploadCSV(final, fileName);
      } catch (error) {
        await uploader.handleError(fileName);
        console.log(error);
      }
    });
/* eslint-disable camelcase */
/* eslint-disable max-len */
