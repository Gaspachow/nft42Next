import fetch from 'isomorphic-fetch';

export const fetchAccessToken = (code) => {
	const data = {
		client_id: process.env.CLIENT_ID as string,
		client_secret: process.env.CLIENT_SECRET as string,
		grant_type:'authorization_code',
		code: code,
		redirect_uri:'https://nft42-next.vercel.app/',
		scope:'identify',
	}
	fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(data),
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
	})
	.then(res => res.json())
	.then(console.log);
}