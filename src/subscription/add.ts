import User from '../models/user.model';
import ERC20 from '../utils/ERC20';
import provider from '../utils/provider';
import _ from 'lodash';
import { utils } from 'ethers';

export default async function add(user: User, txID: string): Promise<boolean> {
    const tx = await provider.getTransaction(txID);
    const receipt = await tx.wait(2);
    const busd = ERC20('0xe9e7cea3dedca5984780bafc599bd69add087d56');
    // const busd = ERC20('0x09c5e27780138e4693e8a66f40c8508eb2719082');

    const { address: busdAddress, topics } = busd.filters.Transfer(
        user.publicAddress,
        process.env.SUBSCRIPTION_ADDRESS
    );

    if (txID === user.txID || receipt.confirmations > 201600) {
        throw Error('This transaction was already used, try another');
    }

    for (const log of receipt.logs) {
        if (_.isEqual(log.topics, topics)) {
            const value = utils.formatEther(parseInt(log.data, 16).toString());
            console.log(value)
            if (value === '20.0') {
                user.subscriptionDue ||= new Date();
                user.subscriptionDue.setDate(user.subscriptionDue.getDate() + 7);

                user.txID = txID;
                user.save();
                
                return true;
            }
            else {
                throw new Error('The value of BUSD is not right, please send the right amount and token (20 BUSD) or open a ticket');
            }
            
        }
    }

    return false;
}
