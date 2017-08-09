import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'
import {GraphQLError} from 'graphql/error'
import {GraphQLEmail, GraphQLDateTime} from 'graphql-custom-types'

import {GraphQLPhoneNumber} from 'src/server/graphql/models/types'
import {USER_ROLES} from 'src/common/models/user'
import {User as ThinkyUser, UserAvatar} from 'src/server/services/dataService'

import {User} from './schema'

import deactivateUser from 'src/server/actions/deactivateUser'

const InputUser = new GraphQLInputObjectType({
  name: 'InputUser',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    email: {type: new GraphQLNonNull(GraphQLEmail), description: 'The user email'},
    handle: {type: new GraphQLNonNull(GraphQLString), description: 'The user handle'},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The user name'},
    phone: {type: GraphQLPhoneNumber, description: 'The user phone number'},
    dateOfBirth: {type: GraphQLDateTime, description: "The user's date of birth"},
    timezone: {type: GraphQLString, description: 'The user timezone'},
  })
})

export default {
  deactivateUser: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)},
    },
    async resolve(source, {id}, {rootValue: {currentUser}}) {
      const currentUserIsAuthorized = (currentUser && Array.isArray(currentUser.roles) &&
        currentUser.roles.includes(USER_ROLES.ADMIN))

      if (!currentUser || !currentUserIsAuthorized) {
        throw new GraphQLError('You are not authorized to do that.')
      }

      return await deactivateUser(id)
    }
  },
  updateUser: {
    type: User,
    args: {
      user: {type: new GraphQLNonNull(InputUser)},
    },
    async resolve(source, {user}, {rootValue: {currentUser}}) {
      const currentUserIsAdmin = (currentUser && currentUser.roles && currentUser.roles.indexOf('admin') >= 0)
      if (!currentUser || (user.id !== currentUser.id && !currentUserIsAdmin)) {
        throw new GraphQLError('You are not authorized to do that.')
      }

      try {
        const updatedUser = await ThinkyUser
          .get(user.id)
          .updateWithTimestamp(user)
        return updatedUser
      } catch (error) {
        throw new GraphQLError('Could not update user, please try again')
      }
    },
  },
  updateUserAvatar: {
    type: GraphQLString,
    args: {
      base64ImgData: {type: new GraphQLNonNull(GraphQLString)},
    },
    async resolve(source, {base64ImgData}, {rootValue: {currentUser}}) {
      const jpegData = new Buffer(base64ImgData, 'base64')
      await UserAvatar.upsert({id: currentUser.id, jpegData})
      return currentUser.id
    },
  }
}
