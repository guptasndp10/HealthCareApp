pragma solidity ^0.4.0;

contract HealthCareApp{
    uint nonce = 0;
    
    struct PatientDetails{
        address e_walletadd; // Wallet addres
        string name;
        uint age;
        string phone;
        string homeAddress;
        uint SSN;           // Social Security No
        string bloodgroup;
        bytes32 []healthRecordUniqueAddr;
    }
    struct HealthRecord{
        bytes32 healthRecordUniqueAddr;
        address diagonisticCenterID;
        string diagonisticCenterAddress;
        string contactHealthCareProvider;
        string currMedProblem;
        string pastMedHistory;
        string bloodSugarLevel;
        string heartRate;
        bytes32 []healthReport;
    }
    
    // walletAddress mapped to PatientDetails struct
    mapping (address=>PatientDetails) public patientDetails;
    // healthRecordUniqueAddr mapped to HealthRecord struct
    mapping (bytes32=>HealthRecord) public healthRecord;
    
    function GetPatientHealthRecordsAddr(address addr) constant returns (bytes32[]) {
        bytes32 []uniqueRecordAddr;
        if(msg.sender == addr){
            uniqueRecordAddr = patientDetails[addr].healthRecordUniqueAddr;
        }
        return uniqueRecordAddr;
    }
    
    function GetPatientHealthRecords(bytes32 uniqueRecordAddr) constant returns (address _diagonisticCenterID,string _diagonisticCenterAddress,string _contactHealthCareProvider,string _currMedProblem,string _pastMedHistory,string _bloodSugarLevel,string _heartRate,bytes32 []_healthReport) {
            //HealthRecord record = healthRecord[uniqueRecordAddr];
            _diagonisticCenterID = healthRecord[uniqueRecordAddr].diagonisticCenterID;
            _diagonisticCenterAddress = healthRecord[uniqueRecordAddr].diagonisticCenterAddress;
            _contactHealthCareProvider = healthRecord[uniqueRecordAddr].contactHealthCareProvider;
            _currMedProblem = healthRecord[uniqueRecordAddr].currMedProblem;
            _pastMedHistory = healthRecord[uniqueRecordAddr].pastMedHistory;
            _bloodSugarLevel = healthRecord[uniqueRecordAddr].bloodSugarLevel;
            _heartRate = healthRecord[uniqueRecordAddr].heartRate;
            _healthReport = healthRecord[uniqueRecordAddr].healthReport;
    }
    
    //0xF3b9D2c81f2b24b0fa0ACaAa865b7D9CED5FC2fb
    function StoreHealthRecords(address addr,string diagonisticCenterAddress,string contactHealthCareProvider,string currMedProblem,string pastMedHistory,string bloodSugarLevel,string heartRate,bytes32 []healthReport) returns (bool _success){
       bytes32 uniqueRecordAddr = generateUniqueRecordAddr();
       
       healthRecord[uniqueRecordAddr].diagonisticCenterID=msg.sender;
       healthRecord[uniqueRecordAddr].diagonisticCenterAddress=diagonisticCenterAddress;
       healthRecord[uniqueRecordAddr].contactHealthCareProvider=contactHealthCareProvider;
       healthRecord[uniqueRecordAddr].currMedProblem=currMedProblem;
       healthRecord[uniqueRecordAddr].pastMedHistory=pastMedHistory;
       healthRecord[uniqueRecordAddr].bloodSugarLevel=bloodSugarLevel;
       healthRecord[uniqueRecordAddr].heartRate=heartRate;
       healthRecord[uniqueRecordAddr].healthReport=healthReport;
       
       patientDetails[addr].healthRecordUniqueAddr.push(uniqueRecordAddr);
       return true;
    }
    
    function RegisterPatient(address addr, string name, uint age, string phone, string homeAddress, uint SSN, string bloodgroup) payable returns (address) {
        address us=addr;
        patientDetails[us].e_walletadd=us;
        patientDetails[us].name=name;
        patientDetails[us].age=age;
        patientDetails[us].phone=phone;
        patientDetails[us].homeAddress=homeAddress;
        patientDetails[us].SSN=SSN;
        patientDetails[us].bloodgroup=bloodgroup;
        return us;
    }
    
    function GetPatientDetails(address addr) constant returns (address _ewadd, string _name, uint _age, string _phone, string _homeAddress, uint _ssn, string _bloodgroup, bytes32 []_uniqueRecordAddr) {
            PatientDetails patient = patientDetails[addr];
            _ewadd = patient.e_walletadd;
            _name = patient.name;
            _age = patient.age;
            _phone = patient.phone;
            _homeAddress = patient.homeAddress;
            _ssn = patient.SSN;
            _bloodgroup = patient.bloodgroup;
    }
    
    // Generates an uniqueRecordAddr
    function generateUniqueRecordAddr() returns (bytes32) {
        bytes32 newUniqueRecordAddr;
        newUniqueRecordAddr = sha3(block.timestamp + rand(0,1000));
       return newUniqueRecordAddr;
    }
    
    function rand(uint min, uint max) internal returns(uint randomNumber) {
        nonce++;
        randomNumber = uint(sha3(nonce)) % (min + max) - min;
        return randomNumber;
    }
}
