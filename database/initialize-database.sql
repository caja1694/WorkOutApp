-- Create a table to store user accounts in.
CREATE TABLE accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(30) NOT NULL,
	CONSTRAINT usernameUnique UNIQUE (username)
);

CREATE TABLE articles (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(500) NOT NULL,
	description VARCHAR(500) NOT NULL,
	content VARCHAR(1600) NOT NULL,
	username VARCHAR(50) NOT NULL
);

CREATE TABLE workouts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	exercise VARCHAR(10) NOT NULL,
	timeOrWeight VARCHAR(10) NOT NULL,
	sets VARCHAR(10) NOT NULL,
	reps VARCHAR(10) NOT NULL,
	username VARCHAR(10) NOT NULL
);

-- Create a dummy account for testing.
INSERT INTO accounts (username, email, password) VALUES ("Alice", "alice@gmail.com", "abc123");

INSERT INTO workouts (exercise, timeOrWeight, sets, reps, username) VALUES ("Benchpress", "80 kg", "4", "10", "Alice");

-- Create a dummy article for testing.
INSERT INTO articles (title, description, content, username) VALUES ("Avoiding the Gym? Here's a Week of Free Follow-Along Workouts!", 
"COVID-19 got you skipping the weight room or cardio machines? Here's a full seven days' worth of our most popular fast, fun, and intense workouts you can do at home. 
Just press play!","When infection is in the air both conversationally and literally—going to the gym can sound anything but healthy. What's a fit guy or gal supposed to do? 
Sure, you could take the old a few push-ups here, a few bodyweight squats there, a few arm circles and jumping jacks when I remember to approach. It's definitely better than nothing, 
but is it enough to give you that Yes, I did something today feeling? Not by a long shot.While everyone else is out there scrubbing lat pull-down handles with bleach wipes, 
take this opportunity to explore the exploding world of online follow-along workouts. We've got you covered with seven free workouts from BodyFit Elite. Each one requires minimal 
equipment and hits the sweet spot of cardio and strength training.
Do them with your partner, your kids, or on your own. Just do them! And if you enjoy them, you can dig deeper into any of the full programs with a free 7-day trial of BodyFit.", 
"Dennis");
INSERT INTO articles (title, description, content, username) VALUES ("5 Mistakes Robbing You of Gains and How to Fix Them", 
"Try these smart course correctors to get your progress in the gym back on track.",
"Everyone wants to build muscle, but if you want to take your physique beyond newbie gains, you need to rethink your strategy. 
Here are the most common mistakes you're probably making and some suggestions for how to fix them:

1. You Don't Prioritize The Right Exercises At The Beginning Of Your Workout
You walk into the gym and start your workout by doing every biceps curl variation you know, before you even think about pulling exercises for your back. 
Then, you wonder why your back muscles are lagging behind.

How To Fix It
Prioritize compound movements at the beginning of your workout. Compound movements like chin-ups, presses, rows, squats, 
and deadlifts are your bread and butter exercises, the ones that bring you the most bang for your buck. They engage several muscles at a time, 
increasing the metabolic demand made by your workout and stimulating more overall growth.

The question of which compound exercise to perform first is easy to answer: Prioritize the exercise you want to get strongest in. For instance, 
if you have both a barbell bench press and a barbell shoulder press on your training menu and you're trying to develop your delts, you would start with shoulder presses.",
 "Jacob");
