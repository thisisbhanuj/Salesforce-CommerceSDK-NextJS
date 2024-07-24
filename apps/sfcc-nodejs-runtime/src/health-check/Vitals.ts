import { getGuestUserAuthToken } from "../helpers/private/privateSLASHelpers";

export default async function healthCheck() {
  let data = {} as any;
  try {
    data = await getGuestUserAuthToken();
    if (!data.access_token) {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.log(`Error fetching token for the guest user: ${error}`);
  }

  return {
    access_token: JSON.stringify(data.access_token)
  };
};