import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Wiki 首页',
          title: 'Wiki 首页',
          href: 'http://main.toyhouse.cc:801/',
          blankTarget: true,
        },
        {
          key: '2018清华MEM课程',
          title: '2018清华MEM课程',
          href: 'http://main.toyhouse.cc:81/',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 清华MEM入学导引课程
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
