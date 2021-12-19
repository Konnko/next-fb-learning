import Head from "next/head"

export default function MetaTags({
  title = "Default title",
  description = "Description",
  image = "https://sun9-71.userapi.com/impf/jzaz1U42gCguIS0hjUfH5omcr7Govfj5kG1ZjA/bDJW3dVxHdU.jpg?size=536x536&quality=96&sign=7766859e031587a847d1f0536d6b5a8d&type=album"
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fireship_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}
