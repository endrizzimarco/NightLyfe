import { firebaseAuth, firebaseDb } from 'boot/firebase'

let messagesRef

const state = {
  userDetails: {},
  users: {},
  messages: {}
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload
  },

  addUser(state, payload) {
    state.users[payload.userId] = payload.userDetails
  },

  updateUser(state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails)
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
        dispatch('firebaseGetUsers')
        this.$router.push('/')
      }
      else {
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

  firebaseGetUsers({ commit }) {
    firebaseDb.ref('users').on('child_added', snapshot => {
      let userDetails = snapshot.val()
      let userId = snapshot.key
      commit('addUser', {
        userId,
        userDetails
      })
    })
    firebaseDb.ref('users').on('child_changed', snapshot => {
      let userDetails = snapshot.val()
      let userId = snapshot.key
      commit('updateUser', {
        userId,
        userDetails
      })
    })
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
  }
}

const getters = {
  users: state => {
    let usersFiltered = {}
    Object.keys(state.users).forEach(key => {
      if (key !== state.userDetails.userId) {
        usersFiltered[key] = state.users[key]
      }
    })
    return usersFiltered
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}