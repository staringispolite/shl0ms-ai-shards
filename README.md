# Zlobe On-Chain Globe Based Data Contract

This contract allows for claiming a specific pin on a part of the globe as a pin.

Only one pin can be created for each user. Claiming is done by inputting lat / lng coordinates without the decimal into the contract.

There exists another contract that seperates the fields between decimal and coordinate to clean up the code.

### Deploying:
(Replace network with desired network)
`hardhat deploy --network rinkeby --tags Globe`

### Verifying:
`hardhat sourcify --network rinkeby && hardhat etherscan-verify --network rinkeby`

### Minting:
Use etherscan or (Todo) create a front-end.
