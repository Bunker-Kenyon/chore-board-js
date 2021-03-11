--First Create the database
CREATE DATABASE choreboard;

--Connect to the database
\c choreboard

--Create Chores Table
CREATE TABLE public.chores (
    chore_id SERIAL NOT NULL PRIMARY KEY,
    chore_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    rewards_id INT NOT NULL REFERENCES public.reward_library(id),
    date_completed DATE,
    xp_reward INT NOT NULL,
    assigned_to_user_id INT REFERENCES public.users(user_id)
);

--Create Rewards table
CREATE TABLE public.rewards (
    rewards_id SERIAL NOT NULL PRIMARY KEY,
    rewards_name VARCHAR (100) NOT NULL,
    description TEXT NOT NULL,
    awarded_to_user_id INT REFERENCES public.users(user_id)
);

--Create User table
CREATE TABLE public.user
(
	user_id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
	display_name VARCHAR(100) NOT NULL,
    user_type BOOLEAN NOT NULL,
    user_xp INT NOT NULL
    household_id INT REFERENCES public.household(household_id)
    
);

--Create household table
CREATE TABLE public.household (
	household_id SERIAL NOT NULL PRIMARY KEY,
	household VARCHAR(250) NOT NULL UNIQUE
);

--Create table reward_library
CREATE TABLE public.reward_library (
    reward_library_id SERIAL NOT NULL PRIMARY KEY,
    reward_name VARCHAR (100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    household_id INT NOT NULL REFERENCES piblic.household(household_id)
);

--Create table chore_library
CREATE TABLE public.chore_library (
    chore_library_id SERIAL NOT NULL PRIMARY KEY,
    chore_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    xp_reward INT NOT NULL,
    reward_library_id INT NOT NULL REFERENCES public.reward_library(reward_library_id),
    household_id INT NOT NULL REFERENCES piblic.household(id)
);


