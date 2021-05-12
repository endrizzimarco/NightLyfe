import { firebaseAuth, firebaseDb } from 'boot/firebase'
import { getDistance } from './functions/getDistance';

let messagesRef

const state = {
  userDetails: {}, // Current user info
  center: {}, // Current user coords
  users: {}, // Current users in a 1.5km radius
  messages: {}, // Holds messages for a conversation
  friends: {}, // Current user's friends
  pending: {}, // Current user's pending friend request
  signals: {}, // Current signals in a 1.5km radius
  events: {}, // All events in a 10km radius
  latestSignalChange: {signalId: null, type: null}, // Latest change to signals object
  latestEventChange: {eventId: null, type: null}, // Latest change to events object
  latestUserChange: {userId: null, type: null} // Latest change to users object
}

const mutations = {
  // Assigns userDetails' value to given payload
  setUserDetails(state, payload) {
    state.userDetails = payload
  },

   // Assigns center' value to current lat and long of user
  setUserCenter(state, payload) {
    state.center = payload
  },

  // Adds a user in 'users' object
  addUser(state, payload) {
    state.users[payload.userId] = payload.userDetails

    state.latestUserChange.userId = payload.userId
    state.latestUserChange.type = 'add'
  },

  // Removes a pending friend request from 'pending' object 
  removeUser(state, payload) {
    let userId = payload
    delete state.users[userId]

    state.latestUserChange.userId = userId
    state.latestUserChange.type = 'remove'
  },

  updateUserPosition(state, payload) {
    state.users[payload.userId].position = payload.userPosition

    state.latestUserChange.userId = payload.userId
    state.latestUserChange.type = 'move'
    state.latestUserChange.pos = payload.userPosition
    
  },

  // Adds a message in 'messages' object
  addMessage(state, payload) {
    state.messages[payload.messageId] = payload.messageDetails
  },

  // Assign an empty object to 'messages', effectively clearing all saved messages
  clearMessages(state) {
    state.messages = {}
  },

  // Adds a friend details to 'friends' object
  addFriend(state, payload) {
    state.friends[payload.userId] = payload.userDetails
  },

  // Modify friends' online status as they go offline / online
  updateFriendStatus(state, payload) {
    if(state.friends[payload.userId]) {
      state.friends[payload.userId].online = payload.online
    }
  },

  // Adds a pending friend request in 'pending' object
  addPending(state, payload) {
    state.pending[payload.userId] = payload.userDetails
  },

  // Removes a pending friend request from 'pending' object 
  removePending(state, payload) {
    let key = payload
    delete state.pending[key]
  },

  // Adds a signal in 'signals' object
  addSignal(state, payload) {
    state.signals[payload.signalId] = payload.signalDetails

    state.latestSignalChange.signalId = payload.signalId
    state.latestSignalChange.type = 'add'
  },

  // Removes a signal in the 'signals' object
  removeSignal(state, payload) {
    let signalId = payload
    delete state.signals[signalId]

    state.latestSignalChange.signalId = signalId
    state.latestSignalChange.type = 'remove'
  },

  // Adds an event in 'events' object
  addEvent(state, payload) {
    state.events[payload.eventId] = payload.eventDetails  
    
    state.latestEventChange.eventId = payload.eventId
    state.latestEventChange.type = 'add'
  },

  // Remove an event in the 'events' object
  removeEvent(state, payload) {
    let eventId = payload
    delete state.events[eventId]

    state.latestEventChange.eventId = eventId
    state.latestEventChange.type = 'remove'
  }
}

