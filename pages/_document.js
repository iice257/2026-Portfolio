import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('theme');var theme=stored==='dark'||stored==='light'?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',theme);if(location.pathname==='/'&&window.matchMedia('(max-width: 1023px)').matches){document.documentElement.setAttribute('data-hero-locked','true')}}catch(e){}})();`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
