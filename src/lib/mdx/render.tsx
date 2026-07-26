import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "./components";
import { marked } from "marked";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark", light: "github-light" },
          keepBackground: false,
        },
      ],
    ],
  },
};

export async function renderMdx(source: string) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      // @ts-expect-error rehype plugin tuple typing
      options={mdxOptions}
    />
  );
}

/** Fallback HTML path for plain markdown without MDX components */
export async function renderMarkdownHtml(source: string): Promise<string> {
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(source) as string | Promise<string>;
}
