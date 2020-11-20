import { recoverPersonalSignature } from 'eth-sig-util';
import { NextApiRequest, NextApiResponse } from 'next';
import { SIGNATURE_MESSAGE } from '../../constants';
import { makeRequest } from '../../services/http';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, signature, code } = req.body;

  const signedAddress = recoverPersonalSignature({ data: SIGNATURE_MESSAGE, sig: signature });

  let verified = false;

  if (signedAddress.toLowerCase() === (address as string).toLowerCase()) {
    verified = true;
  }

  // DO USER ID FETCHING FROM DISCORD
  const data = {
    client_id: process.env.CLIENT_ID as string,
    client_secret: process.env.CLIENT_SECRET as string,
    grant_type: 'authorization_code',
    code: code as string,
    redirect_uri:
      process.env.NODE_ENV === 'production'
        ? 'https://nft42-next.vercel.app/'
        : 'http://localhost:3000',
    scope: 'identify',
  };

  const accessToken = await makeRequest('https://discord.com/api/oauth2/token', {
    body: new URLSearchParams(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const user = await makeRequest('http://discordapp.com/api/users/@me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken.access_token,
    },
  });

  console.log(user);
  // DO SOME STUFF ON MONGODB

  return res.status(200).json({
    status: 'Some status',
    data: {
      verified,
    },
  });
};
