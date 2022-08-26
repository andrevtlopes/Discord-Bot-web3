import User from '../models/user.model';
import ERC20 from '../utils/ERC20';
import provider from '../utils/provider';
import _ from 'lodash';
import { utils } from 'ethers';
import BotError from '../BotError';

export default async function add(user: User, txID: string): Promise<boolean> {
    const tx = await provider.getTransaction(txID);
    const receipt = await tx.wait(2);
    const busd = ERC20('0xe9e7cea3dedca5984780bafc599bd69add087d56');
    // const busd = ERC20('0x1DEC50e5531452B1168962f40EAd44Da45C380DC'); //testnet

    const { address: busdAddress, topics } = busd.filters.Transfer(
        user.publicAddress,
        process.env.SUBSCRIPTION_ADDRESS
    );

    console.info('[DEBUG] ', receipt);

    if (receipt.from.toLowerCase() !== user.publicAddress.toLowerCase()) {
        throw new BotError("From Wallet doesn't match");
    }

    if (txID === user.txID) {
        throw new BotError('This transaction was already used, try another');
    }

    if (receipt.confirmations > 201600) {
        throw new BotError('This transaction is not usable anymore');
    }

    for (const log of receipt.logs) {
        console.info('[DEBUG] ', log.topics, topics);
        if (_.isEqual(topics, log.topics)) {
            const value = utils.formatEther(parseInt(log.data, 16).toString());
            console.info(value)
            if (value === '20.0') {
                user.subscriptionDue ||= new Date();
                user.subscriptionDue.setDate(user.subscriptionDue.getDate() + 7);

                user.txID = txID;
                user.save();
                
                return true;
            }
            else {
                throw new BotError('O valor de BUSD não está correto, por favor mande a quantidade certa de tokens (20 BUSD) ou abra um ticket');
            }
        }
    }
    throw new BotError('Transaction ID is not right');
}
