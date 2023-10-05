import { router } from "../trpc";
import { ogpRouter } from "./ogp";

export const appRouter = router({
  ogpRouter,
});

export type AppRouter = typeof appRouter;
