import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import SESTransport from 'nodemailer/lib/ses-transport';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/*
    This function fetches the secret from AWS Secrets Manager.
    If the secret is not found, it will return the secret from the environment variable.
*/
export async function fetchSESSecret() {
  const secret_name = 'SES-Vercel';
  let response = null;

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );

    if (response?.SecretString) {
      console.log('SecretString:', response.SecretString);
    }
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.error(error);
  }

  return response?.SecretString || process.env.AWS_SES_SECRET;
}

/*
    This function creates a transporter for the SES service.
*/
export async function createTransporter() {
  try {
    const transport: SESTransport.Options = {
      SES: new AWS.SES({ apiVersion: 'latest' }),
      maxConnections: 1,
      sendingRate: 1,
    };

    return nodemailer.createTransport(transport);
  } catch (error) {
    console.error(error);
    throw new Error('Error creating SES instance');
  }
}

/*
    This function sends an email using the SES service.
    It takes in the source, destination, subject, and message of the email.
*/
export async function sendEmail(params: {
  source: string;
  destination: string[];
  message: {
    subject: string;
    body: { html: string; text?: string };
  };
}) {
  const transporter = await createTransporter();

  try {
    const response = await transporter.sendMail({
      from: params.source,
      to: params.destination,
      subject: params.message.subject,
      html: params.message.body.html,
    });

    console.debug('Email sent successfully : ', response);

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error sending email');
  }
}
