import "server-only";
import React from "react";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const fetchSlugsOnly = async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: {
        equals: "Live",
      },
    },
  });
  
  interface NotionPage {
    properties: {
      slug: {
        rich_text: Array<{
          plain_text: string;
        }>;
      };
    };
  }

  const results = JSON.parse(JSON.stringify(response));
  return results.results.map((page: NotionPage) => page.properties.slug.rich_text[0].plain_text);
};

export const fetchPages = async () => {
  return notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: {
        equals: "Live",
      },
    },
  });
};

export const fetchMorePost = async () => {
  return notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: {
        equals: "Live",
      },
    },
    page_size: 3,
  });
};

export const fetchBySlug = React.cache(async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "slug",
      rich_text: {
        equals: slug,
      },
    },
  });
  return response.results[0] as PageObjectResponse | undefined;
});

export const fetchPagesBlocks = React.cache(async (pageId: string) => {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  });
  return response.results as BlockObjectResponse[];
});

export const searchPages = React.cache(async (query: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Status",
          status: {
            equals: "Live",
          },
        },
        {
          or: [
            {
              property: "Title",
              rich_text: {
                contains: query,
              },
            },
          ],
        },
      ],
    },
  });
  return response.results as PageObjectResponse[];
});