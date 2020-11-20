import { recoverPersonalSignature } from 'eth-sig-util';
import { NextApiRequest, NextApiResponse } from 'next';
import { SIGNATURE_MESSAGE } from '../../constants';
import { connectDb } from '../../server/mongo';
import {User} from '../../server/model'
import { WithDb } from '../../types';
import { Collection } from 'mongodb';


export default async (req: NextApiRequest & WithDb, res: NextApiResponse) => {
  const { address, signature, code } = req.body;

  const signedAddress = recoverPersonalSignature({ data: SIGNATURE_MESSAGE as string, sig: signature as string });

  let verified = false;

  console.info('addresses');
  console.log(signedAddress.toLowerCase());
  console.log(address.toLowerCase());
  if (signedAddress.toLowerCase() === (address as string).toLowerCase()) {
    verified = true;
  }

  // DO USER ID FETCHING FROM DISCORD

  const data = {
		client_id: process.env.CLIENT_ID as string,
		client_secret: process.env.CLIENT_SECRET as string,
		grant_type:'authorization_code',
		code: code as string,
		redirect_uri:'https://nft42-next.vercel.app/',
		scope:'identify',
  }
  
  var accessTokenReq = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(data),
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
	})
	var accessToken = await accessTokenReq.json();
  var userReq = await fetch('http://discordapp.com/api/users/@me', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + accessToken.access_token
		}
	})
  var user = await userReq.json();
  var id = user.id

  // DO SOME STUFF ON MONGODB
  if (verified)
    connectDb(async (req: NextApiRequest & WithDb, res: NextApiResponse) => {
      const newUser = {_id : id, address : signedAddress}
    
      const users: Collection<User> = req.db.collection('Users');
      await users.insertOne(newUser);
    
      res.status(200)
      res.end('ok')
    });

  return res.status(200).json({
    status: 'Some status',
    data: {
      verified,
    },
  });
};
