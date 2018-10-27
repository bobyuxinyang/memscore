import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Table, Menu, Dropdown, Input, Button, Progress } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment'
import Pie from '@/components/Charts/Pie';

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
        render: (value) => {
          return value ? (
            <span>{moment(value).format('YYYY-MM-DD HH:mm')}</span>
          ) : ''
        }
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

    // 总完成度
    let scoreCount = 0;
    let progress = 0;
    if (scoreList) {
      scoreList.forEach(item => {
        if (item.status === 'ok') {
          scoreCount += 1;
        }
      });
      progress = parseInt((scoreCount / scoreList.length) * 100)
    }

    let pieChartList = []
    if (scoreList) {
      const classList = [
        '第一批次1班', '第一批次2班', '第一批次3班', '第一批次4班',
        '第二批次1班', '第二批次2班', '第二批次3班', '第二批次4班',
      ]
      // 班级完成度
      const classScoresList = []
      classList.forEach(className => {
        const classMembers = scoreList.filter(item => item['class'] === className)
        const scoreMembers = classMembers.filter(item => item.status === 'ok')
        classScoresList.push({
          className,
          total: classMembers.length,
          score: scoreMembers.length
        })
      })
      pieChartList = classScoresList.map(item => {
        let percent = 0.0
        if (item.total > 0) {
          percent = parseInt(item.score / item.total * 100)
        }
        return (
          <Col span={6}>
            <Pie
              key={item.className}
              percent={percent}
              subTitle={item.className}
              total={`${item.score}/${item.total}`}
              height={200}
            />
          </Col>
        )
      })
    }

    const expandedRowContent = (record) => {
      // 签名的人
      const signUsers = record.signUserList ? record.signUserList.map(item => {
        return (
          <li key={item.email}>
            签名: {item.email}
            {item.isTa ? '(助教)' : '' }
            {item.class !== 'mem_ta' ? `(${item.name}，${item.class})` : ''}，
            {item.timestamp}
          </li>
        )
      }) : (
        <p>还没人签名</p>
      )
      const messages = record.messages ? record.messages.map((item, index) => {
        return (
          <li key={index}
            style={{
              'fontWeight': 'bold',
              textAlign: 'right',
              color: item.status === 'ok' ? 'green' : 'red'
            }}
          >
            {item.msg}
          </li>
        )
      }) : ''
      return (
        <Row>
          <Col span={16}>{signUsers}</Col>
          <Col span={8}>{messages}</Col>
        </Row>
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
              <p>
                <a target="_blank" href="http://main.toyhouse.cc:801/index.php/2018MEM%E5%AF%BC%E5%BC%95%E8%AF%BE%E7%A8%8B%E6%9C%80%E5%90%8E%E7%9A%84%E4%BD%9C%E4%B8%9A">
                  打分规则: http://main.toyhouse.cc:801/index.php/2018MEM导引课程最后的作业
                </a>
              </p>
              <div>
                {pieChartList}
              </div>
              <span>总完成度({scoreCount}/{scoreList.length})</span>
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
