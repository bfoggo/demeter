# Syllable Structure App

The Syllable Structure App is a Go application that helps in keeping track of the syllable structure of sentences. It utilizes an SQLite database for storing and managing the syllable data.

## Project Structure

```
syllable-structure-app
├── cmd
│   └── main.go
├── pkg
│   ├── model
│   │   └── syllable.go
│   └── database
│       └── sqlite.go
├── scripts
│   └── schema.sql
├── go.mod
├── go.sum
└── README.md
```

## Files

### `cmd/main.go`

This file serves as the entry point of the application. It contains the `main` function that initializes the SQLite database, sets up the necessary dependencies, and starts the application.

### `pkg/model/syllable.go`

This file exports a struct `Syllable` which represents the syllable structure of a sentence. It contains properties and methods for managing and manipulating syllables.

### `pkg/database/sqlite.go`

This file exports a struct `SQLiteDB` which handles the interaction with the SQLite database. It contains methods for creating tables, inserting data, querying data, and managing transactions.

### `scripts/schema.sql`

This file contains the SQL schema for creating the necessary tables in the SQLite database. It is used by the `SQLiteDB` struct to initialize the database.

### `go.mod`

The `go.mod` file is the Go module file. It lists the dependencies of the project and their versions.

### `go.sum`

The `go.sum` file contains the expected cryptographic checksums of the content of specific module versions. It is used for module integrity verification.

## Usage

To set up and use the Syllable Structure App, follow these steps:

1. Clone the repository.
2. Install Go on your system if you haven't already.
3. Run `go mod tidy` to download the project dependencies.
4. Run the `schema.sql` script to create the necessary tables in the SQLite database.
5. Update the database connection details in the `main.go` file if needed.
6. Build and run the application using the command `go run cmd/main.go`.
7. Use the application to manage and track the syllable structure of sentences.

That's it! You now have the Syllable Structure App set up and ready to use. Enjoy managing your syllables!