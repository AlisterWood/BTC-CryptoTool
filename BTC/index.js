var BTCMarkets = require('btc-markets');
var rl = require("readline");
var play = require('play');
var connectivity = require('connectivity');
const get = require('simple-get');

const readline = require('readline');
const blank = '\n'.repeat(process.stdout.rows);
console.log(blank);
readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

var Phone = 0;
var PhoneSetupComplete = 'No';


//var API = "f53f34bb-8c33-4a4e-8d30-858afdbaa314";
//var Secret = "YxZvf5iDn4C8UqF0MG7csvGPZnG0W0RZGPKMCArTVzG8ottSZZnIFMz40zHicvy+8DsZe780zrO+81YNbIEdaw==";
var API = null;
var Secret = null;

var client = null;


var numberConverter = 100000000;    // one hundred million

var PercentDifference = 0;

var UpdatePercentage = false;

var OverallBase = 0;

var OverallBasePlusPercent = 0;

var OverallBasePlusPercentSold = 0;

var BaseMinusTier1 = 0;

var BaseMinusTier1Purchased = 0;

var BaseMinusTier2 = 0;

var BaseMinusTier2Purchased = 0;

var BaseMinusTier3 = 0;

var BaseMinusTier3Purchased = 0;

var CurrentValue = 0;

var AUDBalance = 0;

var AppStarting = true;

var InvestmentSize = 0; // 20% Investment

var CoinBalance = 0;

var FinalInvestmentSize = 0;

var StillOffline = 0;

var NewBasePointSet = 0;

var CurrencyName = "BTC";

var TransactionLive = 0;

var getPrice = 0;



/////// READ CONFIG FILE ///////////////////////////////////////
var fs = require('fs');
  //Open a file on the server and return it's content:
  fs.readFile('config.txt', 'utf8', function(err, data) {
      var config = data.split(",");
      
      OverallBase = config[0];
      OverallBasePlusPercent = config[1];
      OverallBasePlusPercentSold = config[2];
      
      BaseMinusTier1 = config[3];
      BaseMinusTier1Purchased = config[4];
      
      BaseMinusTier2 = config[5];
      BaseMinusTier2Purchased = config[6];
      
      BaseMinusTier3 = config[7];
      BaseMinusTier3Purchased = config[8];
      
      InvestmentSize = config[9];
      
      API = config[10];
      Secret = config[11];
      
      Phone = config[12];
      PercentDifference = config[13];
      client = new BTCMarkets(API, Secret);
      
      RequestPercentage();
      
  });
/////// READ CONFIG FILE ///////////////////////////////////////



/////// ROUND NUMBERS TO TWO DECIMAL PLACES ////////////////////
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
/////// ROUND NUMBERS TO TWO DECIMAL PLACES ////////////////////




/////////////////// GET USER INPUT ////////////////////////////
console.log("\n"+CurrencyName+" Trading Tool");

function RequestPercentage(){
if(PercentDifference == null || PercentDifference == undefined || PercentDifference == 0){
var prompts = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
prompts.question("\nEnter the margin percentage?\n", function (Perc) {
    PercentDifference = Perc;
    RequestAPI();
});
    }else{
      RequestAPI();  
    }
}

function RequestAPI(){
    if(API == null || API == undefined){
var APIprompts = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
APIprompts.question("\nEnter your API key then press enter\n\n", function (APIKey) {
    API = APIKey;
    RequestSecret();
});
    }
    else{
      UpdatePercentage = true;
      PhoneSetupComplete = 'Yes';
    }
}

function RequestSecret(){

var Secretprompts = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
Secretprompts.question("\nEnter your Secret key then press enter\n\n", function (SecretKey) {
    Secret = SecretKey;
    client = new BTCMarkets(API, Secret);
    RequestPhone();
});
    
}

