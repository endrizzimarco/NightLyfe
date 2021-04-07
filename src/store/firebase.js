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
  // Call firebase auth method to login a user
  loginUser({}, payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        //pass
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  // Call firebase auth method to logout a user
  logoutUser({}, payload) {
    firebaseAuth.signOut()
  },
  // Call firebase auth method to register a user with email and password and
  // create an instance of the new user in the Realtime Database
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
  // YAAY
  handleAuthStateChanged({ state, commit, dispatch }) {
    firebaseAuth.onAuthStateChanged(user => {
      // If user is logged in
      if(user) {
        let userId = firebaseAuth.currentUser.uid
        firebaseDb.ref('users/' + userId).once('value', snapshot => {
          let userDetails = snapshot.val()
          commit('setUserDetails', {
            name: userDetails.name,
            username: userDetails.username,
            email: userDetails.email,
            userId: userId
          })
        })
        dispatch('firebaseGetFriends', userId)
        dispatch('firebaseGetSignals')
        
        // Handle online status
        firebaseDb.ref('.info/connected').on('value', (snap) => {
          if (snap.val() === true) {
            // Change online to true when app is open
            firebaseDb.ref('status/' + userId).update({online: true})
            // Set online status to false when connection to firebase is lost
            firebaseDb.ref('status/' + userId).onDisconnect().update({online: false})
          }
        });
        this.$router.push('/')
        
      }
      // Else if user has logged out
      else if(state.userDetails.userId) {
        firebaseDb.ref('status/' + state.userDetails.userId).update({online: false})
        commit('setUserDetails', {})
        this.$router.replace('/auth')
      }
      // Else if user does not have account send him to registration
      else {
        this.$router.replace('/auth')
      }
    })
  },
  // Updates details of user at given userId node 
  firebaseUpdateUser({}, payload) {
    firebaseDb.ref('users/' + payload.userId).update(payload.updates)
  },
  firebaseGetFriends({ commit, dispatch}, payload) {
    let userId = payload

    firebaseDb.ref('friends/' + userId + '/friendList').on('child_added', snapshot => {
      let otherUserId = snapshot.key
      firebaseDb.ref('users').child(otherUserId).once('value', snapshot => {
        let userDetails = snapshot.val()
        commit('addFriend', {
          userId: otherUserId, 
          userDetails
        })
      })
      dispatch('firebaseTrackOnlineStatus', otherUserId)
    })

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

  async firebaseSendFriendRequest({ state }, payload) {
    let otherUsername = payload 
    let requestObject = {}
    requestObject[state.userDetails.userId] = true
    
    const snapshot = await firebaseDb.ref('users').orderByChild('username').equalTo(otherUsername).once('value')

    let otherUserId = Object.keys(snapshot.val())[0]    
    firebaseDb.ref('friends/' + otherUserId + '/pending').update(requestObject)
  },
  // Remove pending request from firebase's Realtime Database and local state
  firebaseRemovePending({ state, commit }, payload) {
    let otherUserId = payload
    commit('removePending', payload)
    firebaseDb.ref('friends/' + state.userDetails.userId + '/pending/' + otherUserId).remove()
  },
  firebaseTrackOnlineStatus({ commit }, payload) {
    let userId = payload 
    
    firebaseDb.ref('status/' + userId).on('value', snapshot => {
      let status = snapshot.val()
      commit('updateFriendStatus', {
        userId: userId, 
        online: status.online
      })
    })
  },
  // Removes pending request and adds new friend to Realtime Database + local state
  firebaseAcceptRequest({ dispatch }, payload) {
    dispatch('firebaseRemovePending', payload)

    let friendId = payload
    let friendObject = {}
    friendObject[friendId] = true
  
    firebaseDb.ref('friends/' + state.userDetails.userId + '/friendList').update(friendObject)

    friendObject = {}
    friendObject[state.userDetails.userId] = true

    firebaseDb.ref('friends/' + friendId + '/friendList').update(friendObject)
    dispatch('firebaseTrackOnlineStatus', friendId)
  },

  firebaseSendSignal({ state, commit }, payload) {
    let signal = payload
    signal['lat'] = state.center.lat
    signal['lng'] = state.center.lng

    let signalRef = firebaseDb.ref('signals/').push(signal)

    let newSignal = {}
    newSignal[signalRef.key] =  signal

    commit('addSignal', newSignal)
  },

  firebaseGetSignals({ commit }) {
    firebaseDb.ref('signals/').on('child_added', snapshot => {
      let signal = {}
      signal[snapshot.key] = snapshot.val()
      commit('addSignal', signal)
      })
    
  },

  firebaseSavePosition({ state, commit }, payload) {
    let center = payload

    firebaseDb.ref('status/' + state.userDetails.userId).update({position: center})

    commit('setUserCenter', center)
  },

  firebaseGetMessages({ state, commit }, otherUserId) {
    let userId = state.userDetails.userId
    messagesRef = firebaseDb.ref('chats/' + userId + '/' + otherUserId)
    messagesRef.on(
      'child_added', snapshot => {
        let messageDetails = snapshot.val()
        let messageId = snapshot.key
        commit('addMessage', {
          messageId,
          messageDetails
        })
      }
    )
  },

  firebaseStopGettingMessages({ commit }) {
    if (messagesRef) {
      messagesRef.off('child_added')
      commit('clearMessages')
    }
  },

  firebaseSendMessage({}, payload) {
    firebaseDb.ref('chats/' + state.userDetails.userId + '/' + payload.otherUserId).push(payload.message)
    
    payload.message.from = 'them'
    firebaseDb.ref('chats/' + payload.otherUserId + '/' + state.userDetails.userId).push(payload.message)
  }
}

const getters = {
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