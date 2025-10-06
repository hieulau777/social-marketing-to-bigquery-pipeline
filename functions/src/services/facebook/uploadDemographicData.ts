/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import FacebookApi from "../../api/facebookApi";
import {UploaderFacebook} from "../../utils/uploader";
import {format, subDays} from "date-fns";
import * as Facebook from "../../models/facebook/modelApi";

export const uploadDemographicData = functions
    .runWith({
      timeoutSeconds: 540,
      failurePolicy: true,
      memory: "512MB",
    })
    .pubsub.schedule("30 23 * * *")
    .timeZone("Asia/Jakarta")
    .onRun(async (context) => {
    // .https.onRequest(async (req, res) => {
      const end = format(subDays(new Date(), 1), "yyyy-MM-dd");
      const start = format(subDays(new Date(), 2), "yyyy-MM-dd");
      const timeRange = `since=${start}&until=${end}`;
      const uploader = new UploaderFacebook();
      const fileGender = "pages_gender";
      const fileAge = "pages_age";
      try {
        const api = new FacebookApi();
        const pages = await api.getPages();

        const dataGenderAge: Facebook.GenderAgeByPage[] = [];
        for (const item of pages) {
          const pageToken = item.access_token;
          const pageId = item.id;
          const pageName = item.name;
          const followersGenderAge = await api.getFollowersGenderAge(timeRange, pageId, pageToken);
          if (followersGenderAge !== null) {
            dataGenderAge.push({
              page_id: pageId,
              page_name: pageName,
              gender_age: followersGenderAge,
            });
          }
        }

        const dataGender = [];
        for (const item of dataGenderAge) {
          const gender = item.gender_age;
          const totalMale = Object.entries(gender).reduce((total, [key, value]) => {
            if (key.startsWith("M")) {
              return total + value;
            }
            return total;
          }, 0);

          const totalFemale = Object.entries(gender).reduce((total, [key, value]) => {
            if (key.startsWith("F")) {
              return total + value;
            }
            return total;
          }, 0);

          dataGender.push({page_id: item.page_id, page_name: item.page_name, total_male: totalMale, total_female: totalFemale});
        }
        await uploader.uploadCSV(dataGender, fileGender);

        const dataAge = [];
        const ageGroupKeys = [
          "13-17",
          "18-24",
          "25-34",
          "35-44",
          "45-54",
          "55-64",
          "65+",
        ];

        for (const item of dataGenderAge) {
          const ageGroups: { [key: string]: number } = {};

          for (const ageGroupKey of ageGroupKeys) {
            const matchingKeys = Object.keys(item.gender_age).filter((key) => key.includes(ageGroupKey));

            const ageGroupData = matchingKeys.reduce((total, key) => total + item.gender_age[key], 0);

            const formattedAgeGroupKey = ageGroupKey === "65+" ? "over_65" : ageGroupKey;

            ageGroups[`total_${formattedAgeGroupKey.replace("-", "_")}`] = ageGroupData;
          }

          dataAge.push({
            page_id: item.page_id,
            page_name: item.page_name,
            ...ageGroups,
          });
        }
        await uploader.uploadCSV(dataAge, fileAge);
      } catch (error) {
        await uploader.handleError(fileGender);
        await uploader.handleError(fileAge);
        console.log(error);
      }
    });
/* eslint-disable camelcase */
/* eslint-disable max-len */
