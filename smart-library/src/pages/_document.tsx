import { Head, Html, Main, NextScript } from "next/document";
import { type FC, Suspense } from "react";
import { cn } from "~/utils/css";
import { poppins } from "~/utils/font";

const Document: FC = () => {
  return (
    <Suspense fallback={<h1>Loading!</h1>}>
      <Html lang="hr" className={cn(poppins.className, poppins.variable)}>
        <Head />
        <body className="flex min-h-screen flex-col justify-stretch">
          <Main />
          <NextScript />
        </body>
      </Html>
    </Suspense>
  );
};

export default Document;
