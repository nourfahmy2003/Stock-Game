
import assert from 'assert';
import supertest from 'supertest';


var super_request = supertest.agent("http://localhost:8820")

describe('Users - Tests with Supertest', function(){
    describe('Test Models', function(){
        describe('Users', function(){     

            it('Success 1. POST - Register User(host)', async function(){
                let data = {
                    username: 'John Doe',  
                    password: 'New123456', 
                }

                let res_post = await super_request.post('/register')
                    .send(data)
                let change =  await super_request.post('/change_player')
                 assert.strictEqual(change.status, 200 )
                assert.strictEqual(res_post.text, 'Found. Redirecting to ./Pages/player.html');  
                            
            });
            it('Success 2. Post - Create game ', async function(){

                
                let data = {
                    gameName: 'firstgame', 
                }
            
                let res_post = await super_request.post('/create_game/'+data.gameName)
                    .send(data)
                
                assert.strictEqual(res_post.status, 200);              
            });
            it('Success 3. POST - Register User(player)', async function(){
                await super_request.get('/logout') 
                let data = {
                    username: 'Nour',  
                    password: 'New123456', 
                }

                let res_post = await super_request.post('/register')
                    .send(data)
                let data2 = {
                        username: 'Fahmy',  
                        password: 'New123456', 
                    }
                await super_request.get('/logout')
    
                let res_post2 = await super_request.post('/register')
                        .send(data2)  
                assert.strictEqual(res_post.text, 'Found. Redirecting to ./Pages/player.html');   
                          
            });
            it('Success 4. POST - Login User', async function(){
                await super_request.get('/logout') 
                let data = {
                    username: 'John Doe', 
                    password: 'New123456', 
                }

                let res_post = await super_request.post('/login')
                    .send(data)
                assert.strictEqual(res_post.text, 'Found. Redirecting to ./Pages/host.html');               
            });
            it('Success 5. POST - Login User (Wrong Password)', async function(){
                await super_request.get('/logout') 
                let data = {
                    username: 'John Doe',  
                    password: 'WrongPassword', // Use a wrong password here
                }
            
                let res_post = await super_request.post('/login')
                    .send(data)
                
                
                assert.strictEqual(res_post.text, 'Invalid password.');               
            });
            it('Success 6. Get - player info', async function(){
                let data = {
                    name: 'Nour',
                }
            
                let res_post = await super_request.get('/info/'+data.name)
                    .send(data)
                
                
                
                assert.strictEqual(res_post.statusCode, 200, 'Expected status code to be 200');

                        });
            

            it('Success 7. Post - Create game(game name already in use) ', async function(){
                let data = {
                    gameName: 'firstgame', 
                }
            
                let res_post = await super_request.post('/create_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 403, 'Expected status code to be 403');              
            });
            it('Success 8. Post - Create game(user not host) ', async function(){
                let login_data = {
                    username: 'Nour',  
                    password: 'New123456'
                }
            
                let login_post = await super_request.post('/login')
                    .send(login_data)
                let data = {
                    gameName: 'firsttry', 
                }
            
                let res_post = await super_request.post('/create_game/'+data.gameName)
                    .send(data)
                
                login_post
                assert.strictEqual(res_post.statusCode, 403, 'Expected status code to be 403');              
            });

            it('Success 9. Post - join game ', async function(){
                let data = {
                    username: 'Nour',
                    gameName: 'firstgame', 
                }
            
                let res_post = await super_request.post('/join_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 200, 'Expected status code to be 200'); 
                let login_data = {
                    username: 'Fahmy',  
                    password: 'New123456', 
                }
            
                let login_post = await super_request.post('/login')
                    .send(login_data)  
                let data2 = {
                    username: 'Fahmy',
                    gameName: 'firstgame', 
                }
                
                let res_post2 = await super_request.post('/join_game/'+data2.gameName)
                    .send(data2)           
            });
             it('Success 10. Post - join game(player is already in game) ', async function(){
                let login_data = {
                    username: 'Fahmy',  
                    password: 'New123456', 
                }
            
                let login_post = await super_request.post('/login')
                    .send(login_data)  
                let data = {
                    gameName: 'firstgames', 
                }
            
                let res_post = await super_request.post('/join_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 300, 'Expected status code to be 300');              
            });
            it('Success 11. Post - buy stock ', async function(){
                let login_data = {
                    username: 'Fahmy',  
                    password: 'New123456', 
                }
            
                let login_post = await super_request.post('/login')
                    .send(login_data)  
                let data = {
                    symbol: 'AAPL', 
                    quantity: '1',
                }
            
                let res_post = await super_request.post('/buy')
                    .send(data)
                    
                let res_get = await super_request.get('/portolio/'+data.name)
                
                if (res_get.text.length < 1 ) {
                                fail('There should be elements in the database');
                            }
                else{
                    assert(true, 'There are elements in the database')
                }
                ;               
            });
            
            it('Success 12. POST - Sell stock', async function(){
                let login_data = {
                    username: 'Fahmy',  
                    password: 'New123456', 
                }
            
                let login_post = await super_request.post('/login')
                    .send(login_data)  
                let data = {
                    symbol: 'AAPL', 
                    quantity: '1',
                }
            
                let res_post = await super_request.post('/sell')
                    .send(data)
                
                
                assert.strictEqual(res_post.text, `Successfully sold ${data.quantity} shares of ${data.symbol}`);               
            });
            
            it('Success 13. Get - Game winner', async function(){

                let data = {
                    gameName: 'firstgame',
                    
                }
            
                let res_post = await super_request.get('/game_winner')
                    .send(data)
                
                assert.strictEqual(res_post.text, `The winner of game firstgame is Nour.`);               
            });           
         });        
    });
    
});