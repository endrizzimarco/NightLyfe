import { firebaseAuth, firebaseDb } from 'boot/firebase'

let messagesRef

const state = {
  userDetails: {},
  messages: {},
  friends: {},
  pending: {}
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload
  },

  addFriend(state, payload) {
    state.friends[payload.userId] = payload.userDetails
  },

  addPending(state, payload) {
    state.pending[payload.userId] = payload.userDetails
  },

  removePending(state, payload) {
    let key = payload
    delete state.pending[key]
  },

  addMessage(state, payload) {
    state.messages[payload.messageId] = payload.messageDetails
  },

  clearMessages(state) {
    state.messages = {}
  }
}

const actions = {
  loginUser({}, payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        //pass
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  logoutUser({}, payload) {
    firebaseAuth.signOut()
  },

  registerUser({}, payload) {
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        let userId = firebaseAuth.currentUser.uid
        firebaseDb.ref('users/' + userId).set({
          name: payload.name,
          username: payload.username,
          email: payload.email,
          online: true
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  },

  handleAuthStateChanged({ state, commit, dispatch }) {
    firebaseAuth.onAuthStateChanged(user => {
      if(user) {
        // User logged in
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
        dispatch('firebaseUpdateUser', {
          userId: userId,
          updates: {
            online: true
          }
        })
        dispatch('firebaseGetFriends', userId)
        this.$router.push('/')
      }
      else if(state.userDetails.userId) {
        // User logged out
        dispatch('firebaseUpdateUser', {
          userId: state.userDetails.userId,
          updates: {
            online: false
          }
        })
        commit('setUserDetails', {})
        this.$router.replace('/auth')
      }
    })
  },

  firebaseUpdateUser({}, payload) {
    firebaseDb.ref('users/' + payload.userId).update(payload.updates)
  },

  firebaseGetFriends({ commit }, payload) {
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


  firebaseRemovePending({ state, commit }, payload) {
    let otherUserId = payload
    commit('removePending', payload)
    firebaseDb.ref('friends/' + state.userDetails.userId + '/pending/' + otherUserId).remove()
  },

  firebaseAcceptRequest({ dispatch }, payload) {
    dispatch('firebaseRemovePending', payload)

    let friendId = payload
    let friendObject = {}
    friendObject[friendId] = true
  
    firebaseDb.ref('friends/' + state.userDetails.userId + '/friendList').update(friendObject)

    friendObject = {}
    friendObject[state.userDetails.userId] = true

    firebaseDb.ref('friends/' + friendId + '/friendList').update(friendObject)
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