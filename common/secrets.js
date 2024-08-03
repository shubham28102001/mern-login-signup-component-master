const AWS = require("aws-sdk");

const secretsManager = new AWS.SecretsManager({region: "us-east-1"});

exports.getSecrets = async () => {
  try {
    const secretName = "MySecret";

    const data = await secretsManager
      .getSecretValue({ SecretId: secretName })
      .promise();
    const secretValue = JSON.parse(data.SecretString);

    return secretValue;
  } catch (err) {
    console.error(err);
  }
};
