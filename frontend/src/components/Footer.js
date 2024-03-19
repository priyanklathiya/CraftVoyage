import React from 'react'

function Footer() {
  return (
    <div className="bg-light text-dark text-center py-4"> 
      <hr className="bg-black" />
      <p className="mb-0">&copy; {new Date().getFullYear()} CraftVoyage, Inc</p>
    </div>
  )
}

export default Footer