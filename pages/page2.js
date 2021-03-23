import { callApi } from "../src/api";
import Router from "next/router";
//getInitialProps함수를 정의한다. 매개변수로 다양한 정보가 전달되나 여기서는 쿼리 파라미터 정보만 사용하자.
Page2.getInitialProps = async ({ req, query }) => {
  //쿼리 파라미터로 부터 text변수를 생성한다
  const text = query.text || "none";
  //데이터를 가져오기 위해서 API호출한다.
  //getInitialProps함수 내부의 API호출은 서버 또는 클라이언트에서 호출될 수 있다는 점을 기억해야한다
  //async await 문법을 사용하였기 때문에 API통신이 끝날 때까지 기다린다.
  const data = await callApi();
  //getInitialProps함수가 반환하는 값은 페이지 컴포넌트의 속성값으로 전달된다.

  //test -> http 요청과 응답객체를 user agent정보를 추출해서 데이터로 전달할 수 있디.
  //  http 요청과 응답객체는 getInitialProps함수가 서버에서호출되는 경우에만 전달된다.
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;

  //getInitialProps함수에서 동적임포트를 사용하여 sayHello.js모듈을 가져온다.
  //url로 해당경로로 접속하게 되면 서버측에서 getInitialProps가 실행되어
  // sayHello에 해당하는 모듈파일이 전송되지 않으나
  //클라이언트에서 page2로다시 접속 할 경우 클라이언트측에서 실행되는 것이므로 파일이 전송된다.
  const { sayHello } = await import("../src/sayHello");
  console.log(sayHello());

  return { text, data, userAgent };
};

//Page2 Component에서 getInitialProps함수가 반환한 값을 사용한다
export default function Page2({ text, data, userAgent }) {
  console.log(userAgent);
  // function onClick() {
  //   //동적 import를 통해 sayHello모듈을 가져온다.
  //   import("../src/sayHello").then(({ sayHello }) => console.log(sayHello()));
  // }
  return (
    <div>
      <p>This is HomaPage2</p>
      {/* router 객체를 이용해서 page1로 넘어간다. link와 기능적 차이는 없으나 동적인 코드에 조금 더 적합한 것은 Router객체이다. */}
      {/* <button onClick={() => Router.push("/page1")}>Go to Page 1</button> */}
      {/* <button onClick={onClick}>sayHello</button> */}
      <p>{`test: ${text}`}</p>
      <p>{`data is ${data}`}</p>
    </div>
  );
}
