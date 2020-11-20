import { recoverPersonalSignature } from 'eth-sig-util';
import { NextApiRequest, NextApiResponse } from 'next';
import { SIGNATURE_MESSAGE } from '../../constants';
import { connectDb } from '../../server/mongo';
import {User} from '../../server/model'
import { WithDb } from '../../types';
import { Collection, MongoClient, Long } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });

export default async (req: NextApiRequest & WithDb, res: NextApiResponse) => {
  const { address, signature, code } = req.body;

  const signedAddress = recoverPersonalSignature({ data: SIGNATURE_MESSAGE + address, sig: signature.result });

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


  // DO SOME STUFF ON MONGODB
  if (verified) {
    if (!client.isConnected()) {
      console.log('Connect to DB');
      await client.connect();
    } else {
      console.log('Already connected');
    }
    const id = Long.fromString(user.id.toString())
    const db = client.db('RoleHandlerDatabase')
    const users: Collection<User> = db.collection('Users');
    const previousUser = await users.findOne({_id : id})
    if (previousUser == null){
      console.log('creating user')
      await users.insertOne({_id: id, address: signedAddress});
    }
    else{
      console.log('updating user')
      await users.updateOne({_id: id}, {$set :{_id: id, address: signedAddress}})
    }
  }

  // connectDb(async (req: NextApiRequest & WithDb, res: NextApiResponse) => {
  //   console.log('nani')
  //   const newUser = {_id : 123, address : "hello"}
  //   console.log('boo2')
  //   const users: Collection<User> = req.db.collection('Users');
  //   await users.insertOne(newUser);
  
  //   res.status(200)
  //   res.end('ok')
  // });

  return res.status(200).json({
    status: 'Some status',
    data: {
      verified : true
    },
  });
};
