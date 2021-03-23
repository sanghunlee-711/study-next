module.exports = {
  //웹팩 설정을 변경하기 위한 함수로 첫번ㅂ째 매개변수로 넥스트의 웹팩설정이 넘어온다.

  webpack: (config) => {
    //넥스트의 웹팩설정에 fileloader를 추가한다.
    config.module.rules.push({
      test: /.(png|jpg|jpeg)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            //쿼리 파라미터 부분에 hash를 추가해서 파일 내용이 변경될 때마다 파일의 경로도 수정되도록 한다.
            name: "[path][name].[ext]?[hash]",
            //static폴더의 정적파일을 그대로 서비스하기 때문에 복사할 필요가 없다. 복사설정(emitFile)
            emitFile: false,
            publicPath: "/",
          },
        },
      ],
    });
    return config;
  },
  //npx export 시 exportPathMap명령어의 옵션이 이행된다.
  exportPathMap: function () {
    return {
      "/page1": { page: "/page1" },
      //쿼리 파라미터 정보를 이용해서 미리 렌더링 할 수 있다.
      "/page2-hello": { page: "/page2", query: { text: "hello" } },
      "/page2-world": { page: "/page2", query: { text: "world" } },
    };
  },
};
