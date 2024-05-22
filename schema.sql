    CREATE TABLE user (
        id  VARCHAR(50),
        username VARCHAR(50),
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL
    );UPDATE user SET username = 'manu' WHERE password = 'k0JSOU5JLmcZ6RJ';
