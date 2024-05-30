import { type AppContext, type AppType } from "next/app";
import NextApp from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type NextPageWithLayout } from "~/types/layout";
import Head from "next/head";
import { Suspense } from "react";
import { MainLayout } from "~/layouts/main/main-layout";

export const getInitialProps = async (app: AppContext) => {
  return {
    ...(await NextApp.getInitialProps(app)),
    rawCookies: app.ctx.req?.headers.cookie,
  };
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const { getLayout } = Component as NextPageWithLayout;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="IE=Edge" httpEquiv="X-UA-Compatible" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Smart Library</title>
      </Head>
      <Suspense>
        {getLayout ? (
          getLayout(<Component {...pageProps} />)
        ) : (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        )}
      </Suspense>
    </>
  );
};

export default api.withTRPC(MyApp);
