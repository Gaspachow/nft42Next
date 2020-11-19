import fetch from 'isomorphic-fetch';
import { NextApiRequest, NextApiResponse } from 'next'
import { useRouter } from 'next/router'
import {useEffect} from 'react'

// export const testEnv = async (code : string) => {
// 	var idReq = await fetch('http://localhost:3000/api/discord-auth?code=' + code, {
// 			method: 'GET'
// 		}
// 	)
// 	var id = await idReq.json()
// 	return id;
// }

export const testEnv = async (code : string) => {
	var idReq = await fetch('https://nft42-next.vercel.app/api/discord-auth?code=' + code, {
			method: 'GET'
		}
	)
	var id = await idReq.json()
	return id;
}

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
// 	const { code } = (req.query as unknown);
// 	const data = await avastars.findOne({ _id: parseInt(id, 10) });
  
// 	res.status(200).json({ data } as GetAvastarResponse);
//   };

export default async function fetchAccessToken(req, res){
	const { query: { code } } = req;
	const data = {
		client_id: process.env.CLIENT_ID as string,
		client_secret: process.env.CLIENT_SECRET as string,
		grant_type:'authorization_code',
		code: code as string,
		redirect_uri:'https://nft42-next.vercel.app/',

		// redirect_uri:'https://nft42-next.vercel.app/api/discord-auth',
		scope:'identify',
	}
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	var accessTokenReq = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(data),
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
	})
	var accessToken = await accessTokenReq.json();
	res.end(JSON.stringify(accessToken))
	//console.log(accessToken)
	var userReq = await fetch('http://discordapp.com/api/users/@me', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + accessToken.access_token
		}
	})
	var user = await userReq.json();
	//console.log(user)
	res.end(JSON.stringify({userID : user.id}))
}