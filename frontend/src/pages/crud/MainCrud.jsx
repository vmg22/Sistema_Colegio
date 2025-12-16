import React from 'react'
import HeaderCrud from '../../components/crud/HeaderCrud'
import LinkCrud from '../../components/crud/LinkCrud'
import "../../styles/crud.css"

const MainCrud = () => {
  return (
    <div>
        <HeaderCrud/>
        <LinkCrud showBackButton={false}/>
    </div>
  )
}

export default MainCrud