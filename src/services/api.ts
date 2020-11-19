import { makeRequest } from './http';
import { NextApiRequest } from 'next';
import { ParsedUrlQuery } from 'querystring';

const getQueryParams = (queryParams: ParsedUrlQuery) => {
	let query = '';
  
	Object.entries(queryParams).forEach(([key, value]) => {
	  if (Array.isArray(value)) {
		value.forEach((el) => {
		  query += `&${key}=${el}`;
		});
	  } else if (value !== undefined) {
		query += `&${key}=${value}`;
	  }
	});
  
	return query;
  };

  export const getReqBaseUrl = (req?: NextApiRequest) => (req ? `http://${req.headers.host}` : '');

//   export const requestTest = (
// 	queryParams?,
// 	req?: NextApiRequest
//   ): Promise<any> => {
// 	const defaultQuery = {};
// 	const query = getQueryParams({ ...defaultQuery, ...queryParams });
// 	console.info('query for avastars:', query);
  
// 	return makeRequest(`${getReqBaseUrl(req)}/api/getAvastars/?${query}`);
//   };