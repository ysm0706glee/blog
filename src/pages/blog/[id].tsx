import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MicroCMSContentId, MicroCMSDate } from "microcms-js-sdk";
import dayjs from "dayjs";
import { client } from "src/libs/client";
import { Blog } from "src/pages";

type Props = Blog & MicroCMSContentId & MicroCMSDate;

const BlogId: NextPage<Props> = (props) => {
  return (
    <div>
      <h1 className="text-4xl font-bold">{props.title}</h1>
      <time datatype={props.publishedAt} className="mt-2 block">
        {dayjs(props.publishedAt).format("DD/MM/YYYY")}
      </time>
      <article
        className="prose-sm prose mt-8"
        dangerouslySetInnerHTML={{ __html: props.body }}
      ></article>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const data = await client.getList({ endpoint: "blog" });
  const ids = data.contents.map((content) => `/blog/${content.id}`);
  return {
    paths: ids,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, { id: string }> = async (
  ctx
) => {
  if (!ctx.params) {
    return { notFound: true };
  }

  const data = await client.getListDetail<Blog>({
    endpoint: "blog",
    contentId: ctx.params.id,
  });
  return {
    props: data,
  };
};

export default BlogId;
