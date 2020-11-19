import fetch from 'isomorphic-fetch';
import { NextApiRequest, NextApiResponse } from 'next'
import { useRouter } from 'next/router'
import {useEffect} from 'react'

export const testEnv = () => {
	return process.env.HELLO
}

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
// 	const { code } = (req.query as unknown);
// 	const data = await avastars.findOne({ _id: parseInt(id, 10) });
  
// 	res.status(200).json({ data } as GetAvastarResponse);
//   };

export default function fetchAccessToken(req, res){
	const { query: { code } } = req;
	const data = {
		client_id: process.env.CLIENT_ID as string,
		client_secret: process.env.CLIENT_SECRET as string,
		grant_type:'authorization_code',
		code: code as string,
		redirect_uri:'https://nft42-next.vercel.app/',
		scope:'identify',
	}
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	//res.end(code)
	fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(data),
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
	})
	.then((resp) => {
		res.end(JSON.stringify(resp))
	  })
	.catch((err) => res.end(JSON.stringify(err)));
}