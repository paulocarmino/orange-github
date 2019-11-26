import React from 'react';
import {WebView} from 'react-native-webview';

// import { Container } from './styles';

const Repo = ({navigation}) => {
  const repo = navigation.getParam('repo');
  return <WebView source={{uri: repo.html_url}} />;
};

Repo.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('repo').name,
});

export default Repo;
