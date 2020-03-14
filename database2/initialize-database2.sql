-- Create a table to store user accounts in.
CREATE TABLE accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(30) NOT NULL,
    createdAt VARCHAR(50),
    updatedAt VARCHAR(50),
	CONSTRAINT usernameUnique UNIQUE (username)
);

CREATE TABLE workouts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	username VARCHAR(10) NOT NULL,
	createdAt VARCHAR(50),
    updatedAt VARCHAR(50)
);

CREATE TABLE exercises (
	exerciseID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	exercise VARCHAR(50) NOT NULL,
	timeOrWeight VARCHAR(10) NOT NULL,
	sets VARCHAR(10) NOT NULL,
	reps VARCHAR(10) NOT NULL,
	workoutId INT NOT NULL
);



-- Create a dummy account for testing.
INSERT INTO accounts (username, email, password) VALUES ("Alice", "alice@gmail.com", "abc123");

-- Create a dummy workout for testing.

INSERT INTO workouts (title, username, createdAt) VALUES ("FIRST WORKOUT FROM DB", "Alice", "20-03-14");
INSERT INTO workouts (title, username, createdAt) VALUES ("Second WORKOUT FROM DB", "Alice", "20-03-14");

INSERT INTO exercises(exercise, timeOrWeight, sets, reps, workoutId) VALUES("benchpress", "80kg", "4", "8", 1);