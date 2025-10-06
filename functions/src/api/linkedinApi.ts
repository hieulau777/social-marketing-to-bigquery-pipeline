/* eslint-disable max-len */
import * as Linkedin from "../models/linkedin/modelApi";
import cf from "../config/linkedin";

export default class LinkedinAPI {
  async getFollowersCountByCountry(): Promise<Linkedin.DataFollowersCountByCountry[]> {
    try {
      const url = `${cf.base}/rest/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=urn%3Ali%3Aorganization%3A2531542`;
      const headers = cf.headers;
      const response = await fetch(url, {headers});
      const json: Linkedin.ResFollowersCount = await response.json();
      const followersCountByCountry = json.elements[0].followerCountsByGeoCountry;
      return followersCountByCountry;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getCountryInfoByGeoId(listGeoId: string): Promise<Linkedin.DataCountryId> {
    try {
      const url = `${cf.base}/v2/geo?ids=List(${listGeoId})`;
      const headers = cf.headers;
      headers.append("X-Restli-Protocol-Version", "2.0.0");
      const response = await fetch(url, {headers});
      const json: Linkedin.ResDatacountry = await response.json();
      const countryValues = json.results;
      return countryValues;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPageStats(start: number, end: number): Promise<Linkedin.DataPageStats[]> {
    try {
      const url = `${cf.base}/rest/organizationPageStatistics?q=organization&organization=urn%3Ali%3Aorganization%3A2531542&timeIntervals=(timeRange:(start:${start},end:${end}),timeGranularityType:DAY)`;
      const headers = cf.headers;
      headers.append("X-Restli-Protocol-Version", "2.0.0");
      const response = await fetch(url, {headers});
      const json: Linkedin.ResPageStats = await response.json();
      const pageStats = json.elements;
      return pageStats;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getNewFollowers(start: number, end: number): Promise<Linkedin.DataNewFollowers[]> {
    try {
      const url = `${cf.base}/rest/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=urn%3Ali%3Aorganization%3A2531542&timeIntervals=(timeRange:(start:${start},end:${end}),timeGranularityType:DAY)`;
      const headers = cf.headers;
      const response = await fetch(url, {headers});
      const json: Linkedin.ResNewFollowers = await response.json();
      const newFollowers = json.elements;
      return newFollowers;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getImpressionTotal(start: number, end: number): Promise<Linkedin.DataTotalImpression[]> {
    try {
      const url = `${cf.base}/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn%3Ali%3Aorganization%3A2531542&timeIntervals=(timeRange:(start:${start},end:${end}),timeGranularityType:DAY)`;
      const headers = cf.headers;
      const response = await fetch(url, {headers});
      const json: Linkedin.ResTotalImpression = await response.json();
      const impressionTotal = json.elements;
      return impressionTotal;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPosts(): Promise<Linkedin.DataPosts[]> {
    try {
      const url = `${cf.base}/rest/posts?author=urn%3Ali%3Aorganization%3A2531542&q=author&count=20&sortBy=LAST_MODIFIED`;
      const headers = cf.headers;
      headers.append("X-RestLi-Method", "FINDER");
      const response = await fetch(url, {headers});
      const json: Linkedin.ResPosts = await response.json();
      const posts = json.elements;
      return posts;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPostsImpression(paramPosts: string): Promise<Linkedin.DataPostsImpression[]> {
    try {
      const url = `${cf.base}/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:2531542${paramPosts}`;
      const headers = cf.headers;
      const response = await fetch(url, {headers});
      const json: Linkedin.ResPostsImpression = await response.json();
      const postsImpression = json.elements;
      return postsImpression;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }
}
/* eslint-disable max-len */
