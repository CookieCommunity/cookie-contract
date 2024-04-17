import fs from 'fs'

import { Contract } from 'ethers'
import { ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'

async function main() {
    const [deployer] = await ethers.getSigners()
    const network = (await ethers.provider.getNetwork()).name

    const eidBaseSepolia = 40245
    const eidSepolia = 40161

    const bridgingAmount = '1' // tokens to bridge

    const fileName = 'deployment.json'
    if (!fs.existsSync(fileName)) {
        console.error('Deployment file not found.')
        process.exit(1)
    }
    const deployments = JSON.parse(fs.readFileSync(fileName, 'utf8'))

    const contractAddress = network === 'sepolia' ? deployments.sepolia.address : deployments.sepoliaBase.address

    const targetEID = network === 'sepolia' ? eidBaseSepolia : eidSepolia

    const contractName = network === 'sepolia' ? 'OmnichainToken' : 'Cookie'

    const myOFT: Contract = await ethers.getContractAt(contractName, contractAddress, deployer)

    const tokensToSend = ethers.utils.parseEther(bridgingAmount)
    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()

    const sendParam = [
        targetEID,
        ethers.utils.zeroPad(deployer.address, 32),
        tokensToSend,
        tokensToSend,
        options,
        '0x',
        '0x',
    ]

    const [nativeFee] = await myOFT.quoteSend(sendParam, false)

    const tx = await myOFT.send(sendParam, [nativeFee, 0], deployer.address, { value: nativeFee, gasLimit: 2000000 })
    await tx.wait()
    console.log(`Bridging transaction executed: https://layerzeroscan.com/tx/${tx.hash}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
