# A repository for CS3100 term project

# Launching  
You have to have a database called Stocks-game and creating two collections in it called Users and Games.

# File explanation
I have 3 files Utils, model and controller. 
## Model
It has two files each to model a data structure one for games and one for Users.
## Controller
It has two files each to for each of the data structures one of the controllers is for Games and the other for Users.
## Utils
Just has the validate-fields and db for getting the database.

# Video 
* in the video I explained my site and how it runs I just forgot to point out fro some feature you have to reload the website in order for it to render
* I also forgot to talk about some feautures like the info one but you can see player info at the top of the screen
* I showed the buy/sell feature
* viewing current player porfolio and competitors portfolio, this also shows that I keep track of players portfolios
* regstering and logging in
* starting cash you can see at the left of the player that the portfolio is filled with cash
* showed the winner at the end of the game and ended it as well
* showed the fees for selling stock
* showed that host is able to create a game.


# Explaining each test
### Test 1
This test just registers the user as a host.
### Test 2
This test just registers the user as a player and registers another one for later use.
### Test 3
This test checks to see if the login works.
### Test 4
This test checks to see if a user inputing wrong password returns a wrong password inputted prompt.
### Test 5
This test checks to see if the player info feature works.
### Test 6
This test is to create a game using the Host created.
### Test 7
This test is to create a game using the same name test sees if it returns correct error status.
### Test 8
This test is to create a game using a player the test sees if it returns correct error status.
### Test 9
This test checks if the players can join game and adds both users created.
### Test 10
Checks to see if the code return correct error status when player is alreday in a game.
### Test 11
This buys stock for the player Nour
### Test 12
This sells stock for the player Nour 
### Test 13
This checks to see game winner and it will be the other player Fahmy because of the 10 dollar fee when selling stock.

# Things I will try to work on for next iteration
* I will make it so the Host can adjust lots of settings such as the fee price, max amount if players in lobby, match length and etc..
* I will try to implement the session for each player when logging in so that the system automticallly knows who is buying or selling or etc..
* Adding a timer for each game
* I will try to add a history feauture for players
* I want to make the game run more smoothly as well
* I want the game to look better and seem more modern

