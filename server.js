// const express = require("express");
// const next = require("next");
// const url = require("url");
// //SSR결과를 캐싱하기 위해서 lru-cache패키지를 이용한다.
// const lruCache = require("lru-cache");

// //최대 100개 항목을 저장하고 각 항목은 60초 동안 저장한다.
// const ssrCache = new lruCache({
//   max: 100,
//   maxAge: 1000 * 60,
// });

// const port = 3000;
// //NODE_ENV 환경 변수에 따라 개발모드와 프로덕션 모드로 구분한다.
// const dev = process.env.NODE_ENV !== "production";

// //next를 실행하기 위해서 필요한 객체와 함수를 생성한다.
// const app = next({ dev });
// const handle = app.getRequestHandler();

// //next의 준비과정이 끝나면 입력된 함수를실행한다.
// app.prepare().then(() => {
//   const server = express();

//   //express웹 서버에서 처리할 url패턴을 등록한다.
//   //여기서는 /page/1 요청이 들어오면 /page1으로 리다이렉트 한다.
//   server.get("/page/:id", (req, res) => {
//     res.redirect(`/page${req.params.id}`);
//   });

//   // /page1, /page2요청에 대한 SSR결과를 캐싱한다.
//   server.get(/^\/page[1-9]/, (req, res) => {
//     return renderAndCache(req, res);
//   });

//   //이 외의 모든 요청은 handle함수가 처리하게 한다.
//   //만약 위의 "/page/:id"와 같은 패턴이 없다면 넥스트에 내장된 웹서버와 같은일을 하게 된다.
//   server.get("*", (req, res) => {
//     return handle(req, res);
//   });

//   //renderAndCache함수에서 캐싱기능을 구현하고 이 함수는 async await문법을 이용한다.
//   async function renderAndCache(req, res) {
//     const parsedUrl = url.parse(req.url, true);
//     //쿼리 파라미터가 포함된 경로를 키로 사용한다.
//     const cacheKey = parsedUrl.path;
//     //캐시가 존재하면 캐시에 저장된 값을 사용한다.
//     if (ssrCache.has(cacheKey)) {
//       console.log("Use Cache");
//       res.send(ssrCache.get(cacheKey));
//       return;
//     }

//     try {
//       const { query, pathname } = parsedUrl;
//       //캐시가 없으면 renderToHTML메서드를 호출하여 await 키워드를 사용해 처리가 끝날때 까지 기다린다.
//       const html = await app.renderToHTML(req, res, pathname, query);
//       if (res.statusCode === 200) {
//         //메서드 정식 처리 시 결과 캐싱
//         ssrCache.set(cacheKey, html);
//       }
//       res.send(html);
//     } catch (err) {
//       app.renderError(err, req, res, pathname, query);
//     }
//   }

//   //사용자 요청을 처리하기 위해 대기한다.
//   server.listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// });

//Under is Refactored;

const express = require("express");
const next = require("next");
const url = require("url");
//SSR결과를 캐싱하기 위해서 lru-cache패키지를 이용한다.
const lruCache = require("lru-cache");
const fs = require("fs");

//최대 100개 항목을 저장하고 각 항목은 60초 동안 저장한다.
const ssrCache = new lruCache({
  max: 100,
  maxAge: 1000 * 60,
});

const port = 3000;
//NODE_ENV 환경 변수에 따라 개발모드와 프로덕션 모드로 구분한다.
const dev = process.env.NODE_ENV !== "production";

//next를 실행하기 위해서 필요한 객체와 함수를 생성한다.
const app = next({ dev });
const handle = app.getRequestHandler();

//next의 준비과정이 끝나면 입력된 함수를실행한다.
app.prepare().then(() => {
  const server = express();

  //express웹 서버에서 처리할 url패턴을 등록한다.
  //여기서는 /page/1 요청이 들어오면 /page1으로 리다이렉트 한다.
  server.get("/page/:id", (req, res) => {
    res.redirect(`/page${req.params.id}`);
  });

  // /page1, /page2요청에 대한 SSR결과를 캐싱한다.
  server.get(/^\/page[1-9]/, (req, res) => {
    return renderAndCache(req, res);
  });

  //이 외의 모든 요청은 handle함수가 처리하게 한다.
  //만약 위의 "/page/:id"와 같은 패턴이 없다면 넥스트에 내장된 웹서버와 같은일을 하게 된다.
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  //next.config.js파일에서 설정한 exportPathMap옵션의 내용과 같은내용을 기입했다. 보통은 next.config.js파일을 파싱하는게 좋지만 이해를 위해 아래와 같이 작성
  const prerenderList = [
    { name: "page1", path: "/page1" },
    { name: "page2-hello", path: "/page2?text=hello" },
    { name: "page2-world", path: "/page2?text=world" },
  ];

  const prerenderCache = {};
  //out folder에 있는 미리 렌더링된 HTML파일을 읽어서 prerenderedCache에 저장한다.
  // next export 명령어는 production모드에서만 사용하므로 out폴더의 내용을 읽는 작업은 프로덕션 모드에서만 한다.
  if (!dev) {
    for (const info of prerenderList) {
      const { name, path } = info;
      const html = fs.readFileSync(`./out/${name}.html`, "utf-8");
      prerenderCache[path] = html;
    }
  }

  //renderAndCache함수에서 캐싱기능을 구현하고 이 함수는 async await문법을 이용한다.
  async function renderAndCache(req, res) {
    const parsedUrl = url.parse(req.url, true);
    //쿼리 파라미터가 포함된 경로를 키로 사용한다.
    const cacheKey = parsedUrl.path;
    //캐시가 존재하면 캐시에 저장된 값을 사용한다.
    if (ssrCache.has(cacheKey)) {
      console.log("Use Cache");
      res.send(ssrCache.get(cacheKey));
      return;
    }
    //미리 렌더링한 페이지라면 캐싱된 HTML을 사용한다.
    if (prerenderCache.hasOwnProperty(cacheKey)) {
      console.log("미리 렌더한 html 사용");
      res.send(prerenderCache[cacheKey]);
      return;
    }

    try {
      const { query, pathname } = parsedUrl;
      //캐시가 없으면 renderToHTML메서드를 호출하여 await 키워드를 사용해 처리가 끝날때 까지 기다린다.
      const html = await app.renderToHTML(req, res, pathname, query);
      if (res.statusCode === 200) {
        //메서드 정식 처리 시 결과 캐싱
        ssrCache.set(cacheKey, html);
      }
      res.send(html);
    } catch (err) {
      app.renderError(err, req, res, pathname, query);
    }
  }

  //사용자 요청을 처리하기 위해 대기한다.
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
