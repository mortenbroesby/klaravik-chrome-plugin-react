import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// Function to update the displayed price for highest bid
function updateHighestBid(element) {
  // Check if the element has already been updated
  if (element.classList.contains('price-updated')) {
    return; // Skip updating if already updated
  }

  console.log('updateHighestBid!');

  // Get the current price text
  let priceText = element.innerText.trim();

  // Check if the price text is "Ingen bud", replace with 0
  let currentPrice = 0;

  if (priceText.toLowerCase() !== 'ingen bud') {
    // Remove all non-numeric characters (including dots) from the text
    let numericPriceText = priceText.replace(/[^\d]/g, '');

    // Convert the numeric text to a float
    currentPrice = parseFloat(numericPriceText);
  }

  // Store the original price as a data attribute
  element.dataset.originalPrice = currentPrice;

  // Add 100 to the current price - bidding increment
  currentPrice += 100;

  // Approximate auction fee
  let auctionFee = 200; // Auction fee

  // Calculate the new price
  let newPrice = currentPrice * 1.25 + auctionFee;

  // Format the price with Danish formatting
  let formatter = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
    currencyDisplay: 'code',
  });

  let formattedPrice = formatter.format(newPrice);

  // Append the original price separated by a tilde (~)
  element.innerText = formattedPrice;

  // Store the updated price as a data attribute
  element.dataset.updatedPrice = formattedPrice;

  // Add a class to mark that the price has been updated
  element.classList.add('price-updated');

  // Apply the background style
  element.style.background =
    "linear-gradient(to bottom, #1b7ced 77.5%, transparent 50%) repeat top left,url('') no-repeat top right";
}

// Function to update the displayed price for bid-box__leading-price
function updateLeadingPrice(element) {
  // Check if the element has already been updated
  if (element.classList.contains('price-updated')) {
    return; // Skip updating if already updated
  }

  console.log('updateLeadingPrice!');

  // Get the current price text
  let priceText = element.innerText.trim();

  // Check if the price text is "Ingen bud", replace with 0
  let currentPrice = 0;

  if (priceText.toLowerCase() !== 'ingen bud') {
    // Remove all non-numeric characters (including dots) from the text
    let numericPriceText = priceText.replace(/[^\d]/g, '');

    // Convert the numeric text to a float
    currentPrice = parseFloat(numericPriceText);
  }

  // Store the original price as a data attribute
  element.dataset.originalPrice = currentPrice;

  // Calculate the new price (multiply by 1.25)
  let newPrice = currentPrice * 1.25;

  // Find the fee under .fee-highlighted
  let feeElement = document.querySelector('.fee-highlighted');

  let feePrice = 0;

  if (feeElement) {
    let feeText = feeElement.innerText.trim();
    if (feeText.toLowerCase() !== 'ingen bud') {
      let numericFeeText = feeText.replace(/[^\d]/g, '');
      feePrice = parseFloat(numericFeeText);
    }
  }

  // Add the fee to the current price
  newPrice += feePrice;

  // Format the prices with Danish formatting
  let formatter = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
    currencyDisplay: 'code',
  });

  let formattedCurrentPrice = formatter.format(currentPrice);
  let formattedNewPrice = formatter.format(newPrice);

  // Append the original price
  element.innerText = formattedCurrentPrice;

  // Store the updated price as a data attribute
  element.dataset.updatedPrice = formattedNewPrice;

  // Create a container for the below elements
  let container = document.createElement('div');

  // Create elements for current bid
  let currentBidDiv = document.createElement('div');
  let currentBidElement = document.createElement('span');
  currentBidElement.innerText = 'Med moms: ';
  currentBidElement.classList.add('close-box__end-date__label');
  currentBidDiv.appendChild(currentBidElement);

  let currentBidValueElement = document.createElement('span');
  currentBidValueElement.innerText = formattedNewPrice;
  currentBidValueElement.classList.add('reserve-price__text');
  currentBidValueElement.classList.add('fee-highlighted');
  currentBidDiv.appendChild(currentBidValueElement);

  // Append the current bid div to the container
  container.appendChild(currentBidDiv);

  // Create elements for overbid
  let overBidDiv = document.createElement('div');
  let overBidElement = document.createElement('span');
  overBidElement.innerText = 'Mit overbud: ';
  overBidElement.classList.add('close-box__end-date__label');
  overBidDiv.appendChild(overBidElement);

  let overBidValueElement = document.createElement('span');
  overBidValueElement.innerText = formatter.format(newPrice + 125);
  overBidValueElement.classList.add('reserve-price__text');
  overBidValueElement.classList.add('reserve-price__green');
  overBidValueElement.classList.add('fee-highlighted');
  overBidValueElement.style.color = '#1b7ced'; // Set the color to blue
  overBidDiv.appendChild(overBidValueElement);

  let disclaimerElement = document.createElement('div');
  disclaimerElement.innerText = ' (inkl. moms og auktionsgebyr)';
  overBidDiv.appendChild(disclaimerElement);

  // Append the current bid div to the container
  container.appendChild(overBidDiv);

  // Add a class to mark that the price has been updated
  element.classList.add('price-updated');

  // Find the closest bid-box-container parent and append the container
  let bidBoxContainer = element.closest('.bid-box-container');
  if (bidBoxContainer) {
    bidBoxContainer.appendChild(container);
  }
}

// Update prices for highest bid every second
setInterval(() => {
  document.querySelectorAll('.highestBid').forEach(updateHighestBid);
}, 1000);

// Update prices for bid-box__leading-price every second
setInterval(() => {
  document
    .querySelectorAll('.bid-box__leading-price')
    .forEach(updateLeadingPrice);
}, 1000);
