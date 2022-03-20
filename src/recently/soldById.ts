import { Log } from "@ethersproject/abstract-provider";
import { User } from "discord.js";
import { utils } from "ethers";
import Ninneko from "../models/ninneko.model";
import Selling from "../models/selling.model";
import printNinneko from "../utils/printNinneko";
import provider from "../utils/provider";

export default async function soldbyId(selling: Selling, member: User) {
    const filterSold = {
        address: '0xdfe8f54b894793bfbd2591033e7a307ed28a8d40',
        topics: [
            '0x7bd0b0502f39fae4cc20b3da611aa9e529ffa26435779fe6f2068f197151d9d0',
        ],
    };

    const ninneko = await Ninneko.findOne({ where: { id: selling.ninnekoId }});

    provider.once(
        {
            ...filterSold,
            topics: [
                ...filterSold.topics,
                utils.hexZeroPad(utils.hexlify(selling.ninnekoId), 32),
            ],
        },
        async (log: Log) => {
            await member?.send(`Ninneko #${selling.ninnekoId} sold!`);
            if (ninneko) {
                await member?.send({
                    embeds: [
                        printNinneko(
                            ninneko,
                            utils.formatEther(
                                parseInt(log.data, 16).toString()
                            )
                        ),
                    ],
                });
            }
            Selling.destroy({ where: { id: selling.id } });
        }
    );
}