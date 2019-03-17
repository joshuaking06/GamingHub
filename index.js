require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const PORT = process.env.PORT || 4000
const app = express()

app.use(bodyParser.json())

const games = []

app.use(
	'/graphql',
	graphqlHttp({
		schema: buildSchema(`
            type Game{
                _id: ID!
                title: String!
                genre: String!
                price: Float!
                releaseDate: String!
                rating: Float!
            }

            input GameInput{
                title: String!
                genre: String!
                price: Float!
                releaseDate: String!
                rating: Float!
            }

            type RootQuery{
                games: [Game!]!
            }

            type RootMutation{
                createGame(gameInput: GameInput): Game
            }

            schema{
                query: RootQuery
                mutation: RootMutation
            }
        `),
		rootValue: {
			games: () => {
				return games
			},
			createGame: (args) => {
				const game = {
					_id: Math.random().toString(),
					title: args.gameInput.title,
					genre: args.gameInput.genre,
					price: +args.gameInput.price,
					releaseDate: args.gameInput.releaseDate,
					rating: +args.gameInput.rating
				}
				games.push(game)
				return game
			}
		},
		graphiql: true
	})
)

app.listen(PORT, () => console.log(`express is running on port ${PORT}`))
