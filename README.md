
# Stake & Bet - Chainlink External Adapter Tweetcount

This repository contains the source code of the external adapter used by the Stake & Bet protocol to retrieve the number of tweets posted by a given person, in a given time frame.
  

## API Reference

#### Requested parameters

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `from` | `string` | **Required**. Twitter ID |
| `startTime` | `number` | **Required** UNIX start Timestamp |
| `endTime` | `number` | **Required** UNIX end Timestamp |

Request are forwarded to the twitter API [`GET /2/tweets/counts/recent`](https://developer.twitter.com/en/docs/twitter-api/tweets/counts/api-reference/get-tweets-counts-recent)


## Environment Variables

Twitter API use Bearer Authentication. So to run this project, you will need to add the following environment variables to your .env file

`BEARER_TOKEN`

You can get your own Bearer token on [Twitter developer portal](https://developer.twitter.com/en/portal)


## TOML Job

In the TOML job you will need to modify the following parameters :

`name`: Job name as displayed in the Chainlink Node

`contractAddress`: To update to your own Operator / Oracle contract. Change it aswell it the `submit_tx` tasks.

## Deployment

To deploy this project run

```bash
  yarn install
```

then

```bash
  yarn start
```

## API test 

Run the following curl request : 

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 10, "data": { "from": <from> , "startTime": <startTime> , "endTime": <endTime> } }
```


## Notes

Project develop following this repo [cl-fall22-external-adapters](https://github.com/zeuslawyer/cl-fall22-external-adapters)


