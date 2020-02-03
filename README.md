# HealthCareApp

Approach to solve the problem:

Problem Statement - This is a small demonstration of Health care Application where a patient has their health record fragmented across multiple locations e.g. labs, hospital etc. In a decentralized world, how can you make sure that these records can be stored on public blockchain and can help patients to access them anywhere they want. & obviously, as medical records are a very personal entity, we want you to write the smart contract that is going to secure a single piece of data so that only patient can access it.

Solution - I created HealthRecord struct and PatientDetails struct in smart contract HealthCare.sol 
In patient details struct, we can store the wallet address along with other details and the pointers to healthRecordAddress. And when the patient will fragment the health records from labs, pathology or hospital, 
those records can be stored as the health record in the HealthRecord struct and the address/pointer to this health record will be stored in an array attribute of patient struct as well so that only patient can access those records.

Below given are mappings i coded in smart contract :

a. // walletAddress mapped to PatientDetails struct
    mapping (address=>PatientDetails) public patientDetails;
		
b. // healthRecordUniqueAddr mapped to HealthRecord struct
    mapping (bytes32=>HealthRecord) public healthRecord;

While retriving the health records i have kept the condition where the health records cann't be accessible by other users.It can be only accessed by the required patient. In nodejs there is a rest API service '/getPatientAllHealthRecord' where I am passing the valid adrress of the patient which will return me the addresses of different health records from different labs/hospitals associated with that particular patient address. If anyone other than patient tries to invoke the service will get null address array as a response. 

In happy path scenario when a patient will get health record address array as a respone, we will iterate on the array and pass the various health record addresses one by one in a loop in order to retrieve the respective health record details associated with that health record address. 

Below given are Rest API calls written in server.js (written in node js to trigger the invocation of smart contract functions using Web3 js API)

1. '/registerPatient' - used to register the new patient and return his digital address.
2. '/getPatientDetails' - digital address created in above API call is send as input and return the patient details.
3. '/storeHealthrecords' - patient digital address and health records are sent as input where patient health records are stored against the patient digital address.
4. '/getPatientAllHealthRecord' - Patient logged in with his digital address uses this to get all of his health records distributed at different labs/hospitals.If anyone other than that patient tries to invoke this service will get null address array as a response. 

Below given are Smart Contract functions which are invoked through server.js

1. GetPatientHealthRecordsAddr
2. GetPatientHealthRecords
3. StoreHealthRecords
4. RegisterPatient
5. GetPatientDetails
6. generateUniqueRecordAddr

Setup and Implementation:

// Online browser to compile ethereum smart contract
1. https://ethereum.github.io/browser-solidity/#version=soljson-v0.4.13+commit.fb4cb1a.js

// To set up ethereum blockchain

1. http://hypernephelist.com/2016/06/01/deploying-my-first-smart-contract.html
2. https://lightrains.com/blogs/compile-deploy-solidity-contract-ethereum-console-geth-part-1
3. https://guide.blockchain.z.com/en/docs/init/setup/prepare-deploy-node/
4. https://www.youtube.com/watch?v=yj4yW_rnNx4
5. https://www.youtube.com/watch?v=289EzMOHYnQ
6. https://www.youtube.com/watch?v=aV8C77xAaQA
7. https://www.youtube.com/watch?v=Li0Loy8VRp4

// Geth tutorial
https://github.com/turboprep/geth-tutorial

============================================================ Ethereum Step by Step cmds to Setup on windows and deploy contract  ========================================================
1. Install the .exe in windows.
2. Create a genesis.json file and that should be in current working directory named anything like genesis.json, which is the staring point of 
blockchain where chain gets created. below is the content copy in the genesis file you created. 

{
"config": {
        "chainId": 15,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
  "nonce": "0x0000000000000042",
  "difficulty": "0x4000",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "timestamp": "0x00",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "extraData": "0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa",
  "gasLimit": "0xfffffffff",
  "alloc": {
    "0x9c154bc548b388aaebb474900df917c860304bf7": {
      "balance": "500000000000000000000000000"
    },
    "17961d633bcf20a7b029a7d94b7df4da2ec5427f": {
      "balance": "229427000000000000000"
    }
  }
}

2. Execute this cmd use the same name at the last as ur genesis file name:

geth --datadir data --maxpeers 0 --nodiscover --networkid 2017 --rpc --rpcapi "eth,net,web3,personal" --rpccorsdomain="*" init genesis.json

3. Then execute the cmd below :

geth --datadir data --maxpeers 0 --nodiscover --networkid 2017 --rpc --rpcapi "eth,net,web3,personal" --rpccorsdomain="*" console

4. Check the account if any account is created. initially it will be empty :

>eth.accounts

if [] comes that means there are no accounts.

5. So now create an account using cmd where 123 is the password, u can keep any password just remember it: 

>personal.newAccount("123")

6. Now run the cmd so that the mined ether will come and associated with accounts[0] which u created:
>miner.setEtherbase(eth.accounts[0])

7. Now start mining to get the ether balance so we can use this for gas limit, this will take time may be 2 hrs as well. or 5 min. When u see the block number 2 or 3 coming then ctrl + C to stop and write exit.

>miner.start(2)

8. After mining check your ether balance you mined, it should not be 0. 

eth.getBalance(eth.accounts[0])

9. Whereever it ask to unlock account then run this below cmd to unlock it. where 123 is password and last argument 9898989 is the time in sec the account will 
be unlocked.

personal.unlockAccount(eth.accounts[0], "123", 9898989)

10. Run this below cmd which will mine only if any block mined is in between. this runs quick fast.

loadScript("mine.js")

11. compile your code in online browser and copy the web3 deploy section in HealthCare.js file

12. Then run this cmd to deploy the contract.

loadScript("HealthCare.js")

we will get the console output like : 
"Contract mined! address: 0xa1743562a76e5aef29aa983c2318ffa683ceb172 transactionHash: 0xd303366d923235b64172f410b3a5cd3f3158b184c98499a130ed991009759dc3"

13. Then write the node js for listen to any http request and store the data in ledger by invoking smart contract functions, run the below command to up and running server.js

node server.js
