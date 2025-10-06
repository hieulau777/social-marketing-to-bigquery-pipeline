/* eslint-disable max-len */
import * as Facebook from "../models/facebook/modelApi";
import cf from "../config/facebook";

export default class FacebookApi {
  async getPages(): Promise<Facebook.Pages[]> {
    try {
      const url = `${cf.base}/${cf.accountId}/accounts?fields=name,access_token&access_token=${cf.token}`;
      const response = await fetch(url);
      const json: Facebook.DataPages = await response.json();
      const ematicPages = json.data.filter((pages) => {
        return pages.name.includes("Ematic");
      });
      return ematicPages;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getFollowersGenderAge(timeRange: string, pageId: string, token: string): Promise<Facebook.GenderAge | null> {
    try {
      const url = `${cf.base}/${pageId}/insights?metric=page_fans_gender_age&${timeRange}&access_token=${token}`;

      const response = await fetch(url);
      const json: Facebook.DataGenderAge = await response.json();
      const data = json.data;
      const followersGenderAge = data.length > 0 ? data[0].values[0].value : null;
      return followersGenderAge;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPageOverview(timeRange: string, pageId: string, token: string): Promise<Facebook.DataPageOverview[]> {
    try {
      const url = `${cf.base}/${pageId}/insights?metric=page_fans,page_views_total,page_posts_impressions_unique,page_post_engagements&${timeRange}&period=day&access_token=${token}`;
      const response = await fetch(url);
      const json: Facebook.ResPageOverview = await response.json();
      const data = json.data;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPosts(pageId: string, token: string): Promise<Facebook.DataPosts[]> {
    try {
      const url = `${cf.base}/${pageId}/feed?access_token=${token}`;
      const response = await fetch(url);
      const json: Facebook.ResPosts = await response.json();
      const data = json.data;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPostReactions(postId: string, token: string): Promise<number> {
    try {
      const url = `${cf.base}/${postId}?fields=reactions.summary(true)&access_token=${token}`;
      const response = await fetch(url);
      const json: Facebook.PostReactions = await response.json();
      const data = json.reactions.summary?.total_count || 0;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPostLikes(postId: string, token: string): Promise<number> {
    try {
      const url = `${cf.base}/${postId}?fields=reactions.type(LIKE).summary(true)&access_token=${token}`;
      const response = await fetch(url);
      const json: Facebook.PostReactions = await response.json();
      const data = json.reactions.summary?.total_count || 0;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPostReach(postId: string, token: string): Promise<number> {
    try {
      const url = `${cf.base}/${postId}/insights/post_impressions_unique?access_token=${token}`;
      const response = await fetch(url);
      const json: Facebook.ResPostInsights = await response.json();
      const data = json.data[0]?.values[0]?.value || 0;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPostClicks(postId: string, token: string): Promise<number> {
    try {
      const url = `${cf.base}/${postId}/insights/post_clicks?access_token=${token}`;
      const response = await fetch(url);
      const json: Facebook.ResPostInsights = await response.json();
      const data = json.data[0]?.values[0]?.value || 0;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  async getPostShares(postId: string, token: string): Promise<number> {
    try {
      const url = `${cf.base}/${postId}?fields=shares.summary(true)&access_token=${token}`;
      const response = await fetch(url);
      const json: Facebook.PostShares = await response.json();
      const data = json.share?.count || 0;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }
}
/* eslint-disable max-len */
