/* eslint-disable no-undef,consistent-return */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import ForumView from './ForumView';
// import AsyncStorageHelper from '../../../utils/AsyncStorageHelper';

class ForumContainer extends Component {
  static componentName = 'ForumContainer';

  static propTypes = {
    url: PropTypes.string.isRequired,
    element: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      canLoadMoreContent: false,
      data: [],
      dataUrl: this.props.url,
      element: this.props.element,
      loading: false,
      loadingMore: false,
      originDataUrl: this.props.url,
    };
  }

  componentDidMount = () => {
    this.fetchData();

    // AsyncStorageHelper.query('discussions', (result) => {
    //   if (result) {
    //     this.setState({
    //       loading: false,
    //       data: JSON.parse(result),
    //     });
    //   }
    // });
  };

  fetchData = (option) => {
    if (!option) {
      this.setState({
        loading: true,
      });
    } else if (option.dataUrl) {
      this.setState({
        dataUrl: option.dataUrl,
      });
    }

    this.setState({
      canLoadMoreContent: false,
    });

    if (!this.state.dataUrl) {
      return;
    }

    return fetch(this.state.dataUrl, {
      method: 'get',
      dataType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((responseData) => {
      let data = this.state.data.concat(responseData.data);
      if (option && option.dataUrl) {
        data = responseData.data;
      }
      this.setState({
        loading: false,
        data,
      });

      // AsyncStorageHelper.set('discussions', JSON.stringify(data));
      //
      if (responseData.links.next) {
        this.setState({
          dataUrl: responseData.links.next,
          canLoadMoreContent: true,
        });
      }
    }).catch(() => {
      this.setState({
        data: [],
        loadingMore: false,
        canLoadMoreContent: false,
        loading: false,
      });
    });
  };

  loadMoreContentAsync = async () => {
    this.fetchData({ loadingMore: true }).then(() => {
      this.setState({
        loadingMore: true,
      });
    });
  };

  render = () => {
    const { loading, originDataUrl, data, canLoadMoreContent, element } = this.state;

    if (loading) {
      return (<View
        style={{ marginTop: 20 }}
      >
        <ActivityIndicator
          animating
          size={'large'}
          color={'#000'}
        />
      </View>);
    }

    return (
      <ForumView
        data={data}
        canLoadMoreContent={canLoadMoreContent}
        onLoadMoreAsync={this.loadMoreContentAsync}
        reFetch={this.fetchData}
        dataUrl={originDataUrl}
        element={element}
      />
    );
  }
}

export default ForumContainer;
