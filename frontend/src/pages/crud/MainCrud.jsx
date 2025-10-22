import React from 'react'
import HeaderCrud from '../../components/crud/HeaderCrud'
import "../../styles/crud.css"
import LinkCrud from '../../components/crud/LinkCrud'

const MainCrud = () => {
  return (
    <div>
        <HeaderCrud/>
        <LinkCrud showBackButton={false}/>
    </div>
  )
}

export default MainCrud