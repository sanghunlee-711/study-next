import Link from "next/link";

//pages/_app.js는 모든 페이지에서 공통으로 필요한 기능을 구현하는 곳이다
//페이지가 전환되어도 메뉴 UI를 그대로 유지하고 싶다면 _app.js에서 구성하는 것이 좋다.
export default function MyApp({ Component, pageProps }) {
  //Component속성값은 현재 렌더링하려는 페이지의 컴포넌트이고 pageProps 속성값은 해당페이지의 getInitialProps함수가 반환한 값이다
  return (
    <div>
      <Link href="/page1">
        <a>page1</a>
      </Link>
      <Link href="/page2">
        <a>page2</a>
      </Link>
      {/* 아래는 페이지 컴포넌트를 렌더링한다. */}
      <Component {...pageProps} />
    </div>
  );
}
