import Document from "next/document";
import { ServerStyleSheet } from "styled-components";

//_document.js파일은 서버사이드 렌더링시에만 실행이 되는데 작성하지 않으면 넥스트에 내장된 _document.js 파일을 사용한다.

//Next의 Document 컴포넌트를 상속받아서 컴포넌트를 만든다.
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    //넥스트에 내장된 Document 컴포넌트의 getInitialProps함수에서는 styled-jsx스타일 코드를 추출한다.
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          //MyDocument 컴포넌트의 getInitialProps 메서드에서는 styled-component의 스타일 코드를 추출한다.
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {/* styledComponent로 추출한 스타일 코드를 반환값에 추가한다. */}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
