import Head from "next/head";

export default function MetaTagsGenerator({ metaTags }) {
  return (
    <Head>
      <title>{metaTags.title}</title>
      <meta name="title" content={metaTags.title} />
      <meta name="description" content={metaTags.description} />
      <meta property="og:title" content={metaTags.title} />
      <meta
        property="og:image"
        content={
          metaTags.image ||
          "https://khulke.com/static/media/KhulKe_logo.196f7d82.svg"
        }
      />
      <meta property="og:description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={metaTags.title} />
      <meta name="twitter:description" content={metaTags.description} />
      <link rel="shortcut icon" href="/icons/khulke.svg" />
    </Head>
  );
}
