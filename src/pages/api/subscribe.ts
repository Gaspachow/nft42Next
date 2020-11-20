import { recoverPersonalSignature } from 'eth-sig-util';
import { NextApiRequest, NextApiResponse } from 'next';
import { SIGNATURE_MESSAGE } from '../../constants';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { address, signature, code } = req.body;

  const signedAddress = recoverPersonalSignature({ data: SIGNATURE_MESSAGE, sig: signature });

  let verified = false;

  console.info('addresses');
  console.log(signedAddress.toLowerCase());
  console.log(address.toLowerCase());
  if (signedAddress.toLowerCase() === (address as string).toLowerCase()) {
    verified = true;
  }

  return res.status(200).json({
    status: 'Some status',
    data: {
      verified,
    },
  });
};
