import React from 'react'
import HeaderCrud from '../../components/crud/HeaderCrud'
import "../../styles/crud.css"
import LinkCrud from '../../components/crud/LinkCrud'
import BtnVolver from '../../components/ui/BtnVolver'

const MainCrud = () => {
  return (
    <div>
        <HeaderCrud/>
        <BtnVolver/>
        <LinkCrud showBackButton={false}/>
    </div>
  )
}

export default MainCrud