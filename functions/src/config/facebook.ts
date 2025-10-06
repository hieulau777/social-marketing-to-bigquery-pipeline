import * as dotenv from "dotenv";
dotenv.config();

export default {
  base: "https://graph.facebook.com/v14.0",
  accountId: "1310932799730230",
  token: process.env.USER_ACCESS_TOKEN,
};
