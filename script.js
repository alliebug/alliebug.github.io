/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  document.getElementById("coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  return producers.map((obj) => {
    if (coffeeCount >= obj.price * 0.5) {
      obj.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter((obj) => obj.unlocked === true);
}

function makeDisplayNameFromId(id) {
  // your code here
  let arr = id.split("_");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // your code here
  let producer_container = document.getElementById("producer_container");
  deleteAllChildNodes(producer_container);
  unlockProducers(data.producers, data.coffee);
  let arr = getUnlockedProducers(data);
  arr.forEach((producer) =>
    producer_container.appendChild(makeProducerDiv(producer))
  );
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  let arr = data.producers.filter((obj) => obj.id === producerId);
  return arr[0];
}

function canAffordProducer(data, producerId) {
  // your code here
  if (data.coffee >= getProducerById(data, producerId).price) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  // your code here
  document.getElementById("cps").innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor((oldPrice * 125) / 100);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  let temp = canAffordProducer(data, producerId);
  if (temp) {
    let prod = getProducerById(data, producerId);
    prod.qty++;
    data.coffee -= prod.price;
    prod.price = updatePrice(prod.price);
    data.totalCPS += prod.cps;
  }
  return temp;
}

function buyButtonClick(event, data) {
  // your code here

  if (event.target.id && event.target.id != "producer_container") {
    if (attemptToBuyProducer(data, event.target.id.slice(4))) {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    } else {
      window.alert("Not enough coffee!");
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

function clickStartOver(data) {
  data = window.data;
  window.localStorage.clear();
  window.location.reload();
}
/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  let data = window.data;
  //load previoius game state if there is any
  const testData = window.localStorage.getItem("savedData");
  if (testData) {
    data = JSON.parse(testData);
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
    renderProducers(data);
  }

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // add an event listen to the start over button
  const startOverBtn = document.getElementById("start_over");
  startOverBtn.addEventListener("click", (event) => clickStartOver(data));

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);

  // periodically save game state
  setInterval(() => {
    window.localStorage.setItem("savedData", JSON.stringify(data));
  }, 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
