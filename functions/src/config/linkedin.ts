import * as dotenv from "dotenv";
dotenv.config();

export default {
  base: "https://api.linkedin.com",
  headers: new Headers({
    "LinkedIn-Version": "202308",
    "Authorization": `${process.env.LINKEDIN_API_TOKEN}`,
  }),
};

