# Project proposal

## Descrition

From a players prespective its an engaging trading game presents a thrilling journey marked by startegic thinking and dynamic experience. Players commence by starting registering for a game , recviveing a set amount of cash in there portfolio account. The primary objecvtive of the player is to navigate the market with the initail cash given to startegically sell and buy stocks at the current NYSE prices. The challenge is to diversify your your portfolio and adapting to the market in order to maximize the players portfolio.

From the admins perspective they manage the starting environment of the game and how much cash is added into each of the players portfolio. Admin users have the authority to start/create games, authority over the configuration of the games parameters such as the time duration, starting amounts and other customizable features. They over see the player registration, ensuring the game is fair for each of the players and enforcing rules.

## Screens

### Host screen and Players portfolio page
![Host page](https://github.com/CS3100W24/project-nedsfahmy/assets/113135482/b1f60c7e-7432-4d43-a2c3-5bf4656e2d35)

### players screen and stock market page
![Player screen](https://github.com/CS3100W24/project-nedsfahmy/assets/113135482/20d1be21-75a6-44ae-9352-a680fe8a3cab)

## Features
| ID | Name                   | Access by    | Short description                                                  | Expected Implementation       | Source of Idea                |
|----|------------------------|--------------|--------------------------------------------------------------------|-------------------------------|-------------------------------|
| 01 | Player registration    | Player       | Registering player into game                                       | Must implement                | Project instructions          |
| 02 | Game duration          | Admin        | Duration of the game                                               | Highly likely                 | Project instructions          |
| 03 | Candles                | Player       | It will show candlestick in chart                                  | Likely                        | Project instructions          |
| 04 | Starting cash          | Admin        | The admin picking the starting cash of each player                 | Must implement                | Project instructions          |
| 05 | Buy and sell           | Player       | Allows player to buy and sell their stock                          | Must implement                | Project instructions          |
| 06 | Portfolio track        | Player       | Allows player to keep track and view their portfolio               | Must implement                | Project instructions          |
| 07 | Declare winner         | Player/Admin | Shows winner at the end of current game                            | Must implement                | Project instructions          |
| 08 | Maintain Info          | Player       | Maintains player login and information                             | Must implement                | Project instructions          |
| 09 | Create games           | Admin        | Create a starting game                                             | Must implement                | Project instructions          |
| 10 | End Game               | Admin        | Allows admin to end game                                           | Highly likely                 | Other games have this feature |
| 11 | ban/unban player       | Admin        | Allows admin to ban/unban players                                  | Likely                        | Other games have this feature |
| 12 | Private/public game    | Admin        | Allows admin to make game public or private                        | Likely                        | other games have this feature |
| 13 | Viewing comp portfolio | Player       | Player can look at competitors                                     | Likely                        | Project instructions          |
| 14 | Buy and sell fees      | Player       | Player gets fees for every buy and sell completed                  | Likely                        | Project Instructions          |
| 15 | Track players          | Admin        | Admin can track each individual player                             | Likely                        | Project Instructions          |
| 16 | Trade track/ history   | Player       | Record and display players trade history                           | Highly likely                 | In trading apps               |
| 17 | Game tutorial          | Player       | Shows the player a tutorial of the game                            | Not likely                    | In most games                 |
| 18 | Player rankings        | Player/Admin | Shows the ranking of players using cash in account                 | highly likely                 | In most games                 |
| 19 | Player achievements    | Player       | Shows player reaching milestones                                   | Not likely                    | In video games                |
| 20 | Order types            | Player       | Automates player pre determined trades(stop-limit/stop-loss)       | Not likely                    | In trading apps               |
| 21 | Educational resources  | Player       | Access to eucational material to help player with trading          | likely                        | In trading apps               |
| 22 | Multiple game modes    | Admin        | Create different envioremnts for players                           | Likely                        | In video games                |
| 23 | Game reset             | Admin        | Resets current game to the start                                   | Likely                        | In most games                 |
| 24 | Admin activity logs    | Admin        | Allows admin to view all the players interactions                  | Likely                        | In most admin features        |
| 25 | Mirror trading         | Player       | Allow player to mirror another players trades and stop at anytime  | Not likely                    | In trading apps               |
| 26 | Challenge rewards      | Player       | If player complete a certain challenge they get rewarded           | Not likely                    | In video games                |
| 27 | Sound effects          | Player/admin | Allows users to enable/disable app sounds                          | Not likely                    | In most apps                  |
| 28 | Socail features        | Player       | Allows communication between players such as chats, friends,etc..  | Not likely                    | Social media/video games      |
| 29 | Trading competitions   | Player       | Competitions between players for rewards at the end of competition | Not likely                    | Video games                   |
| 30 | Trading bots           | Player/Admin | Admin can add bots into game to compete with players               | Probably won't be implemented | Video games                   |

## Tools and packages
- I need to find a chart packages for displaying the charts of stock it might be D3.js or chart.js **(nessecary)**
- For realtime communication between the server and the users I may use Socket.io.**(nessecary)**
- I also might need a database for storage which I will find later. **(nessecary)**
- Will need something to setup server such as express. **(nessecary)**
- Will need a package to fetch data will probably use axios. **(nessecary)**
- Might also need a tool/package to make any financial analysis for the game. **(nessecary)**
- Might also need package to help me build a smooth backend for the app.
- Might need something to handel api keys.


## APP API

1. GET /portfolio?player=*playername*&game=*gameid*  
     responds with the current portfolio of the player
   
2. POST /sell?player=*playername*&game=*gameid*&stock=tickersymbol*&quant=*nnn*
    requests that a pretend sale is made within the game
    responds indicating stock sale success or not and the price
   
3. POST /buy?player=playername&game=gameid&stock=tickersymbol&quant=nnn
     This could request a pretend purchase of a certain quantity of a stock within the game.
     The response could indicate whether the stock purchase was successful or not and the price.
   
4. GET /history?player=playername&game=gameid
     This could return a history of the player’s transactions in the game.

5. POST /register?player=*playername*&password=*password*
     This API call registers a new player with the given player name and password. 
     The server should respond with a status message indicating whether the registration was successful.
   
6. POST /game/init?game=*gameid*&host=*hostid*
     This API call initializes a new game with the given gameid for the specified host. 
     The server should respond with a status message indicating whether the game initialization was successful.
   
7. POST /game/join?game=*gameid*&player=*playername*
     This call would add a player to an already initialized game. 
     The server should respond with a status message indicating whether the player was successfully added. 

## Stock API
1. Alpha Vantage API: GET https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo
2. Polygon.io: GET https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&locale=us&apiKey=*
3. Stockdata.org: GET https://api.stockdata.org/v1/data/quote?symbols=AAPL,TSLA,MSFT&api_token=YOUR_API_TOKEN
