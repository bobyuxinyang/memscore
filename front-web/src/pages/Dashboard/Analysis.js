import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Table, Menu, Dropdown, Input, Button, Progress } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './Analysis.less';

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading }) => ({
  chart,
}))
class Analysis extends Component {
  state = {
    loading: false,
    searchText: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/memscore',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleSearch = value => {
    this.setState({
      searchText: value,
    });
  };

  render() {
    const { loading: propsLoding, filteredValue } = this.state;
    const { chart, loading: stateLoading } = this.props;
    const { scoreList } = chart;
    const loading = propsLoding || stateLoading;
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const columns = [
      {
        title: '班级',
        dataIndex: 'class',
        key: 'class',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        className: styles.alignRight,
      },
      {
        title: '对课程内容的掌握情况',
        dataIndex: 'score1',
        key: 'score1',
        className: styles.alignRight,
        sorter: (x, y) => {
          return x.score1 - y.score1;
        },
      },
      {
        title: '对班级生态的贡献',
        dataIndex: 'score2',
        key: 'score2',
        className: styles.alignRight,
        sorter: (x, y) => {
          return x.score2 - y.score2;
        },
      },
      {
        title: '最后更新',
        dataIndex: 'updateAt',
        key: 'updateAt',
        className: styles.alignRight,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value, row ,index) => {
          if (value === 'ok') {
            return (
              <Icon type="check-circle" theme="filled" style={{ color: 'green' }}/>
            )            
          } else {
            return (
              <Icon type="close-circle" theme="filled" style={{ color: 'red' }}/>
            )     
          }
        }
      }
    ];

    const { searchText } = this.state;

    const list = scoreList
      ? scoreList.filter(item => item.name.includes(searchText) || item.email.includes(searchText))
      : null;

    let scoreCount = 0;
    let progress = 0;
    if (scoreList) {
      scoreList.forEach(item => {
        if (item.score1 && item.score2) {
          scoreCount += 1;
        }
      });
      progress = parseInt((scoreCount / scoreList.length) * 100)
    }

    const expandedRowContent = (record) => {
      // 签名的人
      const signUsers = record.signUserList ? record.signUserList.map(item => {
        return (
          <p key={item}>签名: {item}</p>
        )
      }) : (
        <p>还没人签名</p>
      )
      return (
        <div style={{ margin: 0 }}>{signUsers}</div>
      )
    }

    return (
      <GridContent>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title="2018MEM导引课程分数自评(数据来源 main.toyhouse.cc:801)"
              extra={iconGroup}
              style={{ marginTop: 24 }}
            >
              <span>打分完成度</span>
              <Progress percent={progress} />
              <br />
              <br />
              <Input.Search
                placeholder="输入姓名或者邮箱搜索"
                onSearch={this.handleSearch}
                enterButton
              />
              <br />
              <br />
              <Table
                rowKey={record => record.name}
                size="small"
                columns={columns}
                dataSource={list}
                expandedRowRender={expandedRowContent}
                pagination={{
                  style: { marginBottom: 0 },
                  pageSize: 20,
                }}
              />
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Analysis;
