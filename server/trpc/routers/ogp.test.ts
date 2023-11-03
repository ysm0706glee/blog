import { describe, afterEach, test, vi, expect } from "vitest";
import { appRouter } from "./";

describe("ogp", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should return ogp", async () => {
    const fetchMock = vi.fn(() => ({
      text: () =>
        '<meta property="og:title" content="Test Title"><meta property="og:image" content="Test Image URL"><meta property="og:description" content="Test Description">',
    }));
    vi.stubGlobal("fetch", fetchMock);
    const cheerioMock = vi.fn(() => ({
      load: () => ({
        "meta[property='og:title']": { attr: () => "Test Title" },
        "meta[property='og:image']": { attr: () => "Test Image URL" },
        "meta[property='og:description']": { attr: () => "Test Description" },
      }),
    }));
    vi.stubGlobal("cheerio", cheerioMock);
    const caller = appRouter.createCaller({ ctx: null });
    const ogp = await caller.ogpRouter.getOgp({
      url: "https://test.com",
    });
    expect(ogp).toEqual({
      title: "Test Title",
      image: "Test Image URL",
      description: "Test Description",
    });
  });

  test("should return empty ogp", async () => {
    const fetchMock = vi.fn(() => ({
      text: () => "",
    }));
    vi.stubGlobal("fetch", fetchMock);
    const cheerioMock = vi.fn(() => ({
      load: () => ({
        "meta[property='og:title']": { attr: () => "" },
        "meta[property='og:image']": { attr: () => "" },
        "meta[property='og:description']": { attr: () => "" },
      }),
    }));
    vi.stubGlobal("cheerio", cheerioMock);
    const caller = appRouter.createCaller({ ctx: null });
    const ogp = await caller.ogpRouter.getOgp({
      url: "https://test.com",
    });
    expect(ogp).toEqual({
      title: "",
      image: "",
      description: "",
    });
  });
});