function RequestPhone(){

var Secretprompts = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
Secretprompts.question("\nEnter your phone number to receive SMS alerts\n\n", function (PhoneNumber) {
    if(PhoneNumber == '' || PhoneNumber == null || PhoneNumber == undefined){
       Phone = '';
       }
    else{
           Phone = PhoneNumber;
    }
    PhoneSetupComplete = 'Yes';
    UpdatePercentage = true;
});
    
}
/////////////////// GET USER INPUT ////////////////////////////



/////// GET LATEST PRICES ///////////////////////////////////
function GetPrices(){

    if(PercentDifference != 0 && API != undefined && Secret != undefined && API != null && Secret != null && PhoneSetupComplete == 'Yes'){
       
    try{
      
    client.getTick(CurrencyName, "AUD", function(err, data){

    if(data){
    
    if(data.lastPrice != 0 && data.lastPrice != null && data.lastPrice != '' && data.lastPrice != undefined && data.lastPrice != 'undefined' && data.bestAsk != undefined && data.bestAsk != 'undefined' && data.bestBid != undefined && data.bestBid != 'undefined'){
    CurrentValue = parseFloat(data.bestBid).toFixed(2);
        getPrice = getPrice+1;
    }

    
    if(CurrentValue != 0 && CurrentValue != null && CurrentValue != '' && CurrentValue != undefined && CurrentValue != 'undefined'){
       
/////////////////////////////////////////// UPDATE CONFIG  ///////////////////// 
    if(UpdatePercentage == true){
        
    TransactionLive = 1;
        
       if(OverallBase == 0 || OverallBase == '' || OverallBase == null || OverallBase == undefined || OverallBase == 'undefined'){
       OverallBase = CurrentValue;
       }
        
       client.getAccountBalances(function(err, Balancedata){
        
       if(Balancedata){
       if(Balancedata != undefined && Balancedata != 'undefined'){
       Balancedata.forEach(function(account)
       {
        if(account.currency == CurrencyName){
          CoinBalance = account.balance / numberConverter;
            
           }
        if(account.currency == "AUD"){
          //AUDBalance = roundToTwo(account.balance / numberConverter)-0.01;
            AUDBalance = roundToTwo(account.balance / numberConverter);
          if(isNaN(AUDBalance)){
              AUDBalance = 0;
          }
       }
           
       });

        
       if(AppStarting == true){
       var reco = OverallBase*2;
       AUDBalance = roundToTwo(AUDBalance);
       if(isNaN(AUDBalance)){
              AUDBalance = 0;
          }
       //console.log("\nAvailable Balance: $"+AUDBalance+" Recommended Balance: $"+reco);
       AppStarting = false;
       }
    
       Percent = PercentDifference;
       Percent = (OverallBase/100)*Percent;
       Percent = parseFloat(Percent).toFixed(2);
        
       
        
       OverallBasePlusPercent = Number(OverallBase)+Number(Percent);
       OverallBasePlusPercent = roundToTwo(OverallBasePlusPercent);
       if(OverallBasePlusPercentSold != 1){
       OverallBasePlusPercentSold = 0;
       }
      
       BaseMinusTier1 = roundToTwo(OverallBase-Percent);
       if(BaseMinusTier1Purchased != 1){
       BaseMinusTier1Purchased = 0;
       }
       var MinusPercentTier2 = roundToTwo(Percent*2);
       BaseMinusTier2 = roundToTwo(OverallBase-MinusPercentTier2);
       if(BaseMinusTier2Purchased != 1){
       BaseMinusTier2Purchased = 0;
       }
      
       var MinusPercentTier3 = roundToTwo(Percent*3);
       BaseMinusTier3 = roundToTwo(OverallBase-MinusPercentTier3);
       if(BaseMinusTier3Purchased != 1){
       BaseMinusTier3Purchased = 0;
       }
        
      
        
       if(BaseMinusTier1Purchased == 0 && BaseMinusTier2Purchased == 0 && BaseMinusTier3Purchased == 0){
       InvestmentSize = roundToTwo(AUDBalance/10);
       InvestmentSize = roundToTwo(InvestmentSize*3); // 30% of the total investment fund 
       }
           
      
      
       FinalInvestmentSize = roundToTwo(InvestmentSize/CurrentValue);  

       
       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {}); 
       

       var CoinValue = roundToTwo(CurrentValue*CoinBalance);
       var OverallBalance = roundToTwo(CoinValue+AUDBalance);
 
       
       console.log("\n"+CurrencyName+" Balance        : "+CoinBalance+" "+CurrencyName);
       console.log(CurrencyName+" Value          : $"+CoinValue);
       console.log("AUD Balance        : $"+AUDBalance);
       console.log("Overall Balance    : $"+OverallBalance);
       console.log("Investment Size    : $"+InvestmentSize);
       console.log("Current Base Price : $"+OverallBase);
       console.log("Current Value      : $"+CurrentValue);

    
       if(BaseMinusTier1Purchased == 1){
       console.log("Investment Point 1 : $"+BaseMinusTier1+" - Purchased");    
       }else{
           console.log("Investment Point 1 : $"+BaseMinusTier1);               
       }
       if(BaseMinusTier2Purchased == 1){
       console.log("Investment Point 2 : $"+BaseMinusTier2+" - Purchased");    
       }else{
           console.log("Investment Point 2 : $"+BaseMinusTier2);               
       }
       if(BaseMinusTier3Purchased == 1){
       console.log("Investment Point 3 : $"+BaseMinusTier3+" - Purchased");    
       }else{
           console.log("Investment Point 3 : $"+BaseMinusTier3);               
       }
           
            console.log("\n--------------------------------------------\n");

        NewBasePointSet = 0;
        UpdatePercentage = false; 
        TransactionLive = 0;
       }   // IF BALANCEDATA
       }   // IF BALANCE IS NOT UNDEFINED
       }); // GET ACCOUNT BALANCES
       }   // UPDATE PERCENTAGE
/////////////////////////////////////////// UPDATE CONFIG  /////////////////////      
        
    
       var n = new Date().toLocaleString();
        
       if(getPrice == 1800){
            console.log(CurrencyName+" Trading at: $"+CurrentValue+" - "+n);
            getPrice = 0;
        }
    
        
       
/////////////////////////////////////////// INCREASE BASE RATE  //////////////
       if(CurrentValue > OverallBase && NewBasePointSet == 0 && TransactionLive == 0 && BaseMinusTier1Purchased == 0){
            
            TransactionLive = 1;
            NewBasePointSet = 1;
            
            console.log("\n--------------------------------------------");
            console.log("\nIncreasing Base Price to: $"+CurrentValue+" - "+n);
            
            UpdatePercentage = true;
            
            OverallBase = CurrentValue;
            
       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {});   
            
            play.sound('./Sounds/BaseUp.wav', function(){});
            
            TransactionLive = 0;
            
       }
/////////////////////////////////////////// INCREASE BASE RATE  //////////////

    
        
/////////////////////////////////////////// BUY TIER 1  //////////////////////
       if(CurrentValue <= BaseMinusTier1 && BaseMinusTier1Purchased == 0 && TransactionLive == 0){
            
            TransactionLive = 1;
            if(data){
            if(data.lastPrice != 0 && data.lastPrice != null && data.lastPrice != '' && data.lastPrice != undefined && data.lastPrice != 'undefined' && data.bestAsk != undefined && data.bestAsk != 'undefined' && data.bestBid != undefined && data.bestBid != 'undefined'){
            CurrentValue = parseFloat(data.bestAsk).toFixed(2);
                
            
            client.createOrder(CurrencyName, "AUD", CurrentValue * numberConverter, FinalInvestmentSize * numberConverter, 'Bid', 'Limit', "10001", function(err, data){
            
                
            console.log("\nBuying Tier 1 - "+FinalInvestmentSize+" "+CurrencyName+" @ $"+CurrentValue+" - Total: $"+InvestmentSize+" - "+n);
                
            BaseMinusTier1Purchased = 1;
                
                
       if(BaseMinusTier1Purchased == 1){
       console.log("Investment Point 1 : $"+BaseMinusTier1+" - Purchased");    
       }else{
           console.log("Investment Point 1 : $"+BaseMinusTier1);               
       }
       if(BaseMinusTier2Purchased == 1){
       console.log("Investment Point 2 : $"+BaseMinusTier2+" - Purchased");    
       }else{
           console.log("Investment Point 2 : $"+BaseMinusTier2);               
       }
       if(BaseMinusTier3Purchased == 1){
       console.log("Investment Point 3 : $"+BaseMinusTier3+" - Purchased");    
       }else{
           console.log("Investment Point 3 : $"+BaseMinusTier3);               
       }
               
       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {});  
                
                
                
            play.sound('./Sounds/Buy.wav', function(){});
                
            TransactionLive = 0;
                
                
            });
            }
            }
            }
/////////////////////////////////////////// BUY TIER 1  //////////////////////
    
        
        
/////////////////////////////////////////// BUY TIER 2  //////////////////////
       if(CurrentValue <= BaseMinusTier2 && BaseMinusTier2Purchased == 0 && TransactionLive == 0){
            
            TransactionLive = 1;
            if(data){
            if(data.lastPrice != 0 && data.lastPrice != null && data.lastPrice != '' && data.lastPrice != undefined && data.lastPrice != 'undefined' && data.bestAsk != undefined && data.bestAsk != 'undefined' && data.bestBid != undefined && data.bestBid != 'undefined'){
            CurrentValue = parseFloat(data.bestAsk).toFixed(2);

        
            client.createOrder(CurrencyName, "AUD", CurrentValue * numberConverter, FinalInvestmentSize * numberConverter, 'Bid', 'Limit', "10001", function(err, data){
            
            //var Output = JSON.stringify(data);
            //console.log("\n"+Output+"\n");
                

            console.log("\nBuying Tier 2 - "+FinalInvestmentSize+" "+CurrencyName+" @ $"+CurrentValue+" - Total: $"+InvestmentSize+" - "+n);
                
            BaseMinusTier2Purchased = 1;
                
       if(BaseMinusTier1Purchased == 1){
       console.log("Investment Point 1 : $"+BaseMinusTier1+" - Purchased");    
       }else{
           console.log("Investment Point 1 : $"+BaseMinusTier1);               
       }
       if(BaseMinusTier2Purchased == 1){
       console.log("Investment Point 2 : $"+BaseMinusTier2+" - Purchased");    
       }else{
           console.log("Investment Point 2 : $"+BaseMinusTier2);               
       }
       if(BaseMinusTier3Purchased == 1){
       console.log("Investment Point 3 : $"+BaseMinusTier3+" - Purchased");    
       }else{
           console.log("Investment Point 3 : $"+BaseMinusTier3);               
       }
                
       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {}); 
                
            play.sound('./Sounds/Buy.wav', function(){});
            
            TransactionLive = 0;
                
                
            });
            }
            }
            }
/////////////////////////////////////////// BUY TIER 2  //////////////////////
        
        
        
/////////////////////////////////////////// BUY TIER 3  //////////////////////
       if(CurrentValue <= BaseMinusTier3 && BaseMinusTier3Purchased == 0 && TransactionLive == 0){
            
            TransactionLive = 1;
            if(data){
            if(data.lastPrice != 0 && data.lastPrice != null && data.lastPrice != '' && data.lastPrice != undefined && data.lastPrice != 'undefined' && data.bestAsk != undefined && data.bestAsk != 'undefined' && data.bestBid != undefined && data.bestBid != 'undefined'){
            CurrentValue = parseFloat(data.bestAsk).toFixed(2);
        
            client.createOrder(CurrencyName, "AUD", CurrentValue * numberConverter, FinalInvestmentSize * numberConverter, 'Bid', 'Limit', "10001", function(err, data){
              
            //var Output = JSON.stringify(data);
            //console.log("\n"+Output+"\n");
                
            console.log("\nBuying Tier 3 - "+FinalInvestmentSize+" "+CurrencyName+" @ $"+CurrentValue+" - Total: $"+InvestmentSize+" - "+n);
                
            BaseMinusTier3Purchased = 1;
                
       if(BaseMinusTier1Purchased == 1){
       console.log("Investment Point 1 : $"+BaseMinusTier1+" - Purchased");    
       }else{
           console.log("Investment Point 1 : $"+BaseMinusTier1);               
       }
       if(BaseMinusTier2Purchased == 1){
       console.log("Investment Point 2 : $"+BaseMinusTier2+" - Purchased");    
       }else{
           console.log("Investment Point 2 : $"+BaseMinusTier2);               
       }
       if(BaseMinusTier3Purchased == 1){
       console.log("Investment Point 3 : $"+BaseMinusTier3+" - Purchased");    
       }else{
           console.log("Investment Point 3 : $"+BaseMinusTier3);               
       }
                
       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {}); 
                
            play.sound('./Sounds/Buy.wav', function(){});
            
            TransactionLive = 0;
                
                
            });
            }
            }
            }
/////////////////////////////////////////// BUY TIER 3  //////////////////////
    
    
    
/////////////////////////////////////////// SELL TIER 1 //////////////////////
       if(CurrentValue >= OverallBase && BaseMinusTier1Purchased == 1 && TransactionLive == 0){
            
            TransactionLive = 1;
           
            var Multiplyer = 1;
            if(BaseMinusTier2Purchased == 1){Multiplyer = 2;}
            if(BaseMinusTier3Purchased == 1){Multiplyer = 3;}
            
            var Coins = FinalInvestmentSize;
            Coins = roundToTwo(FinalInvestmentSize*Multiplyer);
           
            client.createOrder(CurrencyName, "AUD", CurrentValue * numberConverter, Coins * numberConverter, 'Ask', 'Market', "10001", function(err, data){
             
            //var Output = JSON.stringify(data);
            //console.log("\n"+Output+"\n");
            var totalValue = Coins*CurrentValue;
                totalValue = roundToTwo(totalValue);
            console.log("\nSelling - "+Coins+" "+CurrencyName+" @ $"+CurrentValue+" - Total Sale Price: $"+totalValue+" - "+n);
                
            BaseMinusTier1Purchased = 0;
            BaseMinusTier2Purchased = 0;
            BaseMinusTier3Purchased = 0;
                

       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {}); 
                
            play.sound('./Sounds/Sold.wav', function(){});
            
            TransactionLive = 0;
                
            if(Phone =! '' && Phone == null && Phone != undefined && Phone != false){    
            get.concat('https://visitusreception.com/BTCNotify.php?Tier=1&Currency='+CurrencyName+"&Purchased="+FinalInvestmentSize+"&Value="+CurrentValue+"&Total="+InvestmentSize+"&Type=Selling&Phone="+Phone, function (err, res, data) {});
            }
                
            });
       }
/////////////////////////////////////////// SELL TIER 1 //////////////////////
        
        
/*      
/////////////////////////////////////////// SELL TIER 2 //////////////////////
       if(CurrentValue >= BaseMinusTier1 && BaseMinusTier2Purchased == 1 && TransactionLive == 0){
            
            TransactionLive = 1;
            
            client.createOrder("XRP", "AUD", CurrentValue * numberConverter, FinalInvestmentSize * numberConverter, 'Ask', 'Market', "10001", function(err, data){ 
                
            //var Output = JSON.stringify(data);
            //console.log("\n"+Output+"\n");
                
            console.log("\nSelling Tier 2 - "+FinalInvestmentSize+"XRP @ $"+CurrentValue+" - Total: $"+InvestmentSize+" - "+n);
                
            BaseMinusTier2Purchased = 0;
                
       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {});  
                
            play.sound('./Sounds/Sold.wav', function(){});
                
            TransactionLive = 0;
                
            if(Phone =! '' && Phone == null && Phone != undefined && Phone != false){
            get.concat('https://visitusreception.com/BTCNotify.php?Tier=2&Currency='+CurrencyName+"&Purchased="+FinalInvestmentSize+"&Value="+CurrentValue+"&Total="+InvestmentSize+"&Type=Selling&Phone="+Phone, function (err, res, data) {});
            }
                
            });
       }
/////////////////////////////////////////// SELL TIER 2 //////////////////////
        
        
        
/////////////////////////////////////////// SELL TIER 3 //////////////////////
       if(CurrentValue >= BaseMinusTier2 && BaseMinusTier3Purchased == 1 && TransactionLive == 0){
            
            TransactionLive = 1;
           
            client.createOrder("XRP", "AUD", CurrentValue * numberConverter, FinalInvestmentSize * numberConverter, 'Ask', 'Market', "10001", function(err, data){
                
            //var Output = JSON.stringify(data);
            //console.log("\n"+Output+"\n");
                
            console.log("\nSelling Tier 3 - "+FinalInvestmentSize+"XRP @ $"+CurrentValue+" - Total: $"+InvestmentSize+" - "+n);
                
            BaseMinusTier3Purchased = 0;
                
       fs.writeFile("config.txt", OverallBase+","+OverallBasePlusPercent+","+OverallBasePlusPercentSold+","+BaseMinusTier1+","+BaseMinusTier1Purchased+","+BaseMinusTier2+","+BaseMinusTier2Purchased+","+BaseMinusTier3+","+BaseMinusTier3Purchased+","+InvestmentSize+","+API+","+Secret+","+Phone+","+PercentDifference, function(err) {}); 
                
            play.sound('./Sounds/Sold.wav', function(){});
                
            TransactionLive = 0;
                
            if(Phone =! '' && Phone == null && Phone != undefined && Phone != false){
            get.concat('https://visitusreception.com/BTCNotify.php?Tier=3&Currency='+CurrencyName+"&Purchased="+FinalInvestmentSize+"&Value="+CurrentValue+"&Total="+InvestmentSize+"&Type=Selling&Phone="+Phone, function (err, res, data) {});
            }
                
            });
       }
/////////////////////////////////////////// SELL TIER 3 //////////////////////
*/              
        
    
}   // IF CURRENT VALUE IS NOT UNDEFINED
}   // IF DATA
}); // GETTING THE CURRENT PRICES
}   // TRY GETTING THE PRICES
    catch(err){}       
}   // IF THE PERCENT DIFFERNECE IS NOT 0
}   // GET PRICES FUNCTION
/////// GET LATEST PRICES ///////////////////////////////////



//////////////////////////////////////////////////// SELL TIER 3 //////////////////////
function TryGetPrices(){
    try{
        
      connectivity(function (online) {
      if (online) {
      
      if(PercentDifference != 0 && API != undefined && Secret != undefined && API != null && Secret != null && PhoneSetupComplete == 'Yes' && TransactionLive == 0){
      
      if(StillOffline == 1){
          
         var n = new Date().toLocaleString();
         console.log("Connection up at "+n);
         }
          
         StillOffline = 0;
         GetPrices();
      }
        } else {

      var n = new Date().toLocaleString();
      if(StillOffline == 0){
      if(PercentDifference != 0 && API != undefined && Secret != undefined && API != null && Secret != null && PhoneSetupComplete == 'Yes'){
      console.error('Connection down at '+n);
      StillOffline = 1;
      }
      }
            
}  // IF OFFLINE
});// CHECK TO SEE IF IT'S ONLINE           
}  // TRY GET PRICES 
catch(err){}
}  // TRY GET PRICES FUNCTION
/////////////////////////////// CHECK CONNECTION AND TRIGGER GET PRICES ///////////////




setInterval(TryGetPrices, 2500);