const actions = {
  /***********************
          AUTH
  ************************/
  /* Call firebase auth method to login a user */
  loginUser({}, payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        //pass
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  /* Call firebase auth method to logout a user */
  logoutUser({}, payload) {
    firebaseAuth.signOut()
  },
  
  /* Call firebase auth method to register a user with email and password and
    create an instance of the new user in the Realtime Database */
  registerUser({}, payload) {
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        let userId = firebaseAuth.currentUser.uid
        firebaseDb.ref('users/' + userId).set({
          name: payload.name,
          username: payload.username,
          email: payload.email,
        })
        firebaseDb.ref('status/' + userId).set({
          online: true,
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  /* This method is called when mounting the app and will therefore fire when the app is first opened or reloaded 
    It handles the actions to take depending on whether the user is logged in or logged out*/
  handleAuthStateChanged({ state, commit, dispatch }) {
    firebaseAuth.onAuthStateChanged(user => {
      // If user is logged in
      if(user) {
        let userId = firebaseAuth.currentUser.uid
        // Fetch details for current user
        firebaseDb.ref('users/' + userId).once('value', snapshot => {
          let userDetails = snapshot.val()
          // Save details in store
          commit('setUserDetails', {
            name: userDetails.name,
            username: userDetails.username,
            email: userDetails.email,
            userId: userId
          })
        })
        // Get friends for current user and save them in the store
        dispatch('firebaseGetFriends', userId)
        // Get all signals in db and save them in the store
        dispatch('firebaseGetSignals')
        // Get all signals in db and save them in the store
        dispatch('firebaseGetEvents')
        // Get all users and save them in the store
        dispatch('firebaseGetUsers')
        
        // Handle online status
        firebaseDb.ref('.info/connected').on('value', (snap) => {
          if (snap.val() === true) {
            // Change online status to true when the app is currently open
            firebaseDb.ref('status/' + userId).update({online: true})
            // Set online status to false when connection to firebase is lost
            firebaseDb.ref('status/' + userId).onDisconnect().update({online: false})
          }
        });
        this.$router.push('/') // Go to Index page
      }
      // Else if user has logged out
      else if(state.userDetails.userId) {
        // Update offline status to false 
        firebaseDb.ref('status/' + state.userDetails.userId).update({online: false})
        // Empty local user details
        commit('setUserDetails', {})
        // Go to Login page
        this.$router.replace('/auth') 
      }
      // Else if user does not have account send him to registration
      else {
        this.$router.replace('/auth') // Go to Login page
      }
    })
  },
  /***********************
          USERS
  ************************/
  firebaseGetUsers({ state, commit }) {
    firebaseDb.ref('status/').on('child_added', snapshot => {
      var userKey = snapshot.key
      firebaseDb.ref('status/' + userKey).on('value', snapshot => {
        // Only check for online users
        if (snapshot.val().online == true) {
          let currPos = state.center
          let userPos = snapshot.val().position
          let dist = getDistance(currPos.lat, currPos.lng, userPos.lat, userPos.lng)
          // Check if user is close to you 
          if (dist < 1.5) {
            // If user is already saved update his position
            if (userKey in state.users) {
              commit('updateUserPosition', {
                userId: userKey,
                userPosition: snapshot.val().position
              })
            }
            // If user is not save, store it locally in users
            else if (userKey != state.userDetails.userId) {
              commit('addUser', {
              userId: userKey,
              userDetails: snapshot.val()
              })
            }
          }
          // If a saved user has gone out of bounds remove him
          else if (userKey in state.users) {
            commit('removeUser', userKey)
          }
        }
        // If a saved user has gone offline remove him
        else if (userKey in state.users) {
          commit('removeUser', userKey)
        }
      })
    })
  },

  /***********************
          FRIENDS
  ************************/
  /* Get all of the current user's friends and save them to the store, while adding
    a listener to automatically add to the store new entries were the database to change */
    firebaseGetFriends({ commit, dispatch }, payload) {
      let userId = payload
      // Fetch current user from the db's friends node
      firebaseDb.ref('friends/' + userId + '/friendList').on('child_added', snapshot => {
        let otherUserId = snapshot.key
        // For every friend, add details inside 'friends' store object
        firebaseDb.ref('users').child(otherUserId).once('value', snapshot => {
          let userDetails = snapshot.val()
          commit('addFriend', {
            userId: otherUserId, 
            userDetails
          })
          // Get the online status of every friend 
          dispatch('firebaseTrackOnlineStatus', otherUserId)
        })
      })
    
    // Fetch all pending friend request and save them in the store
    firebaseDb.ref('friends/' + userId + '/pending').on('child_added', snapshot => {
      let otherUserId = snapshot.key
      firebaseDb.ref('users').child(otherUserId).once('value', snapshot => {
        let userDetails = snapshot.val().username
        commit('addPending', {
          userId: otherUserId, 
          userDetails
        })
      })
    })
  },

  /* Updates firebase's db to reflect new pending friend request */
  firebaseSendFriendRequest({ state }, payload) {
    let otherUsername = payload 
    let requestObject = {}
    requestObject[state.userDetails.userId] = true // { userKey: true }

    // Wait for firebase to query db and return the other user's node
    firebaseDb.ref('users').orderByChild('username').equalTo(otherUsername).once('value', snapshot => {
      // Get the other user's key
      let otherUserId = Object.keys(snapshot.val())[0] 
      // Add request objects inside pending property in db
      firebaseDb.ref('friends/' + otherUserId + '/pending').update(requestObject)
    })
  },

  /* Removes pending request and adds new friend to Realtime Database + local state */
  firebaseAcceptRequest({ dispatch }, payload) {
    // Remove request from the store's pending object
    dispatch('firebaseRemovePending', payload) 

    let friendId = payload
    let friendObject = {}
    friendObject[friendId] = true // {friendKey: true}

    // Reflect the new friend in your db's friend list
    firebaseDb.ref('friends/' + state.userDetails.userId + '/friendList').update(friendObject)

    friendObject = {}
    friendObject[state.userDetails.userId] = true // {yourkey: true}

    // Reflect your friendship in the other user's friend list
    firebaseDb.ref('friends/' + friendId + '/friendList').update(friendObject)
    // Start tracking the online status of the new added friends
    dispatch('firebaseTrackOnlineStatus', friendId)
  },

  /* Remove pending request from firebase's Realtime Database and local state */
  firebaseRemovePending({ state, commit }, payload) {
    let otherUserId = payload
    commit('removePending', payload) // remove from store
    firebaseDb.ref('friends/' + state.userDetails.userId + '/pending/' + otherUserId).remove() // remove drom db
  },

  /***********************
          SIGNALS
  ************************/
  /* Fetch from db all signals and save them to the store and add
    a listener to automatically add new recorded signals */
  firebaseGetSignals({ state, commit }) {
    firebaseDb.ref('signals/').on('child_added', snapshot => {
      let currPos = state.center 
      let dist = getDistance(currPos.lat, currPos.lng, snapshot.val().lat, snapshot.val().lng)

      if (dist < 1.5) {
        commit('addSignal', {
          signalId: snapshot.key,
          signalDetails: snapshot.val()
        })
      }
    })
    // Remove old signals locally
    firebaseDb.ref('signals/').on('child_removed', snapshot => {
      commit('removeSignal', snapshot.key)
    })
  },

  /* Add signal under signals node in firebase's db */
  firebaseSendSignal({ state, commit }, payload) {
    let signal = payload
    signal['lat'] = state.center.lat
    signal['lng'] = state.center.lng

    // Add signal to db
    let signalRef = firebaseDb.ref('signals/').push(signal)

    // Add signal to the store's 'signal' object
    commit('addSignal', {
      signalId: signalRef.key,
      signalDetails: signal
    })
  },

  /***********************
          EVENTS
  ************************/
  /* Fetch from db all events and save them to the store while adding
   a listener to automatically add new recorded events */
  firebaseGetEvents({ state, commit }) {
    firebaseDb.ref('events/').on('child_added', snapshot => {
      let currPos = state.center 
      let dist = getDistance(currPos.lat, currPos.lng, snapshot.val().lat, snapshot.val().lng)

      if (dist < 10) {
        commit('addEvent', {
          eventId: snapshot.key,
          eventDetails: snapshot.val()
        })
      }
    })
    // Remove old events locally
    firebaseDb.ref('events/').on('child_removed', snapshot => {
      commit('removeEvent', snapshot.key)
    })
  },

  /* Add an event under events node in firebase's db */
  firebaseSubmitEvent({ commit }, payload) {
    let event = payload
    // Add event to db
    let eventRef = firebaseDb.ref('events/').push(event)

    // Add event to the store's 'event' object
    commit('addEvent', {
      eventId: eventRef.key,
      eventDetails: event
    })
  },
  /***********************
          POSITION
  ************************/
   /* Save your current position in store and db */
  firebaseSavePosition({ state, commit }, payload) {
    let center = payload
    // Update position in the db
    if (state.userDetails.userId) {
      firebaseDb.ref('status/' + state.userDetails.userId).update({position: center})
    }

    // Update position in the store
    commit('setUserCenter', center)
  },

  /***********************
          MESSAGES
  ************************/
  /* Saves in store all the messages between current user and another user 
    and add a listener to automatically add new messages */
  firebaseGetMessages({ state, commit }, otherUserId) {
    let userId = state.userDetails.userId
    messagesRef = firebaseDb.ref('chats/' + userId + '/' + otherUserId)
    // Fetch all messages and add a listener for new messages
    messagesRef.on(
      'child_added', snapshot => {
        let messageDetails = snapshot.val()
        let messageId = snapshot.key
        // Add message to the store's 'messages' object
        commit('addMessage', {
          messageId,
          messageDetails
        })
      }
    )
  },

  /* Removes listener checking for new messages */
  firebaseStopGettingMessages({ commit }) {
    if (messagesRef) {
      messagesRef.off('child_added') // Remove listener
      commit('clearMessages') // Empty messages object
    }
  },

  /* Records sent messages to firebase's db (for both sender and recipient) */
  firebaseSendMessage({}, payload) {
    // Add message on messages node with the current user's key
    firebaseDb.ref('chats/' + state.userDetails.userId + '/' + payload.otherUserId).push(payload.message)
    // Change recipient of message
    payload.message.from = 'them'
    // Add message on messages node with the other user's key
    firebaseDb.ref('chats/' + payload.otherUserId + '/' + state.userDetails.userId).push(payload.message)
  },

  /***********************
          OTHER
  ************************/
  /* Tracks online status for a given user */
  firebaseTrackOnlineStatus({ commit }, payload) {
    let userId = payload 
    // Change saved friend online status in store whenever the value in the db changes
    firebaseDb.ref('status/' + userId).child('online').on('value', snapshot => {
      let status = snapshot.val()
      commit('updateFriendStatus', {
        userId: userId, 
        online: status
      })
    })
  },
  
  /* Updates user details in firebase's db */
  firebaseUpdateUser({}, payload) {
    firebaseDb.ref('users/' + payload.userId).update(payload.updates)
  }
}

const getters = {
  // Return the property names for the userDetails object
  userDetailsKeys: state => {
    return Object.keys(state.userDetails)
  },
  center: state => {
    return state.center
  },
  latestUserChange: state => {
    return state.latestUserChange
  },
  latestSignalChange: state => {
    return state.latestSignalChange
  },
  latestEventChange: state => {
    return state.latestEventChange
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}