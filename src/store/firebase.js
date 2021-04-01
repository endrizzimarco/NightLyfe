import { firebaseAuth, firebaseDb } from 'boot/firebase'

const state = {
  userDetails: {}
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload
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
  handleAuthStateChanged({ commit }) {
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
        this.$router.push('/')
      }
      else {
        // User logged out
        commit('setUserDetails', {})
        this.$router.replace('/auth')
      }
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}