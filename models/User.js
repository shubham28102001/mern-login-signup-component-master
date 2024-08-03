const dynamoose = require("dynamoose");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamodb = new DynamoDB({ region: "us-east-1" });
dynamoose.aws.sdk = dynamodb;

const userSchema = new dynamoose.Schema({
  id: { type: String, hashKey: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: {
    global: true,
    project: true,
    name: "emailIndex"
  } },
  password: { type: String, required: true },
  profile: { type: String, required: true, default: "https://picsum.photos/200"},
  key: {type: String, default: null}
});

module.exports = dynamoose.model("users", userSchema);
