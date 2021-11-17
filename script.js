const dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".To select");
getButton = document.querySelector("form button");

for(let i=0;i< dropList.length;i++){
    for(currency_code in country_code){
        // selecting USD by default as FROM currency and NPR as TO currency
        let selected;
        if(i==0){
            selected = currency_code == "USD" ? "selected" : "";
        }

        else if(i==1){
            selected = currency_code == "NPR" ? "selected" : "";
        }
        // creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadflag(e.target);//  calling loadflag with passing target element as an argument
    });
}
function loadflag(element)
{
    for(code in country_code){
        if(code == element.value){//if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img");// selecting img tag of particular drop list
            //passing country code of a selected currency code in a img url
            imgTag.src = `https://flagcdn.com/w160/${country_code[code]}.png`;
        }
    }
}


window.addEventListener("load", () =>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); // preventing form from submitting
    getExchangeRate();
});

    const exchangeIcon = document.querySelector(".drop-list .icon");
    exchangeIcon.addEventListener("click", ()=>{
        let TempCode = fromCurrency.value;// temporary currency code of From drop list
        fromCurrency.value = toCurrency.value;//passing TO Currency code to From Currency Code
        toCurrency.value = TempCode;//passing temporary currency code to TO Currency code
        loadflag(fromCurrency);//calling loadFlag with passing select element (fromCurrency) of FROM
        loadflag(toCurrency);//calling loadFlag with passing select element (toCurrency) of TO
        getExchangeRate();
    });

function getExchangeRate(){
    const amount = document.querySelector(".amount input"),
    exchangerateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    //if user dont enter any vlue or 0 then we will put 1 value by default in the input field
    if(amountVal == "" || amountVal == "0")
    {
        amount.value = "1";
        amountVal = 1;
    }
    exchangerateTxt.innerText = "Getting Exchange Rate...";
    let url = `https://v6.exchangerate-api.com/v6/b5863b4c2f65c458d888560e/latest/${fromCurrency.value}`;
    // fetching api response and returning it with parsing into js obj and in another then method receiving that obj 
    fetch(url).then(response => response.json()).then(result =>{
        let exchangerate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangerate).toFixed(2);
        exchangerateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch( () =>{//if user is offline or any other error occured while fetching data then catch block will run.
        exchangerateTxt.innerText = "something went wrong ...";
    });
}