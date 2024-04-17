import assert from 'assert'
import fs from 'fs'

import { type DeployFunction } from 'hardhat-deploy/types'

const deploymentConfig = {
    sepoliaBase: {
        contractName: 'Cookie',
        args: [
            'TEST', // name
            'TT', // symbol,
            101_000_000, // initialSupply
        ],
    },
    sepolia: {
        contractName: 'OmnichainToken',
        args: [
            'TEST', // name
            'TT', // symbol
        ],
    },
}

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const networkConfig = network.name === 'sepolia' ? deploymentConfig.sepolia : deploymentConfig.sepoliaBase

    const contractName = networkConfig.contractName
    const staticArgs = networkConfig.args

    const fullArgs = [...staticArgs, endpointV2Deployment.address, deployer]

    const { address } = await deploy(contractName, {
        from: deployer,
        args: fullArgs,
        log: false,
        skipIfAlreadyDeployed: true,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)

    const deploymentData = {
        contractName,
        address,
    }

    const fileName = 'deployment.json'
    let data: any = {}

    if (fs.existsSync(fileName)) {
        data = JSON.parse(fs.readFileSync(fileName, 'utf8'))
    }

    data[network.name] = deploymentData
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2))
}

deploy.tags = ['Cookie3Token', 'OmnichainToken']

export default deploy
