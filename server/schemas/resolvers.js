// Import Models
const { User, Book} = require('../models')

// Automatically Relay Errors to Client
const { AuthenticationError } = require('apollo-server-express');

// Import JWTs
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
      // get specific user
      me: async (parent, args, context) => {
          if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
              .select('-v -password')

              return userData;
          }
          throw new AuthenticationError('Not logged in');
      }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
          
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
          
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const token = signToken(user);
            return { token, user };
          }

    }
  };
  
  module.exports = resolvers;