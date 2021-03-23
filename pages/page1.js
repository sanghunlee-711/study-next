import Head from "next/head";
import Link from "next/link";
import Icon from "../static/icon.png";
import { add } from "../src/util";
import styled from "styled-components";

const MyP = styled.div`
  color: red;
  font-size: 18pt;
`;

function Page1() {
  return (
    <div>
      <MyP>{`10 + 20 = ${add(10, 20)}`}</MyP>
      <MyP>This is Home Page</MyP>

      {/* <Link href="/page2">
        <p>Go to Page 2</p>
      </Link> */}
      {/* <p>This is Home Page</p>
      <p>{`10+20 = ${add(10, 20)}`}</p> */}
      <img src={Icon} />
      <Head>
        <title>page1</title>
      </Head>
      <Head>
        <meta name="description" content="Hello World!" />
      </Head>
      <style jsx>{`
        p {
          color: blue;
          font-size: 18pt;
        }
      `}</style>
    </div>
  );
}

export default Page1;
