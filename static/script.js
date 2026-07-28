// ==========================================================
// AI RULE BASED CHATBOT PROJECT 1
// FINAL JAVASCRIPT
// ==========================================================

// ================================
// Get HTML Elements
// ================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const restartBtn = document.getElementById("restartBtn");
const clearBtn = document.getElementById("clearBtn");
const typing = document.getElementById("typing");

// ================================
// Send Button
// ================================

sendBtn.addEventListener("click", sendMessage);

// ================================
// Press Enter
// ================================

userInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        sendMessage();

    }

});

// ================================
// Restart Button
// ================================

restartBtn.addEventListener("click", restartChat);

// ================================
// Clear Button
// ================================

clearBtn.addEventListener("click", function(){

    chatBox.innerHTML="";

});

// ================================
// Main Function
// ================================

function sendMessage(){

    let message = userInput.value.trim();

    if(message===""){

        return;

    }

    addUserMessage(message);

    userInput.value="";

    showTyping();

    fetch("/search",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            message:message

        })

    })

    .then(response=>response.json())

    .then(data=>{

        hideTyping();

        handleResponse(data);

    })

    .catch(error=>{

        hideTyping();

        addBotMessage(

        "❌ Unable to connect with Flask Server."

        );

        console.log(error);

    });

}

// ================================
// Typing Animation
// ================================

function showTyping(){

    typing.style.display="block";

}

function hideTyping(){

    typing.style.display="none";

}

// ================================
// User Message
// ================================

function addUserMessage(text){

    let html=`

<div class="user-message">

<div class="message">

${text}

<br><br>

<small>${currentTime()}</small>

</div>

</div>

`;

chatBox.innerHTML+=html;

scrollBottom();

}

// ================================
// Bot Message
// ================================

function addBotMessage(text){

let html=`

<div class="bot-message">

<div class="bot-icon">

<i class="fa-solid fa-robot"></i>

</div>

<div class="message">

<h4>AI Assistant</h4>

<p>

${text}

</p>

<br>

<small>${currentTime()}</small>

</div>

</div>

`;

chatBox.innerHTML+=html;

scrollBottom();

}

// ================================
// Current Time
// ================================

function currentTime(){

let now=new Date();

return now.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});

}

// ================================
// Auto Scroll
// ================================

function scrollBottom(){

chatBox.scrollTop=chatBox.scrollHeight;

}
// ==========================================================
// Handle Flask Response
// ==========================================================

function handleResponse(data){

    switch(data.type){

        case "greeting":

            addBotMessage(data.reply);

            break;

        case "help":

            addBotMessage(data.reply);

            break;

        case "bye":

            addBotMessage(data.reply);

            break;

        case "empty":

            addBotMessage(data.reply);

            break;

        case "notfound":

            addBotMessage(data.reply);

            break;

        case "order":

            showOrder(data);

            break;

        case "customer":

            showCustomer(data);

            break;

        case "product":

            showProduct(data);

            break;

        default:

            addBotMessage("❌ Unknown response from server.");

    }

}


// ==========================================================
// Order Card
// ==========================================================

function showOrder(data){

let html=`

<div class="bot-message">

<div class="bot-icon">

<i class="fa-solid fa-box"></i>

</div>

<div class="message">

<h4>📦 Order Information</h4>

<p>

<b>Order ID :</b> ${data.order_id}

<br><br>

<b>Date :</b> ${data.date}

<br><br>

<b>Customer ID :</b> ${data.customer_id}

<br><br>

<b>Product :</b> ${data.product}

<br><br>

<b>Quantity :</b> ${data.quantity}

<br><br>

<b>Unit Price :</b> $${data.unit_price}

<br><br>

<b>Total Price :</b> $${data.total_price}

<br><br>

<b>Status :</b> ${data.status}

<br><br>

<b>Tracking :</b> ${data.tracking}

<br><br>

<b>Payment :</b> ${data.payment}

<br><br>

<b>Shipping :</b> ${data.shipping}

</p>

<br>

<small>${currentTime()}</small>

</div>

</div>

`;

chatBox.innerHTML+=html;

scrollBottom();

}



// ==========================================================
// Customer Card
// ==========================================================

