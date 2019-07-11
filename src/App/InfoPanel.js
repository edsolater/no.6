import React from 'react'
import ReactMarkdown from 'react-markdown'
import Table from 'antd/es/table';
import 'antd/es/table/style';
import Card from 'antd/es/card';
import 'antd/es/card/style';

// react component
export default  function InfoPanel({ selectedComponent }) {
  const [md, setMd] = React.useState('')
  selectedComponent.getMarkdownAsync().then(text=>setMd(text))

  return (
    <div style={{ padding: 10 }}>
      <Card title="API">
        <APITable
          apiArray={selectedComponent.api.filter(
            ({ type }) => type === 'table'
          )}
        />
        <ReactMarkdown source={md} />
      </Card>
    </div>
  )
}

// react-component
function APITable({ apiArray }) {
  return (
    <>
      {apiArray.map(api => (
        <Table
          key={api.title}
          rowKey={record => record.property}
          title={() => <p>{api.title}</p>}
          columns={[
            { title: 'Property', dataIndex: 'property' },
            { title: '说明', dataIndex: 'description' },
            { title: '值类型', dataIndex: 'type' },
            { title: '默认值', dataIndex: 'default' }
          ]}
          dataSource={api.data}
          pagination={false}
        />
      ))}
    </>
  )
}
