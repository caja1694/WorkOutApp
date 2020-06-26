-- Create a table to store user accounts in.
CREATE TABLE accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(128) NOT NULL,
	CONSTRAINT usernameUnique UNIQUE (username)
);

CREATE TABLE articles (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(250) NOT NULL,
	description VARCHAR(500) NOT NULL,
	content VARCHAR(8000) NOT NULL,
	username VARCHAR(50) NOT NULL,
	ownerId INT UNSIGNED,
);

CREATE TABLE workouts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	username VARCHAR(20) NOT NULL,
	ownerId INT UNSIGNED,
	createdAt VARCHAR(50),
	updatedAt VARCHAR(50),
);

CREATE TABLE exercises (
	exerciseID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	exercise VARCHAR(25) NOT NULL,
	timeOrWeight VARCHAR(10) NOT NULL,
	sets VARCHAR(10) NOT NULL,
	reps VARCHAR(10) NOT NULL,
	workoutID INT NOT NULL
	);
CREATE TABLE tokens (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	token VARCHAR(255) NOT NULL,
	userId INT UNSIGNED,
	CONSTRAINT userIdUnique UNIQUE(userId)
);
