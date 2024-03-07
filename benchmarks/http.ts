import autocannon, { Result } from "autocannon";

const { llrturl, nodeurl } = process.env;
if (!llrturl || !nodeurl) {
  throw `llrt and nodeurl not found in env`;
}

const printResult = (err: any, res: Result) => {
  if (err) {
    throw err;
  }
  const { latency, requests, "4xx": erroredReq } = res;
  // console.log("97.5% Latency	97.5% Req/Sec	Total requests");
  // console.log(`${latency.p97_5}\t${requests.p97_5}\t${requests.total}`);
  console.log(latency.p97_5);

  if (erroredReq) {
    console.log("errored reqs", erroredReq);
  }
  // console.log("total_req", requests.total);
};

const connections = [1, 10, 50, 100];

connections.forEach((c) => {
  autocannon(
    {
      url: nodeurl,
      connections: c,
      duration: 10,
    },
    printResult,
  );
});

/* for (let i = 5; i <= 20; i += 5) {
  autocannon(
    {
      url: llrturl,
      connections: 10,
      duration: i,
    },
    printResult,
  );
} */
