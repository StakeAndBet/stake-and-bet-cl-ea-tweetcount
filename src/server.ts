import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";
import * as dotenv from "dotenv";

dotenv.config();

type EAInput = {
  id: number | string;
  data: {
    from: string;
    startTime: number;
    endTime: number;
  };
};

type EAOutput = {
  jobRunId: number | string;
  statusCode: number;
  data: {
    result?: any;
  };
  error?: string;
};

const PORT = process.env.PORT || 8080;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Extenal Adapters says yolooooo");
});

// Request send by Chainlink node
app.post("/", async (req: Request, res: Response) => {
  const eaInputData: EAInput = req.body;
  console.log("Resquest data received : " + eaInputData);
  console.log("From : " + eaInputData.data.from);
  console.log("Start time : " + eaInputData.data.startTime);
  console.log("End time : " + eaInputData.data.endTime);

  // Build the API request to look like this : "https://api.twitter.com/2/tweets/counts/recent?query=from:elonmusk&start_time=2022-11-29T00:00:00Z&end_time=2022-11-29T23:59:59Z"
  const headers = {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  };

  const start_time = new Date(eaInputData.data.startTime * 1000).toISOString();
  const end_time = new Date(eaInputData.data.endTime * 1000).toISOString();

  console.log("Converted starct time : " + start_time);
  console.log("Converted end time : " + end_time);

  const url = `https://api.twitter.com/2/tweets/counts/recent?query=from:${eaInputData.data.from}&start_time=${start_time}&end_time=${end_time}&granularity=day`;

  // Build the EA's response

  let eaResponse: EAOutput = {
    data: {},
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    const apiResponse: AxiosResponse = await axios.get(url, headers);

    console.log("Sending request top : " + url);

    eaResponse.data = { result: apiResponse.data };
    eaResponse.statusCode = apiResponse.status;

    console.log("Returned response :" + eaResponse);
    res.json(eaResponse);
  } catch (error: any) {
    console.log("API Response error : ", error);

    eaResponse.error = error.message;
    eaResponse.statusCode = error.response.status;

    res.json(eaResponse);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
