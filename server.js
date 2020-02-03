var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));


var contractabi=[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"patientDetails","outputs":[{"name":"e_walletadd","type":"address"},{"name":"name","type":"string"},{"name":"age","type":"uint256"},{"name":"phone","type":"string"},{"name":"homeAddress","type":"string"},{"name":"SSN","type":"uint256"},{"name":"bloodgroup","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"diagonisticCenterAddress","type":"string"},{"name":"contactHealthCareProvider","type":"string"},{"name":"currMedProblem","type":"string"},{"name":"pastMedHistory","type":"string"},{"name":"bloodSugarLevel","type":"string"},{"name":"heartRate","type":"string"},{"name":"healthReport","type":"bytes32[]"}],"name":"StoreHealthRecords","outputs":[{"name":"_success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"healthRecord","outputs":[{"name":"healthRecordUniqueAddr","type":"bytes32"},{"name":"diagonisticCenterID","type":"address"},{"name":"diagonisticCenterAddress","type":"string"},{"name":"contactHealthCareProvider","type":"string"},{"name":"currMedProblem","type":"string"},{"name":"pastMedHistory","type":"string"},{"name":"bloodSugarLevel","type":"string"},{"name":"heartRate","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"generateUniqueRecordAddr","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"name","type":"string"},{"name":"age","type":"uint256"},{"name":"phone","type":"string"},{"name":"homeAddress","type":"string"},{"name":"SSN","type":"uint256"},{"name":"bloodgroup","type":"string"}],"name":"RegisterPatient","outputs":[{"name":"","type":"address"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"GetPatientDetails","outputs":[{"name":"_ewadd","type":"address"},{"name":"_name","type":"string"},{"name":"_age","type":"uint256"},{"name":"_phone","type":"string"},{"name":"_homeAddress","type":"string"},{"name":"_ssn","type":"uint256"},{"name":"_bloodgroup","type":"string"},{"name":"_uniqueRecordAddr","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"GetPatientHealthRecordsAddr","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"uniqueRecordAddr","type":"bytes32"}],"name":"GetPatientHealthRecords","outputs":[{"name":"_diagonisticCenterID","type":"address"},{"name":"_diagonisticCenterAddress","type":"string"},{"name":"_contactHealthCareProvider","type":"string"},{"name":"_currMedProblem","type":"string"},{"name":"_pastMedHistory","type":"string"},{"name":"_bloodSugarLevel","type":"string"},{"name":"_heartRate","type":"string"},{"name":"_healthReport","type":"bytes32[]"}],"payable":false,"type":"function"}];
var sp_address="0xb5cb05e410ab939a07c07ef5c888c8ae3e78dc92";   //mylaptop
var subContract=web3.eth.contract(contractabi).at(sp_address);



/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/
app.use(bodyParser.urlencoded());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, apitoken');
    res.header('Content-Type','application/json');
    //res.send(JSON.stringify({ a: 1 }));
    next();
}


var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   // configure stuff here
   //app.use(express.bodyParser());
   app.use(allowCrossDomain);
}


app.all('/*', function (req, res, next) {
  //console.log(req.body);
  //console.log(req.headers.apitoken);
  if(!req.headers || !req.headers.apitoken) {
    res.send('Bad Request');
    return;
  }

  var sharedKey = "forsecurity";


        if(req.headers.apitoken == sharedKey) {
    next();
  } else {
    res.send("API Access Forbidden. Key not matched");
  }
});

app.post('/registerPatient',urlencodedParser,function(req,res){
  try{
  var add={};
  var pid="";
  var walletaddress=[];
  add.walletaddress=walletaddress;
  var name=req.body.name;
  var age=parseInt(req.body.age);
  var phone=req.body.phone;
  var homeAddress=req.body.homeAddress;
  var SSN=req.body.SSN;
  var bloodgroup=req.body.bloodgroup;
  
    var newadd=web3.personal.newAccount("passwd");
    web3.personal.unlockAccount(web3.eth.accounts[0],"123");
	pid = subContract.RegisterPatient(newadd,name,age,phone,homeAddress,SSN,bloodgroup,{from: web3.eth.accounts[0],gas:0x186A0});
	
    web3.eth.filter("latest").watch(function () {
        if (web3.eth.getTransaction(pid).blockNumber!==null) {

        }
      });
    var a={"ewalletaddress":newadd};
    add.walletaddress.push(a);
    res.end(JSON.stringify(add));
}
catch (err){
  var abc="Something Went wrong please try again";
  res.end(JSON.stringify(abc));
}
})

app.post('/getPatientDetails',urlencodedParser,function(req,res){
  //console.log(req);
  //console.log(req.body.address);
  try{
      var addr=req.body.address;
      var value=subContract.GetPatientDetails.call(addr);
    //  console.log(value);
        var patient = {};
        var patientattr =[];
        patient.patientattr=patientattr;
      if(addr==""){
        res.end("Invalid address");
      }
        var us={
                "Ethereum_address":value[0],
                "PatientName":value[1],
				"PatientAge":value[2],
				"phone":value[3],
				"HomeAddress":value[4],
				"SSN":value[5],
				"BLOODGROUP":value[6],
				"MedRecordAddr":value[7],
        };
        patient.patientattr.push(us);
        res.end(JSON.stringify(patient));
    }
    catch (err){
      var abc="Something Went wrong please try again";
      res.end(JSON.stringify(abc));
    }

})

app.post('/storeHealthrecords',urlencodedParser,function(req,res){
  try{
		var Response={};
		var Success=[];
		Response.Success=Success;
		var pid="";
		var addr=req.body.addr;
		var diagonisticCenterAddress=req.body.diagonisticCenterAddress;
		var contactHealthCareProvider=req.body.contactHealthCareProvider;
		var currMedProblem=req.body.currMedProblem;
		var pastMedHistory=req.body.pastMedHistory;
		var bloodSugarLevel=req.body.bloodSugarLevel;
		var heartRate=req.body.heartRate;
		var healthReport=req.body.healthReport;

		var newadd=web3.personal.newAccount("passwd");
		web3.personal.unlockAccount(web3.eth.accounts[0],"123");
		var value = subContract.StoreHealthRecords.call(addr,diagonisticCenterAddress,contactHealthCareProvider,currMedProblem,pastMedHistory,bloodSugarLevel,heartRate,healthReport,{from: web3.eth.accounts[0],gas:0x186A0});
		console.log("value from contract is : "+value);
		if(value){
			pid = subContract.StoreHealthRecords(addr,diagonisticCenterAddress,contactHealthCareProvider,currMedProblem,pastMedHistory,bloodSugarLevel,heartRate,healthReport,{from: web3.eth.accounts[0],gas:0x186A0});
		}
		var respJson={
			"success": value
		};
		web3.eth.filter("latest").watch(function () {
			if (web3.eth.getTransaction(pid).blockNumber!==null) {

			}
		});
		
		Response.Success.push(respJson);
		res.end(JSON.stringify(Response));
	}
	catch (err){
		var abc="Something Went wrong please try again";
		res.end(JSON.stringify(abc));
	}
})

app.get('/getPatientAllHealthRecord', function (req, res) {
    try{
        var Response={};
		var Records=[];
		Response.Records=Records;
		var addr=req.body.addr;
        var value=subContract.GetPatientHealthRecordsAddr.call(addr);
        var uniqueRecordAddr=value;
		if(uniqueRecordAddr.length() > 0){
			for(var a=0;a<uniqueRecordAddr.length();a++){
				console.log("address is : "+ uniqueRecordAddr[a]);
				var healthrecord=subContract.GetPatientHealthRecords.call(uniqueRecordAddr[a]);
				var record={
					"DiagonisticCenterID":healthrecord[0],
					"DiagonisticCenterAddress": healthrecord[1],
					"ContactHealthCareProvider": healthrecord[2],
					"CurrMedProblem":healthrecord[3],
					"PastMedHistory":healthrecord[4],
					"BloodSugarLevel":healthrecord[5],
					"HeartRate":healthrecord[6],
					"HealthReport":healthrecord[7],
				};
				Response.Records.push(record);
			}
			res.end(JSON.stringify(Response));
		}else{
			var record={};
			Response.Records.push(record);
			res.end(JSON.stringify(Response));
		}
    }
    catch (err){
        var abc="Something Went wrong please try again";
        res.end(JSON.stringify(abc));
    }
})

app.get('/getBlocks',urlencodedParser,function(req,res){
  try{
  var LatestBlocks={};
  var Blocks=[];
  LatestBlocks.Blocks=Blocks;
  var latestBlno=parseInt(web3.eth.getBlock("latest")["number"]);
  if(latestBlno<15){
    for(var i=1;i<=latestBlno;i++){
      var thisblock=web3.eth.getBlock(i);
      var date = new Date(thisblock["timestamp"] * 1000);
                        var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

      var bl={
          "Block Number":thisblock["number"],
          "Block hash": thisblock["hash"],
          "Parent Hash": thisblock["parentHash"],
          "Miner": thisblock["miner"],
          "Gas Used": thisblock["gasUsed"],
          "Time Stamp": formattedDate,
      }
      LatestBlocks.Blocks.push(bl);
    }
  }

  if(latestBlno>15){
    for(var i=latestBlno-14;i<=latestBlno;i++){
      var thisblock=web3.eth.getBlock(i);
      var date = new Date(thisblock["timestamp"] * 1000);
                        var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

      var bl={
          "Block Number":thisblock["number"],
          "Block hash": thisblock["hash"],
          "Parent Hash": thisblock["parentHash"],
          "Miner": thisblock["miner"],
          "Gas Used": thisblock["gasUsed"],
          "Time Stamp": formattedDate,
      }
      LatestBlocks.Blocks.push(bl);
    }
  }
res.end(JSON.stringify(LatestBlocks));
}
catch (err){
  var abc="Something Went wrong please try again";
  res.end(JSON.stringify(abc));
}
})



var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
