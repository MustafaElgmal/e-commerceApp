import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

type props = {
  values:number[]
  defaultValue?: string | number
  onChange: (value: string) => void
}
function Dropdown({ values,defaultValue=values[0],onChange }: props) {
  return (
    <select
      id="quantity"
      name="quantity"
      onChange={(e) =>{
        onChange(e.target.value)
      }}
      defaultValue={defaultValue}
      className="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
    >
      {values.map((i) => {
        return <option value={i}>{i}</option>
      })}
    </select>
  )
}

export default Dropdown
