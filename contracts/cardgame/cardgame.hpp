#include <eosio/eosio.hpp>

CONTRACT cardgame : public eosio::contract {

public:
using contract::contract;

    cardgame( eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds ):
		contract(receiver, code, ds),
		_users( receiver, receiver.value )	// provides code and scope
		{}

	ACTION login( eosio::name username );

private:
	TABLE user_info
	{
		eosio::name username;
		uint16_t win_count = 0;
		uint16_t lost_count = 0;

		auto primary_key() const { return username.value; }
	};

	typedef eosio::multi_index<eosio::name("users"), user_info> users_table;
	users_table _users;
};
