import React from "react";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { Stylesheet, InjectionMode } from "@fluentui/merge-styles";
import { resetIds } from "@fluentui/utilities";

const stylesheet = Stylesheet.getInstance();

stylesheet.setConfig({
  injectionMode: InjectionMode.none,
  namespace: "server"
});

export default class MyDocument extends Document<{
  styleTags: any;
  serializedStylesheet: any;
}> {
  static async getInitialProps({renderPage}: DocumentContext) {
    resetIds();
    // const initialProps = await Document.getInitialProps(ctx);
    const page = renderPage(App => props => <App {...props} />);
    return {
      // ...initialProps,
      ...page,
      styleTags: stylesheet.getRules(true),
      serializedStylesheet: stylesheet.serialize(),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: this.props.styleTags }}
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
            window.FabricConfig = window.FabricConfig || {};
            window.FabricConfig.serializedStylesheet = ${this.props.serializedStylesheet};
          `,
            }}
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
