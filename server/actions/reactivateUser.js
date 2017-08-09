import {User} from 'src/server/services/dataService'

export default function reactivateUser(id) {
  return User.get(id).updateWithTimestamp({active: true})
}
