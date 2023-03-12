export default {
  async contactCoach(context, payload) {
    const newRequest = {
      userEmail: payload.email,
      message: payload.message
    }

    const response = await fetch(`https://vue-with-max-default-rtdb.europe-west1.firebasedatabase.app/requests/${payload.coachId}.json`, {
      method: 'POST',
      body: JSON.stringify(newRequest)
    })

    const responseData = await response.json()

    if(!response.ok) {
      const error = new Error(response.message || 'Failed to send request.')
      throw error
    }

    newRequest.id = responseData.name
    newRequest.coachId = payload.coachId

    context.commit('addRequest', newRequest)
  },
  async fetchRequests(context) {
    console.log(context.rootGetters)
    const coachId = context.rootGetters.userId
    const response = await fetch(`https://vue-with-max-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json`)
    const responseData = await response.json()

    if(!response.ok) {
      const error = new Error(response.message || 'Failed to fetch request.')
      throw error
    }

    const requests = []

    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message
      }
      requests.push(request)
    }
    console.log(requests)
    context.commit('setRequests', requests)

  }
}