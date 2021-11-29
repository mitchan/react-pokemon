import * as R from 'ramda'
import React from 'react'

import type { Pokemon } from '../types'

type PokemonData = {
  name: string
  url: string
}

type Data = {
  count: number
  next: string | null
  previous: string | null
  results: PokemonData[]
}

const splitUrl = R.compose(R.split('/'), R.prop('url'))

function enhanceData(p: PokemonData) {
  const urlSplitted = splitUrl(p)

  // ID is in 6th position
  const id = urlSplitted[6]

  return {
    ...p,
    id,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  }
}

export function PokemonList(): JSX.Element {
  const [pokemon, setPokemon] = React.useState<Pokemon[]>([])

  // Load list
  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/pokemon`)
      .then((resp) => resp.json())
      .then((data: Data) => {
        const { results } = data
        setPokemon(R.map(enhanceData, results))
      })
  }, [])

  return (
    <div>
      <ul>
        {pokemon.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
