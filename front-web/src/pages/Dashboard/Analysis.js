import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Table,
  Menu,
  Dropdown,
} from 'antd';
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

  render() {
    const { loading: propsLoding } = this.state;
    const { chart, loading: stateLoading } = this.props;
    const {
      scoreList
    } = chart
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
        title: '对课程内容的掌握情况评分',
        dataIndex: 'score1',
        key: 'score1',
        className: styles.alignRight,
      },
      {
        title: '对班级生态的贡献评分',
        dataIndex: 'score2',
        key: 'score2',
        className: styles.alignRight,
      },    
      {
        title: '最后更新',
        dataIndex: 'updateAt',
        key: 'updateAt',
        className: styles.alignRight,
      },            
    ];

    return (
      <GridContent>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title='2018MEM导引课程分数自评'
              extra={iconGroup}
              style={{ marginTop: 24 }}
            >
              <Table
                rowKey={record => record.index}
                size="small"
                columns={columns}
                dataSource={scoreList}
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
