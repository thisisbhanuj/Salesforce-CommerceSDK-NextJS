import healthCheck from '@repo/sfcc-nodejs-runtime/vitals';

const SCAPIHealthCheck = async () => {
  let data = {} as any;
  try {
    data = await healthCheck();
    if (!data.access_token) {
      return <div>Failed to fetch the token</div>;
    }
  } catch (error) {
    console.log(`Error fetching token for the guest user: ${error}`);
  }

  return (
    <div>
      <h1>Authorization token: {data.access_token}</h1>
    </div>
  );
};

export default SCAPIHealthCheck;
