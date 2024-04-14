
import assert from 'assert';
import { validate_fields } from '../utils/validate-fields.mjs';
import supertest from 'supertest';
import { Users } from '../model/Users.mjs';

var super_request = supertest("http://localhost:8820")

describe('Users - Tests with Supertest', function(){
    describe('Test Models', function(){
        describe('Users', function(){
            let cname = 'Noureldeen Fahmy';
            let cemail = 'nedsfahmy@mun.ca';
            let cpass = 'new123456'
            var user = new Users(cname, cemail, cpass);       

            it('Success 1. POST - Register User(host)', async function(){
                let data = {
                    name: 'John Doe', 
                    email: 'jdoe@mun.ca', 
                    password: 'New123456', 
                    isHost: true,
                }

                let res_post = await super_request.post('/register')
                    .send(data)
                assert.strictEqual(res_post.text, 'User correctly inserted in the Database.');               
            });
            it('Success 2. POST - Register User(player)', async function(){
                let data = {
                    name: 'Nour', 
                    email: 'yes12@mun.ca', 
                    password: 'New123456', 
                }

                let res_post = await super_request.post('/register')
                    .send(data)
                assert.strictEqual(res_post.text, 'User correctly inserted in the Database.');   
                let data2 = {
                    name: 'Fahmy', 
                    email: 'Fahmy12@mun.ca', 
                    password: 'New123456', 
                }

                let res_post2 = await super_request.post('/register')
                    .send(data2)            
            });

            it('Success 3. POST - Login User', async function(){
                let data = {
                    name: 'John Doe', 
                    email: 'jdoe@mun.ca', 
                    password: 'New123456', 
                }

                let res_post = await super_request.post('/login')
                    .send(data)
                assert.strictEqual(res_post.text, 'Login successful.');               
            });
            it('Success 4. POST - Login User (Wrong Password)', async function(){
                let data = {
                    name: 'John Doe', 
                    email: 'jdoe@mun.ca', 
                    password: 'WrongPassword', // Use a wrong password here
                }
            
                let res_post = await super_request.post('/login')
                    .send(data)
                
                
                assert.strictEqual(res_post.text, 'Invalid password.');               
            });
            it('Success 5. Get - player info', async function(){
                let data = {
                    name: 'Nour',
                }
            
                let res_post = await super_request.get('/info/'+data.name)
                    .send(data)
                
                
                
                assert.strictEqual(res_post.statusCode, 200, 'Expected status code to be 200');

                        });
            it('Success 6. Post - Create game ', async function(){
                let data = {
                    name: 'John Doe',
                    gameName: 'firstgame', 
                }
            
                let res_post = await super_request.post('/create_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 200, 'Expected status code to be 200');              
            });

            it('Success 7. Post - Create game(game name already in use) ', async function(){
                let data = {
                    name: 'John Doe',
                    gameName: 'firstgame', 
                }
            
                let res_post = await super_request.post('/create_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 403, 'Expected status code to be 403');              
            });
            it('Success 8. Post - Create game(user not host) ', async function(){
                let data = {
                    name: 'Nour',
                    gameName: 'firstgame', 
                }
            
                let res_post = await super_request.post('/create_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 403, 'Expected status code to be 403');              
            });

            it('Success 9. Post - join game ', async function(){
                let data = {
                    name: 'Nour',
                    gameName: 'firstgame', 
                }
            
                let res_post = await super_request.post('/join_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 200, 'Expected status code to be 200');   
                let data2 = {
                    name: 'Fahmy',
                    gameName: 'firstgame', 
                }
            
                let res_post2 = await super_request.post('/join_game/'+data2.gameName)
                    .send(data2)           
            });
             it('Success 10. Post - join game(player is lareday in game) ', async function(){
                let data = {
                    name: 'Nour',
                    gameName: 'firstgames', 
                }
            
                let res_post = await super_request.post('/join_game/'+data.gameName)
                    .send(data)
                
                
                assert.strictEqual(res_post.statusCode, 300, 'Expected status code to be 300');              
            });
            it('Success 11. Post - buy stock ', async function(){
                let data = {
                    name: 'Nour',
                    symbol: 'AAPL', 
                    quantity: '1',
                }
            
                let res_post = await super_request.post('/buy/'+data.name)
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
                let data = {
                    name: 'Nour',
                    symbol: 'AAPL', 
                    quantity: '1',
                }
            
                let res_post = await super_request.post('/sell/'+data.name)
                    .send(data)
                
                
                assert.strictEqual(res_post.text, `Successfully sold ${data.quantity} shares of ${data.symbol}`);               
            });
            
            it('Success 13. Get - Game winner', async function(){
                let data = {
                    gameName: 'firstgame',
                    
                }
            
                let res_post = await super_request.get('/game_winner/'+data.gameName)
                    .send(data)
                console.log(res_post.text)
                
                assert.strictEqual(res_post.text, `The winner of game firstgame is Fahmy.`);               
            });
           
        //     it
        //     it('Success 4. POST - Valid User, GET - /contacts (Greater 0), DELETE - User', async function(){
        //         let data = { 
        //             name: 'Amilcar Soares', 
        //             email: 'amilcarsj@mun.ca', 
        //             tel: '709-221-6612', 
        //             address: '230 Elizabeth Ave, St. John\'s, Newfoundland'
        //         };
        //         let res_post = await super_request.post('/contacts')
        //                                 .set('Content-Type', 'application/json')
        //                                 .send(data)
        //         let res_get = await super_request.get('/contacts')

        //         if (res_get.text.length < 1 ) {
        //             fail('There should be elements in the database');
        //         }
        //         let res_del = await super_request.delete('/contacts/'+data.name);
        //         strictEqual(res_del.text, 'Contact was deleted.');                
        //     });
        //     it('Success 3. POST - Valid User, GET - :name, DELETE - User', async function(){
        //         let data = {
        //             name: 'Bob Churchil', 
        //             email: 'bchurchil@mun.ca', 
        //             tel: '709-987-6543', 
        //             address: '50 Crosbie Road, St. John\'s, Newfoundland'
        //         };
        //         let res_post = await super_request.post('/contacts')
        //                             .set('Content-Type', 'application/json')
        //                             .send(data)
        //         let res_get = await super_request.get('/contacts/'+data.name)
        //         strictEqual(res_get.body.name, data.name);
        //         strictEqual(res_get.body.email, data.email);
        //         strictEqual(res_get.body.tel, data.tel);
        //         strictEqual(res_get.body.address, data.address);
        //         let res_del = await super_request.delete('/contacts/'+data.name);
        //         strictEqual(res_del.text, 'Contact was deleted.');                
        //     });
        //     it('Success 4. POST - Valid User, UPDATE - :name, GET - /:name, DELETE - User', async function(){
        //         let data = {
        //             name: 'Robert Doe', 
        //             email: 'rob@mun.ca', 
        //             tel: '709-917-6643', 
        //             address: '150 Torbay Road, St. John\'s, Newfoundland'
        //         };
        //         let up_data = {
        //             name: 'Robert Doe Jr', 
        //             email: 'robs@mun.ca', 
        //             tel: '709-917-6643', 
        //             address: '105 Torbay Road, St. John\'s, Newfoundland'
        //         };
        //         let res_post = await super_request.post('/contacts')
        //                             .set('Content-Type', 'application/json')
        //                             .send(data)
        //         let res_put = await super_request.put('/contacts/'+data.name)
        //                                 .set('Content-Type', 'application/json')
        //                                 .send(up_data)
        //         strictEqual(res_put.text,'Contact correctly updated.');
        //         let res_get = await super_request.get('/contacts/'+up_data.name)
        //         strictEqual(res_get.body.name, up_data.name);
        //         strictEqual(res_get.body.email, up_data.email);
        //         strictEqual(res_get.body.tel, up_data.tel);
        //         strictEqual(res_get.body.address, up_data.address);
        //         let res_del = await super_request.delete('/contacts/'+up_data.name);
        //         strictEqual(res_del.text, 'Contact was deleted.');                
        //     });            
         });        
    });
    
});