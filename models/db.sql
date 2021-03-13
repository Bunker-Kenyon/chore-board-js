--First Create the database
CREATE DATABASE choreboard;

--Connect to the database
\c choreboard

--Create household table
CREATE TABLE public.household (
	household_id SERIAL NOT NULL PRIMARY KEY,
	household VARCHAR(250) NOT NULL UNIQUE
);

--Create User table
CREATE TABLE public.users (
	user_id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
	display_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(10) NOT NULL,
    user_xp INT NOT NULL,
    household_id INT REFERENCES public.household(household_id)
);

--Create table reward_library
CREATE TABLE public.reward_library (
    reward_library_id SERIAL NOT NULL PRIMARY KEY,
    reward_name VARCHAR (100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    household_id INT NOT NULL REFERENCES public.household(household_id)
);

--Create table chore_library
CREATE TABLE public.chore_library (
    chore_library_id SERIAL NOT NULL PRIMARY KEY,
    chore_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    xp_reward INT NOT NULL,
    reward_library_id INT NOT NULL REFERENCES public.reward_library(reward_library_id),
    household_id INT NOT NULL REFERENCES public.household(household_id)
);

--Create Rewards table
CREATE TABLE public.rewards (
    rewards_id SERIAL NOT NULL PRIMARY KEY,
    rewards_name VARCHAR (100) NOT NULL,
    description TEXT NOT NULL,
    awarded_to_user_id INT REFERENCES public.users(user_id),
    household_id INT REFERENCES public.household(household_id)
);

--Create Chores Table
CREATE TABLE public.chores (
    chore_id SERIAL NOT NULL PRIMARY KEY,
    chore_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    rewards_id INT NOT NULL REFERENCES public.reward_library(reward_library_id),
    date_completed DATE,
    xp_reward INT NOT NULL,
    assigned_to_user_id INT REFERENCES public.users(user_id),
    household_id INT REFERENCES public.household(household_id)
);

--Get chores from chore library based on household id
SELECT chore_library.chore_library_id, chore_library.chore_name, chore_library.description, chore_library.xp_reward, 
        reward_library.reward_library_id, reward_library.reward_name, household.household_id, household.household_name
    FROM chore_library
    LEFT JOIN reward_library
    ON chore_library.reward_library_id=reward_library.reward_library_id
    LEFT JOIN public.household
    ON chore_library.household_id=household.household_id
    Where household.household_id = 1
    ORDER BY chore_library.chore_name;