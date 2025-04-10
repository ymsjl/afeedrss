import React from "react";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { Stylesheet } from "@fluentui/merge-styles";
import {
  createDOMRenderer,
  renderToStyleElements,
} from "@fluentui/react-components";

const stylesheet = Stylesheet.getInstance();

export default class MyDocument extends Document<{
  styleTags: any;
  serializedStylesheet: any;
}> {
  static async getInitialProps(ctx: DocumentContext) {
    // resetIds();
    const renderer = createDOMRenderer();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhancedApp(props) {
            const enhancedProps = {
              ...props,
              // 👇 this is required to provide a proper renderer instance
              renderer,
            };

            return <App {...enhancedProps} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);

    const styles = renderToStyleElements(renderer);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {/* 👇 adding Fluent UI styles elements to output */}
          {styles}
        </>
      ),
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