function showCustomer(data){

let html=`

<div class="bot-message">

<div class="bot-icon">

<i class="fa-solid fa-user"></i>

</div>

<div class="message">

<h4>👤 Customer Information</h4>

<p>

<b>Customer ID :</b> ${data.customer_id}

<br><br>

<b>Order ID :</b> ${data.order_id}

<br><br>

<b>Product :</b> ${data.product}

<br><br>

<b>Status :</b> ${data.status}

<br><br>

<b>Tracking :</b> ${data.tracking}

<br><br>

<b>Total Price :</b> $${data.total_price}

</p>

<br>

<small>${currentTime()}</small>

</div>

</div>

`;

chatBox.innerHTML+=html;

scrollBottom();

}



// ==========================================================
// Product Card
// ==========================================================

function showProduct(data){

    let html = `

    <div class="bot-message">

        <div class="bot-icon">
            <i class="fa-solid fa-laptop"></i>
        </div>

        <div class="message">

            <h4>💻 Product Information</h4>

            <p>

                <b>Product :</b> ${data.product}

                <br><br>

                <b>Total Price :</b> $${data.price}

                <br><br>

                <b>Status :</b> ${data.status}

                <br><br>

                <b>Tracking :</b> ${data.tracking}

                <br><br>

                <b>Quantity :</b> ${data.quantity}

                <br><br>

                <b>Payment :</b> ${data.payment}

            </p>

            <hr style="margin:15px 0;">

            <b>Quick Options</b>

            <br><br>

            <button class="infoBtn"
            onclick="showInfo('Price', '$${data.price}')">
                💲 Price
            </button>

            <button class="infoBtn"
            onclick="showInfo('Status', '${data.status}')">
                📦 Status
            </button>

            <button class="infoBtn"
            onclick="showInfo('Tracking', '${data.tracking}')">
                🚚 Tracking
            </button>

            <button class="infoBtn"
            onclick="showInfo('Payment', '${data.payment}')">
                💳 Payment
            </button>

        </div>

    </div>

    `;

    chatBox.innerHTML += html;

    scrollBottom();
}
function showInfo(title, value){

    addBotMessage(
        "<b>" + title + ":</b><br><br>" + value
    );

}
// ==========================================================
// Restart Chat
// ==========================================================

function restartChat(){

    chatBox.innerHTML="";

    addBotMessage(`👋 Hello!

Welcome to <b>AI Rule Based Chatbot Project 1</b>.

I can help you search your Excel dataset.

You can search by:

✅ Order ID

✅ Customer ID

✅ Product Name

Type <b>HELP</b> to see all available commands.`);

}



// ==========================================================
// Quick Search Buttons
// ==========================================================

function quickSearch(text){

    userInput.value=text;

    sendMessage();

}



// ==========================================================
// Example Buttons
// ==========================================================

const exampleButtons=document.querySelectorAll(".example-btn");

exampleButtons.forEach(function(button){

button.addEventListener("click",function(){

userInput.value=this.innerText;

sendMessage();

});

});



// ==========================================================
// Welcome Message
// ==========================================================

window.onload=function(){

setTimeout(function(){

addBotMessage(

`🤖 Welcome!

AI Rule Based Chatbot Project 1 is ready.

Dataset Loaded Successfully.

Try searching:

<b>ORD200001</b>

or

<b>C72649</b>

or

<b>Laptop</b>`

);

},500);

};



// ==========================================================
// Auto Focus
// ==========================================================

userInput.focus();



// ==========================================================
// Remove Starting Spaces
// ==========================================================

userInput.addEventListener("input",function(){

this.value=this.value.replace(/^ +/,"");

});



// ==========================================================
// Better Error Handling
// ==========================================================

window.addEventListener("error",function(){

hideTyping();

addBotMessage(

"❌ Something went wrong.<br>Please try again."

);

});



// ==========================================================
// Offline Detection
// ==========================================================

window.addEventListener("offline",function(){

addBotMessage(

"⚠ Internet connection lost."

);

});



// ==========================================================
// Online Detection
// ==========================================================

window.addEventListener("online",function(){

addBotMessage(

"✅ Internet connection restored."

);

});



// ==========================================================
// Prevent Multiple Clicks
// ==========================================================

let sending=false;

const originalSend=sendMessage;

sendMessage=function(){

if(sending){

return;

}

sending=true;

originalSend();

setTimeout(function(){

sending=false;

},700);

};



// ==========================================================
// Clear Chat Button
// ==========================================================

clearBtn.addEventListener("click",function(){

chatBox.innerHTML="";

addBotMessage(

"🗑 Chat has been cleared.<br>You can start a new conversation."

);

});



// ==========================================================
// Restart Button
// ==========================================================

restartBtn.addEventListener("click",function(){

restartChat();

});



// ==========================================================
// End of File
// ==========================================================
