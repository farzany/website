


playBlackjack();

function playBlackjack() {
    // Declaring all of the clickable buttons and displays
    let hit_button = document.querySelector("#hit");
    let stand_button = document.querySelector("#stand");
    let wager_input = document.querySelector("#wager_input");
    let balance_display = document.querySelector("#balance");
    let place_bet = document.querySelector("#place_bet");
    let winner_display = document.querySelector("#game_over");
    let newRound_button = document.querySelector("#new_round");
    let warning = document.querySelector(".message_container");

    // Declaring the variables used by all functions
    let player_hand;
    let dealer_hand;
    let player_total;
    let dealer_total;
    let wager = 0;
    let balance = 5000;
    let hidden;
     

    // Clearing the hands and setting everything to its default value for a new round
    newRound();
    balance_display.textContent = "$" + balance.toLocaleString();

    // Enter key places bet
    wager_input.onkeydown = function (e){
        if (e.keyCode == 13) {
            place_bet.click();
            return false;
        }
    }

    place_bet.onclick = function () {
        // Disabling the wager_input and making the place_bet button not visible
        // Making the Hit and Stand buttons visible
        // Displaying the player's latest wager as a placeholder in the wager_input
        wager = parseInt(wager_input.value);
        if (wager>balance) {
            // Displays an error if wager is higher than balance
            wager_input.value = "";
            warning.style.display = "block";
            setTimeout(function () {
                warning.style.display = "none";
            }, 2500)
            console.log("Not enough funds.");
            return false;
        } else if (wager_input.value.length == 0) {
            console.log("Input field is empty. Place a wager.");
            return false;
        }

        wager_input.value = ""
        if ((window.matchMedia("(max-width:420px)")).matches) {
            wager_input.placeholder = "$" + wager.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            wager_input.placeholder = "Wager: $" + wager.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        place_bet.style.display = "none";
        hit_button.style.display = "block";
        stand_button.style.display = "block";
        place_bet.disabled = true;
        wager_input.disabled = true;
        
        // Dealing 2 cards to the dealer and player, with Timeout's to simulate
        // a real BlackJack game's flow.
        setTimeout(function () {
            dealCard(player_hand,"player");
        },1000)
        setTimeout(function () {
            dealCard(dealer_hand,"dealer");
        },2000)
        setTimeout(function () {
            dealCard(player_hand,"player");
        },3000)
        setTimeout(function () {
            dealCard(dealer_hand,"dealer");
            hit_button.disabled = false;
            stand_button.disabled = false;
        },4000)
    }

    hit_button.onclick = function() {
        // The Hit button deals a card to the player and checks if
        // the player has gone above 21, resulting in a default loss.
        dealCard(player_hand,"player")
        if (player_total>21) {
            hit_button.disabled = true;
            stand_button.disabled = true;
            setTimeout(function () {playerWinLose("l");},1500);
        }
    };

    stand_button.onclick = function() {
        // The Stand button disables the Hit and Stand buttons and
        // deals cards to the dealer according to the rules outlined in dealerPlays()
        hit_button.disabled = true;
        stand_button.disabled = true;
        dealerPlays();
    }

    newRound_button.onclick = function() {
        newRound();
    }

    // Main Functions

    function dealCard(hand,pd) {
        // Deals a random card from the deck, along with a random symbol to the input hand
        // Sends the new hand to evalHand() to update the hand's value
        // Displays this new value and the card through displayHand() and displayLastCard()
        const deck = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"];
        const symbol = ["H","D","C","S"];
        hand.push(deck[Math.floor(Math.random()*deck.length)] + 
        symbol[Math.floor(Math.random()*symbol.length)]);
        
        if (pd=="player") {
            evalHand(player_hand,player_total,pd)
        } else if (pd=="dealer") {
            evalHand(dealer_hand,dealer_total,pd)
        }

        displayHand(pd);
        displayLastCard(hand,pd);
    }

    function evalHand(hand,total,pd) {
        // Evaluates the input hand's value based on conventional BlackJack rules.
        total = 0;
        let countA = 0; // This variable counts the number of Aces in a hand.
        let handLength = hand.length;
        if ((pd == "dealer") && (handLength == 1)) {
            // If it's the dealer's first card, the hand's value is set to 0 as it is
            // not meant to be shown to the player.
            dealer_total = 0;
            return;
        } else if ((pd == "dealer") && (handLength == 2) && (hidden == true)) {
            // If it's the dealer's second card, this block only evaluates the
            // second card's value and ignores the first. It evaluates the card by
            // looking at the first letter of the card's name (disregarding the symbol).
            hidden = false;
            cardValue = hand[1].substring(0, hand[1].length - 1);
            if (Number.isInteger(parseInt(cardValue))) {
                total += parseInt(cardValue);
            } else if ((cardValue == "J") || (cardValue == "Q") || (cardValue == "K")) {
                total += 10;
            } else if (cardValue == "A") {
                countA++;
            }
        } else {
            // This simply evaluates every card's value in the hand
            for (var i=0; i < handLength; i++) {
                cardValue = hand[i].substring(0, hand[i].length - 1);
                if (Number.isInteger(parseInt(cardValue))) {
                    total += parseInt(cardValue);
                } else if ((cardValue == "J") || (cardValue == "Q") || (cardValue == "K")) {
                    total += 10;
                } else if (cardValue == "A") {
                    countA++;
                }
            }
        }
        
        // This determines the values of the Aces in the hand. Either 11 or 1.
        if (countA) {
            if (countA > 1) {
                if (total <= (10-(countA-1))) {
                    total += 11+(countA-1);
                } else {
                    total += countA;
                }
            }  else if (countA == 1) {
                if (total <= 10) {
                    total += 11;
                } else {
                    total += 1;
                }
            }
        }

        if (pd=="player") {
            player_total = total;
        } else {
            dealer_total = total;
        }
    }

    function playerWinLose(wlt) {
        // This is the end of a round
        // Adds/subtracts the wager from the balance and displays the winner
        if (wlt=="w") {
            wager_input.placeholder = "Player Wins";
            winner_display.innerHTML = "WINNER!";
            balance += wager;
            balanceChange("+");
            console.log("Player wins.");
        } else if (wlt=="l") {
            wager_input.placeholder = "Dealer Wins";
            winner_display.innerHTML = "DEFEATED";
            balance -= wager;
            balanceChange("-");
            console.log("Dealer wins.");
        } else {
            wager_input.placeholder = "Push";
            winner_display.innerHTML = "PUSH";
            console.log("Push.");
        }

        // Disables and removes the hit and stand buttons
        hit_button.disabled = true;
        stand_button.disabled = true;
        hit_button.style.display = "none";
        stand_button.style.display = "none";
        // Makes only the New Round button visible
        newRound_button.style.display = "block";
        wager_input.style.display = "none";
        // Removes the totals while making the winner display visible
        document.querySelector("#player_total").style.display = "none";
        document.querySelector("#dealer_total").style.display = "none";
        winner_display.style.display = "block";

        if (balance == 0) {
            setTimeout(function () {
                warning.children[0].innerHTML = "Tip: Refreshing the page resets balance"
                warning.style.display = "block";
            }, 1000)
        }
        
    }

    function balanceChange(sign) {
        // Breifly displays the change on balance. The increase (green) or decrease (red).
        setTimeout(function () {
            balance_display.textContent = sign + "$" + wager.toLocaleString();
            if (sign=="+") {
                balance_display.className = "green";
            } else {
                balance_display.className = "red";
            }
        },500);

        setTimeout(function () {
            balance_display.textContent = "$" + balance.toLocaleString();
            balance_display.className = "";
        },2000);
    }

    function displayHand(pd) {
        // Displays the hand's total value
        if (pd=="player") {
            document.querySelector("#player_total").innerHTML = player_total;
        } else {
            document.querySelector("#dealer_total").innerHTML = dealer_total;
        }
    }

    function dealerPlays() {
        // A function to deal cards to the dealer.

        // This block shows the player the dealer's first card and the hands new total value
        displayHiddenCard()
        evalHand(dealer_hand,dealer_total,"dealer");
        displayHand("dealer");

        // This block deals cards to the dealer until 16, and stands on 17.
        // Increases the Timeout length of checkWinner() on every itteration 
        // through the "wait" variable.
        dealerDeals();
        let wait = 1;
        function dealerDeals() {
            if ((dealer_total < player_total) && (dealer_total <= 16)) {
                setTimeout(function () {
                    dealCard(dealer_hand,"dealer");
                    dealerDeals();
                    wait++;
                },1500);
            } else {
                setTimeout(function () {checkWinner();},1200);
            }
        }
    }

    function checkWinner() {
        // Checks to see who has won the round based on hand values.
        if ((player_total > dealer_total) && (player_total <= 21)) {
            playerWinLose("w");
        } else if ((dealer_total > 21) && (player_total <= 21)) {
            playerWinLose("w");
        } else if (dealer_total == player_total) {
            playerWinLose("t");
        } else {
            playerWinLose("l");
        }
    }

    function displayLastCard(hand,pd) {
        // Creates an image element to display the just-dealt card to the input hand
        let img = document.createElement('img');
        let card = hand[hand.length -1];
        img.className = "fade-right";

        // Displays the back of a card for the dealer's first card
        if ((pd == "dealer") && (dealer_hand.length == 1)) {
            card = "red_back";
            img.className = "fade-right hidden";
        }

        // Console logs the card name
        console.log(pd+" delt "+card);
        img.src = "deck/"+card+".png";
        img.id = "card";
        img.alt = "Card: " + card;
        document.getElementById(pd+"_hand").appendChild(img);

        // This block updates the hand div's width to fit the number of cards
        let cardWidth = document.getElementById("card").offsetWidth;
        document.getElementById(pd+"_hand").style.width = (hand.length*cardWidth-(hand.length-1)*(cardWidth/3)).toString()+"px";
    }

    function displayHiddenCard() {
        // Replaces the back-face card shown by the dealer's first card with the real card
        hiddenCard = document.querySelector(".fade-right.hidden");
        hiddenCard.className = "fade-out-left hidden"
        setTimeout(function () {
            let img = document.createElement('img');
            let card = dealer_hand[0];
            img.src = "deck/"+card+".png";
            img.id = "card";
            img.alt = "Card: " + card;
            img.className = "fade-left";
            hiddenCard.parentNode.replaceChild(img,hiddenCard);
        },450);
    }

    function newRound() {
        // Sets all variables to initial values, makes visible the hand totals rather
        // than the winner display. Enables and makes visible
        // only the wager input and place_bet button.
        document.querySelectorAll('#card').forEach(e => e.remove());
        wager_input.disabled = false;
        hit_button.disabled = true;
        stand_button.disabled = true;
        place_bet.disabled = false;
        wager_input.placeholder = "Your Wager";
        if (balance==0) {
            place_bet.disabled = true;
            wager_input.disabled = true;
            wager_input.placeholder = "No Funds"
        }
        place_bet.style.display = "block";
        hit_button.style.display = "none";
        wager_input.style.display = "block";
        newRound_button.style.display = "none";
        stand_button.style.display = "none";
        player_hand = [];
        dealer_hand = [];
        player_total = 0;
        dealer_total = 0;
        hidden = true;
        winner_display.innerHTML = "";
        winner_display.style.display = "none";
        document.querySelector("#dealer_total").style.display = "block";
        document.querySelector("#player_total").style.display = "block";
        document.querySelector("#dealer_total").innerHTML = "▲ Dealer's Hand ▲";
        document.querySelector("#player_total").innerHTML = "▼ Player's Hand ▼";
    }
}
