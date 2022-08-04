import { GetStaticProps, NextPage } from "next";
import { MicroCMSListResponse } from "microcms-js-sdk";
import { client } from "src/libs/client";
import Link from "next/link";

export type Blog = {
  title: string;
  body: string;
};

type Props = MicroCMSListResponse<Blog>;

const Home: NextPage<Props> = (props) => {
  return (
    <div>
      <p className="text-gray-400">{props.totalCount}</p>
      <ul className="mt-4 space-y-4">
        {props.contents.map((content) => (
          <li key={content.id}>
            <Link href={`/blog/${content.id}`}>
              <a className="text-xl text-blue-800 underline hover:text-blue-400">
                {content.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await client.getList<Blog>({ endpoint: "blog" });
  return { props: data };
};

export default Home;
