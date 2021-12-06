# Memory Game

## Approach
Users can begin the memory game with log-in, which can be created automatically. 
There are 12 cards (4x3) of golden retriever pictures. 
Everytime a player finds two matching cards, the score goes up 100. When a player finds two unmatching cards, they lose 10 life, which starts from 100. 

A player can restart the game or log out. Once a player get all the matching cards, a pop-up meesage will show the score.

When a player logs in with an existing account (username), they can see the scores that are saved from the previous games and continue from that score. 


<hr>

## Technologies Used
### Backend
- Ruby on Rails
- Postgresql

link: https://jae-memory-game-api.herokuapp.com/users/jae <br>
github: https://github.com/jmsyoo/memory_game_backend

### Frontend
- React JS
- Scss
- Html
- Bootstrap
- Material UI

link: http://jae-memory-game-app.herokuapp.com/<br>
github: https://github.com/jmsyoo/memory_game_frontend

### Other
- PgAdmin
- Heroku

<hr>

## User Stories
As a user, I want to login.<br>
As a user, I want to see the total score from previous game and contiune to play.<br>
As a user, I want to have some time to observe the unmaching cards before they get flipped back.
