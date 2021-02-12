import axios from 'axios'
import {
  COIN_LIST_REQUEST,
  COIN_LIST_SUCCESS,
  COIN_LIST_FAIL,
  COIN_DETAILS_REQUEST,
  COIN_DETAILS_SUCCESS,
  COIN_DETAILS_FAIL,
  COIN_GAINERS_REQUEST,
  COIN_GAINERS_SUCCESS,
  COIN_GAINERS_FAIL,
  COIN_LOSERS_REQUEST,
  COIN_LOSERS_SUCCESS,
  COIN_LOSERS_FAIL,
  COIN_TOTALS_REQUEST,
  COIN_TOTALS_SUCCESS,
  COIN_TOTALS_FAIL,
} from '../constants/coin'

export const fetchCoins = (page) => async (dispatch) => {
  try {
    dispatch({ type: COIN_LIST_REQUEST })

    let response

    if (page) {
      response = await axios.get(`/api/coins?page=${page}`)
    } else {
      response = await axios.get('/api/lists/watchlist')
    }

    dispatch({
      type: COIN_LIST_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    dispatch({
      type: COIN_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    })
  }
}

export const fetchCoin = (coin) => async (dispatch) => {
  try {
    dispatch({ type: COIN_DETAILS_REQUEST })

    const response = await axios.get(`/api/coins/${coin}`)

    dispatch({
      type: COIN_DETAILS_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    dispatch({
      type: COIN_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    })
  }
}

export const fetchGainers = () => async (dispatch) => {
  try {
    dispatch({ type: COIN_GAINERS_REQUEST })

    const response = await axios.get('/api/lists/gainers')

    dispatch({
      type: COIN_GAINERS_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    dispatch({
      type: COIN_GAINERS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    })
  }
}

export const fetchLosers = () => async (dispatch) => {
  try {
    dispatch({ type: COIN_LOSERS_REQUEST })

    const response = await axios.get('/api/lists/losers')

    dispatch({
      type: COIN_LOSERS_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    dispatch({
      type: COIN_LOSERS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    })
  }
}

export const fetchTotals = () => async (dispatch) => {
  try {
    dispatch({ type: COIN_TOTALS_REQUEST })

    const response = await axios.get('/api/totals')

    dispatch({
      type: COIN_TOTALS_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    dispatch({
      type: COIN_TOTALS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    })
  }
}
