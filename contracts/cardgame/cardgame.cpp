#include "gameplay.cpp"

void cardgame::login( eosio::name username )
{
    // ensure this is authorized by player
    eosio::require_auth( username );

    // Create a record in the table if the player doesn't exist in our app yet
    auto user_iterator = _users.find( username.value );

    if( user_iterator == _users.end()){
        _users.emplace( username, [&](auto& new_user){
            new_user.username = username;
        });
    }
}