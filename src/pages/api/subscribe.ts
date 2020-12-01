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
  console.log(process.env.CLIENT_ID)
  console.log(process.env.CLIENT_SECRET)
  console.log(process.env.MONGODB_URI)

  const data = {
		client_id: process.env.CLIENT_ID as string,
		client_secret: process.env.CLIENT_SECRET as string,
		grant_type:'authorization_code',
		code: code as string,
    redirect_uri:'https://nft42-next.vercel.app/',
    //redirect_uri:'http://localhost:3000',
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
  console.log(JSON.stringify(accessToken));
  var userReq = await fetch('http://discordapp.com/api/users/@me', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + accessToken.access_token
		}
	})
  var user = await userReq.json();
  console.log(JSON.stringify(user));

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
    const addressOwner = await users.find({addresses: {$in:[signedAddress.toLocaleLowerCase()]}});
    const arr = await addressOwner.toArray()
    if (arr.length > 1)
      verified = false;
    if (arr.length == 0 || (arr.length == 1 && arr[0]._id.toString() == id.toString())) {
      const previousUser = await users.findOne({_id : id})
      if (previousUser == null){
        console.log('creating user')
        var adds = [signedAddress.toLocaleLowerCase()];
        await users.insertOne({_id: id, addresses: adds});
      }
      else{
        if (!previousUser.addresses.some(a => a == signedAddress.toLocaleLowerCase())){
          console.log('updating user')
          var adds = previousUser.addresses
          adds.push(signedAddress.toLocaleLowerCase())
          await users.updateOne({_id: id}, {$set :{_id: id, addresses: adds}})
        }
        else
          verified = false;
      }
    }
    else
      verified = false;
  }
  return res.status(200).json({
    status: 'Some status',
    data: {
      verified : verified
    },
  });
};
