import { firebaseAuth, firebaseDb } from 'boot/firebase'

let messagesRef

const state = {
  userDetails: {},
  center: {},
  messages: {},
  friends: {},
  pending: {},
  signals: {},
  latestSignalKey: null
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

  // Modify friends' online status as they go offline / get online
  updateFriendStatus(state, payload) {
    state.friends[payload.userId].online = payload.online
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
    let signalId = Object.keys(payload)[0]
    state.signals[signalId] = payload[signalId]    
    state.latestSignalKey = signalId
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
      })
      // Get the online status of every friend 
      dispatch('firebaseTrackOnlineStatus', otherUserId)
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
  async firebaseSendFriendRequest({ state }, payload) {
    let otherUsername = payload 
    let requestObject = {}
    requestObject[state.userDetails.userId] = true // { userKey: true }

    // Wait for firebase to query db and return the other user's node
    const snapshot = await firebaseDb.ref('users').orderByChild('username').equalTo(otherUsername).once('value')
    // Get the other user's key
    let otherUserId = Object.keys(snapshot.val())[0] 
    // Add request objects inside pending property in db
    firebaseDb.ref('friends/' + otherUserId + '/pending').update(requestObject)
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
  firebaseGetSignals({ commit }) {
    firebaseDb.ref('signals/').on('child_added', snapshot => {
      let signal = {}
      signal[snapshot.key] = snapshot.val()
      commit('addSignal', signal)
      })
  },

  /* Add signal under signals node in firebase's sb */
  firebaseSendSignal({ state, commit }, payload) {
    let signal = payload
    signal['lat'] = state.center.lat
    signal['lng'] = state.center.lng

    // Add signal to db
    let signalRef = firebaseDb.ref('signals/').push(signal)

    let newSignal = {}
    newSignal[signalRef.key] =  signal // {signalKey: signalContent}
    // Add signal to the store's 'signal' object
    commit('addSignal', newSignal)
  },

  /***********************
          POSITION
  ************************/
   /* Save your current position in store and db */
  firebaseSavePosition({ state, commit }, payload) {
    let center = payload
    // Update position in the db
    firebaseDb.ref('status/' + state.userDetails.userId).update({position: center})
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
    firebaseDb.ref('status/' + userId).on('value', snapshot => {
      let status = snapshot.val()
      commit('updateFriendStatus', {
        userId: userId, 
        online: status.online
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}