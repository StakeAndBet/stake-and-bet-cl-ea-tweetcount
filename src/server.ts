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
    // start_time: number; // BigInt ?
    // end_time: number; // BigInt ?
    // granularity: string;
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

// THIS IS WHAT OUR CHAINLINK NODE IS GOING TO END UP SENDING
app.post("/", async (req: Request, res: Response) => {
  const eaInputData: EAInput = req.body;
  console.log("Resquest data received : " + eaInputData);

  // Build the API request to look like this : "https://api.twitter.com/2/tweets/counts/recent" + add field :  ?query=from:elonmusk
  const headers = {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  };

  const url = `https://api.twitter.com/2/tweets/counts/recent?query=from:${eaInputData.data.from}&granularity=day`;

  // Build the EA's response

  let eaResponse: EAOutput = {
    data: {},
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    const apiResponse: AxiosResponse = await axios.get(url, headers);

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
