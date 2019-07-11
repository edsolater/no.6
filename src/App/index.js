import React from 'react'
import * as myLibrary from '../my-library'

import {Layout} from 'antd/es'

// 子组件

const { Header, Sider, Content } = Layout

const App = () => {
  const [selectedComponentName, selectComponentName] = React.useState('Button')
  const selectedComponent =
    myLibrary.components[selectedComponentName.toLowerCase()]
  const [headerColor, setHeaderColor] = React.useState(
    selectedComponent.color || '#b6aee4'
  )
  return (
    <Layout>
      <Header>hello</Header>
      <Content>world</Content>
    </Layout>
  )
  // return (
  //   <Layout style={{ width: '100vw', height: '100vh' }}>
  //     <Header style={{ height: 40, background: headerColor }}>
  //       <TopIndicator
  //         selectedComponent={selectedComponent}
  //         setHeaderColor={setHeaderColor}
  //       />
  //     </Header>
  //     <Layout>
  //       <Sider width={300} theme="light">
  //         <SideMenu
  //           allComponents={Object.values(myLibrary.components)}
  //           selectComponentName={selectComponentName}
  //         />
  //       </Sider>
  //       <Content>
  //         <InfoPanel selectedComponent={selectedComponent} />
  //       </Content>
  //     </Layout>
  //   </Layout>
  // )
}
export default App
