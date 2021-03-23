ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default function ErrorPage({ statusCode }) {
  return (
    <div>
      {statusCode === 404 && <p>페이지를 찾을 수 없습니다.</p>}
      {statusCode === 500 && <p>알수없는 에러가 발생 했습니다.</p>}
      {!statusCode && <p>클라이언트에서 에러가 발생 했습니다</p>}
    </div>
  );
}
