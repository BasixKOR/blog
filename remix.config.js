const { readdir } = require("fs/promises");
const DEFAULT_LANG = "en";

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "src/app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  async routes(defineRoutes) {
    const contents = await readdir("src/posts");
    const posts = contents.filter((c) => /\.mdx?$/.test(c));

    const fileRegex = /^(?<slug>[^\.]+)(?:\.(?<lang>\w+))?\.mdx?$/;

    return defineRoutes((route) => {
      for (const post of posts) {
        const match = fileRegex.exec(post);
        const { lang = DEFAULT_LANG, slug } = match?.groups;
        if (slug) {
          route(`/blog/${lang}/${slug}`, `../posts/${post}`);
          if (lang === DEFAULT_LANG)
            route(`/blog/${slug}`, `../posts/${post}`);
        }
      }
    });
  },
};
